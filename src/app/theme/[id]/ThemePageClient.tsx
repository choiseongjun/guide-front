"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  HiOutlineArrowLeft,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineMapPin,
  HiOutlineHeart,
  HiOutlineStar,
  HiOutlineArrowsUpDown,
  HiXMark,
} from "react-icons/hi2";
import { useRouter, usePathname } from "next/navigation";
import TripList from "@/components/TripList";

// 임시 데이터
const trips = [
  {
    id: 1,
    title: "제주도 3박 4일 힐링 여행",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=60",
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
      "https://i.pravatar.cc/150?img=4",
    ],
  },
  {
    id: 2,
    title: "부산 해운대 맛집 투어",
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f11?w=800&auto=format&fit=crop&q=60",
    price: 280000,
    discountPrice: 220000,
    duration: "2일",
    activity: "맛집",
    participants: "1-6명",
    transport: "대중교통",
    facilities: ["해변", "맛집"],
    date: "2024-04-20",
    time: "10:30",
    location: "해운대구",
    reviews: 89,
    wishlist: 42,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=5",
      "https://i.pravatar.cc/150?img=6",
      "https://i.pravatar.cc/150?img=7",
    ],
  },
  {
    id: 3,
    title: "강원도 설악산 등반",
    image:
      "https://images.unsplash.com/photo-1598887141929-ef608c1dba3c?w=800&auto=format&fit=crop&q=60",
    price: 320000,
    discountPrice: 280000,
    duration: "3일",
    activity: "등산",
    participants: "4-8명",
    transport: "버스",
    facilities: ["숙소", "식사", "장비대여"],
    date: "2024-04-25",
    time: "08:00",
    location: "속초시",
    reviews: 156,
    wishlist: 78,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=8",
      "https://i.pravatar.cc/150?img=9",
      "https://i.pravatar.cc/150?img=10",
      "https://i.pravatar.cc/150?img=11",
      "https://i.pravatar.cc/150?img=12",
    ],
  },
  {
    id: 4,
    title: "여수 바다 여행",
    image:
      "https://images.unsplash.com/photo-1598887141929-ef608c1dba3c?w=800&auto=format&fit=crop&q=60",
    price: 350000,
    discountPrice: 290000,
    duration: "3일",
    activity: "해변",
    participants: "2-6명",
    transport: "렌터카",
    facilities: ["해변", "수상스포츠", "맛집"],
    date: "2024-05-01",
    time: "11:00",
    location: "여수시",
    reviews: 92,
    wishlist: 45,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=13",
      "https://i.pravatar.cc/150?img=14",
      "https://i.pravatar.cc/150?img=15",
    ],
  },
  {
    id: 5,
    title: "경주 역사 문화 여행",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
    price: 250000,
    discountPrice: 200000,
    duration: "2일",
    activity: "문화",
    participants: "1-4명",
    transport: "대중교통",
    facilities: ["문화재", "박물관", "맛집"],
    date: "2024-05-05",
    time: "09:30",
    location: "경주시",
    reviews: 112,
    wishlist: 63,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=16",
      "https://i.pravatar.cc/150?img=17",
      "https://i.pravatar.cc/150?img=18",
      "https://i.pravatar.cc/150?img=19",
    ],
  },
  {
    id: 6,
    title: "전주 한옥마을 체험",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60",
    price: 280000,
    discountPrice: 230000,
    duration: "2일",
    activity: "문화",
    participants: "2-4명",
    transport: "대중교통",
    facilities: ["한옥숙박", "전통체험", "맛집"],
    date: "2024-05-10",
    time: "10:00",
    location: "전주시",
    reviews: 145,
    wishlist: 71,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=20",
      "https://i.pravatar.cc/150?img=21",
      "https://i.pravatar.cc/150?img=22",
    ],
  },
  {
    id: 7,
    title: "강원도 스키장 투어",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=60",
    price: 420000,
    discountPrice: 360000,
    duration: "3일",
    activity: "스키",
    participants: "2-6명",
    transport: "렌터카",
    facilities: ["스키장", "장비대여", "숙소"],
    date: "2024-12-20",
    time: "08:30",
    location: "평창군",
    reviews: 98,
    wishlist: 52,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=23",
      "https://i.pravatar.cc/150?img=24",
      "https://i.pravatar.cc/150?img=25",
      "https://i.pravatar.cc/150?img=26",
    ],
  },
  {
    id: 8,
    title: "제주 올레길 트레킹",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60",
    price: 380000,
    discountPrice: 320000,
    duration: "4일",
    activity: "트레킹",
    participants: "4-8명",
    transport: "버스",
    facilities: ["숙소", "식사", "가이드"],
    date: "2024-05-15",
    time: "07:00",
    location: "제주시",
    reviews: 167,
    wishlist: 89,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=27",
      "https://i.pravatar.cc/150?img=28",
      "https://i.pravatar.cc/150?img=29",
      "https://i.pravatar.cc/150?img=30",
      "https://i.pravatar.cc/150?img=31",
    ],
  },
  {
    id: 9,
    title: "울릉도 독도 투어",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=60",
    price: 550000,
    discountPrice: 480000,
    duration: "3일",
    activity: "해변",
    participants: "2-4명",
    transport: "배",
    facilities: ["숙소", "식사", "가이드"],
    date: "2024-05-20",
    time: "08:00",
    location: "울릉군",
    reviews: 78,
    wishlist: 45,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=32",
      "https://i.pravatar.cc/150?img=33",
      "https://i.pravatar.cc/150?img=34",
    ],
  },
  {
    id: 10,
    title: "강원도 MTB 투어",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=60",
    price: 320000,
    discountPrice: 280000,
    duration: "2일",
    activity: "자전거",
    participants: "2-6명",
    transport: "렌터카",
    facilities: ["장비대여", "숙소", "식사"],
    date: "2024-05-25",
    time: "09:00",
    location: "홍천군",
    reviews: 92,
    wishlist: 58,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=35",
      "https://i.pravatar.cc/150?img=36",
      "https://i.pravatar.cc/150?img=37",
      "https://i.pravatar.cc/150?img=38",
    ],
  },
  {
    id: 11,
    title: "부산 야경 투어",
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f11?w=800&auto=format&fit=crop&q=60",
    price: 180000,
    discountPrice: 150000,
    duration: "1일",
    activity: "도시",
    participants: "1-4명",
    transport: "대중교통",
    facilities: ["맛집", "카페"],
    date: "2024-06-01",
    time: "18:00",
    location: "부산시",
    reviews: 145,
    wishlist: 89,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=39",
      "https://i.pravatar.cc/150?img=40",
      "https://i.pravatar.cc/150?img=41",
    ],
  },
  {
    id: 12,
    title: "제주 서핑 체험",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=60",
    price: 280000,
    discountPrice: 240000,
    duration: "2일",
    activity: "서핑",
    participants: "2-4명",
    transport: "렌터카",
    facilities: ["장비대여", "숙소", "식사"],
    date: "2024-06-05",
    time: "10:00",
    location: "제주시",
    reviews: 112,
    wishlist: 67,
    participantsPhotos: [
      "https://i.pravatar.cc/150?img=42",
      "https://i.pravatar.cc/150?img=43",
      "https://i.pravatar.cc/150?img=44",
      "https://i.pravatar.cc/150?img=45",
    ],
  },
];

const filters = {
  activities: ["힐링", "맛집", "액티비티", "문화", "쇼핑"],
  transport: ["렌터카", "대중교통", "자전거", "도보"],
  facilities: ["반려동물 동반 가능", "수영장", "스파", "해변", "맛집"],
};

type FilterCategory = "activities" | "transport" | "facilities";

interface SelectedFilters {
  activities: string[];
  transport: string[];
  facilities: string[];
  date: string;
  priceRange: string;
  participants: string;
  location: string;
  time: string;
  rating: string;
  wishlist: string;
}

type SortOption = "date" | "price" | "popular";

export default function ThemePageClient({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    activities: [],
    transport: [],
    facilities: [],
    date: "",
    priceRange: "",
    participants: "",
    location: "",
    time: "",
    rating: "",
    wishlist: "",
  });

  // 현재 경로가 여행 관련 페이지인지 확인
  useEffect(() => {
    if (pathname.startsWith("/theme/")) {
      // 하단 탭의 여행 아이콘을 활성화하는 이벤트 발생
      window.dispatchEvent(new CustomEvent("updateTab", { detail: "travel" }));
    }
  }, [pathname]);

  const handleFilterChange = (category: FilterCategory, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item: string) => item !== value)
        : [...prev[category], value],
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
                      onClick={() => handleSort("date")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        sortBy === "date"
                          ? "text-blue-500 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      모임 시작일순
                    </button>
                    <button
                      onClick={() => handleSort("price")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        sortBy === "price"
                          ? "text-blue-500 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      가격순
                    </button>
                    <button
                      onClick={() => handleSort("popular")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        sortBy === "popular"
                          ? "text-blue-500 font-medium"
                          : "text-gray-700"
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

      {/* 필터 오버레이 */}
      {showFilters && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[50vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">필터</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HiXMark className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-3 space-y-4">
              {/* 가격 범위 */}
              <div>
                <h3 className="font-medium mb-3">가격 범위</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={selectedFilters.priceRange.split("-")[0] || ""}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        priceRange: `${e.target.value}-${
                          prev.priceRange.split("-")[1] || ""
                        }`,
                      }))
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="최소"
                  />
                  <span>~</span>
                  <input
                    type="number"
                    value={selectedFilters.priceRange.split("-")[1] || ""}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        priceRange: `${prev.priceRange.split("-")[0] || ""}-${
                          e.target.value
                        }`,
                      }))
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="최대"
                  />
                </div>
              </div>

              {/* 날짜 선택 */}
              <div>
                <h3 className="font-medium mb-3">여행 기간</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      시작일
                    </label>
                    <input
                      type="date"
                      value={selectedFilters.date.split("-")[0] || ""}
                      onChange={(e) =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          date: `${e.target.value}-${
                            prev.date.split("-")[1] || ""
                          }`,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      종료일
                    </label>
                    <input
                      type="date"
                      value={selectedFilters.date.split("-")[1] || ""}
                      onChange={(e) =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          date: `${prev.date.split("-")[0] || ""}-${
                            e.target.value
                          }`,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 인원수 */}
              <div>
                <h3 className="font-medium mb-3">남은 인원수</h3>
                <div className="flex flex-wrap gap-2">
                  {["1-2명", "3-4명", "5-6명", "7-8명", "9명 이상"].map(
                    (size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            participants: size,
                          }))
                        }
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedFilters.participants === size
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {size}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* 지역 */}
              <div>
                <h3 className="font-medium mb-3">지역</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "서울",
                    "부산",
                    "제주",
                    "강원",
                    "경기",
                    "전라",
                    "경상",
                    "충청",
                  ].map((region) => (
                    <button
                      key={region}
                      onClick={() =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          location: region,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedFilters.location === region
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* 시작 시간 */}
              <div>
                <h3 className="font-medium mb-3">시작 시간</h3>
                <div className="flex flex-wrap gap-2">
                  {["오전", "오후"].map((period) => (
                    <button
                      key={period}
                      onClick={() =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          time: period,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedFilters.time === period
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* 리뷰 평점 */}
              <div>
                <h3 className="font-medium mb-3">리뷰 평점</h3>
                <div className="flex flex-wrap gap-2">
                  {["4.5점 이상", "4.0점 이상", "3.5점 이상", "3.0점 이상"].map(
                    (rating) => (
                      <button
                        key={rating}
                        onClick={() =>
                          setSelectedFilters((prev) => ({ ...prev, rating }))
                        }
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedFilters.rating === rating
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {rating}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* 찜 수 */}
              <div>
                <h3 className="font-medium mb-3">찜 수</h3>
                <div className="flex flex-wrap gap-2">
                  {["100개 이상", "50개 이상", "30개 이상", "10개 이상"].map(
                    (wishlist) => (
                      <button
                        key={wishlist}
                        onClick={() =>
                          setSelectedFilters((prev) => ({ ...prev, wishlist }))
                        }
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedFilters.wishlist === wishlist
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {wishlist}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* 검색 버튼 */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  onClick={() => {
                    // 필터 적용 로직
                    setShowFilters(false);
                  }}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  검색하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <main className="pb-20">
        <div className="max-w-md mx-auto p-4">
          <TripList
            trips={trips}
            onTripClick={(tripId) => router.push(`/trip/${tripId}`)}
          />
        </div>
      </main>
    </div>
  );
}
