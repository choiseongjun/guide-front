"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import TripList from "@/components/TripList";
import instance from "@/app/api/axios";
import { log } from "console";

interface Travel {
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
  schedules: {
    id: number;
    dayNumber: number;
    title: string;
    time: string;
    description: string;
  }[];
  tags: {
    id: number;
    name: string;
  }[];
  images: {
    id: number;
    imageUrl: string;
    displayOrder: number;
    originalFileName: string;
    storedFileName: string;
    fileSize: number;
  }[];
  reviews?: { id: number }[];
  likes?: { id: number }[];
  participants?: { profileImage: string }[];
  createdBy: string;
  updatedBy: string;
  links: any[];
  user: {
    id: number;
    email: string | null;
    nickname: string;
    profileImageUrl: string;
  };
}

interface TravelResponse {
  status: number;
  data: {
    content: Travel[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
}

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

type SortOption = "startDate" | "price" | "popular";

export default function ThemePageClient({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("startDate");
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
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
  const [sort, setSort] = useState('');

  // 카테고리 ID가 변경될 때 상태 초기화
  useEffect(() => {
    // 모든 상태 초기화
    setPage(0);
    setTrips([]);
    setHasMore(true);
    setLoading(false);

    // 새로운 데이터 로드
    fetchTravels(0);
  }, [params.id,sortBy]);

  // fetchTravels 함수를 useCallback으로 메모이제이션
  const fetchTravels = useCallback(
    async (pageNum: number = 0) => {
      if (loading) return;

      console.log("sortBy===",sortBy)
      try {
        setLoading(true);
        const response = await instance.get<TravelResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/travels`,
          {
            params: {
              page: pageNum,
              size: 10,
              categoryId: params.id,
              sort: sortBy === 'startDate' ? 'startDate,desc' : 
                    sortBy === 'price' ? 'price,asc' : 
                    sortBy === 'popular' ? 'likes,desc' : ""
            },
          }
        );

        if (response.data.status === 200) {
          const mappedTrips = response.data.data.content.map((travel) => ({
            ...travel,
            image:
              travel.images.length > 0
                ? travel.images[0].imageUrl
                : "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=60",
            price:
              travel.discountedPrice > 0
                ? travel.discountedPrice
                : travel.price,
            originalPrice: travel.price,
            duration: `${Math.ceil(
              (new Date(travel.endDate).getTime() -
                new Date(travel.startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )}일`,
            time: travel.schedules[0]?.time || "",
            location: travel.address.split(" ")[0],
            reviews: travel.reviews?.length || 0,
            wishlist: travel.likes?.length || 0,
            user: {
              id: travel.user.id,
              nickname: travel.user.nickname,
              profileImage: travel.user.profileImageUrl,
            },
          }));

          setTrips((prev) =>
            pageNum === 0 ? mappedTrips : [...prev, ...mappedTrips]
          );
          setHasMore(response.data.data.content.length === 10);
          setPage(pageNum);
        }
      } catch (error) {
        console.error("여행 목록 조회 실패:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [params.id, loading, sortBy]
  );

  // Intersection Observer 설정
  useEffect(() => {
    let isFetching = false; // API 호출 중복 방지를 위한 플래그

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isFetching) {
          isFetching = true;
          await fetchTravels(page + 1);
          isFetching = false;
        }
      },
      {
        root: null,
        rootMargin: "100px", // 더 일찍 로딩 시작
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [page, hasMore, loading, fetchTravels]);

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
    setTrips([]); // 기존 데이터 초기화
    setPage(0);   // 페이지 초기화
    setHasMore(true); // 더 불러올 수 있도록 설정
    // fetchTravels(0); // 정렬된 데이터 새로 불러오기
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
                      onClick={() => handleSort("startDate")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        sortBy === "startDate"
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
          {/* 무한 스크롤 감지 요소 */}
          <div
            ref={observerTarget}
            className="h-10 flex items-center justify-center"
          >
            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
