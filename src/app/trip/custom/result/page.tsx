'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineLightBulb } from 'react-icons/hi';
import { FaUtensils, FaLandmark } from 'react-icons/fa';

interface DailySchedule {
  날짜: string;
  일정: string;
}

interface Restaurant {
  이름: string;
  주소: string;
  추천_메뉴: string;
}

interface Attraction {
  이름: string;
  설명: string;
  주소: string;
}

interface TripPlan {
  일별_추천_일정: DailySchedule[];
  추천_맛집: Restaurant[];
  추천_명소: Attraction[];
  예상_비용: string;
  여행_팁: string;
}

export default function TripPlanResult() {
  const searchParams = useSearchParams();
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);

  useEffect(() => {
    const planData = searchParams.get('plan');
    if (planData) {
      try {
        // JSON 문자열에서 실제 JSON 객체 추출
        const jsonStr = planData.replace(/```json\n|\n```/g, '');
        const parsedPlan = JSON.parse(jsonStr);
        setTripPlan(parsedPlan);
      } catch (error) {
        console.error('Error parsing trip plan:', error);
      }
    }
  }, [searchParams]);

  if (!tripPlan) {
    return <div className="flex justify-center items-center min-h-screen">로딩중...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">맞춤 여행 계획</h1>

      {/* 일별 일정 */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineCalendar className="text-2xl text-blue-500" />
          <h2 className="text-2xl font-semibold">일별 추천 일정</h2>
        </div>
        <div className="grid gap-4">
          {tripPlan.일별_추천_일정.map((schedule, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="font-semibold text-blue-600">{schedule.날짜}</div>
              <div className="mt-2">{schedule.일정}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 추천 맛집 */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <FaUtensils className="text-2xl text-red-500" />
          <h2 className="text-2xl font-semibold">추천 맛집</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tripPlan.추천_맛집.map((restaurant, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="font-semibold text-lg">{restaurant.이름}</div>
              <div className="text-gray-600 mt-2">{restaurant.주소}</div>
              <div className="text-red-500 mt-2">추천 메뉴: {restaurant.추천_메뉴}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 추천 명소 */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <FaLandmark className="text-2xl text-green-500" />
          <h2 className="text-2xl font-semibold">추천 명소</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tripPlan.추천_명소.map((attraction, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="font-semibold text-lg">{attraction.이름}</div>
              <div className="text-gray-600 mt-2">{attraction.주소}</div>
              <div className="mt-2">{attraction.설명}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 예상 비용 */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineCurrencyDollar className="text-2xl text-yellow-500" />
          <h2 className="text-2xl font-semibold">예상 비용</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-xl font-semibold">{tripPlan.예상_비용}</div>
        </div>
      </section>

      {/* 여행 팁 */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineLightBulb className="text-2xl text-yellow-500" />
          <h2 className="text-2xl font-semibold">여행 팁</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg">{tripPlan.여행_팁}</div>
        </div>
      </section>
    </div>
  );
} 