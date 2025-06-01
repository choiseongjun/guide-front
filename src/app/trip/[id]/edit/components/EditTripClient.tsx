"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import instance from "@/app/api/axios";

interface EditTripClientProps {
  tripId: string;
}

export default function EditTripClient({ tripId }: EditTripClientProps) {
  const router = useRouter();
  const [tripData, setTripData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await instance.get(
          `/api/v1/travels/${tripId}`
        );
        console.log('response==',response)
        setTripData(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "여행 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

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

  if (!tripData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">여행 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">여행 수정</h1>
        {/* 여행 수정 폼 컴포넌트 */}
      </div>
    </div>
  );
} 