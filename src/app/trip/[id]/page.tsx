"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineStar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineXCircle,
} from "react-icons/hi2";
import instance from "@/app/api/axios";
import { useUser } from "@/hooks/useUser";

interface Participant {
  id: number;
  status: string;
  message?: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
}

interface Trip {
  id: number;
  title: string;
  highlight: string;
  description: string;
  address: string;
  detailAddress: string;
  startDate: string;
  endDate: string;
  minParticipants: number;
  maxParticipants: number;
  price: number;
  discountRate: number;
  discountedPrice: number;
  providedItems: string;
  notProvidedItems: string;
  images: {
    id: number;
    imageUrl: string;
    displayOrder: number;
  }[];
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  schedules: {
    id: number;
    dayNumber: number;
    title: string;
    description: string;
    time: string;
  }[];
  tags: {
    id: number;
    name: string;
  }[];
  participants: Participant[];
  reviews: any[];
  likes: any[];
}

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await instance.get(`/api/v1/travels/${resolvedParams.id}`);
        if (response.data.status === 200) {
          setTrip(response.data.data);
          setIsCreator(user?.id === response.data.data.user.id);
        }
      } catch (error) {
        console.error("여행 상세 정보 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [resolvedParams.id]);

  const nextImage = () => {
    if (trip && currentImageIndex < trip.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleParticipateClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/trip/${resolvedParams.id}/participate`);
  };

  const handleApprove = async (participantId: number) => {
    try {
      const response = await instance.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/travels/${resolvedParams.id}/participants/${participantId}/approve`
      );
      if (response.data.status === 200) {
        // 상태 업데이트
        setTrip(prev => {
          if (!prev) return null;
          return {
            ...prev,
            participants: prev.participants.map(p => 
              p.id === participantId ? { ...p, status: 'APPROVED' } : p
            )
          };
        });
      }
    } catch (error) {
      console.error('참여자 승인 실패:', error);
      alert('참여자 승인에 실패했습니다.');
    }
  };

  const handleReject = async (participantId: number) => {
    try {
      const response = await instance.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/travels/${resolvedParams.id}/participants/${participantId}/reject`
      );
      if (response.data.status === 200) {
        // 상태 업데이트
        setTrip(prev => {
          if (!prev) return null;
          return {
            ...prev,
            participants: prev.participants.map(p => 
              p.id === participantId ? { ...p, status: 'REJECTED' } : p
            )
          };
        });
      }
    } catch (error) {
      console.error('참여자 거절 실패:', error);
      alert('참여자 거절에 실패했습니다.');
    }
  };

  const handleCancelClick = (participantId: number) => {
    setSelectedParticipantId(participantId);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    try {
      const response = await instance.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/travels/${resolvedParams.id}/participants/cancel`
      );
      if (response.data.status === 200) {
        // 상태 업데이트
        setTrip(prev => {
          if (!prev) return null;
          return {
            ...prev,
            participants: prev.participants.filter(p => p.user.id !== user?.id)
          };
        });
        setShowCancelModal(false);
      }
    } catch (error) {
      console.error('참여 취소 실패:', error);
      alert('참여 취소에 실패했습니다.');
    }
  };

  if (userLoading || !trip || loading) {
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
            <h1 className="text-xl font-bold ml-4">여행 상세</h1>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="max-w-md mx-auto relative">
        {/* 이미지 슬라이더 */}
        <div className="relative h-80">
          <Image
            src={trip.images[currentImageIndex].imageUrl}
            alt={trip.title}
            fill
            className="object-cover"
            priority
          />
          {/* 이미지 네비게이션 버튼 */}
          {trip.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                disabled={currentImageIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 disabled:opacity-30"
              >
                <HiOutlineChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                disabled={currentImageIndex === trip.images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 disabled:opacity-30"
              >
                <HiOutlineChevronRight className="w-6 h-6" />
              </button>
              {/* 이미지 인디케이터 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {trip.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white bg-opacity-50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 가이드 정보 */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={trip.user.profileImageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60"}
                alt={trip.user.nickname}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{trip.user.nickname}</h2>
              <p className="text-sm text-gray-500">여행 가이드</p>
            </div>
          </div>
        </div>

        {/* 여행 정보 */}
        <div className="bg-white p-4">
          <h1 className="text-2xl font-bold mb-2">{trip.title}</h1>
          <p className="text-gray-600 mb-4">{trip.highlight}</p>

          {/* 여행 상세 정보 */}
          <div className="space-y-3 mb-4">
            {/* 여행 기간 */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <HiOutlineCalendar className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">여행 기간</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(trip.startDate).toLocaleDateString()} ~{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* 참가 인원 */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <HiOutlineUserGroup className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">참가 인원</p>
                <p className="text-sm font-medium text-gray-900">
                  {trip.minParticipants}~{trip.maxParticipants}명
                </p>
              </div>
            </div>

            {/* 여행지 */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <HiOutlineMapPin className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">여행지</p>
                <p className="text-sm font-medium text-gray-900">{trip.address}</p>
              </div>
            </div>

            {/* 여행 시간 */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <HiOutlineClock className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">여행 시간</p>
                <p className="text-sm font-medium text-gray-900">
                  {trip.schedules[0]?.time || "미정"}
                </p>
              </div>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">여행 비용</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {trip.discountedPrice.toLocaleString()}원
                  </span>
                  {trip.discountRate > 0 && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        {trip.price.toLocaleString()}원
                      </span>
                      <span className="text-xs text-red-500">
                        {trip.discountRate}% 할인
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 플로팅 참가하기 버튼 */}
        {!isCreator && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 max-w-md w-full px-4">
            <div className="flex justify-end">
              {user && trip.participants.some(p => p.user.id === user.id && (p.status === 'APPROVED' || p.status === 'PENDING')) ? (
                <button 
                  onClick={() => {
                    const participant = trip.participants.find(p => p.user.id === user.id);
                    if (participant) {
                      handleCancelClick(participant.id);
                    }
                  }}
                  className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <HiOutlineXCircle className="w-6 h-6" />
                </button>
              ) : (
                <button 
                  onClick={handleParticipateClick}
                  className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
                >
                  <HiOutlineUserGroup className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 하단 여백 추가 */}
        {/* <div className="h-24"></div> */}

        {/* 여행 설명 */}
        <div className="bg-white p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">여행 설명</h2>
          <p className="text-gray-600 whitespace-pre-line">{trip.description}</p>
        </div>

        {/* 참여자 정보 */}
        {/* <div className="bg-white p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">참여자</h2>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {trip.participants && trip.participants
                .filter(participant => participant.status === 'APPROVED')
                .map((participant, index) => (
                  <div
                    key={participant.id}
                    className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                    style={{ zIndex: trip.participants!.filter(p => p.status === 'APPROVED').length - index }}
                  >
                    <Image
                      src={participant.user.profileImageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60"}
                      alt={participant.user.nickname}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {trip.participants?.filter(p => p.status === 'APPROVED').length || 0}명
              </span>
              <span className="mx-1">/</span>
              <span>{trip.maxParticipants}명</span>
            </div>
          </div>
        </div> */}

        {/* 취소 확인 모달 */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">참여 취소</h3>
              <p className="text-gray-600 mb-6">정말로 참여를 취소하시겠습니까?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  아니오
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  네, 취소합니다
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 참여자 목록 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">참여자 목록</h3>
          <div className="space-y-4">
            {trip.participants
              .filter((p) => p.status === "APPROVED")
              .map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={
                        participant.user.profileImageUrl ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60"
                      }
                      alt={participant.user.nickname}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{participant.user.nickname}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(participant.createdAt).toLocaleDateString()} 참여
                    </p>
                  </div>
                  {user?.id === participant.user.id && (
                    <button
                      onClick={() => handleCancelClick(participant.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <HiOutlineXCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* 대기자 목록 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">대기자 목록</h3>
          <div className="space-y-4">
            {trip.participants
              .filter((p) => p.status === "PENDING")
              .map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={
                        participant.user.profileImageUrl ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60"
                      }
                      alt={participant.user.nickname}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{participant.user.nickname}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(participant.createdAt).toLocaleDateString()} 신청
                    </p>
                    {participant.message && (
                      <p className="text-sm text-gray-600 mt-1">{participant.message}</p>
                    )}
                  </div>
                  {user?.id === participant.user.id ? (
                    <button
                      onClick={() => handleCancelClick(participant.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <HiOutlineXCircle className="w-5 h-5" />
                    </button>
                  ) : isCreator && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(participant.id)}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                      >
                        <HiOutlineCheck className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(participant.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <HiOutlineXMark className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            {trip.participants.filter((p) => p.status === "PENDING").length === 0 && (
              <p className="text-center text-gray-500 py-4">대기중인 신청이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 제공/미제공 항목 */}
        <div className="bg-white p-4">
          <h2 className="text-xl font-bold mb-4">포함/불포함 항목</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">포함 항목</h3>
              <div className="bg-emerald-50 rounded-lg p-3">
                <ul className="space-y-1">
                  {trip.providedItems.split(",").map((item, index) => (
                    <li key={index} className="text-emerald-700 text-sm">
                      • {item.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">불포함 항목</h3>
              <div className="bg-red-50 rounded-lg p-3">
                <ul className="space-y-1">
                  {trip.notProvidedItems.split(",").map((item, index) => (
                    <li key={index} className="text-red-700 text-sm">
                      • {item.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 일정 */}
        <div className="bg-white mt-4 p-4">
          <h2 className="text-xl font-bold mb-4">여행 일정</h2>
          <div className="space-y-4">
            {trip.schedules.map((schedule) => (
              <div key={schedule.id} className="border-l-2 border-blue-500 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-blue-500">
                    Day {schedule.dayNumber}
                  </span>
                  <span className="text-sm text-gray-500">
                    {schedule.time}
                  </span>
                </div>
                <h3 className="font-medium mb-1">{schedule.title}</h3>
                <p className="text-sm text-gray-600">{schedule.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 태그 */}
        <div className="bg-white mt-4 p-4">
          <h2 className="text-xl font-bold mb-4">태그</h2>
          <div className="flex flex-wrap gap-2">
            {trip.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 