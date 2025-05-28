"use client";
import Image from "next/image";
import { HiOutlineHeart, HiOutlineChatBubbleLeftRight, HiOutlineShare, HiOutlineArrowLeft, HiOutlinePhoto, HiOutlineCamera, HiOutlinePaperAirplane, HiOutlineXMark } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import instance from "@/app/api/axios";
import { getImageUrl } from "@/app/common/imgUtils";

interface Post {
  id: number;
  content: string;
  category: string;
  imageUrls: string[];
  userId: number;
  userNickname: string | null;
  userProfileImage: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: number;
  content: string;
  imageUrls: string[];
  userId: number;
  userName: string;
  createdAt: string;
}

interface CommentResponse {
  content: Comment[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

const categories = [
  { id: "TRAVEL_REVIEW", name: "여행후기" },
  { id: "RESTAURANT_RECOMMENDATION", name: "맛집 추천" },
  { id: "ACCOMMODATION_RECOMMENDATION", name: "숙소 추천" },
  { id: "TRAVEL_TIP", name: "여행 팁" },
  { id: "TRAVEL_COMPANION", name: "동행 구함" },
  { id: "TRAVEL_QUESTION", name: "여행 질문" },
];

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function SocialPage({ params }: PageProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [selectedImages, setSelectedImages] = useState<{ preview: string; url: string | null }[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [replyTotalCnt,setReplyTotalCnt] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const resolvedParams = await params;
        const response = await instance.get(`/api/social/posts/${resolvedParams.id}`);
        if (response.status === 200) {
          setPost(response.data);
        }
      } catch (error) {
        console.error('게시글 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params]);

  const fetchComments = async () => {
    try {
      const resolvedParams = await params;
      console.log('Fetching comments for post:', resolvedParams.id);
      const response = await instance.get(`/api/v1/social/replies/${resolvedParams.id}`, {
        params: {
          page,
          size: 10
        }
      });
      
      console.log('Response data:', response.data);
      
      if (response.status === 200) {
        const newComments = response.data.data.replies.content;
        console.log('New comments:', newComments);

        setReplyTotalCnt(response.data.data.totalCount);
        setComments(prev => page === 0 ? newComments : [...prev, ...newComments]);
        setHasMore(!response.data.last);
      }
    } catch (error) {
      console.error('댓글 조회 실패:', error);
      setComments([]);
    }
  };
  useEffect(() => {
   

    fetchComments();
  }, [params, page]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return date.toLocaleDateString();
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 최대 5개까지만 업로드 가능
    if (selectedImages.length + files.length > 5) {
      alert("이미지는 최대 5개까지만 첨부할 수 있습니다.");
      return;
    }

    for (const file of Array.from(files)) {
      // 미리보기를 위한 임시 URL 생성
      const previewUrl = URL.createObjectURL(file);
      
      // 새로운 이미지 객체 추가
      setSelectedImages(prev => [...prev, { preview: previewUrl, url: null }]);

      // S3 업로드
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pathType', 'social_reply');

      try {
        const uploadResponse = await instance.post('/api/v1/s3/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (uploadResponse.status === 200) {
          // 업로드된 URL로 상태 업데이트
          setSelectedImages(prev => 
            prev.map(img => 
              img.preview === previewUrl 
                ? { ...img, url: uploadResponse.data.fileUrl }
                : img
            )
          );
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
        // 실패한 이미지 제거
        setSelectedImages(prev => prev.filter(img => img.preview !== previewUrl));
        URL.revokeObjectURL(previewUrl);
      }
    }
  };

  const handleRemoveImage = (previewUrl: string) => {
    setSelectedImages(prev => {
      const removedImage = prev.find(img => img.preview === previewUrl);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return prev.filter(img => img.preview !== previewUrl);
    });
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handlePrevImage = () => {
    if (!post) return;
    setCurrentImageIndex((prev) => (prev === 0 ? post.imageUrls.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!post) return;
    setCurrentImageIndex((prev) => (prev === post.imageUrls.length - 1 ? 0 : prev + 1));
  };

  const handleSubmitComment = async () => {
    const uploadedUrls = selectedImages.map(img => img.url).filter((url): url is string => url !== null);
    
    if (!comment.trim() && uploadedUrls.length === 0) {
      alert("댓글 내용을 입력하거나 이미지를 첨부해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const resolvedParams = await params;
      const response = await instance.post(`/api/v1/social/replies/${resolvedParams.id}`, {
        content: comment.trim(),
        imageUrls: uploadedUrls,
      });

      if (response.status === 200) {
        setComment("");
        // 모든 이미지 미리보기 URL 해제
        selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
        setSelectedImages([]);
        fetchComments();
        // 댓글 목록 새로고침
        router.refresh();
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <HiOutlineArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-4">게시글</h1>
          </div>
        </div>
      </header>

      {/* 컨텐츠 */}
      <div className="max-w-md mx-auto">
        {/* 게시글 */}
        <div className="bg-white border-b border-gray-200">
          <div className="p-4">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black">
                {post.userProfileImage ? (
                  <Image
                    src={post.userProfileImage}
                    alt={post.userNickname || "사용자"}
                    width={40}
                    height={40}
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-xs">
                    {post.userNickname?.[0] || "?"}
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium">{post.userNickname || "익명 사용자"}</div>
                <div className="text-sm text-gray-500">
                  {formatTimeAgo(post.createdAt)} •{" "}
                  <span className="text-blue-500">
                    {categories.find((c) => c.id === post.category)?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* 게시글 내용 */}
            <div className="mb-4">
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>

            {/* 이미지 그리드 */}
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-1">
                  {post.imageUrls.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image 
                        src={getImageUrl(image)}
                        alt={`Post image ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 통계 */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <HiOutlineHeart className="w-5 h-5" />
                <span>{post.likeCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                <span>{post.commentCount}</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex border-t border-gray-200">
            <button className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50">
              <HiOutlineHeart className="w-6 h-6" />
              <span>좋아요</span>
            </button>
            <button className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50">
              <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
              <span>댓글</span>
            </button>
            <button className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50">
              <HiOutlineShare className="w-6 h-6" />
              <span>공유</span>
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white">
          <div className="p-4">
            <h2 className="font-medium mb-4">댓글 {replyTotalCnt}개</h2>
            <div className="space-y-6">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    {/* 프로필 이미지 */}
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center text-white text-xs">
                        {comment.userName?.[0] || "?"}
                      </div>
                    </div>
                    
                    {/* 댓글 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-line mb-2">
                        {comment.content}
                      </p>
                      {comment.imageUrls && comment.imageUrls.length > 0 && (
                        <div className="grid grid-cols-2 gap-1 mb-2">
                          {comment.imageUrls.map((image, index) => (
                            <div key={index} className="relative aspect-square">
                              <Image
                                src={getImageUrl(image)}
                                alt={`Comment image ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
                                unoptimized
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  아직 댓글이 없습니다.
                </div>
              )}
              
              {/* 더보기 버튼 */}
              {hasMore && comments && comments.length > 0 && (
                <button
                  onClick={handleLoadMore}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  더보기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 모달 */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-3xl mx-auto">
              {/* 닫기 버튼 */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-12 right-0 z-10 p-2 text-white hover:bg-white/10 rounded-full"
              >
                <HiOutlineXMark className="w-6 h-6" />
              </button>

              {/* 이미지 */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black">
                <Image
                  src={post.imageUrls[currentImageIndex]}
                  alt={`Post image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* 이전/다음 버튼 */}
              {post.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* 이미지 인디케이터 */}
              {post.imageUrls.length > 1 && (
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                  {post.imageUrls.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 댓글 입력 */}
      <div className={`fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 z-40 transition-opacity duration-200 ${showImageModal ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-md mx-auto p-4">
          {selectedImages.length > 0 && (
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={image.preview}
                    alt={`Selected ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(image.preview)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 border rounded-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 min-w-0">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 outline-none text-sm bg-transparent min-w-0"
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <label className="cursor-pointer hover:text-blue-500">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <HiOutlinePhoto className="w-5 h-5" />
                </label>
              </div>
            </div>
            <button
              onClick={handleSubmitComment}
              disabled={isSubmitting || (!comment.trim() && selectedImages.length === 0)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 ${
                (comment.trim() || selectedImages.length > 0) && !isSubmitting
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-100 text-gray-400'
              } transition-colors`}
            >
              {isSubmitting ? "작성 중..." : "게시"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 