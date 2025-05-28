"use client";
import Image from "next/image";
import { HiOutlineHeart, HiOutlineChatBubbleLeftRight, HiOutlineShare, HiOutlineArrowLeft, HiOutlinePhoto, HiOutlineCamera, HiOutlinePaperAirplane, HiOutlineXMark, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import { FaExclamationTriangle } from "react-icons/fa";
import { MdEmergency, MdReportProblem } from "react-icons/md";
import { GiPoliceCar, GiPoliceBadge, GiSiren } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import instance from "@/app/api/axios";
import { getImageUrl } from "@/app/common/imgUtils";
import { useUser } from "../../../hooks/useUser";

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
  const { user: me } = useUser();
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
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState<{ preview: string; url: string | null }[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCommentId, setReportCommentId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState("");

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

  useEffect(() => {
    console.log('comments===',comments);

    console.log('me===',me)
  },[]);

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

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleEditComment = async (commentId: number) => {
    if (!editContent.trim() && editImages.length === 0) {
      alert("댓글 내용을 입력하거나 이미지를 첨부해주세요.");
      return;
    }

    try {
      const uploadedUrls = editImages.map(img => img.url).filter((url): url is string => url !== null);
      
      const response = await instance.put(`/api/v1/social/replies/${commentId}`, {
        content: editContent.trim(),
        imageUrls: uploadedUrls
      });

      if (response.status === 200) {
        // 수정 성공 후 모달 닫기
        setEditingCommentId(null);
        setEditContent("");
        setEditImages([]);
        setShowEditModal(false);
        
        // 댓글 목록 새로고침
        const resolvedParams = await params;
        const listResponse = await instance.get(`/api/v1/social/replies/${resolvedParams.id}`, {
          params: {
            page: 0,
            size: 10
          }
        });
        
        if (listResponse.status === 200) {
          setComments(listResponse.data.data.replies.content);
          setReplyTotalCnt(listResponse.data.data.totalCount);
          setPage(0); // 페이지 초기화
          showSuccessToast("댓글이 수정되었습니다.");
        }
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  const handleEditImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 최대 5개까지만 업로드 가능
    if (editImages.length + files.length > 5) {
      alert("이미지는 최대 5개까지만 첨부할 수 있습니다.");
      return;
    }

    for (const file of Array.from(files)) {
      // 미리보기를 위한 임시 URL 생성
      const previewUrl = URL.createObjectURL(file);
      
      // 새로운 이미지 객체 추가
      setEditImages(prev => [...prev, { preview: previewUrl, url: null }]);

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
          setEditImages(prev => 
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
        setEditImages(prev => prev.filter(img => img.preview !== previewUrl));
        URL.revokeObjectURL(previewUrl);
      }
    }
  };

  const handleRemoveEditImage = (previewUrl: string) => {
    setEditImages(prev => {
      const removedImage = prev.find(img => img.preview === previewUrl);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return prev.filter(img => img.preview !== previewUrl);
    });
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await instance.delete(`/api/v1/social/replies/${commentId}`);

      if (response.status === 200) {
        // 삭제 성공 후 모달 닫기
        setShowDeleteModal(false);
        setDeleteCommentId(null);
        
        // 댓글 목록 새로고침
        const resolvedParams = await params;
        const listResponse = await instance.get(`/api/v1/social/replies/${resolvedParams.id}`, {
          params: {
            page: 0,
            size: 10
          }
        });
        
        if (listResponse.status === 200) {
          setComments(listResponse.data.data.replies.content);
          setReplyTotalCnt(listResponse.data.data.totalCount);
          setPage(0); // 페이지 초기화
        }
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handleReportComment = async () => {
    if (!reportReason.trim()) {
      alert("신고 사유를 입력해주세요.");
      return;
    }

    try {
      const response = await instance.post(`/api/v1/social/replies/${reportCommentId}/report`, {
        reason: reportReason.trim()
      });

      if (response.status === 200) {
        setShowReportModal(false);
        setReportCommentId(null);
        setReportReason("");
        showSuccessToast("신고가 접수되었습니다.");
      }
    } catch (error) {
      console.error('댓글 신고 실패:', error);
      alert('신고 처리 중 오류가 발생했습니다.');
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
              <div className="flex-1">
                <div className="font-medium">{post.userNickname || "익명 사용자"}</div>
                <div className="text-sm text-gray-500">
                  {formatTimeAgo(post.createdAt)} •{" "}
                  <span className="text-blue-500">
                    {categories.find((c) => c.id === post.category)?.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setReportCommentId(post.id);
                  setShowReportModal(true);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <GiSiren className="w-6 h-6" />
              </button>
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
                <span>{replyTotalCnt}</span>
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
                      <div className="flex items-center justify-end gap-3 mt-2">
                        {me && me.id === comment.userId && (
                          <>
                            <button
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditContent(comment.content);
                                if (comment.imageUrls && comment.imageUrls.length > 0) {
                                  setEditImages(comment.imageUrls.map(url => ({
                                    preview: getImageUrl(url),
                                    url: url
                                  })));
                                } else {
                                  setEditImages([]);
                                }
                                setShowEditModal(true);
                              }}
                              className="text-gray-500 hover:text-blue-500 transition-colors"
                            >
                              <HiOutlinePencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteCommentId(comment.id);
                                setShowDeleteModal(true);
                              }}
                              className="text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <HiOutlineTrash className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setReportCommentId(comment.id);
                            setShowReportModal(true);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <GiSiren className="w-6 h-6" />
                        </button>
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

      {/* 댓글 수정 모달 */}
      <AnimatePresence>
        {showEditModal && editingCommentId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full bg-white rounded-t-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">댓글 수정</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCommentId(null);
                    setEditContent("");
                    setEditImages([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <HiOutlineXMark className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border rounded-lg text-sm"
                  rows={4}
                  placeholder="댓글을 입력하세요..."
                />

                {editImages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {editImages.map((image, index) => (
                      <div key={index} className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={image.preview}
                          alt={`Selected ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveEditImage(image.preview)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer hover:text-blue-500">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleEditImageSelect}
                    />
                    <HiOutlinePhoto className="w-6 h-6" />
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditComment(editingCommentId)}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCommentId(null);
                      setEditContent("");
                      setEditImages([]);
                    }}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    취소
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 댓글 삭제 모달 */}
      <AnimatePresence>
        {showDeleteModal && deleteCommentId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-2xl p-6"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineTrash className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  댓글 삭제
                </h3>
                <p className="text-sm text-gray-500">
                  이 댓글을 삭제하시겠습니까?
                  <br />
                  삭제된 댓글은 복구할 수 없습니다.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteCommentId(null);
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  취소
                </button>
                <button
                  onClick={() => handleDeleteComment(deleteCommentId)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  삭제
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 댓글 신고 모달 */}
      <AnimatePresence>
        {showReportModal && reportCommentId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-2xl p-6"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GiSiren className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {reportCommentId === post?.id ? '게시글 신고' : '댓글 신고'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  신고 사유를 입력해주세요.
                </p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 border rounded-lg text-sm"
                  rows={3}
                  placeholder="신고 사유를 입력하세요..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportCommentId(null);
                    setReportReason("");
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleReportComment}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  신고하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 토스트 알림 */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 