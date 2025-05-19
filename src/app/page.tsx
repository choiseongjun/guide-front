"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { HiPlus } from "react-icons/hi";

const trips = [
  {
    id: 1,
    title: "제주도 3박 4일 힐링 여행",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
    members: 4,
    price: 450000,
    date: "2024.04.15 - 2024.04.18",
  },
  {
    id: 2,
    title: "부산 해운대 바다 여행",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
    members: 2,
    price: 280000,
    date: "2024.04.20 - 2024.04.22",
  },
  {
    id: 3,
    title: "강원도 설악산 등반",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
    members: 6,
    price: 320000,
    date: "2024.04.25 - 2024.04.27",
  },
];

export default function Home() {
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
          <div key={index} className="theme-item">
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
          </div>
        ))}
      </div>

      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold mb-4">추천 여행</h2>
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="flex gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  className="rounded-lg object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {trip.title}
                </h3>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {trip.members}명
                </div>
                <div className="mt-1 text-xs text-gray-500">{trip.date}</div>
                <div className="mt-1 text-sm font-semibold text-blue-600">
                  {trip.price.toLocaleString()}원
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="floating-button" aria-label="새 여행 만들기">
        <HiPlus />
      </button>
    </main>
  );
}
