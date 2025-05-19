"use client";

import { useState } from "react";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlineAdjustmentsHorizontal, HiOutlineCalendar, HiOutlineClock, HiOutlineUserGroup, HiOutlineCurrencyDollar, HiOutlineMapPin, HiOutlineHeart, HiOutlineStar, HiOutlineArrowsUpDown } from "react-icons/hi2";
import { useRouter } from "next/navigation";

// 임시 데이터
const trips = [
  {
    id: 1,
    title: "제주도 3박 4일 힐링 여행",
    image: "https://picsum.photos/seed/trip1/400/300",
    price: 450000,
    discountPrice: 380000,
    duration: "4일",
    activity: "힐링",
    participants: "2-4명",
    transport: "렌터카",
    facilities: ["반려동물 동반 가능", "수영장", "스파"],
    date: "2024-04-15",
    time: "09:00",
    location: "제주시",
    reviews: 128,
    wishlist: 56,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3",
      "https://i.pravatar.cc/150?img=4"
    ]
  },
  // ... rest of the trips data ...
];

const filters = {
  activities: ["힐링", "맛집", "액티비티", "문화", "쇼핑"],
  transport: ["렌터카", "대중교통", "자전거", "도보"],
  facilities: ["반려동물 동반 가능", "수영장", "스파", "해변", "맛집"],
};

type FilterCategory = 'activities' | 'transport' | 'facilities';

interface SelectedFilters {
  activities: string[];
  transport: string[];
  facilities: string[];
  date: string;
  priceRange: string;
  participants: string;
}

type SortOption = 'date' | 'price' | 'popular';

export default function ThemePageClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    activities: [],
    transport: [],
    facilities: [],
    date: "",
    priceRange: "",
    participants: "",
  });

  const handleFilterChange = (category: FilterCategory, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item: string) => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    setShowSort(false);
  };

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
            <h1 className="text-xl font-bold ml-4">테마 여행</h1>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="p-2 hover:bg-gray-100 rounded-full relative"
                >
                  <HiOutlineArrowsUpDown className="w-6 h-6" />
                </button>
                {showSort && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => handleSort('date')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        sortBy === 'date' ? 'text-blue-500 font-medium' : 'text-gray-700'
                      }`}
                    >
                      모임 시작일순
                    </button>
                    <button
                      onClick={() => handleSort('price')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        sortBy === 'price' ? 'text-blue-500 font-medium' : 'text-gray-700'
                      }`}
                    >
                      가격순
                    </button>
                    <button
                      onClick={() => handleSort('popular')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        sortBy === 'popular' ? 'text-blue-500 font-medium' : 'text-gray-700'
                      }`}
                    >
                      인기순
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <HiOutlineAdjustmentsHorizontal className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 필터 섹션 */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-md mx-auto space-y-4">
            {/* 날짜 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                날짜
              </label>
              <input
                type="date"
                value={selectedFilters.date}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* 가격대 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                가격대
              </label>
              <select
                value={selectedFilters.priceRange}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">전체</option>
                <option value="0-200000">20만원 이하</option>
                <option value="200000-400000">20-40만원</option>
                <option value="400000-600000">40-60만원</option>
                <option value="600000+">60만원 이상</option>
              </select>
            </div>

            {/* 참여 인원 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                참여 인원
              </label>
              <select
                value={selectedFilters.participants}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, participants: e.target.value }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">전체</option>
                <option value="1-2">1-2명</option>
                <option value="3-4">3-4명</option>
                <option value="5+">5명 이상</option>
              </select>
            </div>

            {/* 액티비티 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                액티비티
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.activities.map(activity => (
                  <button
                    key={activity}
                    onClick={() => handleFilterChange('activities', activity)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedFilters.activities.includes(activity)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* 이동 수단 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이동 수단
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.transport.map(transport => (
                  <button
                    key={transport}
                    onClick={() => handleFilterChange('transport', transport)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedFilters.transport.includes(transport)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {transport}
                  </button>
                ))}
              </div>
            </div>

            {/* 편의시설 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                편의시설
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.facilities.map(facility => (
                  <button
                    key={facility}
                    onClick={() => handleFilterChange('facilities', facility)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedFilters.facilities.includes(facility)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {facility}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 여행 리스트 */}
      <div className="max-w-md mx-auto p-4">
        <div className="space-y-4">
          {trips.map(trip => (
            <div
              key={trip.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  className="object-cover"
                />
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
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex -space-x-2">
                    {trip.participantsPhotos.map((photo, index) => (
                      <div key={index} className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                        <Image
                          src={photo}
                          alt={`참여자 ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{trip.participants}</span>
                </div>

                {/* 리뷰와 찜 */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                    <span>리뷰 {trip.reviews}개</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineHeart className="w-4 h-4 text-red-400" />
                    <span>찜 {trip.wishlist}명</span>
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm line-through text-gray-400">
                      {trip.price.toLocaleString()}원
                    </span>
                    <span className="text-lg font-semibold text-blue-600">
                      {trip.discountPrice.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <HiOutlineMapPin className="w-4 h-4" />
                    <span>{trip.transport}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 