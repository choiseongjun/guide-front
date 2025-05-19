"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { HiPlus, HiOutlineCalendar, HiOutlineUserGroup, HiOutlineMap } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";

const trips = [
  {
    id: 1,
    title: "제주도 3박 4일 힐링 여행",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
    members: 4,
    price: 450000,
    discountPrice: 380000,
    date: "2024.04.15 - 2024.04.18",
    departure: "서울",
    time: "09:00",
    reviews: 128,
    wishlist: 56
  },
  {
    id: 2,
    title: "부산 해운대 바다 여행",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
    members: 2,
    price: 280000,
    discountPrice: 220000,
    date: "2024.04.20 - 2024.04.22",
    departure: "인천",
    time: "10:30",
    reviews: 89,
    wishlist: 42
  },
  {
    id: 3,
    title: "강원도 설악산 등반",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
    members: 6,
    price: 320000,
    discountPrice: 280000,
    date: "2024.04.25 - 2024.04.27",
    departure: "수원",
    time: "08:00",
    reviews: 156,
    wishlist: 78
  },
];

export default function Home() {
  const router = useRouter();
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
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f11?w=800&auto=format&fit=crop&q=60",
      description: "바다와 함께하는 부산 여행",
    },
    {
      id: 3,
      title: "강원도 여행",
      image:
        "https://images.unsplash.com/photo-1598887141929-ef608c1dba3c?w=800&auto=format&fit=crop&q=60",
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
      title: "지식 & 교육",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 7,
      title: "미스터리 & 어드벤처",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 8,
      title: "로맨틱 & 프라이빗",
      image:
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <main className="main-page">
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

      <div className="mt-6">
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

        <section className="py-8">
          <div className="max-w-md mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">추천 여행</h2>
            <div className="space-y-4">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => router.push(`/trip/${trip.id}`)}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
                    <h3 className="font-semibold mb-2">{trip.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-2">
                        <HiOutlineCalendar className="w-4 h-4" />
                        <span>{trip.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineUserGroup className="w-4 h-4" />
                        <span>{trip.members}명</span>
                      </div>
                    </div>
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
                        <HiOutlineMap className="w-4 h-4" />
                        <span>{trip.departure}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <button className="floating-button" aria-label="새 여행 만들기">
        <HiPlus />
      </button>
    </main>
  );
}
