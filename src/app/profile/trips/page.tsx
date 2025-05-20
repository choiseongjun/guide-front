"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineChevronLeft,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineStar,
  HiOutlineHeart,
} from "react-icons/hi2";
import { motion } from "framer-motion";

// 임시 여행 데이터
const trips = [
  {
    id: 1,
    title: "2024 봄 유럽 여행",
    image: "https://picsum.photos/seed/europe/200/120",
    startDate: "2024-03-15",
    endDate: "2024-03-25",
    location: "프랑스, 이탈리아",
    status: "upcoming",
    duration: "11일",
    time: "09:00",
    participants: "2-4명",
    reviews: 128,
    wishlist: 56,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3",
    ],
  },
  {
    id: 2,
    title: "혼자 떠난 제주 3박 4일",
    image: "https://picsum.photos/seed/jeju/200/120",
    startDate: "2024-02-01",
    endDate: "2024-02-04",
    location: "제주도",
    status: "completed",
    duration: "4일",
    time: "10:00",
    participants: "1명",
    reviews: 89,
    wishlist: 42,
    participantsPhotos: ["https://i.pravatar.cc/150?img=4"],
  },
  {
    id: 3,
    title: "도쿄 디즈니랜드 여행",
    image: "https://picsum.photos/seed/tokyo/200/120",
    startDate: "2023-12-20",
    endDate: "2023-12-23",
    location: "일본 도쿄",
    status: "completed",
    duration: "4일",
    time: "08:00",
    participants: "2명",
    reviews: 156,
    wishlist: 78,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=5",
      "https://i.pravatar.cc/150?img=6",
    ],
  },
  {
    id: 4,
    title: "태국 푸켓 여행",
    image: "https://picsum.photos/seed/phuket/200/120",
    startDate: "2024-04-10",
    endDate: "2024-04-15",
    location: "태국 푸켓",
    status: "upcoming",
    duration: "6일",
    time: "11:00",
    participants: "2-4명",
    reviews: 92,
    wishlist: 45,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=7",
      "https://i.pravatar.cc/150?img=8",
      "https://i.pravatar.cc/150?img=9",
    ],
  },
];

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
    "upcoming"
  );

  const filteredTrips = trips.filter((trip) => trip.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiOutlineChevronLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-lg font-medium">나의 여행</h1>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4">
          <div className="flex gap-4">
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === "upcoming"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              예정된 여행
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

      {/* 여행 목록 */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {filteredTrips.map((trip) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <Link href={`/trip/${trip.id}`}>
              <div className="relative h-48">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                  className="object-cover"
                />
                {trip.status === "upcoming" && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    예정
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{trip.title}</h3>

                {/* 기본 정보 */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <HiOutlineCalendar className="w-4 h-4" />
                    <span>{trip.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineClock className="w-4 h-4" />
                    <span>{trip.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineMapPin className="w-4 h-4" />
                    <span>{trip.location}</span>
                  </div>
                </div>

                {/* 참여자 프로필 사진 */}
                {trip.participantsPhotos && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex -space-x-2">
                      {trip.participantsPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                        >
                          <Image
                            src={photo}
                            alt={`참여자 ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {trip.participants}
                    </span>
                  </div>
                )}

                {/* 리뷰와 찜 */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                    <span>리뷰 {trip.reviews}개</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineHeart className="w-4 h-4 text-red-400" />
                    <span>찜 {trip.wishlist}명</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
