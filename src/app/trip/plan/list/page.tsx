"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineHeart,
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
    status: "pending", // pending, accepted, rejected
    preferences: ["휴양/힐링", "자연/경관"],
    mood: "relaxed",
    host: {
      name: "김제주",
      avatar: "https://via.placeholder.com/40",
      rating: 4.8,
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
    status: "accepted",
    preferences: ["맛집/음식", "문화/역사"],
    mood: "cultural",
    host: {
      name: "이부산",
      avatar: "https://via.placeholder.com/40",
      rating: 4.9,
    },
  },
];

export default function TripPlanList() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredPlans =
    selectedStatus === "all"
      ? mockPlans
      : mockPlans.filter((plan) => plan.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "검토중";
      case "accepted":
        return "수락됨";
      case "rejected":
        return "거절됨";
      default:
        return status;
    }
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
            <h1 className="text-lg font-semibold">내 여행 계획</h1>
            <button
              onClick={() => router.push("/trip/plan/create")}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              새 계획 만들기
            </button>
          </div>
        </div>

        {/* 필터 */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedStatus === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedStatus("pending")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedStatus === "pending"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              검토중
            </button>
            <button
              onClick={() => setSelectedStatus("accepted")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedStatus === "accepted"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              수락됨
            </button>
          </div>
        </div>

        {/* 여행 계획 목록 */}
        <div className="divide-y divide-gray-200">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/trip/plan/${plan.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">{plan.title}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    plan.status
                  )}`}
                >
                  {getStatusText(plan.status)}
                </span>
              </div>

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

              {/* 호스트 정보 */}
              <div className="mt-4 flex items-center gap-2">
                <img
                  src={plan.host.avatar}
                  alt={plan.host.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="text-sm font-medium">{plan.host.name}</div>
                  <div className="text-xs text-gray-500">
                    평점 {plan.host.rating}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
