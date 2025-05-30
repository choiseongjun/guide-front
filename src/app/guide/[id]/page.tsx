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
  followers: number;
  following: number;
  reviews: number;
  tripLevel: number;
  nationality: string;
  age: number;
  gender: string;
}

function GuideProfileClient({ guideId }: { guideId: string }) {
  const router = useRouter();
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

  if (loading || !guide) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <HiOutlineArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-4">가이드 프로필</h1>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto p-4">
        {/* 가이드 정보 */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20">
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
            <div>
              <h2 className="text-xl font-bold">{guide.nickname}</h2>
              <p className="text-sm text-gray-600">
                {guide.nationality} · {guide.age}세 · {guide.gender}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">
                  여행 레벨 {guide.tripLevel}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{guide.introduction}</p>

          <div className="flex justify-around border-t border-gray-100 pt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">팔로워</p>
              <p className="font-semibold">{guide.followers}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">팔로잉</p>
              <p className="font-semibold">{guide.following}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">리뷰</p>
              <p className="font-semibold">{guide.reviews}</p>
            </div>
          </div>
        </div>

        {/* 가이드의 여행 목록 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">진행 중인 여행</h3>
          {trips && trips.length > 0 ? (
            <TripList
              trips={trips}
              onTripClick={(tripId) => router.push(`/trip/${tripId}`)}
            />
          ) : (
            <div className="text-center text-gray-500 py-4">
              진행 중인 여행이 없습니다.
            </div>
          )}
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
