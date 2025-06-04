"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineSparkles,
} from "react-icons/hi2";

const moods = [
  {
    id: "relaxed",
    name: "힐링/휴식",
    description: "평화롭고 여유로운 여행을 원하시나요?",
  },
  {
    id: "adventurous",
    name: "모험/도전",
    description: "새로운 경험과 도전을 찾으시나요?",
  },
  {
    id: "cultural",
    name: "문화/역사",
    description: "지역의 문화와 역사를 탐방하고 싶으신가요?",
  },
  {
    id: "romantic",
    name: "로맨틱",
    description: "특별한 추억을 만들고 싶으신가요?",
  },
  {
    id: "family",
    name: "가족/친목",
    description: "가족이나 친구들과 함께 즐거운 시간을 보내고 싶으신가요?",
  },
  {
    id: "nature",
    name: "자연/경관",
    description: "아름다운 자연 속에서 힐링하고 싶으신가요?",
  },
  {
    id: "urban",
    name: "도시/현대",
    description: "도시의 활기찬 분위기를 즐기고 싶으신가요?",
  },
  {
    id: "luxury",
    name: "럭셔리/특별",
    description: "특별하고 고급스러운 경험을 원하시나요?",
  },
];

const personalities = [
  {
    id: "introvert",
    name: "내향적",
    description: "조용하고 차분한 환경을 선호하시나요?",
  },
  {
    id: "extrovert",
    name: "외향적",
    description: "활발하고 사교적인 활동을 선호하시나요?",
  },
  {
    id: "planner",
    name: "계획형",
    description: "미리 계획된 일정을 선호하시나요?",
  },
  {
    id: "spontaneous",
    name: "즉흥형",
    description: "즉흥적인 여행을 선호하시나요?",
  },
  {
    id: "adventurous",
    name: "도전형",
    description: "새로운 경험을 추구하시나요?",
  },
  {
    id: "comfort",
    name: "안락형",
    description: "편안하고 안정적인 여행을 선호하시나요?",
  },
];

const preferences = [
  {
    id: "relaxation",
    name: "휴양/힐링",
    description: "편안한 휴식과 힐링을 원하시나요?",
  },
  {
    id: "nature",
    name: "자연/경관",
    description: "아름다운 자연 경관을 즐기고 싶으신가요?",
  },
  {
    id: "food",
    name: "맛집/음식",
    description: "현지의 맛있는 음식을 경험하고 싶으신가요?",
  },
  {
    id: "culture",
    name: "문화/역사",
    description: "지역의 문화와 역사를 탐방하고 싶으신가요?",
  },
  {
    id: "shopping",
    name: "쇼핑",
    description: "현지의 쇼핑을 즐기고 싶으신가요?",
  },
  {
    id: "activity",
    name: "액티비티",
    description: "다양한 활동과 체험을 원하시나요?",
  },
  {
    id: "photo",
    name: "사진/인스타그램",
    description: "아름다운 사진을 찍고 싶으신가요?",
  },
  {
    id: "local",
    name: "로컬/지역문화",
    description: "현지인처럼 지역 문화를 경험하고 싶으신가요?",
  },
  {
    id: "art",
    name: "예술/전시",
    description: "예술 작품과 전시를 감상하고 싶으신가요?",
  },
  {
    id: "nightlife",
    name: "야경/야시장",
    description: "밤의 분위기를 즐기고 싶으신가요?",
  },
  {
    id: "wellness",
    name: "웰니스/스파",
    description: "건강과 웰빙을 위한 시간을 원하시나요?",
  },
  {
    id: "adventure",
    name: "어드벤처/스포츠",
    description: "스릴있는 활동을 원하시나요?",
  },
];

const locations = [
  {
    id: "jeju",
    name: "제주도",
    description: "아름다운 자연과 휴양지",
  },
  {
    id: "busan",
    name: "부산",
    description: "바다와 현대적인 도시",
  },
  {
    id: "gangwon",
    name: "강원도",
    description: "산과 자연의 아름다움",
  },
  {
    id: "gyeongju",
    name: "경주",
    description: "역사와 문화의 도시",
  },
  {
    id: "seoul",
    name: "서울",
    description: "현대적인 도시와 전통의 조화",
  },
  {
    id: "jeonju",
    name: "전주",
    description: "전통과 한옥의 도시",
  },
  {
    id: "incheon",
    name: "인천",
    description: "바다와 현대적인 도시",
  },
  {
    id: "daegu",
    name: "대구",
    description: "전통과 현대가 공존하는 도시",
  },
];

const seasons = [
  {
    id: "spring",
    name: "봄",
    description: "꽃이 피는 계절",
  },
  {
    id: "summer",
    name: "여름",
    description: "바다와 여름 휴가",
  },
  {
    id: "autumn",
    name: "가을",
    description: "단풍과 가을 풍경",
  },
  {
    id: "winter",
    name: "겨울",
    description: "눈과 겨울 스포츠",
  },
];

const budgets = [
  {
    id: "budget",
    name: "경제적",
    description: "합리적인 가격의 여행",
  },
  {
    id: "moderate",
    name: "보통",
    description: "적당한 가격의 여행",
  },
  {
    id: "luxury",
    name: "럭셔리",
    description: "고급스러운 여행",
  },
];

export default function CreateCustomTrip() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedPersonality, setSelectedPersonality] = useState<string>("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);

  const handlePreferenceToggle = (preferenceId: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preferenceId)
        ? prev.filter((p) => p !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  const handleNext = () => {
    if (step === 1 && !selectedMood) {
      alert("기분/분위기를 선택해주세요.");
      return;
    }
    if (step === 2 && !selectedPersonality) {
      alert("성향을 선택해주세요.");
      return;
    }
    if (step === 3 && selectedPreferences.length === 0) {
      alert("최소 하나 이상의 선호 여행 스타일을 선택해주세요.");
      return;
    }
    if (step === 4 && !selectedLocation) {
      alert("여행지를 선택해주세요.");
      return;
    }
    if (step === 5 && !selectedSeason) {
      alert("계절을 선택해주세요.");
      return;
    }
    if (step === 5 && !selectedBudget) {
      alert("예산을 선택해주세요.");
      return;
    }
    if (step === 6 && !startDate) {
      alert("여행 일정을 선택해주세요.");
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    // TODO: API 연동
    console.log({
      mood: selectedMood,
      personality: selectedPersonality,
      preferences: selectedPreferences,
      location: selectedLocation,
      season: selectedSeason,
      budget: selectedBudget,
      startDate,
      endDate,
      travelers,
    });

    router.push("/trip/custom");
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
            <h1 className="text-lg font-semibold">새 맞춤 여행</h1>
            <div className="w-8" /> {/* 균형을 위한 빈 공간 */}
          </div>
        </div>

        {/* 진행 상태 */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s <= step
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s}
                </div>
                {s < 6 && (
                  <div
                    className={`w-8 h-0.5 ${
                      s < step ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 스텝 1: 기분/분위기 선택 */}
        {step === 1 && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              어떤 기분으로 여행하고 싶으신가요?
            </h2>
            <div className="space-y-3">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`w-full p-4 text-left rounded-lg border ${
                    selectedMood === mood.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-500"
                  }`}
                >
                  <div className="font-medium">{mood.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {mood.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 스텝 2: 성향 선택 */}
        {step === 2 && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              어떤 성향을 가지고 계신가요?
            </h2>
            <div className="space-y-3">
              {personalities.map((personality) => (
                <button
                  key={personality.id}
                  onClick={() => setSelectedPersonality(personality.id)}
                  className={`w-full p-4 text-left rounded-lg border ${
                    selectedPersonality === personality.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-500"
                  }`}
                >
                  <div className="font-medium">{personality.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {personality.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 스텝 3: 선호 여행 스타일 선택 */}
        {step === 3 && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              어떤 여행을 선호하시나요?
            </h2>
            <div className="space-y-3">
              {preferences.map((preference) => (
                <button
                  key={preference.id}
                  onClick={() => handlePreferenceToggle(preference.id)}
                  className={`w-full p-4 text-left rounded-lg border ${
                    selectedPreferences.includes(preference.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-500"
                  }`}
                >
                  <div className="font-medium">{preference.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {preference.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 스텝 4: 여행지 선택 */}
        {step === 4 && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              어디로 여행하고 싶으신가요?
            </h2>
            <div className="space-y-3">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location.id)}
                  className={`w-full p-4 text-left rounded-lg border ${
                    selectedLocation === location.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-500"
                  }`}
                >
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {location.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 스텝 5: 계절과 예산 */}
        {step === 5 && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              어떤 계절과 예산으로 여행하고 싶으신가요?
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  선호하는 계절
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {seasons.map((season) => (
                    <button
                      key={season.id}
                      onClick={() => setSelectedSeason(season.id)}
                      className={`p-3 text-left rounded-lg border ${
                        selectedSeason === season.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-500"
                      }`}
                    >
                      <div className="font-medium">{season.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {season.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  예산 범위
                </h3>
                <div className="space-y-3">
                  {budgets.map((budget) => (
                    <button
                      key={budget.id}
                      onClick={() => setSelectedBudget(budget.id)}
                      className={`w-full p-4 text-left rounded-lg border ${
                        selectedBudget === budget.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-500"
                      }`}
                    >
                      <div className="font-medium">{budget.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {budget.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 스텝 6: 여행 일정 */}
        {step === 6 && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              여행 일정을 선택해주세요
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  여행 기간
                </label>
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  여행 인원
                </label>
                <input
                  type="number"
                  min="1"
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          {step < 6 ? (
            <button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              AI 맞춤 여행 생성하기
            </button>
          )}
        </div>
      </motion.main>
    </div>
  );
}
