"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineHeart,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShare,
  HiOutlineBookmark,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import instance from "@/app/api/axios";

// 가데이터 정의
const mockTravelPlan = {
  id: 1,
  destination: "도쿄",
  startDate: "2024-04-01",
  endDate: "2024-04-05",
  budget: "150만원",
  companions: "혼자",
  interests: ["맛집/음식", "문화/역사", "쇼핑"],
  preferredActivities: ["도시 관광", "맛집 투어", "쇼핑"],
  accommodationType: "호텔",
  transportation: "대중교통",
  dailyPlans: [
    {
      day: 1,
      activities: [
        {
          time: "09:00",
          title: "도쿄 스카이트리 방문",
          description: "도쿄의 전경을 감상하며 아침 식사",
          location: "도쿄 스카이트리",
          cost: "3,000엔",
        },
        {
          time: "12:00",
          title: "스시 점심 식사",
          description: "현지 유명 스시집에서 점심 식사",
          location: "츠키지 시장",
          cost: "5,000엔",
        },
        {
          time: "14:00",
          title: "아사쿠사 사원 관광",
          description: "도쿄의 대표적인 사원과 전통 시장 탐방",
          location: "아사쿠사",
          cost: "무료",
        },
        {
          time: "18:00",
          title: "시부야 쇼핑",
          description: "도쿄의 대표적인 쇼핑 거리 탐방",
          location: "시부야",
          cost: "자유",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          time: "10:00",
          title: "하라주쿠 쇼핑",
          description: "일본의 트렌디한 쇼핑 거리",
          location: "하라주쿠",
          cost: "자유",
        },
        {
          time: "13:00",
          title: "라멘 점심",
          description: "유명 라멘집에서 점심 식사",
          location: "신주쿠",
          cost: "1,200엔",
        },
        {
          time: "15:00",
          title: "신주쿠 정원 산책",
          description: "도쿄의 아름다운 정원에서 휴식",
          location: "신주쿠 정원",
          cost: "500엔",
        },
      ],
    },
  ],
  similarPlans: [
    {
      id: 2,
      destination: "도쿄",
      startDate: "2024-04-10",
      endDate: "2024-04-14",
      user: {
        id: 1,
        nickname: "여행러1",
        profileImageUrl: "https://i.pravatar.cc/150?img=1",
      },
      similarity: 0.85,
    },
    {
      id: 3,
      destination: "오사카",
      startDate: "2024-04-15",
      endDate: "2024-04-19",
      user: {
        id: 2,
        nickname: "여행러2",
        profileImageUrl: "https://i.pravatar.cc/150?img=2",
      },
      similarity: 0.75,
    },
    {
      id: 4,
      destination: "후쿠오카",
      startDate: "2024-04-20",
      endDate: "2024-04-24",
      user: {
        id: 3,
        nickname: "여행러3",
        profileImageUrl: "https://i.pravatar.cc/150?img=3",
      },
      similarity: 0.65,
    },
  ],
};

interface TravelPlan {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  companions: string;
  interests: string[];
  preferredActivities: string[];
  accommodationType: string;
  transportation: string;
  dailyPlans: {
    day: number;
    activities: {
      time: string;
      title: string;
      description: string;
      location: string;
      cost: string;
    }[];
  }[];
  similarPlans: {
    id: number;
    destination: string;
    startDate: string;
    endDate: string;
    user: {
      id: number;
      nickname: string;
      profileImageUrl: string;
    };
    similarity: number;
  }[];
}

interface Props {
  params: { id: string };
}

export default function TravelPlanResultClient({ params }: Props) {
  const router = useRouter();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"plan" | "similar">("plan");

  useEffect(() => {
    // API 호출 대신 가데이터 사용
    setTimeout(() => {
      setPlan(mockTravelPlan);
      setLoading(false);
    }, 1000); // 로딩 효과를 위해 1초 지연
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">여행 계획을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <HiOutlineArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <HiOutlineShare className="w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <HiOutlineBookmark className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 여행 계획 요약 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{plan.destination} 여행 계획</h1>
            <div className="flex items-center gap-2 text-blue-500">
              <HiOutlineSparkles className="w-5 h-5" />
              <span className="text-sm font-medium">AI 추천</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <HiOutlineCalendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">여행 기간</p>
                <p className="font-medium">
                  {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineCurrencyDollar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">예산</p>
                <p className="font-medium">{plan.budget}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineUserGroup className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">동행</p>
                <p className="font-medium">{plan.companions}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineMapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">여행지</p>
                <p className="font-medium">{plan.destination}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {plan.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("plan")}
            className={`px-6 py-3 font-medium ${
              activeTab === "plan"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
          >
            일정
          </button>
          <button
            onClick={() => setActiveTab("similar")}
            className={`px-6 py-3 font-medium ${
              activeTab === "similar"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
          >
            비슷한 여행 계획
          </button>
        </div>

        {/* 일정 탭 */}
        {activeTab === "plan" && (
          <div className="space-y-6">
            {plan.dailyPlans.map((dayPlan) => (
              <div key={dayPlan.day} className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Day {dayPlan.day}</h2>
                <div className="space-y-4">
                  {dayPlan.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="w-20 flex-shrink-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.time}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <HiOutlineMapPin className="w-4 h-4" />
                            {activity.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <HiOutlineCurrencyDollar className="w-4 h-4" />
                            {activity.cost}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 비슷한 여행 계획 탭 */}
        {activeTab === "similar" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.similarPlans.map((similarPlan) => (
              <motion.div
                key={similarPlan.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer"
                onClick={() => router.push(`/trip/ai-plan/result/${similarPlan.id}`)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={similarPlan.user.profileImageUrl}
                      alt={similarPlan.user.nickname}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{similarPlan.user.nickname}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(similarPlan.startDate)} -{" "}
                      {formatDate(similarPlan.endDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{similarPlan.destination}</h3>
                  <span className="text-sm text-blue-500">
                    {Math.round(similarPlan.similarity * 100)}% 유사
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 