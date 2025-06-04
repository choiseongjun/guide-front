"use client";

import { useState } from "react";
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
} from "react-icons/hi2";
import instance from "@/app/api/axios";

interface TravelPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  companions: string;
  interests: string[];
  preferredActivities: string[];
  accommodationType: string;
  transportation: string;
}

const interestOptions = [
  "문화/역사",
  "자연/경관",
  "맛집/음식",
  "쇼핑",
  "액티비티",
  "휴양/힐링",
  "사진/인스타그램",
  "예술/전시",
];

const activityOptions = [
  "도시 관광",
  "자연 탐방",
  "맛집 투어",
  "쇼핑",
  "액티비티",
  "휴양",
  "문화 체험",
  "사진 촬영",
];

const accommodationOptions = [
  "호텔",
  "게스트하우스",
  "리조트",
  "펜션",
  "호스텔",
  "에어비앤비",
];

const transportationOptions = [
  "대중교통",
  "렌터카",
  "택시",
  "자전거",
  "도보",
];

export default function AITravelPlanPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<TravelPreferences>({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    companions: "",
    interests: [],
    preferredActivities: [],
    accommodationType: "",
    transportation: "",
  });

  const handleInputChange = (field: keyof TravelPreferences, value: string | string[]) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleActivityToggle = (activity: string) => {
    setPreferences((prev) => ({
      ...prev,
      preferredActivities: prev.preferredActivities.includes(activity)
        ? prev.preferredActivities.filter((a) => a !== activity)
        : [...prev.preferredActivities, activity],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await instance.post("/api/v1/travels/ai-plan", preferences);
      if (response.data.status === 200) {
        router.push(`/trip/ai-plan/result/${response.data.data.id}`);
      }
    } catch (error) {
      console.error("여행 계획 생성 실패:", error);
      alert("여행 계획 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                여행지
              </label>
              <input
                type="text"
                value={preferences.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
                placeholder="예: 도쿄, 파리, 제주도"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  출발일
                </label>
                <input
                  type="date"
                  value={preferences.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  도착일
                </label>
                <input
                  type="date"
                  value={preferences.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                예산
              </label>
              <input
                type="text"
                value={preferences.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                placeholder="예: 100만원, 200만원"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                동행자
              </label>
              <input
                type="text"
                value={preferences.companions}
                onChange={(e) => handleInputChange("companions", e.target.value)}
                placeholder="예: 혼자, 커플, 가족"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                관심사 (다중 선택 가능)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-2 rounded-lg border ${
                      preferences.interests.includes(interest)
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                선호하는 활동 (다중 선택 가능)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {activityOptions.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => handleActivityToggle(activity)}
                    className={`p-2 rounded-lg border ${
                      preferences.preferredActivities.includes(activity)
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                숙소 유형
              </label>
              <select
                value={preferences.accommodationType}
                onChange={(e) => handleInputChange("accommodationType", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">선택해주세요</option>
                {accommodationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                교통수단
              </label>
              <select
                value={preferences.transportation}
                onChange={(e) => handleInputChange("transportation", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">선택해주세요</option>
                {transportationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">AI 맞춤형 여행 계획</h1>
            <HiOutlineSparkles className="w-6 h-6 text-blue-500" />
          </div>

          {/* 진행 상태 표시 */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s <= step ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>기본 정보</span>
              <span>예산/동행</span>
              <span>관심사</span>
              <span>선호도</span>
            </div>
          </div>

          {/* 현재 단계 폼 */}
          {renderStep()}

          {/* 버튼 */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep((prev) => prev - 1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                이전
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep((prev) => prev + 1)}
                className="ml-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? "생성 중..." : "여행 계획 생성하기"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 