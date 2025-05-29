"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineArrowLeft,
  HiOutlineStar,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import { getImageUrl } from "@/app/common/imgUtils";

interface Review {
  id: number;
  title: string;
  image: string;
  location: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
  comments: number;
}

export default function MyReviewsPage() {
  const [activeTab, setActiveTab] = useState<"places" | "accommodations">(
    "places"
  );

  const placeReviews: Review[] = [
    {
      id: 1,
      title: "도쿄 타워",
      image: "/images/tokyo-tower.jpg",
      location: "일본 도쿄",
      rating: 5,
      content:
        "도쿄의 상징적인 랜드마크! 야경이 정말 아름답습니다. 특히 석양 시간대에 방문하면 더욱 아름다운 풍경을 볼 수 있어요.",
      date: "2024-03-15",
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      title: "에펠탑",
      image: "/images/eiffel-tower.jpg",
      location: "프랑스 파리",
      rating: 4,
      content:
        "파리의 상징적인 건축물. 야경이 정말 멋지지만, 관광객이 너무 많아서 조금 답답했어요. 아침 일찍 방문하는 것을 추천합니다.",
      date: "2024-03-10",
      likes: 18,
      comments: 3,
    },
  ];

  const accommodationReviews: Review[] = [
    {
      id: 3,
      title: "도쿄 시부야 호텔",
      image: "/images/shibuya-hotel.jpg",
      location: "일본 도쿄 시부야",
      rating: 5,
      content:
        "시부야 역에서 도보 5분 거리에 위치해 있어서 교통이 매우 편리합니다. 객실도 깨끗하고 직원분들도 친절해요.",
      date: "2024-03-08",
      likes: 15,
      comments: 2,
    },
    {
      id: 4,
      title: "파리 에펠탑 호텔",
      image: "/images/paris-hotel.jpg",
      location: "프랑스 파리",
      rating: 4,
      content:
        "에펠탑이 보이는 뷰가 정말 좋았습니다. 다만 가격이 조금 비싸다는 점이 아쉬워요.",
      date: "2024-03-05",
      likes: 12,
      comments: 1,
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <HiOutlineStar
            key={index}
            className={`w-5 h-5 ${
              index < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

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
              작성한 리뷰
            </h1>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("places")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "places"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            여행지
          </button>
          <button
            onClick={() => setActiveTab("accommodations")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "accommodations"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            숙소
          </button>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {(activeTab === "places" ? placeReviews : accommodationReviews).map(
          (review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <Link href={`/review/${review.id}`}>
                <div className="relative h-48">
                  <Image
                    src={getImageUrl(review.image)}
                    alt={review.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {review.title}
                    </h3>
                    {renderStars(review.rating)}
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <HiOutlineMapPin className="w-5 h-5 mr-2" />
                    <span>{review.location}</span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {review.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{review.date}</span>
                    <div className="flex items-center gap-4">
                      <span>좋아요 {review.likes}</span>
                      <span>댓글 {review.comments}</span>
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
