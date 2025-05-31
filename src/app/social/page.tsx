"use client";

import Image from "next/image";
import {
  HiOutlineHeart,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShare,
  HiPlus,
} from "react-icons/hi2";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import instance from "@/app/api/axios";
import { getImageUrl } from "../common/imgUtils";
import { useUser } from "@/hooks/useUser";

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

const categories = [
  { id: "1", name: "여행후기" },
  { id: "2", name: "맛집 추천" },
  { id: "3", name: "숙소 추천" },
  { id: "4", name: "여행 팁" },
  { id: "5", name: "동행 구함" },
  { id: "6", name: "여행 질문" },
];

type SortOption = "latest" | "popular" | "comments";
type FilterState = {
  location: string[];
  duration: string[];
  price: string[];
  theme: string[];
};

function SocialContent() {
  const router = useRouter();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    location: [],
    duration: [],
    price: [],
    theme: [],
  });
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [serverError, setServerError] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // URL 쿼리 파라미터가 변경될 때 탭 상태 업데이트
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // 탭 변경 시 URL 업데이트
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/social?tab=${tab}`);
  };

  const fetchPosts = async (pageNum: number = 0) => {
    try {
      setServerError(false);
      const endpoint =
        activeTab === "my" ? "/api/social/posts/user/me" : "/api/social/posts";

      const response = await instance.get(endpoint, {
        params: {
          page: pageNum,
          size: 10,
          sort: "createdAt,desc",
          category:
            selectedCategories.length > 0
              ? selectedCategories.join(",")
              : undefined,
        },
      });
      console.log(response.data);

      if (response.status === 200) {
        const newPosts = response.data.data.content;
        setPosts((prev) => (pageNum === 0 ? newPosts : [...prev, ...newPosts]));
        setHasMore(newPosts.length === 10);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("게시글 조회 실패:", error);
      setServerError(true);
    }
  };

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts(page + 1);
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [page, hasMore, loading]);

  // 초기 데이터 로드 및 카테고리/탭 변경 시 데이터 리셋
  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    setPage(0);
    fetchPosts(0);
  }, [selectedCategories, activeTab]);

  // 서버 상태 체크
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await instance.get("/api/health");
        setServerError(false);
      } catch (error) {
        setServerError(true);
      }
    };

    const interval = setInterval(checkServerStatus, 30000); // 30초마다 체크
    return () => clearInterval(interval);
  }, []);

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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "방금 전";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 서버 상태 알림 */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 bg-red-500 text-white py-3 px-4 text-center z-50"
          >
            서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.
          </motion.div>
        )}
      </AnimatePresence>

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
              onClick={() => handleTabChange("all")}
            >
              전체 피드
            </button>
            {user && (
              <button
                className={`py-4 px-2 font-medium text-sm ${
                  activeTab === "my"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => handleTabChange("my")}
              >
                내 게시글
              </button>
            )}
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

      {/* 게시글 목록 */}
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
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black">
                  {post.userProfileImage ? (
                    <Image
                      src={getImageUrl(post.userProfileImage)}
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
                  <h3 className="font-medium text-sm">
                    {post.userNickname || "익명 사용자"}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatTimeAgo(post.createdAt)}</span>
                    <span>•</span>
                    <span className="text-blue-500">
                      {categories.find((c) => c.id === post.category)?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* 게시글 내용 */}
              <div className="px-4 pb-4">
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
              {post.imageUrls && post.imageUrls.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-1">
                    {post.imageUrls.slice(0, 4).map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={getImageUrl(image)}
                          alt={`Post image ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {/* 마지막 이미지이고 더 많은 이미지가 있을 경우 오버레이 표시 */}
                        {index === 3 && post.imageUrls.length > 4 && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-white text-lg font-medium">
                              더보기
                              +{post.imageUrls.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
                <motion.button
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <HiOutlineHeart className="w-5 h-5" />
                  <span className="text-sm">{post.likeCount}</span>
                </motion.button>
                <motion.button
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                  <span className="text-sm">{post.commentCount}</span>
                </motion.button>
                <motion.button
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <HiOutlineShare className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        {/* 무한 스크롤 감지 요소 */}
        <div
          ref={observerTarget}
          className="h-10 flex items-center justify-center"
        >
          {loading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          )}
        </div>
      </motion.main>

      {/* 플로팅 버튼 */}
      <button
        onClick={() => router.push("/social/create")}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
      >
        <HiPlus className="w-6 h-6" />
      </button>
    </div>
  );
}

export default function Social() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SocialContent />
    </Suspense>
  );
}
