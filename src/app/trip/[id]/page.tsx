"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlineHeart,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineMapPin,
} from "react-icons/hi2";
import instance from "@/app/api/axios";

interface Schedule {
  id: number;
  dayNumber: number;
  title: string;
  time: string;
  description: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Trip {
  id: number;
  title: string;
  highlight: string;
  description: string;
  address: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  minParticipants: number;
  maxParticipants: number;
  isPaid: boolean;
  price: number;
  discountRate: number;
  discountedPrice: number;
  providedItems: string;
  notProvidedItems: string;
  requiresApproval: boolean;
  minAge: number;
  maxAge: number;
  hasSchedule: boolean;
  schedules: Schedule[];
  tags: Tag[];
  images: { imageUrl: string }[];
  participants: any[];
  likes: any[];
}

interface TripResponse {
  status: number;
  data: Trip;
  message: string;
}

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await instance.get<TripResponse>(`/api/v1/travels/${resolvedParams.id}`);
        if (response.data.status === 200) {
          setTrip(response.data.data);
        }
      } catch (error) {
        console.error('여행 상세 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [resolvedParams.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">여행 정보를 찾을 수 없습니다.</p>
      </div>
    );
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

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto">
        {/* 이미지 섹션 */}
        <div className="relative aspect-[4/3] bg-gray-200">
          {trip.images.length > 0 ? (
            <Image
              src={trip.images[0].imageUrl}
              alt={trip.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              이미지 없음
            </div>
          )}
        </div>

        {/* 기본 정보 */}
        <div className="bg-white p-4">
          <h1 className="text-2xl font-bold mb-2">{trip.title}</h1>
          <p className="text-gray-600 mb-4">{trip.highlight}</p>
          
          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {trip.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                #{tag.name}
              </span>
            ))}
          </div>

          {/* 주요 정보 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <HiOutlineCalendar className="w-5 h-5" />
              <span>
                {formatDate(trip.startDate)} ~ {formatDate(trip.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <HiOutlineUserGroup className="w-5 h-5" />
              <span>
                {trip.minParticipants}~{trip.maxParticipants}명
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <HiOutlineMapPin className="w-5 h-5" />
              <span>{trip.address} {trip.detailAddress}</span>
            </div>
            {trip.isPaid && (
              <div className="flex items-center gap-2 text-gray-600">
                <HiOutlineCurrencyDollar className="w-5 h-5" />
                <span>
                  {formatPrice(trip.price)}
                  {trip.discountRate > 0 && (
                    <span className="text-red-500 ml-2">
                      {trip.discountRate}% 할인
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 상세 설명 */}
        <div className="bg-white mt-2 p-4">
          <h2 className="text-lg font-bold mb-3">상세 설명</h2>
          <p className="text-gray-600 whitespace-pre-line">{trip.description}</p>
        </div>

        {/* 일정 */}
        {trip.hasSchedule && trip.schedules.length > 0 && (
          <div className="bg-white mt-2 p-4">
            <h2 className="text-lg font-bold mb-3">일정</h2>
            <div className="space-y-4">
              {trip.schedules.map((schedule) => (
                <div key={schedule.id} className="flex gap-4">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-sm font-medium text-blue-600">
                      Day {schedule.dayNumber}
                    </div>
                    <div className="text-xs text-gray-500">{schedule.time}</div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{schedule.title}</h3>
                    <p className="text-sm text-gray-600">{schedule.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 제공/미제공 항목 */}
        <div className="bg-white mt-2 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">제공 항목</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {trip.providedItems.split(',').map((item, index) => (
                  <li key={index}>• {item.trim()}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">미제공 항목</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {trip.notProvidedItems.split(',').map((item, index) => (
                  <li key={index}>• {item.trim()}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 참가 조건 */}
        <div className="bg-white mt-2 p-4">
          <h2 className="text-lg font-bold mb-3">참가 조건</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 연령: {trip.minAge}세 ~ {trip.maxAge}세</p>
            <p>• 승인 필요: {trip.requiresApproval ? '예' : '아니오'}</p>
          </div>
        </div>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          onClick={() => {
            // 참가 신청 로직
          }}
        >
          참가 신청하기
        </button>
      </div>
    </div>
  );
} 