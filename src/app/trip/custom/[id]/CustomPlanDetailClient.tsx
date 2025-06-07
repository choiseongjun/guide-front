"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface TravelPlan {
  id: number;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  travelers: number;
  mood: string;
  moodState: string;
  personality: string;
  preferences: string[];
  budget: string;
  plan: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
}

interface Props {
  params: { value: string };
}

export default function CustomPlanDetailClient({ params }: Props) {
  const router = useRouter();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Raw params:', params);
    
    let parsedParams;
    try {
      parsedParams = JSON.parse(params.value);
      console.log('Parsed params:', parsedParams);
    } catch (error) {
      console.error('Error parsing params:', error);
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      if (!parsedParams?.id) {
        console.error('Plan ID is undefined');
        setLoading(false);
        return;
      }

      try {
        const response = await instance.get<TravelPlan>(`/api/travel/plans/${parsedParams.id}`);
        setPlan(response.data);
      } catch (error) {
        console.error('Error fetching plan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [params]);

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

  const parsePlan = (planString: string) => {
    try {
      return JSON.parse(planString);
    } catch (error) {
      console.error('Error parsing plan:', error);
      return null;
    }
  };

  const planData = parsePlan(plan.plan);

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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={plan.user.profileImageUrl || "/default-profile.png"}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{plan.user.nickname}</div>
              <div className="text-sm text-gray-500">여행 계획 작성자</div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{plan.title}</h1>
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
                <p className="text-sm text-gray-500">인원</p>
                <p className="font-medium">{plan.travelers}명</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineMapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">여행지</p>
                <p className="font-medium">{plan.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineHeart className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">성향</p>
                <p className="font-medium">{plan.personality}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {plan.preferences.map((preference) => (
              <span
                key={preference}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                {preference}
              </span>
            ))}
          </div>
        </div>

        {/* 일정 탭 */}
        <div className="space-y-6">
          {planData?.일별_추천_일정?.map((dayPlan: any, index: number) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">{dayPlan.날짜}</h2>
              <div className="space-y-4">
                {dayPlan.일정.map((activity: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-20 flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.시간대}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {activity.활동}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.장소}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1 text-blue-600">
                          <HiOutlineCurrencyDollar className="w-4 h-4" />
                          예상 비용: {activity['예상_비용(₩)'] || '비용 정보 없음'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">
                    일일 총 예상 비용: {dayPlan.일일_총_예상_비용}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 추천 맛집 */}
        {planData?.추천_맛집 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">추천 맛집</h2>
            <div className="space-y-4">
              {planData.추천_맛집.map((restaurant: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-medium">{restaurant.이름}</h3>
                  <p className="text-sm text-gray-500 mt-1">{restaurant.주소}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-blue-600">{restaurant.추천_메뉴}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{restaurant.유명도}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 추천 명소 */}
        {planData?.추천_명소 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">추천 명소</h2>
            <div className="space-y-4">
              {planData.추천_명소.map((attraction: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-medium">{attraction.이름}</h3>
                  <p className="text-sm text-gray-500 mt-1">{attraction.설명}</p>
                  <p className="text-sm text-gray-500 mt-1">{attraction.주소}</p>
                  <span className="inline-block mt-2 text-sm text-blue-600">
                    {attraction.유명도}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 예상 비용 총정리 */}
        {planData?.예상_비용_총정리 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">예상 비용 총정리</h2>
            <div className="space-y-2">
              {Object.entries(planData.예상_비용_총정리).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 여행 팁 */}
        {planData?.여행_팁 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">여행 팁</h2>
            <p className="text-gray-600">{planData.여행_팁}</p>
          </div>
        )}
      </div>
    </div>
  );
} 