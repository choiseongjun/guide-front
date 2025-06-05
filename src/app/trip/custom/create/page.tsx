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
  HiOutlineCurrencyDollar,
  HiOutlineLightBulb,
} from "react-icons/hi2";
import { FaUtensils, FaLandmark } from "react-icons/fa";
import axios from "axios";
import instance from "@/app/api/axios";

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

const moodStates = [
  {
    id: "stress-relief",
    name: "스트레스 해소",
    description: "스트레스를 풀고 싶으신가요?",
  },
  {
    id: "happy",
    name: "행복한",
    description: "행복한 기분을 더하고 싶으신가요?",
  },
  {
    id: "tired",
    name: "피곤한",
    description: "피로를 풀고 싶으신가요?",
  },
  {
    id: "excited",
    name: "설렘",
    description: "새로운 경험을 기대하시나요?",
  },
  {
    id: "depressed",
    name: "우울한",
    description: "기분 전환이 필요하신가요?",
  },
  {
    id: "joyful",
    name: "즐거운",
    description: "즐거운 시간을 보내고 싶으신가요?",
  },
  {
    id: "anxious",
    name: "불안한",
    description: "마음을 진정시키고 싶으신가요?",
  },
  {
    id: "peaceful",
    name: "평온한",
    description: "평화로운 시간을 원하시나요?",
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

const travelStyles = [
  {
    id: "relaxation",
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

export default function CreateCustomTrip() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedMoodState, setSelectedMoodState] = useState<string>("");
  const [selectedPersonality, setSelectedPersonality] = useState<string>("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [selectedTravelStyle, setSelectedTravelStyle] = useState<string>("");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    if (step === 5 && !selectedBudget) {
      alert("예산을 선택해주세요.");
      return;
    }
    if (step === 6 && !startDate) {
      alert("여행 일정을 선택해주세요.");
      return;
    }
    setStep(step + 1);

    // 모바일에서도 작동하는 스크롤 최상단 이동
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // 여행 데이터 구성
      const tripData = {
        mood: moods.find((m) => m.id === selectedMood)?.name,
        moodState: moodStates.find((m) => m.id === selectedMoodState)?.name,
        personality: personalities.find((p) => p.id === selectedPersonality)
          ?.name,
        preferences: selectedPreferences.map(
          (prefId) => preferences.find((p) => p.id === prefId)?.name
        ),
        location: locations.find((l) => l.id === selectedLocation)?.name,
        travelStyle: travelStyles.find((t) => t.id === selectedTravelStyle)
          ?.name,
        budget: budgets.find((b) => b.id === selectedBudget)?.name,
        startDate,
        endDate,
        travelers,
      };

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "당신은 여행 계획 전문가입니다. 사용자의 조건에 맞게 실용적이고 구체적인 여행 일정을 작성하세요. 각 시간대별 활동과 해당 활동의 비용을 함께 명시하고, 하루 전체 비용 요약도 포함해주세요.",
            },
            {
              role: "user",
              content: `
            다음 조건에 맞는 여행 계획을 생성해주세요:
            - 여행 분위기: ${tripData.mood}
            - 현재 기분: ${tripData.moodState}
            - 성향: ${tripData.personality}
            - 선호 여행 스타일: ${tripData.preferences.join(", ")}
            - 여행지: ${tripData.location}
            - 여행 스타일: ${tripData.travelStyle}
            - 예산: ${tripData.budget}
            - 여행 기간: ${tripData.startDate} ~ ${tripData.endDate}
            - 여행 인원: ${tripData.travelers}명
      
            다음 형식의 JSON으로 상세하게 응답해주세요. 각 시간대별 활동과 그에 따른 예상 비용을 반드시 포함해야 합니다.
      
            {
              "일별_추천_일정": [
                {
                  "날짜": "YYYY-MM-DD",
                  "일정": [
                    {
                      "시간대": "아침",
                      "활동": "활동 내용 (예: 호텔 조식 또는 카페 방문)",
                      "장소": "장소명 또는 위치",
                      "예상_비용(₩)": "원"
                    },
                    {
                      "시간대": "오전 활동",
                      "활동": "예: 박물관 관람",
                      "장소": "명소명",
                      "예상_비용(₩)": "원"
                    },
                    {
                      "시간대": "점심",
                      "활동": "식사",
                      "장소": "맛집 이름",
                      "예상_비용(₩)": "원"
                    },
                    {
                      "시간대": "오후 활동",
                      "활동": "시장 구경 및 쇼핑",
                      "장소": "시장 이름",
                      "예상_비용(₩)": "원"
                    },
                    {
                      "시간대": "저녁",
                      "활동": "식사 및 야경 관람",
                      "장소": "레스토랑 또는 야경 명소",
                      "예상_비용(₩)": "원"
                    },
                    {
                      "시간대": "이동/기타",
                      "활동": "교통 이동 및 숙소 체크인",
                      "장소": "교통수단 또는 숙소명",
                      "예상_비용(₩)": "원"
                    }
                  ],
                  "일일_총_예상_비용(₩)": "원"
                }
              ],
              "추천_맛집": [
                {"이름": "맛집명", "주소": "주소", "추천_메뉴": "메뉴", "유명도": "유명" 또는 "로컬"}
              ],
              "추천_명소": [
                {"이름": "명소명", "설명": "간단 설명", "주소": "주소", "유명도": "유명" 또는 "로컬"}
              ],
              "예상_비용_총정리": {
                "항공/교통": "₩",
                "숙박": "₩",
                "식비": "₩",
                "관광/체험": "₩",
                "기타": "₩",
                "총합계": "₩"
              },
              "여행_팁": "유용한 여행 팁 (현지 문화, 날씨, 주의사항 등 포함)"
            }
      
            ※ 각 시간대별 활동마다 '예상 비용'을 반드시 작성해주세요.
            ※ 비용은 대략적인 원화 기준으로 명시하고, '일일_총_예상_비용'은 모든 시간대 비용의 합계여야 합니다.
            `,
            },
          ],
          temperature: 0.3,
          max_tokens: 3500,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      // 응답 메시지에서 assistant content 추출
      const assistantMessage = response.data.choices[0].message.content;

      // JSON 문자열에서 실제 JSON 객체 추출
      const jsonStr = assistantMessage.replace(/```json\n|\n```/g, "");
      const parsedPlan = JSON.parse(jsonStr);

      setGeneratedPlan(parsedPlan);
      setStep(7);
    } catch (error) {
      console.error("Error generating trip plan:", error);
      alert("여행 계획 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    try {
      setIsSaving(true);

      // 저장할 여행 데이터 구성
      const tripData = {
        title: `${locations.find((l) => l.id === selectedLocation)?.name} ${
          selectedSeason
            ? seasons.find((s) => s.id === selectedSeason)?.name
            : ""
        } 여행`,
        mood: moods.find((m) => m.id === selectedMood)?.name,
        moodState: moodStates.find((m) => m.id === selectedMoodState)?.name,
        personality: personalities.find((p) => p.id === selectedPersonality)
          ?.name,
        preferences: selectedPreferences.map(
          (prefId) => preferences.find((p) => p.id === prefId)?.name
        ),
        location: locations.find((l) => l.id === selectedLocation)?.name,
        travelStyle: travelStyles.find((t) => t.id === selectedTravelStyle)
          ?.name,
        budget: budgets.find((b) => b.id === selectedBudget)?.name,
        startDate,
        endDate,
        travelers,
        plan: generatedPlan,
        createdAt: new Date().toISOString(),
      };
      // const generatedPlan = generatedPlan;

      console.log("tripData==", tripData);
      const response = await instance.post('/api/travel/plans', tripData);

      console.log("response==", response);
      if (response.status===200) {
        alert('여행 계획이 저장되었습니다.');
        router.push('/trip/custom');
      } else {
        throw new Error('저장 실패');
      }
    } catch (error) {
      console.error("Error saving trip plan:", error);
      alert("여행 계획 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
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
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
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
                {s < 7 && (
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
        {step === 1 && !generatedPlan && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              어떤 기분으로 여행하고 싶으신가요?
            </h2>
            <div className="space-y-3 mb-6">
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
        {step === 2 && !generatedPlan && (
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
        {step === 3 && !generatedPlan && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              어떤 여행을 선호하시나요?(다중 선택 가능)
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

        {/* 스텝 4: 여행지와 기분 상태 선택 */}
        {step === 4 && !generatedPlan && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              어디로 여행하고 싶으신가요?
            </h2>
            <div className="space-y-3 mb-6">
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

            <h2 className="text-lg font-semibold mb-4">
              현재 기분 상태는 어떠신가요?
            </h2>
            <div className="space-y-3">
              {moodStates.map((state) => (
                <button
                  key={state.id}
                  onClick={() => setSelectedMoodState(state.id)}
                  className={`w-full p-4 text-left rounded-lg border ${
                    selectedMoodState === state.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-500"
                  }`}
                >
                  <div className="font-medium">{state.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {state.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 스텝 5: 여행 스타일과 예산 */}
        {step === 5 && !generatedPlan && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              어떤 여행 스타일과 예산으로 여행하고 싶으신가요?
            </h2>
            <div className="space-y-6">
              {/* <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  선호하는 여행 스타일
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {travelStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedTravelStyle(style.id)}
                      className={`p-3 text-left rounded-lg border ${
                        selectedTravelStyle === style.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-500"
                      }`}
                    >
                      <div className="font-medium">{style.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {style.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div> */}
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
        {step === 6 && !generatedPlan && (
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

        {/* 스텝 7: 생성된 여행 계획 */}
        {step === 7 && generatedPlan && (
          <div className="p-4 pb-24">
            <h2 className="text-lg font-semibold mb-4">맞춤 여행 계획</h2>

            {/* 일별 일정 */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineCalendar className="text-2xl text-blue-500" />
                <h3 className="text-xl font-semibold">일별 추천 일정</h3>
              </div>
              <div className="space-y-3">
                {generatedPlan.일별_추천_일정.map(
                  (schedule: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="font-semibold text-blue-600">
                        {schedule.날짜}
                      </div>
                      <div className="mt-2 space-y-2">
                        {schedule.일정.map((item: any, itemIndex: number) => (
                          <div key={itemIndex} className="flex gap-2">
                            <span className="font-medium text-gray-700 min-w-[80px]">
                              {item.시간대}:
                            </span>
                            <div className="flex-1">
                              <div>{item.활동}</div>
                              <div className="text-sm text-gray-600">
                                {item.장소}
                              </div>
                              <div className="text-sm text-blue-600">
                                예상 비용: {item["예상_비용(₩)"]}원
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-2 border-t border-gray-200">
                        <div className="font-medium text-right">
                          일일 총 예상 비용: {schedule["일일_총_예상_비용(₩)"]}
                          원
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* 추천 맛집 */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FaUtensils className="text-2xl text-red-500" />
                <h3 className="text-xl font-semibold">추천 맛집</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedPlan.추천_맛집.map(
                  (restaurant: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="font-semibold text-lg">
                        {restaurant.이름}
                      </div>
                      <div className="text-gray-600 mt-2">
                        {restaurant.주소}
                      </div>
                      <div className="text-red-500 mt-2">
                        추천 메뉴: {restaurant.추천_메뉴}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* 추천 명소 */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FaLandmark className="text-2xl text-green-500" />
                <h3 className="text-xl font-semibold">추천 명소</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedPlan.추천_명소.map(
                  (attraction: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="font-semibold text-lg">
                        {attraction.이름}
                      </div>
                      <div className="text-gray-600 mt-2">
                        {attraction.주소}
                      </div>
                      <div className="mt-2">{attraction.설명}</div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* 예상 비용 */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineCurrencyDollar className="text-2xl text-yellow-500" />
                <h3 className="text-xl font-semibold">예상 비용</h3>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  {Object.entries(
                    generatedPlan.예상_비용_총정리 as Record<string, string>
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-blue-600 font-semibold">
                        {value}원
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 여행 팁 */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineLightBulb className="text-2xl text-yellow-500" />
                <h3 className="text-xl font-semibold">여행 팁</h3>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-lg">{generatedPlan.여행_팁}</div>
              </div>
            </section>
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
          ) : step === 6 ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {isLoading
                ? "여행 계획 생성 중...(약 1분정도 걸립니다!)"
                : "AI 맞춤 여행 생성하기"}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setStep(6)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                이전
              </button>
              <button
                onClick={handleSaveTrip}
                disabled={isSaving}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {isSaving ? "저장 중..." : "저장하기"}
              </button>
              <button
                onClick={() => router.push("/trip/custom")}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                목록으로
              </button>
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
}
