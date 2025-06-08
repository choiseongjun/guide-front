"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import instance from "@/app/api/axios";
import TripList from "@/components/TripList";
import { ProcessedTravel, processTravelList } from "@/app/common/travelUtils";

export default function SavedTripsPage() {
  const router = useRouter();
  const [likedTrips, setLikedTrips] = useState<ProcessedTravel[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchLikedTrips();
  }, []);

  const fetchLikedTrips = async () => {
    try {
      const response = await instance.get(`/api/v1/travels/me?page=${page}`);
      if (response.status === 200) {
        const processedTrips = processTravelList(response.data.data.content);
        setLikedTrips((prev) => [...prev, ...processedTrips]);
        setHasMore(!response.data.data.last);
      }
    } catch (error) {
      console.error("찜한 여행 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    fetchLikedTrips();
  };

  const handleTripClick = (tripId: number) => {
    router.push(`/trip/${tripId}`);
  };

  const handleBack = () => {
    router.back();
  };

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
            <h1 className="text-xl font-bold ml-4">찜한 여행</h1>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : likedTrips.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            찜한 여행이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            <TripList trips={likedTrips} onTripClick={handleTripClick} />
            {hasMore && (
              <button
                onClick={handleLoadMore}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                더 보기
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
