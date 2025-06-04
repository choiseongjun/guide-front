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

// 가데이터 정의
const mockCustomPlan = {
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
};

interface CustomPlan {
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
}

interface Props {
  params: { id: string };
}

export default function CustomPlanDetailClient({ params }: Props) {
  const router = useRouter();
  const [plan, setPlan] = useState<CustomPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API 호출 대신 가데이터 사용
    setTimeout(() => {
      setPlan(mockCustomPlan);
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
              <span className="text-sm font-medium">맞춤 여행</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
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

        {/* 일정 탭 */}
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 