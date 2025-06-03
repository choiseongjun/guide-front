"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiPlus as HiPlusIcon, HiOutlineMap, HiOutlineGlobeAlt } from "react-icons/hi2";
import TripList from "@/components/TripList";
import { useState, useEffect, useRef } from "react";
import instance from "@/app/api/axios";
import { useUser } from "@/hooks/useUser";

interface Travel {
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
  images: {
    id: number;
    imageUrl: string;
    displayOrder: number;
  }[];
  schedules: {
    id: number;
    dayNumber: number;
    title: string;
    description: string;
    time: string;
  }[];
  reviews?: { id: number }[];
  likes?: { id: number }[];
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
}

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [recommendedTrips, setRecommendedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecommendedTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await instance.get(
          `/api/v1/travels`,
          {
            params: {
              page: 0,
              size: 5,
              kind:"latest",
            },
          }
        );

        if (response.data.status === 200) {
          const mappedTrips = response.data.data.content.map(
            (travel: Travel) => ({
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
            })
          );
          setRecommendedTrips(mappedTrips);
        }
      } catch (error: any) {
        console.error("추천 여행 조회 실패:", error);
        if (error.message === "Network Error") {
          setError("서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError(
            "데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedTrips();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const banners = [
    {
      id: 1,
      title: "제주도 여행",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=60",
      description: "아름다운 제주도의 풍경을 만나보세요",
    },
    {
      id: 2,
      title: "부산 여행",
      image:
        "https://travelwithme-dev-file.s3.ap-northeast-2.amazonaws.com/banner/1065_4776_439.jpg",
      description: "바다와 함께하는 부산 여행",
    },
    {
      id: 3,
      title: "강원도 여행",
      image:
        "https://travelwithme-dev-file.s3.ap-northeast-2.amazonaws.com/banner/512_1879_1827.jpg",
      description: "자연과 함께하는 강원도 여행",
    },
  ];

  const themes = [
    {
      id: 1,
      title: "힐링 & 웰니스",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      title: "미식 & 음식 투어",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      title: "사진 & 영상 투어",
      image:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      title: "액티비티 & 모험",
      image:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 5,
      title: "예술 & 문화",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 6,
      title: "캠핑",
      image:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 7,
      title: "파티 & 페스티벌",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 8,
      title: "펫여행",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="banner-slider">
        <Slider {...settings}>
          {banners.map((banner, index) => (
            <div key={index} className="banner-item">
              <div className="banner-image">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  width={370}
                  height={200}
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
                <div className="banner-content">
                  <h2>{banner.title}</h2>
                  <p>{banner.description}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="theme-grid">
        {themes.map((theme, index) => (
          <Link
            key={index}
            href={`/theme/${theme.id}`}
            className="theme-item cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="theme-image">
              <Image
                src={theme.image}
                alt={theme.title}
                width={85}
                height={85}
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
            <div className="theme-title">{theme.title}</div>
          </Link>
        ))}
      </div>

      <div className="relative mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="어디로 여행가시나요?"
            className="w-full h-12 pl-12 pr-24 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors shadow-sm">
          검색
        </button>
      </div>

      <section className="max-w-md mx-auto px-4 py-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">추천 여행</h2>
          <Link
            href="/trip"
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            더보기
          </Link>
        </div>

        {/* {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              새로고침
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendedTrips.map((trip, index) => (
              <TripList
                key={index}
                trips={[trip]}
                onTripClick={(tripId) => router.push(`/trip/${tripId}`)}
              />
            ))}
          </div>
        )} */}
         <div className="space-y-4">
            {recommendedTrips.map((trip, index) => (
              <TripList
                key={index}
                trips={[trip]}
                onTripClick={(tripId) => router.push(`/trip/${tripId}`)}
              />
            ))}
          </div>

        {user && (
          <div className="fixed bottom-[100px]  z-50" style={{ right: 'calc((100% - 22rem) / 2 + 1rem)' }}>
            {showMenu && (
              <div className="absolute bottom-16 right-0 w-48 bg-white rounded-lg shadow-lg py-2 mb-2">
                <button
                  onClick={() => {
                    router.push("/trip/create");
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <HiPlusIcon className="w-5 h-5" />
                  여행 만들기
                </button>
                <button
                  onClick={() => {
                    router.push("/trip");
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <HiOutlineMap className="w-5 h-5" />
                  전체 여행 보기
                </button>
              </div>
            )}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="floating-button"
            >
              <HiPlusIcon className="w-6 h-6" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
