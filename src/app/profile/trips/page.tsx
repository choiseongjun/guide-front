"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import instance from "@/app/api/axios";
import TripList from "@/components/TripList";
import { ProcessedTravel, processTravelList } from "@/app/common/travelUtils";

export default function TripsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [pendingTrips, setPendingTrips] = useState<ProcessedTravel[]>([]);
  const [completedTrips, setCompletedTrips] = useState<ProcessedTravel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const [pendingResponse, completedResponse] = await Promise.all([
        instance.get("/api/v1/travels/participated", {
          params: {
            participantStatus: "PENDING",
            page: 0,
            size: 10
          }
        }),
        instance.get("/api/v1/travels/participated", {
          params: {
            participantStatus: "APPROVED",
            page: 0,
            size: 10
          }
        })
      ]);

      console.log(pendingResponse);
      setPendingTrips(processTravelList(pendingResponse.data.data.content || []));
      setCompletedTrips(processTravelList(completedResponse.data.data.content || []));
    } catch (error) {
      console.error("여행 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

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
            <h1 className="text-xl font-bold ml-4">나의 여행</h1>
          </div>
        </div>
      </header>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex gap-4">
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              대기중인 여행
            </button>
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === "completed"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("completed")}
            >
              완료된 여행
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto p-4">
        <TripList trips={activeTab === "pending" ? pendingTrips : completedTrips} onTripClick={(id) => router.push(`/trip/${id}`)} />
      </main>
    </div>
  );
}
