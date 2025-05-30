"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  HiOutlineArrowLeft,
  HiOutlineUserGroup,
  HiOutlineStar,
  HiOutlineHeart,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineGlobeAlt,
  HiOutlineLanguage,
} from "react-icons/hi2";
import instance from "@/app/api/axios";
import { use } from "react";
import { getProfileImage } from "@/app/common/imgUtils";
import TripList from "@/components/TripList";
import { processTravelList, ProcessedTravel } from "@/app/common/travelUtils";

interface Guide {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
  introduction: string;
  languages: string[];
  specialties: string[];
  rating: number;
  reviewCount: number;
  tripCount: number;
  followerCount: number;
  followingCount: number;
}

function GuideProfileClient({ guideId }: { guideId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed' | 'social'>('ongoing');
  const [guide, setGuide] = useState<Guide | null>(null);
  const [trips, setTrips] = useState<ProcessedTravel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const response = await instance.get(
          `/api/v1/users/user/info/${guideId}`
        );
        if (response.status === 200) {
          setGuide(response.data.data);
        }
      } catch (error) {
        console.error("가이드 정보 조회 실패:", error);
      }
    };

    const fetchGuideTrips = async () => {
      try {
        const response = await instance.get(`/api/v1/travels/guide/${guideId}`);
        if (response.status === 200) {
          const processedTrips = processTravelList(response.data.data.content);
          setTrips(processedTrips);
        }
      } catch (error) {
        console.error("가이드 여행 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuideData();
    fetchGuideTrips();
  }, [guideId]);

  const handleBack = () => {
    router.back();
  };

  const handleChatRequest = async () => {
    try {
      const response = await instance.post(`/api/v1/chats/request/${guideId}`);
      if (response.data.status === 200) {
        router.push(`/chat/${response.data.data.chatId}`);
      }
    } catch (error) {
      console.error("대화 신청 실패:", error);
      alert("대화 신청에 실패했습니다.");
    }
  };

  if (loading || !guide) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-2.5">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold ml-3">가이드 프로필</h1>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto p-3">
        {/* 가이드 정보 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <Image
                src={
                  getProfileImage(guide.profileImageUrl) ||
                  "/images/default-profile.png"
                }
                alt={guide.nickname}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold">{guide.nickname}</h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                <HiOutlineStar className="text-yellow-400 w-3.5 h-3.5" />
                <span>{(guide.rating || 0).toFixed(1)}</span>
                <span>({guide.reviewCount || 0}개의 리뷰)</span>
              </div>
            </div>
            <button
              onClick={handleChatRequest}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              <HiOutlineChatBubbleLeftRight className="w-4 h-4" />
              <span>대화 신청</span>
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-600 leading-relaxed">{guide.introduction}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-1.5">
              <HiOutlineMapPin className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                {(guide.specialties || []).join(", ") || "없음"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiOutlineLanguage className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                {(guide.languages || []).join(", ") || "없음"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiOutlineUserGroup className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                {guide.tripCount || 0}회의 여행
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiOutlineCalendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                {guide.followerCount || 0}명의 팔로워
              </span>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="mt-4 bg-white rounded-xl shadow-sm">
          <div className="flex">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'ongoing'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500'
              }`}
            >
              진행중인 여행
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'completed'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500'
              }`}
            >
              완료된 여행
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'social'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500'
              }`}
            >
              소셜
            </button>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-3">
            {activeTab === 'ongoing' && (
              <div>
                {trips && trips.length > 0 ? (
                  <TripList
                    trips={trips}
                    onTripClick={(tripId) => router.push(`/trip/${tripId}`)}
                  />
                ) : (
                  <div className="text-center text-sm text-gray-400 py-3">
                    진행 중인 여행이 없습니다.
                  </div>
                )}
              </div>
            )}
            {activeTab === 'completed' && (
              <div>
                {/* 완료된 여행 목록 */}
              </div>
            )}
            {activeTab === 'social' && (
              <div>
                {/* 소셜 컨텐츠 */}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function GuideProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return <GuideProfileClient guideId={resolvedParams.id} />;
}
