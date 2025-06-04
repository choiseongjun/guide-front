"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineCheck,
  HiOutlineXMark,
} from "react-icons/hi2";

// 가데이터
const mockPlans = [
  {
    id: 1,
    title: "제주도 3박 4일 힐링 여행",
    destination: "제주도",
    startDate: "2024-04-01",
    endDate: "2024-04-04",
    travelers: 2,
    budget: "1,500,000",
    status: "pending",
    preferences: ["휴양/힐링", "자연/경관"],
    mood: "relaxed",
    traveler: {
      name: "김여행",
      avatar: "https://via.placeholder.com/40",
      rating: 4.5,
      introduction:
        "여행을 좋아하는 30대 직장인입니다. 제주도의 아름다운 자연을 즐기고 싶습니다.",
    },
  },
  {
    id: 2,
    title: "부산 2박 3일 맛집 투어",
    destination: "부산",
    startDate: "2024-04-15",
    endDate: "2024-04-17",
    travelers: 4,
    budget: "2,000,000",
    status: "pending",
    preferences: ["맛집/음식", "문화/역사"],
    mood: "cultural",
    traveler: {
      name: "이맛집",
      avatar: "https://via.placeholder.com/40",
      rating: 4.8,
      introduction:
        "맛집 탐방을 좋아하는 20대 대학생입니다. 부산의 다양한 맛집을 경험하고 싶습니다.",
    },
  },
];

export default function HostTripPlans() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");

  const filteredPlans = mockPlans.filter(
    (plan) => plan.status === selectedStatus
  );

  const handleAccept = (planId: number) => {
    // TODO: API 연동
    console.log("Accept plan:", planId);
    // 상태 업데이트 로직 추가
  };

  const handleReject = (planId: number) => {
    // TODO: API 연동
    console.log("Reject plan:", planId);
    // 상태 업데이트 로직 추가
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.main
        className="max-w-md mx-auto bg-white min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-semibold">여행 계획 제안</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStatus("pending")}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedStatus === "pending"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                새로운 제안
              </button>
              <button
                onClick={() => setSelectedStatus("accepted")}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedStatus === "accepted"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                수락한 제안
              </button>
            </div>
          </div>
        </div>

        {/* 여행 계획 목록 */}
        <div className="divide-y divide-gray-200">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold">{plan.title}</h2>
                {plan.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(plan.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      title="수락"
                    >
                      <HiOutlineCheck className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(plan.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="거절"
                    >
                      <HiOutlineXMark className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 여행자 정보 */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={plan.traveler.avatar}
                    alt={plan.traveler.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{plan.traveler.name}</div>
                    <div className="text-sm text-gray-500">
                      평점 {plan.traveler.rating}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {plan.traveler.introduction}
                </p>
              </div>

              {/* 여행 정보 */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <HiOutlineMapPin className="w-4 h-4" />
                  <span>{plan.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineCalendar className="w-4 h-4" />
                  <span>
                    {plan.startDate} ~ {plan.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineUserGroup className="w-4 h-4" />
                  <span>{plan.travelers}명</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineHeart className="w-4 h-4" />
                  <span>{plan.preferences.join(", ")}</span>
                </div>
              </div>

              {/* 예산 */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">예산</span>
                  <span className="font-medium">₩{plan.budget}</span>
                </div>
              </div>

              {/* 상세 보기 버튼 */}
              <button
                onClick={() => router.push(`/trip/host/plans/${plan.id}`)}
                className="w-full mt-4 text-center text-blue-500 hover:text-blue-600 font-medium"
              >
                상세 보기
              </button>
            </div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
