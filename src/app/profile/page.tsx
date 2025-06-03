"use client";
import { useState, useEffect } from "react";
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
  HiOutlineUserGroup,
  HiOutlineBanknotes,
  HiOutlineQuestionMarkCircle,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheck,
} from "react-icons/hi2";
import instance from "@/app/api/axios";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import PortOne from "@portone/browser-sdk/v2";
import { getImageUrl } from "../common/imgUtils";
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
  // {
  //   id: "privacy",
  //   title: "공개 범위 설정",
  //   icon: HiOutlineGlobeAlt,
  //   description: "누가 내 여행 이력을 볼 수 있는지",
  //   items: [
  //     { id: "profile", title: "프로필 공개" },
  //     { id: "reviews", title: "리뷰 공개" },
  //     { id: "collections", title: "컬렉션 공개" },
  //   ],
  // },
  // {
  //   id: "safety",
  //   title: "차단 목록 / 안전 설정",
  //   icon: HiOutlineShieldCheck,
  //   description: "신뢰 기반 여행 커뮤니티",
  //   items: [
  //     { id: "blocked", title: "차단한 사용자" },
  //     { id: "report", title: "신고 내역" },
  //     { id: "privacy", title: "개인정보 보호" },
  //   ],
  // },
];

const menuItems = [
  {
    title: "나의 여행",
    icon: <HiOutlineCalendar className="w-6 h-6" />,
    href: "/profile/trips",
  },
  {
    title: "참여 신청 관리",
    icon: <HiOutlineUserGroup className="w-6 h-6" />,
    href: "/profile/trips/requests",
  },
  {
    title: "찜한 여행",
    icon: <HiOutlineHeart className="w-6 h-6" />,
    href: "/profile/wishlist",
  },
  {
    title: "리뷰 관리",
    icon: <HiOutlineStar className="w-6 h-6" />,
    href: "/profile/reviews",
  },
  {
    title: "자주 묻는 질문",
    icon: <HiOutlineQuestionMarkCircle className="w-6 h-6" />,
    href: "/profile/faq",
  },
  {
    title: "설정",
    icon: <HiOutlineCog6Tooth className="w-6 h-6" />,
    href: "/profile/settings",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCertification, setShowCertification] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [myTrips, setMyTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const at = localStorage.getItem("at");
    setIsLoggedIn(!!at);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await instance.get(
          `/api/v1/users/me`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }
    };

    // const fetchMyTrips = async () => {
    //   try {
    //     const response = await instance.get(
    //       `/api/v1/travels/my`
    //     );
    //     setMyTrips(response.data);
    //   } catch (error) {
    //     console.error("내 여행 목록 조회 실패:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    if(user) {
      fetchUserData();
      // fetchMyTrips();
    }
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const certification = async () => {
    try {
      const response = await PortOne.requestIdentityVerification({
        storeId: "store-0d664ae7-e67d-4bb7-b891-2a9003c6b9bb",
        identityVerificationId: `identity-verification-${crypto.randomUUID()}`,
        channelKey: "channel-key-e997c286-fdb5-4239-9583-991a7bbf5cee",
        redirectUrl: `${window.location.origin}/profile/certification/complete`
      });

      if (response?.code !== undefined) {
        return alert(response.message);
      }
      if (response?.identityVerificationId) {
        handleVerificationComplete(response.identityVerificationId);
      }
      console.log(response);
    } catch (error) {
      console.error("본인인증 요청 실패:", error);
      alert("본인인증 요청에 실패했습니다.");
    }
  };

  const handleCertificationComplete = (data: any) => {
    console.log("인증 결과:", data);
    // data에는 다음과 같은 정보가 포함됩니다:
    // - name: 이름
    // - birthDate: 생년월일
    // - gender: 성별
    // - phoneNumber: 전화번호
    // - nationality: 국적
    
    // 서버에 사용자 정보 업데이트 요청
    instance.put('/api/v1/users/me/verification', {
      name: data.name,
      birthDate: data.birthDate,
      gender: data.gender,
      phoneNumber: data.phoneNumber
    }).then(response => {
      if (response.data.status === 200) {
        alert('본인인증이 완료되었습니다.');
        window.location.reload();
      }
    }).catch(error => {
      console.error("인증 결과 처리 실패:", error);
      alert('본인인증 결과 처리에 실패했습니다.');
    });

    setShowCertification(false);
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("rt");

      // 카카오 로그아웃 API 호출
      await instance.post("/api/auth/kakao/logout", null, {
        headers: {
          "Refresh-Token": refreshToken,
        },
      });

      // 로컬 스토리지 정리
      localStorage.removeItem("at");
      localStorage.removeItem("rt");
      localStorage.removeItem("user");

      // 로그인 상태 변경
      setIsLoggedIn(false);

      // 로그인 페이지로 리다이렉션
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 에러:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
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

  const getGenderText = (gender: string | undefined) => {
    if (!gender) return "남성";
    return gender === "MALE" ? "남성" : "여성";
  };

  const testCertification = async () => {
    const identityVerificationId = "identity-verification-c23b2c40-0cac-48ae-a06f-207e9f8bc89b";
    const PORTONE_API_SECRET = "ZUhPSzQzQUpCN1dLa1I0RFd3Y1VuQT09";
    try {
      const verificationResponse = await instance.post(
        `https://api.portone.io/identity-verifications/${encodeURIComponent(identityVerificationId)}/send`,
        {
          channelKey: "channel-key-e997c286-fdb5-4239-9583-991a7bbf5cee"
        },
        {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${PORTONE_API_SECRET}`
          }
        }
      );

      console.log("verificationResponse=", verificationResponse);
    } catch (error) {
      console.error("인증 확인 실패:", error);
    }
  };

  const checkVerificationResult = async (identityVerificationId: string) => {
    try {
      // 1. 먼저 토큰 발급
      const tokenResponse = await instance.post(
        'https://api.portone.io/login/api-secret',
        {
          apiSecret: "ZUhPSzQzQUpCN1dLa1I0RFd3Y1VuQT09"
        }
      );
      
      const accessToken = tokenResponse.data.accessToken;

      // 2. 본인인증 결과 조회
      const response = await instance.get(
        `https://api.portone.io/identity-verifications/${encodeURIComponent(identityVerificationId)}`,
        {
          headers: { 
            "Authorization": `Bearer ${accessToken}`
          }
        }
      );

      console.log("인증 결과:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("인증 결과 조회 실패:", error.response?.data || error);
      throw error;
    }
  };

  // 본인인증 완료 후 리다이렉트되는 페이지에서 호출할 함수
  const handleVerificationComplete = async (identityVerificationId: string) => {
    if (identityVerificationId) {
      try {
        console.log("인증 ID:", identityVerificationId);
        const result = await checkVerificationResult(identityVerificationId);
        console.log("인증 완료:", result);
        
        // 서버에 사용자 정보 업데이트 요청
        const updateResponse = await instance.put('/api/v1/users/me/verification', {
          name: result.name,
          birthDate: result.birthDate,
          gender: result.gender,
          phoneNumber: result.phoneNumber
        });

        if (updateResponse.data.status === 200) {
          alert('본인인증이 완료되었습니다.');
          window.location.reload();
        }
      } catch (error: any) {
        console.error("인증 결과 처리 실패:", error.response?.data || error);
        alert('본인인증 결과 처리에 실패했습니다.');
      }
    }
  };

  // 페이지 로드 시 인증 완료 여부 확인
  useEffect(() => {
    if (window.location.pathname === '/profile/certification/complete') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('identity_verification_id');
      if (id) {
        handleVerificationComplete(id);
      }
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 본인인증 모달 */}
      {showCertification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">본인인증</h3>
              <button 
                onClick={() => setShowCertification(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <iframe
              src={`https://cert.danal.co.kr/cert?CP_CD=CPID&CP_ID=CPID&CP_PWD=CPPWD&CP_DST=CPDST&CP_RET_URL=${encodeURIComponent(window.location.origin + '/profile/certification/complete')}`}
              className="w-full h-[500px] border-0"
              title="본인인증"
            />
          </div>
        </div>
      )}

      {/* 프로필 헤더 */}
      {isLoggedIn && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                {user?.profileImageUrl ? (
                  <Image
                    src={getImageUrl(user.profileImageUrl)}
                    alt={user.nickname}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                    {user?.nickname?.[0] || "?"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col">
                  <button
                    onClick={() => router.push("/profile/account")}
                    className="self-start mt-2 p-1 text-gray-500 hover:text-blue-500 transition-colors flex justify-start w-full"
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">
                      {user?.nickname || "여행러"}
                    </h2>
                    <div className="flex items-center gap-1">
                      <div className="bg-blue-500 rounded-full p-1">
                        <HiOutlineShieldCheck className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-gray-500">
                        본인인증완료
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {(user as any)?.introduction || ""}
                  </p>
                  <button 
                    onClick={certification}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    본인인증 하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 프로필 섹션 */}
      {isLoggedIn && (
        <div className="bg-white">
          <div className="max-w-md mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <HiOutlineUser className="w-4 h-4" />
                    <span>{getGenderText(user?.gender)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <HiOutlineCalendar className="w-4 h-4" />
                    <span>{user?.age || 32}세</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <HiOutlineMapPin className="w-4 h-4" />
                    <span>{user?.nationality || "대한민국"}</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${getLevelColor(
                      calculateTripLevel(user?.tripLevel || 0).level
                    )}`}
                  >
                    <HiOutlineStar className="w-4 h-4" />
                    <span>
                      {calculateTripLevel(user?.tripLevel || 0).title}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="font-bold">{user?.followers || 0}</div>
                <div className="text-sm text-gray-500">팔로워</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{user?.following || 0}</div>
                <div className="text-sm text-gray-500">팔로잉</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{user?.reviews || 0}</div>
                <div className="text-sm text-gray-500">리뷰</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 가이드 레벨 */}
      {isLoggedIn && <div className="bg-white rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">가이드 레벨</h2>
          <button 
            onClick={() => router.push('/profile/level?tab=guide')}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            레벨 안내
          </button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">Lv.2</span>
            </div>
            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              +2
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">프로 가이드</h3>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <span className="text-sm text-gray-500">8/10</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">획득한 뱃지</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">신뢰도 100%</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">리뷰 마스터</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">인기 가이드</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-900">특별 혜택</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <HiOutlineCheck className="w-5 h-5 text-green-500" />
              <span>프리미엄 가이드 배지</span>
            </li>
            <li className="flex items-center gap-2">
              <HiOutlineCheck className="w-5 h-5 text-green-500" />
              <span>여행 상품 등록 수수료 20% 할인</span>
            </li>
            <li className="flex items-center gap-2">
              <HiOutlineCheck className="w-5 h-5 text-green-500" />
              <span>프로필 상단 노출</span>
            </li>
          </ul>
        </div>
      </div>}

      {/* 트립 레벨 */}
      {isLoggedIn && (
        <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">트립 레벨</h2>
            <button 
              onClick={() => router.push('/profile/level')}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              레벨 안내
            </button>
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
       
        <div className="mt-4 bg-white">
          <div className="max-w-md mx-auto px-4 py-4">
            <h2 className="text-lg font-semibold mb-4">여행 컬렉션</h2>
            <div className="space-y-3">
              {isLoggedIn&&<motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/trip/my")}
              >
                <div className="flex items-center">
                  <HiOutlineCalendar className="w-6 h-6 text-blue-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">나의 여행</h4>
                    <p className="text-sm text-gray-600">
                      등록한 여행 {myTrips.length}개
                    </p>
                  </div>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>}

             {isLoggedIn&& <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/profile/trips")}
              >
                <div className="flex items-center">
                  <HiOutlineCalendar className="w-6 h-6 text-blue-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">내가 참여한 여행</h4>
                    <p className="text-sm text-gray-600">
                      예정된 여행 2개 • 완료된 여행 8개
                    </p>
                  </div>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>}

            {isLoggedIn&&  <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/profile/trips/requests")}
              >
                <div className="flex items-center">
                  <HiOutlineUserGroup className="w-6 h-6 text-purple-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">
                      참여 신청 관리
                    </h4>
                    <p className="text-sm text-gray-600">
                      대기중인 신청 3건 • 승인된 신청 5건
                    </p>
                  </div>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>}

              {isLoggedIn&&<motion.button
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
              </motion.button>}

             {isLoggedIn&& <motion.button
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
              </motion.button>}

              {isLoggedIn&&<motion.button
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
              </motion.button>}

            {isLoggedIn&&  <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/profile/settlement")}
              >
                <div className="flex items-center">
                  <HiOutlineBanknotes className="w-6 h-6 text-green-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">정산 내역</h4>
                    <p className="text-sm text-gray-600">
                      정산 대기 2건 • 정산 완료 5건
                    </p>
                  </div>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>}
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/profile/suggestion")}
              > 
                <div className="flex items-center">
                  <HiOutlineChatBubbleLeftRight className="w-6 h-6 text-gray-600" />
                  <span className="ml-3 text-gray-900">건의사항</span>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100"
                onClick={() => router.push("/profile/faq")}
              >
                <div className="flex items-center">
                  <HiOutlineQuestionMarkCircle className="w-6 h-6 text-gray-600" />
                  <span className="ml-3 text-gray-900">자주 묻는 질문</span>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>
      

      {/* 설정 메뉴 */}
      <div className="mt-4 bg-white">
        <div className="max-w-md mx-auto">
          {isLoggedIn && settingsMenu.map((section) => (
            <div key={section.id} className="border-b last:border-b-0">
              <button
                className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  if (section.id === "account") {
                    router.push("/profile/account");
                  } else if (section.id === "notifications") {
                    router.push("/profile/notification");
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
