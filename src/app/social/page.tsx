"use client";
import Image from "next/image";
import {
  HiOutlineHeart,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShare,
  HiPlus,
} from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const categories = [
  { id: "review", name: "여행 후기" },
  { id: "food", name: "맛집 추천" },
  { id: "accommodation", name: "숙소 추천" },
  { id: "tips", name: "여행 팁" },
  { id: "companion", name: "동행 구함" },
  { id: "question", name: "여행 질문" },
];

const posts = [
  {
    id: 1,
    author: {
      name: "여행러",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60",
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
    category: "review",
  },
  {
    id: 2,
    author: {
      name: "여행작가",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60",
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
    category: "food",
  },
  {
    id: 3,
    author: {
      name: "여행가이드",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
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
    category: "tips",
  },
];

// 내 게시글 데이터
const myPosts = [
  {
    id: 101,
    author: {
      name: "여행러",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60",
    },
    content: `도쿄 여행에서 발견한 숨은 맛집들을 소개합니다! 🍜

신주쿠의 작은 골목에서 만난 라멘집은 정말 놀라웠어요.
특히 돈코츠 라멘의 깊은 맛은 잊을 수 없습니다.
대기 시간이 좀 길었지만, 그만한 가치가 있었어요.

#도쿄여행 #맛집추천 #신주쿠 #라멘`,
    images: [
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=60",
    ],
    likes: 245,
    comments: 38,
    shares: 12,
    location: "일본 도쿄",
    timeAgo: "3일 전",
    category: "food",
  },
  {
    id: 102,
    author: {
      name: "여행러",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60",
    },
    content: `제주도 3박 4일 여행 코스 추천 🌊

1일차: 성산일출봉 - 섭지코지 - 만장굴
2일차: 우도 - 비자림 - 함덕해수욕장
3일차: 한라산 등반 - 오설록 티 뮤지엄
4일차: 서귀포 올레길 - 카페투어

특히 우도의 에메랄드빛 바다는 꼭 가보세요!
#제주여행 #여행코스 #우도`,
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&auto=format&fit=crop&q=60",
    ],
    likes: 189,
    comments: 45,
    shares: 23,
    location: "제주도",
    timeAgo: "1주일 전",
    category: "tips",
  },
  {
    id: 103,
    author: {
      name: "여행러",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60",
    },
    content: `파리 에펠탑 야경 포인트 추천 🌙

트로카데로 광장에서 바라본 에펠탑의 야경은 정말 장관입니다.
특히 매시 정각마다 반짝이는 조명쇼는 꼭 봐야 해요!
사진을 찍기 좋은 시간대는 일몰 직후 30분 정도입니다.

#파리여행 #에펠탑 #야경 #여행사진`,
    images: [
      "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&auto=format&fit=crop&q=60",
    ],
    likes: 312,
    comments: 56,
    shares: 34,
    location: "프랑스 파리",
    timeAgo: "2주일 전",
    category: "review",
  },
];

export default function SocialPage() {
  const router = useRouter();
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");

  const toggleExpand = (postId: number) => {
    setExpandedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handlePostClick = (postId: number) => {
    router.push(`/social/${postId}`);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredPosts =
    selectedCategories.length === 0
      ? posts
      : posts.filter((post) => selectedCategories.includes(post.category));

  const displayedPosts = activeTab === "my" ? myPosts : filteredPosts;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 탭 메뉴 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20">
        <div className="max-w-md mx-auto px-4">
          <div className="flex gap-4">
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === "all"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("all")}
            >
              전체 피드
            </button>
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === "my"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("my")}
            >
              내 게시글
            </button>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="sticky top-[57px] bg-white border-b border-gray-200 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategories.includes(category.id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <motion.main
        className="max-w-md mx-auto pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence>
          {displayedPosts.map((post) => (
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
                    <span>•</span>
                    <span className="text-blue-500">
                      {categories.find((c) => c.id === post.category)?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* 게시글 내용 */}
              <div className="px-4 pb-3">
                <p
                  className={`text-sm text-gray-800 whitespace-pre-line ${
                    !expandedPosts.includes(post.id) ? "line-clamp-3" : ""
                  }`}
                >
                  {post.content}
                </p>
                {post.content.split("\n").length > 3 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(post.id);
                    }}
                    className="text-sm text-blue-500 mt-1"
                    whileTap={{ scale: 0.95 }}
                  >
                    {expandedPosts.includes(post.id) ? "접기" : "더보기"}
                  </motion.button>
                )}
              </div>

              {/* 이미지 그리드 */}
              <div className="grid grid-cols-2 gap-1">
                {post.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
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

      {/* 플로팅 버튼 */}
      <button
        onClick={() => router.push("/social/create")}
        className="floating-button"
      >
        <HiPlus className="w-6 h-6" />
      </button>
    </div>
  );
}
