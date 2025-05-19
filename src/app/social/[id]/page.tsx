"use client";
import Image from "next/image";
import { HiOutlineHeart, HiOutlineChatBubbleLeftRight, HiOutlineShare, HiOutlineArrowLeft, HiOutlinePhoto, HiOutlineCamera, HiOutlinePaperAirplane, HiOutlineXMark } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 실제로는 API에서 데이터를 가져와야 하지만, 예시를 위해 하드코딩
const post = {
  id: 2,
  author: {
    name: "여행작가",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60",
  },
  content: `부산 해운대에서의 일몰이 너무 아름다웠어요 🌅 

해운대 해수욕장에서 바라본 일몰은 정말 장관이었습니다. 
바다 위로 지는 태양이 하늘을 붉게 물들이고, 
그 위로 떠있는 구름들이 마치 불꽃처럼 타오르는 듯 했어요.

특히 오늘은 날씨가 좋아서 더욱 아름다웠는데, 
해변에 앉아서 바라보는 일몰은 정말 힐링이 되더라고요.
주변 사람들도 다들 카메라를 들고 이 순간을 담으려고 했답니다.

#부산여행 #해운대 #일몰 #힐링여행 #여행스타그램`,
  images: [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=60",
  ],
  likes: 256,
  comments: 42,
  shares: 15,
  location: "부산 해운대구",
  timeAgo: "5시간 전",
  commentsList: [
    {
      id: 1,
      author: {
        name: "여행러",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60",
      },
      content: "정말 아름다운 일몰이네요! 다음에 가면 꼭 이 장소에서 일몰을 봐야겠어요 😍",
      timeAgo: "3시간 전",
      likes: 12,
    },
    {
      id: 2,
      author: {
        name: "사진작가",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
      },
      content: "사진이 정말 잘 나왔네요! 카메라 설정을 공유해주실 수 있나요?",
      timeAgo: "2시간 전",
      likes: 8,
    },
  ],
};

export default function PostDetailPage() {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    // 카메라 접근 권한 요청 및 처리
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          // 카메라 스트림 처리 로직
          console.log('Camera access granted');
        })
        .catch(err => {
          console.error('Camera access denied:', err);
        });
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1));
  };

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
            <h1 className="text-xl font-bold ml-4">소셜</h1>
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
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-gray-500">{post.timeAgo}</div>
              </div>
            </div>

            {/* 게시글 내용 */}
            <div className="mb-4">
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>

            {/* 이미지 그리드 */}
            {post.images.length > 0 && (
              <div className="mb-4">
                {post.images.length === 1 ? (
                  <div 
                    className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(0)}
                  >
                    <Image
                      src={post.images[0]}
                      alt="Post image"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : post.images.length === 2 ? (
                  <div className="grid grid-cols-2 gap-1">
                    {post.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handleImageClick(index)}
                      >
                        <Image
                          src={image}
                          alt={`Post image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : post.images.length === 3 ? (
                  <div className="grid grid-cols-2 gap-1">
                    <div 
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => handleImageClick(0)}
                    >
                      <Image
                        src={post.images[0]}
                        alt="Post image 1"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="grid grid-rows-2 gap-1">
                      {post.images.slice(1).map((image, index) => (
                        <div 
                          key={index} 
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => handleImageClick(index + 1)}
                        >
                          <Image
                            src={image}
                            alt={`Post image ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1">
                    {post.images.slice(0, 4).map((image, index) => (
                      <div 
                        key={index} 
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handleImageClick(index)}
                      >
                        <Image
                          src={image}
                          alt={`Post image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {index === 3 && post.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">+{post.images.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 통계 */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <HiOutlineHeart className="w-5 h-5" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                <span>{post.comments}</span>
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
            <h2 className="font-medium mb-4">댓글 {post.comments}개</h2>
            <div className="space-y-6">
              {post.commentsList.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Image
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.author.name}</span>
                      <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                    </div>
                    <p className="text-sm text-gray-800 break-words">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-500">
                        <HiOutlineHeart className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="hover:text-blue-500">답글</button>
                    </div>
                  </div>
                </div>
              ))}
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
                  src={post.images[currentImageIndex]}
                  alt={`Post image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* 이전/다음 버튼 */}
              {post.images.length > 1 && (
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
              {post.images.length > 1 && (
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                  {post.images.map((_, index) => (
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
          {selectedImage && (
            <div className="relative mb-2 w-20 h-20">
              <Image
                src={selectedImage}
                alt="Selected"
                fill
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 border rounded-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 outline-none text-sm bg-transparent"
              />
              <div className="flex items-center gap-2">
                <label className="cursor-pointer hover:text-blue-500">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <HiOutlinePhoto className="w-5 h-5" />
                </label>
                <button
                  onClick={handleCameraClick}
                  className="hover:text-blue-500"
                >
                  <HiOutlineCamera className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                (comment.trim() || selectedImage) 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-100 text-gray-400'
              } transition-colors`}
              disabled={!comment.trim() && !selectedImage}
            >
              게시
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 