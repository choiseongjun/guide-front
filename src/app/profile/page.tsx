"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  HiOutlineCog6Tooth,
  HiOutlineBell,
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck,
  HiOutlinePencil,
  HiOutlineStar,
  HiOutlineChevronRight,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineBookmark,
  HiOutlineMapPin,
  HiOutlineFire,
  HiOutlineClock,
  HiOutlineCreditCard,
} from "react-icons/hi2";
import instance from "@/app/api/axios";

// 임시 사용자 데이터
const userData = {
  isLoggedIn: true,
  profileImage: "https://i.pravatar.cc/150?img=1",
  nickname: "여행러",
  introduction: "혼자 여행 좋아하는 30대 직장인입니다!",
  gender: "남성",
  age: 32,
  nationality: "대한민국",
  languages: ["한국어", "영어"],
  followers: 128,
  following: 256,
  reviews: 45,
  tripLevel: 8,
  badges: ["유럽 전문가", "혼행 마스터", "맛집 탐험가"],
  collections: [
    {
      id: 1,
      title: "2024 봄 유럽 여행",
      image: "https://picsum.photos/seed/europe/200/120",
      count: 12,
    },
    {
      id: 2,
      title: "혼자 떠난 제주 3박 4일",
      image: "https://picsum.photos/seed/jeju/200/120",
      count: 8,
    },
  ],
};

// 설정 메뉴 데이터
const settingsMenu = [
  {
    id: "account",
    title: "계정 설정",
    icon: HiOutlineCog6Tooth,
    description: "이메일, 비밀번호 등",
    items: [
      { id: "email", title: "이메일 변경" },
      { id: "password", title: "비밀번호 변경" },
      { id: "phone", title: "전화번호 변경" },
    ],
  },
  {
    id: "notifications",
    title: "알림 설정",
    icon: HiOutlineBell,
    description: "알림 수신 설정",
    items: [
      { id: "push", title: "푸시 알림" },
      { id: "email", title: "이메일 알림" },
      { id: "marketing", title: "마케팅 알림" },
    ],
  },
  {
    id: "privacy",
    title: "공개 범위 설정",
    icon: HiOutlineGlobeAlt,
    description: "누가 내 여행 이력을 볼 수 있는지",
    items: [
      { id: "profile", title: "프로필 공개" },
      { id: "reviews", title: "리뷰 공개" },
      { id: "collections", title: "컬렉션 공개" },
    ],
  },
  {
    id: "safety",
    title: "차단 목록 / 안전 설정",
    icon: HiOutlineShieldCheck,
    description: "신뢰 기반 여행 커뮤니티",
    items: [
      { id: "blocked", title: "차단한 사용자" },
      { id: "report", title: "신고 내역" },
      { id: "privacy", title: "개인정보 보호" },
    ],
  },
];


export default function ProfilePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoggedIn, setIsLoggedIn] = useState(userData.isLoggedIn);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('rt');
      
      // 카카오 로그아웃 API 호출
      await instance.post('/api/auth/kakao/logout', null, {
        headers: {
          'Refresh-Token': refreshToken
        }
      });

      // 로컬 스토리지 정리
      localStorage.removeItem('at');
      localStorage.removeItem('rt');
      localStorage.removeItem('user');
      
      // 로그인 상태 변경
      setIsLoggedIn(false);
      
      // 로그인 페이지로 리다이렉션
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 에러:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const calculateTripLevel = (recommendations: number) => {
    if (recommendations >= 101) return { level: 5, title: "마스터 여행러" };
    if (recommendations >= 61) return { level: 4, title: "베테랑 여행러" };
    if (recommendations >= 31) return { level: 3, title: "경험 많은 여행러" };
    if (recommendations >= 11) return { level: 2, title: "성장하는 여행러" };
    return { level: 1, title: "초보 여행러" };
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 5:
        return "text-purple-600";
      case 4:
        return "text-blue-600";
      case 3:
        return "text-green-600";
      case 2:
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 프로필 섹션 */}
      <div className="bg-white">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={userData.profileImage}
                alt="프로필 이미지"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{userData.nickname}</h1>
                <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-sm">
                  <HiOutlineFire className="w-4 h-4" />
                  <span>36.5°C</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                {userData.introduction}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <HiOutlineUser className="w-4 h-4" />
                  <span>{userData.gender}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <HiOutlineCalendar className="w-4 h-4" />
                  <span>{userData.age}세</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <HiOutlineMapPin className="w-4 h-4" />
                  <span>{userData.nationality}</span>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${getLevelColor(
                    calculateTripLevel(userData.tripLevel).level
                  )}`}
                >
                  <HiOutlineStar className="w-4 h-4" />
                  <span>{calculateTripLevel(userData.tripLevel).title}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="font-bold">{userData.followers}</div>
              <div className="text-sm text-gray-500">팔로워</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{userData.following}</div>
              <div className="text-sm text-gray-500">팔로잉</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{userData.reviews}</div>
              <div className="text-sm text-gray-500">리뷰</div>
            </div>
          </div>
        </div>
      </div>

      {/* 트립 레벨 */}
      {isLoggedIn && (
        <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">트립 레벨</h2>
            <span className="text-sm text-gray-500">
              다음 레벨까지 3회 남음
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  Lv.3
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                  +3
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">트립 마스터</span>
                  <span className="text-blue-600 font-medium">12/15</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">획득한 뱃지</span>
                </div>
                <div className="flex gap-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    여행가
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    맛집탐험가
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                    문화인
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <HiOutlineHeart className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium">특별 혜택</span>
                </div>
                <div className="text-xs text-gray-600">
                  <p>• 여행 상품 5% 할인</p>
                  <p>• 프리미엄 가이드 서비스</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 여행 컬렉션 */}
      {isLoggedIn && (
        <div className="mt-4 bg-white">
          <div className="max-w-md mx-auto px-4 py-4">
            <h2 className="text-lg font-semibold mb-4">여행 컬렉션</h2>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/profile/trips")}
              >
                <div className="flex items-center">
                  <HiOutlineCalendar className="w-6 h-6 text-blue-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">나의 여행</h4>
                    <p className="text-sm text-gray-600">
                      예정된 여행 2개 • 완료된 여행 8개
                    </p>
                  </div>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/profile/saved")}
              >
                <div className="flex items-center">
                  <HiOutlineHeart className="w-6 h-6 text-red-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">저장한 여행지</h4>
                    <p className="text-sm text-gray-600">
                      여행지 3개 • 게시글 2개
                    </p>
                  </div>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/profile/reviews")}
              >
                <div className="flex items-center">
                  <HiOutlineStar className="w-6 h-6 text-yellow-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">작성한 리뷰</h4>
                    <p className="text-sm text-gray-600">
                      여행지 2개 • 숙소 2개
                    </p>
                  </div>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/profile/bookmarks")}
              >
                <div className="flex items-center">
                  <HiOutlineBookmark className="w-6 h-6 text-green-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">북마크</h4>
                    <p className="text-sm text-gray-600">
                      여행 가이드 2개 • 게시글 2개
                    </p>
                  </div>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/profile/payment")}
              >
                <div className="flex items-center">
                  <HiOutlineCreditCard className="w-6 h-6 text-blue-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">결제 내역</h4>
                    <p className="text-sm text-gray-600">
                      결제 완료 3건 • 환불 완료 1건
                    </p>
                  </div>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button> 

              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/profile/settlement")}
              >
                <div className="flex items-center">
                  <HiOutlineCreditCard className="w-6 h-6 text-blue-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">정산 내역</h4>
                    <p className="text-sm text-gray-600">
                      정산 대기 2건 • 정산 완료 5건
                    </p>
                  </div>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* 설정 메뉴 */}
      <div className="mt-4 bg-white">
        <div className="max-w-md mx-auto">
          {settingsMenu.map((section) => (
            <div key={section.id} className="border-b last:border-b-0">
              <button
                className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  if (section.id === "account") {
                    router.push("/profile/account");
                  } else {
                    setActiveSection(section.id);
                  }
                }}
              >
                <section.icon className="w-6 h-6 text-gray-600" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              {activeSection === section.id && (
                <div className="bg-gray-50 px-4 py-2">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      className="w-full py-2 text-left text-sm text-gray-600 hover:text-blue-500"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* 로그인/로그아웃 버튼 */}
          <div className="border-b last:border-b-0">
            <button
              className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              onClick={isLoggedIn ? handleLogout : handleLogin}
            >
              <HiOutlineUser className="w-6 h-6 text-gray-500" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">
                  {isLoggedIn ? "로그아웃" : "로그인"}
                </h3>
                <p className="text-sm text-gray-500">
                  {isLoggedIn
                    ? "계정에서 로그아웃합니다"
                    : "계정에 로그인합니다"}
                </p>
              </div>
              <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
