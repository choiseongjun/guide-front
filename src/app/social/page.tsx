"use client";
import Image from "next/image";
import { HiOutlineHeart, HiOutlineChatBubbleLeftRight, HiOutlineShare } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const posts = [
  {
    id: 1,
    author: {
      name: "여행러",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60",
    },
    content: "제주도 여행에서 만난 아름다운 풍경들 🌊 #제주여행 #힐링여행",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=60",
    ],
    likes: 128,
    comments: 24,
    shares: 8,
    location: "제주도 서귀포시",
    timeAgo: "2시간 전",
  },
  {
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
  },
  {
    id: 3,
    author: {
      name: "여행가이드",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
    },
    content: "강원도 설악산 등반 후기 ⛰️ #설악산 #등산",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&auto=format&fit=crop&q=60",
    ],
    likes: 512,
    comments: 89,
    shares: 32,
    location: "강원도 속초시",
    timeAgo: "어제",
  },
];

export default function SocialPage() {
  const router = useRouter();
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);

  const toggleExpand = (postId: number) => {
    setExpandedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handlePostClick = (postId: number) => {
    router.push(`/social/${postId}`);
  };

  return (
    <motion.main 
      className="max-w-md mx-auto pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence>
        {posts.map((post) => (
          <motion.article 
            key={post.id}
            className="bg-white mb-4 rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => handlePostClick(post.id)}
            whileTap={{ scale: 0.98 }}
          >
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
              <p className={`text-sm text-gray-800 whitespace-pre-line ${
                !expandedPosts.includes(post.id) ? 'line-clamp-3' : ''
              }`}>
                {post.content}
              </p>
              {post.content.split('\n').length > 3 && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(post.id);
                  }}
                  className="text-sm text-blue-500 mt-1"
                  whileTap={{ scale: 0.95 }}
                >
                  {expandedPosts.includes(post.id) ? '접기' : '더보기'}
                </motion.button>
              )}
            </div>

            {/* 이미지 그리드 */}
            <div className="grid grid-cols-2 gap-1">
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
                onClick={(e) => e.stopPropagation()}
              >
                <HiOutlineHeart className="w-5 h-5" />
                <span className="text-sm">{post.likes}</span>
              </motion.button>
              <motion.button 
                className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                <span className="text-sm">{post.comments}</span>
              </motion.button>
              <motion.button 
                className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <HiOutlineShare className="w-5 h-5" />
                <span className="text-sm">{post.shares}</span>
              </motion.button>
            </div>
          </motion.article>
        ))}
      </AnimatePresence>
    </motion.main>
  );
} 