"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineHeart,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineArrowRight,
} from "react-icons/hi2";

// 임시 데이터
const mockTravelPlan = {
  destination: "도쿄",
  startDate: "2024-04-01",
  endDate: "2024-04-05",
  budget: "150만원",
  companions: "혼자",
  interests: ["문화/역사", "맛집/음식", "쇼핑"],
  preferredActivities: ["도시 관광", "맛집 투어", "쇼핑"],
  accommodationType: "호텔",
  transportation: "대중교통",
  dailyPlans: [
    {
      day: 1,
      date: "2024-04-01",
      activities: [
        {
          time: "09:00",
          title: "도쿄 스카이트리 방문",
          description: "도쿄의 전경을 감상하며 아침 식사",
          location: "도쿄 스카이트리",
          cost: "2,100엔",
        },
        {
          time: "12:00",
          title: "스시 점심",
          description: "현지인 추천 스시 레스토랑",
          location: "스시잔마이",
          cost: "5,000엔",
        },
        {
          time: "14:00",
          title: "아사쿠사 관광",
          description: "센소지 사원과 전통 시장 탐방",
          location: "아사쿠사",
          cost: "0엔",
        },
      ],
    },
    {
      day: 2,
      date: "2024-04-02",
      activities: [
        {
          time: "10:00",
          title: "시부야 쇼핑",
          description: "트렌디한 쇼핑몰과 카페 탐방",
          location: "시부야",
          cost: "0엔",
        },
        {
          time: "13:00",
          title: "라멘 점심",
          description: "유명 라멘집 방문",
          location: "이치란",
          cost: "1,000엔",
        },
        {
          time: "15:00",
          title: "하라주쿠 관광",
          description: "카와이 문화 체험",
          location: "하라주쿠",
          cost: "0엔",
        },
      ],
    },
  ],
  guide: {
    name: "사토 케이코",
    avatar: "/images/guide-avatar.jpg",
    rating: 4.9,
    reviews: 128,
    specialties: ["일본 문화", "맛집", "쇼핑"],
    languages: ["한국어", "일본어", "영어"],
  },
  similarPlans: [
    {
      id: 1,
      user: {
        name: "김서연",
        avatar: "/images/user-avatar.jpg",
      },
      destination: "도쿄",
      startDate: "2024-04-10",
      endDate: "2024-04-14",
      similarity: 85,
    },
    {
      id: 2,
      user: {
        name: "이준호",
        avatar: "/images/user-avatar.jpg",
      },
      destination: "오사카",
      startDate: "2024-04-15",
      endDate: "2024-04-19",
      similarity: 75,
    },
  ],
};

export default function TravelPlanResultClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"plan" | "similar">("plan");
  const [travelPlan] = useState(mockTravelPlan);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">맞춤형 여행 계획</h1>
            <button
              onClick={() => router.push("/trip/planning")}
              className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg"
            >
              새 계획 만들기
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 여행 정보 요약 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <HiOutlineMapPin className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{travelPlan.destination}</h2>
              <p className="text-gray-500">
                {travelPlan.startDate} ~ {travelPlan.endDate}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <HiOutlineCurrencyDollar className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">예산</span>
              </div>
              <p className="font-medium">{travelPlan.budget}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <HiOutlineUserGroup className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">동행</span>
              </div>
              <p className="font-medium">{travelPlan.companions}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <HiOutlineHeart className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">관심사</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {travelPlan.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <HiOutlineClock className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">활동</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {travelPlan.preferredActivities.map((activity) => (
                  <span
                    key={activity}
                    className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("plan")}
              className={`flex-1 py-4 text-center ${
                activeTab === "plan"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              일정
            </button>
            <button
              onClick={() => setActiveTab("similar")}
              className={`flex-1 py-4 text-center ${
                activeTab === "similar"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              비슷한 여행 계획
            </button>
          </div>
        </div>

        {/* 일정 탭 */}
        {activeTab === "plan" && (
          <div className="space-y-6">
            {travelPlan.dailyPlans.map((dayPlan) => (
              <div key={dayPlan.day} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-500">
                      Day {dayPlan.day}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {new Date(dayPlan.date).toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {dayPlan.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-20 text-center">
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{activity.title}</h4>
                        <p className="text-sm text-gray-500 mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
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
          <div className="space-y-4">
            {travelPlan.similarPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/trip/planning/result/${plan.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src={plan.user.avatar}
                        alt={plan.user.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{plan.user.name}</h3>
                      <p className="text-sm text-gray-500">
                        {plan.destination} • {plan.startDate} ~ {plan.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500 font-medium">
                      {plan.similarity}% 유사
                    </span>
                    <HiOutlineArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 가이드 정보 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16">
              <Image
                src={travelPlan.guide.avatar}
                alt={travelPlan.guide.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{travelPlan.guide.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                  <span className="ml-1">{travelPlan.guide.rating}</span>
                </div>
                <span>•</span>
                <span>{travelPlan.guide.reviews}개의 리뷰</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">전문 분야</h4>
              <div className="flex flex-wrap gap-2">
                {travelPlan.guide.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">사용 가능 언어</h4>
              <div className="flex flex-wrap gap-2">
                {travelPlan.guide.languages.map((language) => (
                  <span
                    key={language}
                    className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-full"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button className="w-full mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
            가이드와 채팅하기
          </button>
        </div>
      </div>
    </div>
  );
} 