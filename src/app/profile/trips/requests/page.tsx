"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  HiOutlineChevronLeft,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineStar,
  HiOutlineHeart,
} from "react-icons/hi2";
import instance from "@/app/api/axios";
import { getImageUrl, getProfileImage } from "@/app/common/imgUtils";

interface Trip {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  address: string;
  minParticipants: number;
  maxParticipants: number;
  price: number;
  discountedPrice: number;
  images: { imageUrl: string }[];
  reviews: any[];
  likes: any[];
  participants: {
    id: number;
    status: string;
    message: string;
    createdAt: string;
    user: {
      id: number;
      nickname: string;
      profileImageUrl: string | null;
    };
  }[];
}

export default function TripRequestsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/api/v1/travels/me`);
        if (response.data.status === 200) {
          const tripsData = response.data.data.content || response.data.data;
          setTrips(Array.isArray(tripsData) ? tripsData : []);
        }
      } catch (error) {
        console.error('여행 목록 조회 실패:', error);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleApprove = async (tripId: number, participantId: number) => {
    try {
      const response = await instance.put(
        `/api/v1/travels/${tripId}/participants/${participantId}/approve`
      );
      if (response.data.status === 200) {
        setTrips(prevTrips => 
          prevTrips.map(trip => {
            if (trip.id === tripId) {
              return {
                ...trip,
                participants: trip.participants.map(p => 
                  p.id === participantId ? { ...p, status: 'APPROVED' } : p
                )
              };
            }
            return trip;
          })
        );
      }
    } catch (error) {
      console.error('참여자 승인 실패:', error);
      alert('참여자 승인에 실패했습니다.');
    }
  };

  const handleReject = async (tripId: number, participantId: number) => {
    try {
      const response = await instance.put(
        `/api/v1/travels/${tripId}/participants/${participantId}/reject`
      );
      if (response.data.status === 200) {
        setTrips(prevTrips => 
          prevTrips.map(trip => {
            if (trip.id === tripId) {
              return {
                ...trip,
                participants: trip.participants.map(p => 
                  p.id === participantId ? { ...p, status: 'REJECTED' } : p
                )
              };
            }
            return trip;
          })
        );
      }
    } catch (error) {
      console.error('참여자 거절 실패:', error);
      alert('참여자 거절에 실패했습니다.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-500';
      case 'APPROVED':
        return 'text-green-500';
      case 'REJECTED':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '대기중';
      case 'APPROVED':
        return '승인됨';
      case 'REJECTED':
        return '거절됨';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiOutlineChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-medium">참여 신청 관리</h1>
          </div>
        </div>
      </div>

      {/* 여행 목록 */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        {trips && trips.length > 0 ? (
          trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* 여행 정보 */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={getImageUrl(trip.images[0]?.imageUrl)}
                      alt={trip.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2">{trip.title}</h2>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <HiOutlineCalendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString()} ~{" "}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineMapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{trip.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineUserGroup className="w-4 h-4 text-gray-400" />
                        <span>
                          {trip.minParticipants}~{trip.maxParticipants}명
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <HiOutlineStar className="w-4 h-4" />
                        <span>{trip.reviews?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <HiOutlineHeart className="w-4 h-4" />
                        <span>{trip.likes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 참여자 목록 */}
              <div className="divide-y divide-gray-100">
                {trip.participants && trip.participants.length > 0 ? (
                  trip.participants.map((participant) => (
                    <div key={participant.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={getProfileImage(participant.user.profileImageUrl || "")}
                              alt={participant.user.nickname}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{participant.user.nickname}</h3>
                            <p className={`text-sm ${getStatusColor(participant.status)}`}>
                              {getStatusText(participant.status)}
                            </p>
                          </div>
                        </div>
                        {participant.status === 'PENDING' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(trip.id, participant.id)}
                              className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                            >
                              <HiOutlineCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(trip.id, participant.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <HiOutlineXMark className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                      {participant.message && (
                        <p className="text-sm text-gray-600 mt-2">{participant.message}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(participant.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    아직 참여 신청이 없습니다.
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            등록된 여행이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
} 