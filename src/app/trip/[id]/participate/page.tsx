"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  HiOutlineArrowLeft,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMapPin,
} from "react-icons/hi2";
import instance from "@/app/api/axios";
import { useUser } from "@/hooks/useUser";

interface Trip {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  address: string;
  minParticipants: number;
  maxParticipants: number;
  requiresApproval: boolean;
  minAge: number;
  maxAge: number;
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string;
  };
}

export default function ParticipatePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useUser();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await instance.get(`/api/v1/travels/${resolvedParams.id}`);
        if (response.data.status === 200) {
          setTrip(response.data.data);
        }
      } catch (error) {
        console.error("여행 정보 조회 실패:", error);
      }
    };

    fetchTrip();
  }, [resolvedParams.id]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    setLoading(true);
    try {
      const response = await instance.post(`/api/v1/travels/${resolvedParams.id}/participants`, {
        message
      });

      if (response.data.status === 200) {
        router.push(`/trip/${resolvedParams.id}/payment`);
      } else {
        alert('참여 신청에 실패했습니다.');
      }
    } catch (error) {
      console.error('참여 신청 실패:', error);
      alert('참여 신청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
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
            <h1 className="text-xl font-bold ml-4">참여 신청</h1>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="max-w-md mx-auto p-4">
        {/* 여행 정보 요약 */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">{trip.title}</h2>
          
          <div className="space-y-3">
            {/* 여행 기간 */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineCalendar className="w-5 h-5 text-gray-400" />
              <span>
                {new Date(trip.startDate).toLocaleDateString()} ~{" "}
                {new Date(trip.endDate).toLocaleDateString()}
              </span>
            </div>

            {/* 여행지 */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineMapPin className="w-5 h-5 text-gray-400" />
              <span>{trip.address}</span>
            </div>

            {/* 참가 인원 */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineUserGroup className="w-5 h-5 text-gray-400" />
              <span>{trip.minParticipants}~{trip.maxParticipants}명</span>
            </div>
          </div>
        </div>

        {/* 참여 조건 */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-3">참여 조건</h3>
          <div className="space-y-2 text-sm text-gray-600">
            {trip.requiresApproval && (
              <p>• 가이드의 승인이 필요한 여행입니다.</p>
            )}
            {trip.minAge > 0 && (
              <p>• 참가 가능 연령: {trip.minAge}세 ~ {trip.maxAge}세</p>
            )}
          </div>
        </div>

        {/* 참여 메시지 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              참여 메시지
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="가이드에게 전달할 메시지를 입력하세요."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? "처리 중..." : "참여 신청하기"}
          </button>
        </form>
      </main>
    </div>
  );
} 