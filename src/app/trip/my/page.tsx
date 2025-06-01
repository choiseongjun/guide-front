"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import instance from "@/app/api/axios";
import TripList from "@/components/TripList";
import { ProcessedTravel, processTravelList } from "@/app/common/travelUtils";

interface TripResponse {
  data: any;
  content: any[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export default function MyTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<ProcessedTravel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMyTrips = async () => {
      try {
        const response = await instance.get<TripResponse>(
          `/api/v1/travels/me?page=${currentPage}&size=10`
        );
        const processedTrips = processTravelList(response.data.data.content);
        setTrips(processedTrips);
        setTotalPages(response.data.data.totalPages);
      } catch (err: any) {
        setError(err.response?.data?.message || "여행 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyTrips();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">나의 여행</h1>
          <button
            onClick={() => router.push("/trip/create")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            여행 만들기
          </button>
        </div>

        <TripList 
          trips={trips}
          onTripClick={(tripId) => router.push(`/trip/${tripId}`)}
          showEditButton={true}
        />
      </div>
    </div>
  );
} 