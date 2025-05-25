"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineMapPin, HiOutlineUserGroup, HiOutlineClock } from "react-icons/hi2";
import instance from "@/app/api/axios";

interface Trip {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  address: string;
  detailAddress: string;
  maxParticipants: number;
  currentParticipants: number;
  images: {
    id: number;
    imageUrl: string;
    displayOrder: number;
  }[];
  participants: {
    id: number;
    status: string;
    user: {
      id: number;
      nickname: string;
      profileImageUrl: string | null;
    };
  }[];
}

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await instance.get("/api/v1/travels/participated", {
          params: {
            status: activeTab === 'pending' ? 'PENDING' : 'APPROVED'
          }
        });
        if (response.data.status === 200) {
          const uniqueTrips = Array.from(
            new Map(
              (response.data.data.content as Trip[]).map((trip) => [trip.id, trip])
            ).values()
          );
          setTrips(uniqueTrips);
        }
      } catch (error) {
        console.error("여행 목록 조회 실패:", error);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredTrips = trips.filter(trip => {
    const now = new Date();
    const endDate = new Date(trip.endDate);
    if (activeTab === 'pending') return true;
    return endDate < now;
  });

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
                activeTab === 'pending'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              대기중인 여행
            </button>
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              완료된 여행
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto p-4">
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              onClick={() => router.push(`/trip/${trip.id}`)}
            >
              <div className="relative h-48">
                <Image
                  src={trip.images[0]?.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60"}
                  alt={trip.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{trip.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <HiOutlineCalendar className="w-4 h-4" />
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineMapPin className="w-4 h-4" />
                    <span>{trip.address} {trip.detailAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineUserGroup className="w-4 h-4" />
                    <span>참여자 {trip.participants.length}/{trip.maxParticipants}명</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineClock className="w-4 h-4" />
                    <span className={`${
                      activeTab === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {activeTab === 'pending' ? '대기중' : '완료'}
                    </span>
                  </div>
                </div>

                {/* 참여자 프로필 사진 */}
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">참여자:</span>
                  <div className="flex -space-x-2">
                    {trip.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="relative w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-black"
                      >
                        {participant.user.profileImageUrl ? (
                          <Image
                            src={participant.user.profileImageUrl}
                            alt={participant.user.nickname}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-xs">
                            {participant.user.nickname.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
