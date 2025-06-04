"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineHeart,
} from "react-icons/hi2";

export default function CreateTripPlan() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    budget: "",
    preferences: [] as string[],
    mood: "",
  });

  const preferences = [
    "자연/경관",
    "문화/역사",
    "맛집/음식",
    "쇼핑",
    "액티비티",
    "휴양/힐링",
  ];

  const moods = [
    { id: "adventure", name: "모험적인", icon: "🏃" },
    { id: "relaxed", name: "여유로운", icon: "😌" },
    { id: "cultural", name: "문화적인", icon: "🏛️" },
    { id: "romantic", name: "로맨틱한", icon: "💑" },
    { id: "family", name: "가족적인", icon: "👨‍👩‍👧‍👦" },
  ];

  const handlePreferenceToggle = (pref: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const handleSubmit = async () => {
    // TODO: AI 여행 계획 생성 로직 구현
    console.log("Form submitted:", formData);
    router.push("/trip/plan/list");
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
              취소
            </button>
            <h1 className="text-lg font-semibold">AI 여행 계획 만들기</h1>
            <button
              onClick={handleSubmit}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              생성하기
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="p-4 space-y-6">
          {/* 여행지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              여행지
            </label>
            <div className="relative">
              <HiOutlineMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.destination}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    destination: e.target.value,
                  }))
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="어디로 여행가시나요?"
              />
            </div>
          </div>

          {/* 여행 기간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                출발일
              </label>
              <div className="relative">
                <HiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                도착일
              </label>
              <div className="relative">
                <HiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 인원 수 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              인원 수
            </label>
            <div className="relative">
              <HiOutlineUserGroup className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                min="1"
                value={formData.travelers}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    travelers: parseInt(e.target.value),
                  }))
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 예산 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              예산
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ₩
              </span>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, budget: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예산을 입력해주세요"
              />
            </div>
          </div>

          {/* 선호도 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              선호하는 여행 스타일
            </label>
            <div className="flex flex-wrap gap-2">
              {preferences.map((pref) => (
                <button
                  key={pref}
                  onClick={() => handlePreferenceToggle(pref)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    formData.preferences.includes(pref)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* 여행 분위기 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              원하는 여행 분위기
            </label>
            <div className="grid grid-cols-3 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, mood: mood.id }))
                  }
                  className={`p-4 rounded-lg border ${
                    formData.mood === mood.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.icon}</div>
                  <div className="text-sm">{mood.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
