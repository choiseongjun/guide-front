"use client";
import Image from "next/image";
import { HiOutlineHeart, HiOutlineChatBubbleLeftRight, HiOutlineShare, HiOutlineArrowLeft } from "react-icons/hi2";
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

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 배경 오버레이 */}
        <motion.div 
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => router.back()}
        />

        {/* 모달 컨텐츠 */}
        <motion.div 
          className="absolute inset-0 bg-white"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <motion.main className="h-full overflow-y-auto pb-20">
            {/* 헤더 */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <div className="flex items-center h-14 px-4">
                <motion.button 
                  onClick={() => router.back()}
                  className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
                  whileTap={{ scale: 0.95 }}
                >
                  <HiOutlineArrowLeft className="w-6 h-6" />
                </motion.button>
                <h1 className="text-lg font-semibold ml-2">게시글</h1>
              </div>
            </div>

            {/* 게시글 내용 */}
            <article className="bg-white">
              {/* 작성자 정보 */}
              <div className="p-4 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{post.author.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{post.location}</span>
                    <span>•</span>
                    <span>{post.timeAgo}</span>
                  </div>
                </div>
              </div>

              {/* 게시글 내용 */}
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-800 whitespace-pre-line">{post.content}</p>
              </div>

              {/* 이미지 그리드 */}
              <div className="px-4 grid grid-cols-2 gap-1">
                {post.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-square"
                  >
                    <Image
                      src={image}
                      alt={`Post image ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>

              {/* 액션 버튼 */}
              <div className="p-4 flex items-center justify-between border-t border-gray-100">
                <motion.button 
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <HiOutlineHeart className="w-5 h-5" />
                  <span className="text-sm">{post.likes}</span>
                </motion.button>
                <motion.button 
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </motion.button>
                <motion.button 
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <HiOutlineShare className="w-5 h-5" />
                  <span className="text-sm">{post.shares}</span>
                </motion.button>
              </div>
            </article>

            {/* 댓글 섹션 */}
            <motion.div 
              className="mt-4 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold">댓글 {post.comments}개</h2>
              </div>
              
              {/* 댓글 목록 */}
              <div className="divide-y divide-gray-100">
                {post.commentsList.map((comment) => (
                  <motion.div 
                    key={comment.id} 
                    className="p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{comment.author.name}</h3>
                          <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                        </div>
                        <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <motion.button 
                            className="text-xs text-gray-500 hover:text-blue-500"
                            whileTap={{ scale: 0.95 }}
                          >
                            좋아요 {comment.likes}
                          </motion.button>
                          <motion.button 
                            className="text-xs text-gray-500 hover:text-blue-500"
                            whileTap={{ scale: 0.95 }}
                          >
                            답글
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 댓글 입력 */}
              <motion.div 
                className="sticky bottom-0 p-4 bg-white border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
                  />
                  <motion.button 
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      comment.trim() 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                    } transition-colors`}
                    disabled={!comment.trim()}
                    whileTap={{ scale: 0.95 }}
                  >
                    게시
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.main>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 