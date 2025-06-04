"use client";

import { useState } from "react";
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

// 가데이터
const mockCustomTrips = [
  {
    id: 1,
    title: "제주도 힐링 여행",
    destination: "제주도",
    startDate: "2024-04-01",
    endDate: "2024-04-04",
    travelers: 2,
    mood: "relaxed",
    preferences: ["휴양/힐링", "자연/경관"],
    aiSuggestions: [
      "성산일출봉에서 일출 감상",
      "섭지코지 해안 산책로",
      "우도 자전거 투어",
    ],
  },
  {
    id: 2,
    title: "부산 맛집 투어",
    destination: "부산",
    startDate: "2024-04-15",
    endDate: "2024-04-17",
    travelers: 4,
    mood: "adventurous",
    preferences: ["맛집/음식", "문화/역사"],
    aiSuggestions: [
      "자갈치 시장 해산물 투어",
      "감천문화마을 산책",
      "부산 국제시장 탐방",
    ],
  },
];

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
        <div className="divide-y divide-gray-200">
          {mockCustomTrips.map((trip) => (
            <div
              key={trip.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/trip/custom/${trip.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold">{trip.title}</h2>
                <span className="text-sm text-gray-500">
                  {moods.find((m) => m.id === trip.mood)?.name}
                </span>
              </div>

              {/* 여행 정보 */}
              <div className="space-y-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <HiOutlineMapPin className="w-4 h-4" />
                  <span>{trip.destination}</span>
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

              {/* AI 추천 */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <HiOutlineSparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">AI 추천 활동</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  {trip.aiSuggestions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
