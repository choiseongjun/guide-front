"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheck,
  HiOutlineXMark,
} from "react-icons/hi2";

// 가데이터
const mockPlan = {
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
    previousTrips: 5,
    memberSince: "2023-01",
  },
  schedule: [
    {
      day: 1,
      date: "2024-04-01",
      activities: [
        {
          time: "10:00",
          title: "공항 도착",
          description: "제주국제공항 도착",
        },
        {
          time: "11:00",
          title: "렌터카 수령",
          description: "제주국제공항 렌터카 카운터",
        },
        {
          time: "12:00",
          title: "점심 식사",
          description: "제주 흑돼지 맛집 방문",
        },
        {
          time: "14:00",
          title: "숙소 체크인",
          description: "제주시 호텔 체크인",
        },
      ],
    },
    {
      day: 2,
      date: "2024-04-02",
      activities: [
        {
          time: "09:00",
          title: "아침 식사",
          description: "호텔 조식",
        },
        {
          time: "10:00",
          title: "성산일출봉",
          description: "유네스코 세계자연유산 방문",
        },
        {
          time: "13:00",
          title: "점심 식사",
          description: "해산물 회 맛집",
        },
        {
          time: "15:00",
          title: "섭지코지",
          description: "아름다운 해안 산책로",
        },
      ],
    },
  ],
};

export default function HostTripPlanDetail({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const handleAccept = () => {
    // TODO: API 연동
    console.log("Accept plan");
    router.push("/trip/host/plans");
  };

  const handleReject = () => {
    // TODO: API 연동
    console.log("Reject plan");
    router.push("/trip/host/plans");
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
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              뒤로
            </button>
            <h1 className="text-lg font-semibold">여행 계획 상세</h1>
            <div className="w-8" /> {/* 균형을 위한 빈 공간 */}
          </div>
        </div>

        {/* 여행 계획 정보 */}
        <div className="p-4 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold">{mockPlan.title}</h2>
            {mockPlan.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  수락
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  거절
                </button>
              </div>
            )}
          </div>

          {/* 여행자 정보 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={mockPlan.traveler.avatar}
                alt={mockPlan.traveler.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-medium">{mockPlan.traveler.name}</div>
                <div className="text-sm text-gray-500">
                  평점 {mockPlan.traveler.rating}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {mockPlan.traveler.introduction}
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <div>이전 여행 {mockPlan.traveler.previousTrips}회</div>
              <div>가입일 {mockPlan.traveler.memberSince}</div>
            </div>
          </div>

          {/* 여행 정보 */}
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center gap-2">
              <HiOutlineMapPin className="w-5 h-5" />
              <span>{mockPlan.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineCalendar className="w-5 h-5" />
              <span>
                {mockPlan.startDate} ~ {mockPlan.endDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineUserGroup className="w-5 h-5" />
              <span>{mockPlan.travelers}명</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineHeart className="w-5 h-5" />
              <span>{mockPlan.preferences.join(", ")}</span>
            </div>
          </div>

          {/* 예산 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">예산</span>
              <span className="text-lg font-semibold">₩{mockPlan.budget}</span>
            </div>
          </div>

          {/* 일정 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">상세 일정</h3>
            <div className="space-y-6">
              {mockPlan.schedule.map((day) => (
                <div key={day.day} className="border-l-2 border-blue-500 pl-4">
                  <div className="font-medium mb-2">
                    Day {day.day} ({day.date})
                  </div>
                  <div className="space-y-4">
                    {day.activities.map((activity, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-6 w-3 h-3 bg-blue-500 rounded-full" />
                        <div className="text-sm font-medium text-gray-900">
                          {activity.time} - {activity.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 채팅 버튼 */}
          <button
            onClick={() => router.push(`/chat/${mockPlan.traveler.name}`)}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
            <span>여행자와 채팅하기</span>
          </button>
        </div>
      </motion.main>
    </div>
  );
}
