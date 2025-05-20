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
} from "react-icons/hi2";

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

  const handleLogout = () => {
    setIsLoggedIn(false);
    // TODO: 로그아웃 로직 구현
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
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                <HiOutlinePencil className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{userData.nickname}</h1>
              <p className="text-gray-600 text-sm mt-1">
                {userData.introduction}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>{userData.gender}</span>
                <span>•</span>
                <span>{userData.age}세</span>
                <span>•</span>
                <span>{userData.nationality}</span>
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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

      {/* 컬렉션 */}
      {isLoggedIn && (
        <div className="bg-white">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">나의 여행 컬렉션</h2>
              <button className="text-blue-500 text-sm">더보기</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {userData.collections.map((collection) => (
                <div
                  key={collection.id}
                  className="relative rounded-lg overflow-hidden"
                >
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    width={200}
                    height={120}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <h3 className="text-white text-sm font-medium">
                      {collection.title}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {collection.count}개의 여행
                    </p>
                  </div>
                </div>
              ))}
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
