"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlinePlus,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineSparkles,
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
  preferences: string[];
  plan: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
}

interface PageResponse {
  content: TravelPlan[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

const moods = [
  { id: "relaxed", name: "힐링/휴식" },
  { id: "adventurous", name: "모험/도전" },
  { id: "cultural", name: "문화/역사" },
  { id: "romantic", name: "로맨틱" },
  { id: "family", name: "가족/친목" },
];

const preferences = [
  "휴양/힐링",
  "자연/경관",
  "맛집/음식",
  "문화/역사",
  "쇼핑",
  "액티비티",
  "사진/인스타그램",
  "로컬/지역문화",
];

export default function CustomTripList() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTravelPlans = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const response = await instance.get<PageResponse>(`/api/travel/plans?page=${pageNum}&size=10`);
      const newPlans = response.data.content;
      
      if (pageNum === 0) {
        setTravelPlans(newPlans);
      } else {
        setTravelPlans(prev => [...prev, ...newPlans]);
      }
      
      setHasMore(!response.data.last);
    } catch (error) {
      console.error('Error fetching travel plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTravelPlans(0);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoading && hasMore) {
      setPage(prev => prev + 1);
      fetchTravelPlans(page + 1);
    }
  };

  const handleCreateTrip = () => {
    router.push("/trip/custom/create");
  };

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  const parsePlan = (planString: string) => {
    try {
      return JSON.parse(planString);
    } catch (error) {
      console.error('Error parsing plan:', error);
      return null;
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
            <h1 className="text-lg font-semibold">맞춤 여행</h1>
            <button
              onClick={handleCreateTrip}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
            >
              <HiOutlinePlus className="w-5 h-5" />
              <span>새 여행</span>
            </button>
          </div>
        </div>

        {/* 필터 */}
        <div className="p-4 border-b border-gray-200">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">
              기분/분위기
            </h2>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedMood === mood.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {mood.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-2">
              선호 여행 스타일
            </h2>
            <div className="flex flex-wrap gap-2">
              {preferences.map((preference) => (
                <button
                  key={preference}
                  onClick={() => handlePreferenceToggle(preference)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedPreferences.includes(preference)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {preference}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 여행 목록 */}
        <div 
          className="divide-y divide-gray-200"
          onScroll={handleScroll}
        >
          {travelPlans.map((trip) => {
            const plan = parsePlan(trip.plan);
            const firstDaySchedule = plan?.일별_추천_일정?.[0]?.일정?.[0];
            
            return (
              <div
                key={trip.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/trip/custom/${trip.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={trip.user.profileImageUrl || "/default-profile.png"}
                      alt="프로필"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-semibold">{trip.title}</h2>
                      <span className="text-sm text-gray-500">{trip.mood}</span>
                    </div>
                    <div className="text-sm text-gray-500">{trip.user.nickname}</div>
                  </div>
                </div>

                {/* 여행 정보 */}
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <HiOutlineMapPin className="w-4 h-4" />
                    <span>{trip.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCalendar className="w-4 h-4" />
                    <span>
                      {trip.startDate} ~ {trip.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineUserGroup className="w-4 h-4" />
                    <span>{trip.travelers}명</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineHeart className="w-4 h-4" />
                    <span>{trip.preferences.join(", ")}</span>
                  </div>
                </div>

                {/* 함께 여행하기 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/trip/custom/${trip.id}/travelers`);
                  }}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  함께 여행하기
                </button>

                {/* AI 추천 */}
                {firstDaySchedule && (
                  <div className="bg-blue-50 p-3 rounded-lg mt-3">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <HiOutlineSparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">첫날 추천 활동</span>
                    </div>
                    <div className="text-sm text-blue-700">
                      <div>• {firstDaySchedule.활동}</div>
                      <div className="text-gray-600">{firstDaySchedule.장소}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              로딩 중...
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
}
