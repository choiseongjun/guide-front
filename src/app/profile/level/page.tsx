"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import instance from "@/app/api/axios";
import { HiOutlineUser, HiOutlineMap } from "react-icons/hi2";

const travelerLevels = [
  {
    level: 1,
    title: "초보 여행러",
    emoji: "🚶",
    points: "0~9점",
    description: "그저 걷는 중",
    benefits: ["-"]
  },
  {
    level: 2,
    title: "탐험 중인 여행러",
    emoji: "🧭",
    points: "10~29점",
    description: "호기심 많은 여정",
    benefits: ["상품 3% 할인"]
  },
  {
    level: 3,
    title: "추억 수집가",
    emoji: "📷",
    points: "30~59점",
    description: "인생샷 제조기",
    benefits: ["상품 5% 할인", "프리미엄 가이드 이용권"]
  },
  {
    level: 4,
    title: "로컬 여행러",
    emoji: "🌟",
    points: "60~99점",
    description: "지역과 연결된 사람",
    benefits: ["상품 7% 할인", "특별 여행 초대"]
  },
  {
    level: 5,
    title: "여행 마스터",
    emoji: "🛤",
    points: "100점 이상",
    description: "여행의 찐맛을 아는 사람",
    benefits: ["상품 10% 할인", "VIP 여행 초대", "굿즈 제공"]
  }
];

const guideLevels = [
  {
    level: 1,
    title: "새싹 가이드",
    emoji: "🟢",
    condition: "기본 가입",
    badge: "없음",
    benefits: ["운영팀 등록 지원"]
  },
  {
    level: 2,
    title: "활동 가이드",
    emoji: "🟡",
    condition: "체험 3회 이상 + 리뷰 3개 이상",
    badge: "'활동' 뱃지",
    benefits: ["체험 추천 우선 노출"]
  },
  {
    level: 3,
    title: "추천 가이드",
    emoji: "🔴",
    condition: "체험 10회 이상 + 평균 리뷰 4.5 이상",
    badge: "'추천' 뱃지",
    benefits: ["프리미엄 배너 노출", "이벤트 우선 제안"]
  }
];

function LevelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"guide" | "traveler">("guide");
  const [guideLevel, setGuideLevel] = useState<number>(0);
  const [travelerLevel, setTravelerLevel] = useState<number>(0);
  const [guideExp, setGuideExp] = useState<number>(0);
  const [travelerExp, setTravelerExp] = useState<number>(0);
  const [guideNextExp, setGuideNextExp] = useState<number>(0);
  const [travelerNextExp] = useState<number>(1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "guide") {
      setActiveTab("guide");
    } else if (tab === "traveler") {
      setActiveTab("traveler");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <HiOutlineArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-4">레벨 안내</h1>
          </div>
        </div>
      </header>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex gap-4">
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === "traveler"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("traveler")}
            >
              여행자 레벨
            </button>
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === "guide"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("guide")}
            >
              가이드 레벨
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto p-4">
        {activeTab === "traveler" ? (
          <div className="space-y-4">
            {travelerLevels.map((level) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    {level.emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Lv.{level.level} {level.title}
                    </h3>
                    <p className="text-sm text-gray-500">{level.points}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">혜택</h4>
                    <ul className="space-y-1">
                      {level.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {guideLevels.map((level) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    {level.emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Lv.{level.level} {level.title}
                    </h3>
                    <p className="text-sm text-gray-500">{level.condition}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">신뢰 배지: {level.badge}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">혜택</h4>
                    <ul className="space-y-1">
                      {level.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function LevelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <LevelContent />
    </Suspense>
  );
} 