"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineClock,
} from "react-icons/hi2";

interface CompanionPost {
  id: number;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  description: string;
  tags: string[];
}

export default function CompanionPage() {
  const [posts] = useState<CompanionPost[]>([
    {
      id: 1,
      title: "제주도 3박 4일 동행 구합니다",
      location: "제주도",
      startDate: "2024-06-01",
      endDate: "2024-06-04",
      maxParticipants: 4,
      currentParticipants: 2,
      description:
        "제주도 여행 같이 가실 분 구합니다. 렌트카로 이동하며, 숙소는 게스트하우스 예정입니다.",
      tags: ["제주도", "렌트카", "게스트하우스", "20대"],
    },
    {
      id: 2,
      title: "부산 해운대 맛집 투어",
      location: "부산 해운대",
      startDate: "2024-05-25",
      endDate: "2024-05-25",
      maxParticipants: 6,
      currentParticipants: 4,
      description:
        "부산 해운대 맛집 투어 같이 가실 분 구합니다. 저녁 식사와 카페 투어 예정입니다.",
      tags: ["부산", "맛집", "카페", "당일치기"],
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">동행 모집</h1>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 검색 및 필터 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="여행지 검색"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              검색
            </button>
          </div>
        </div>

        {/* 동행 모집 글 목록 */}
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <HiOutlineMapPin className="w-5 h-5 mr-1" />
                    <span>{post.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <HiOutlineCalendar className="w-5 h-5 mr-1" />
                    <span>
                      {post.startDate} ~ {post.endDate}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <HiOutlineUserGroup className="w-5 h-5 mr-1" />
                    <span>
                      {post.currentParticipants}/{post.maxParticipants}명
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{post.description}</p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 글 작성 버튼 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          <span className="text-2xl">+</span>
        </motion.button>
      </div>
    </div>
  );
}
