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
import { getImageUrl } from "@/app/common/imgUtils";

// 임시 저장한 여행지 데이터
const savedPlaces = [
  {
    id: 1,
    title: "에펠탑",
    image: "https://picsum.photos/seed/eiffel/200/120",
    location: "프랑스 파리",
    category: "명소",
    savedAt: "2024-02-15",
    duration: "2시간",
    time: "09:00-21:00",
    participants: "1-4명",
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
    title: "성산일출봉",
    image: "https://picsum.photos/seed/seongsan/200/120",
    location: "제주도 성산",
    category: "명소",
    savedAt: "2024-02-10",
    duration: "3시간",
    time: "07:00-19:00",
    participants: "1-6명",
    reviews: 89,
    wishlist: 42,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=4",
      "https://i.pravatar.cc/150?img=5",
    ],
  },
  {
    id: 3,
    title: "도쿄 디즈니랜드",
    image: "https://picsum.photos/seed/tokyo/200/120",
    location: "일본 도쿄",
    category: "테마파크",
    savedAt: "2024-02-05",
    duration: "1일",
    time: "08:00-22:00",
    participants: "2-4명",
    reviews: 156,
    wishlist: 78,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=6",
      "https://i.pravatar.cc/150?img=7",
      "https://i.pravatar.cc/150?img=8",
    ],
  },
  {
    id: 4,
    title: "푸켓 해변",
    image: "https://picsum.photos/seed/phuket/200/120",
    location: "태국 푸켓",
    category: "해변",
    savedAt: "2024-02-01",
    duration: "4시간",
    time: "08:00-18:00",
    participants: "1-8명",
    reviews: 92,
    wishlist: 45,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=9",
      "https://i.pravatar.cc/150?img=10",
    ],
  },
];

export default function SavedPlacesPage() {
  const [activeTab, setActiveTab] = useState<"places" | "posts">("places");

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
            <h1 className="text-lg font-medium">저장한 여행지</h1>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4">
          <div className="flex gap-4">
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === "places"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("places")}
            >
              여행지
            </button>
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === "posts"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              게시글
            </button>
          </div>
        </div>
      </div>

      {/* 여행지 목록 */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {savedPlaces.map((place) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <Link href={`/place/${place.id}`}>
              <div className="relative h-48">
                <Image
                  src={getImageUrl(place.image)}
                  alt={place.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {place.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{place.title}</h3>

                {/* 기본 정보 */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <HiOutlineCalendar className="w-4 h-4" />
                    <span>{place.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineClock className="w-4 h-4" />
                    <span>{place.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineMapPin className="w-4 h-4" />
                    <span>{place.location}</span>
                  </div>
                </div>

                {/* 참여자 프로필 사진 */}
                {place.participantsPhotos && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex -space-x-2">
                      {place.participantsPhotos.map((photo, index) => (
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
                      {place.participants}
                    </span>
                  </div>
                )}

                {/* 리뷰와 찜 */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                    <span>리뷰 {place.reviews}개</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineHeart className="w-4 h-4 text-red-400" />
                    <span>찜 {place.wishlist}명</span>
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
