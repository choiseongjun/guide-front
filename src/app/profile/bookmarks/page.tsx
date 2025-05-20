"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineArrowLeft,
  HiOutlineBookmark,
  HiOutlineUser,
} from "react-icons/hi2";
import { motion } from "framer-motion";

interface Bookmark {
  id: number;
  title: string;
  image: string;
  author: string;
  category: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
}

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState<"guides" | "posts">("guides");

  const guideBookmarks: Bookmark[] = [
    {
      id: 1,
      title: "도쿄 3박 4일 완벽 가이드",
      image: "/images/tokyo-guide.jpg",
      author: "여행러",
      category: "여행 가이드",
      content:
        "도쿄 여행의 모든 것! 교통, 숙소, 맛집, 관광지까지 완벽하게 정리했습니다.",
      date: "2024-03-15",
      likes: 156,
      comments: 23,
    },
    {
      id: 2,
      title: "파리 미술관 투어 가이드",
      image: "/images/paris-museum.jpg",
      author: "아트러버",
      category: "여행 가이드",
      content:
        "루브르, 오르세, 퐁피두까지! 파리의 주요 미술관을 효율적으로 둘러보는 방법을 소개합니다.",
      date: "2024-03-10",
      likes: 98,
      comments: 15,
    },
  ];

  const postBookmarks: Bookmark[] = [
    {
      id: 3,
      title: "도쿄 숨은 맛집 10선",
      image: "/images/tokyo-food.jpg",
      author: "맛집탐험가",
      category: "맛집",
      content: "현지인들만 아는 도쿄의 숨은 맛집들을 소개합니다. 예약 필수!",
      date: "2024-03-08",
      likes: 245,
      comments: 42,
    },
    {
      id: 4,
      title: "파리 쇼핑 가이드",
      image: "/images/paris-shopping.jpg",
      author: "패션러버",
      category: "쇼핑",
      content: "파리에서 꼭 가봐야 할 쇼핑 명소와 추천 브랜드를 소개합니다.",
      date: "2024-03-05",
      likes: 178,
      comments: 31,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link
              href="/my"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiOutlineArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-lg font-medium ml-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              북마크
            </h1>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("guides")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "guides"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            여행 가이드
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "posts"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            게시글
          </button>
        </div>
      </div>

      {/* 북마크 목록 */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {(activeTab === "guides" ? guideBookmarks : postBookmarks).map(
          (bookmark) => (
            <motion.div
              key={bookmark.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <Link href={`/post/${bookmark.id}`}>
                <div className="relative h-48">
                  <Image
                    src={bookmark.image}
                    alt={bookmark.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                    {bookmark.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {bookmark.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <HiOutlineUser className="w-5 h-5 mr-2" />
                    <span>{bookmark.author}</span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {bookmark.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{bookmark.date}</span>
                    <div className="flex items-center gap-4">
                      <span>좋아요 {bookmark.likes}</span>
                      <span>댓글 {bookmark.comments}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
