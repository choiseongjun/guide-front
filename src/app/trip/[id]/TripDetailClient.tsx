"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineMapPin,
  HiOutlineHeart,
  HiOutlineStar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShare,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineChevronRight,
} from "react-icons/hi2";

// 임시 데이터 (실제로는 API에서 가져올 데이터)
const tripData = {
  id: 1,
  title: "제주도 3박 4일 힐링 여행",
  images: [
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1596422846543-75c6fc197f11?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1598887141929-ef608c1dba3c?w=800&auto=format&fit=crop&q=60",
  ],
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
  wishlist: 56,
  participantsPhotos: [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
  ],
  description: `제주도의 아름다운 자연과 함께하는 힐링 여행입니다.
  
  - 제주 올레길 트레킹
  - 해변에서의 여유로운 시간
  - 현지 맛집 투어
  - 스파 & 마사지 체험
  
  숙소는 제주시 중심가에 위치한 프리미엄 호텔로, 모든 편의시설이 완비되어 있습니다.`,
  schedule: [
    {
      day: 1,
      title: "제주도 도착 & 시티투어",
      activities: ["공항 픽업", "숙소 체크인", "제주시 시티투어", "저녁 식사"],
    },
    {
      day: 2,
      title: "올레길 트레킹 & 해변",
      activities: [
        "아침 식사",
        "올레길 트레킹",
        "해변에서의 자유시간",
        "저녁 식사",
      ],
    },
    {
      day: 3,
      title: "맛집 투어 & 스파",
      activities: ["아침 식사", "현지 맛집 투어", "스파 & 마사지", "저녁 식사"],
    },
    {
      day: 4,
      title: "마지막 날",
      activities: ["아침 식사", "쇼핑", "공항 이동", "귀가"],
    },
  ],
  host: {
    name: "김여행",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 4.8,
    reviews: 156,
    trips: 89,
  },
  reviewList: [
    {
      id: 1,
      user: {
        name: "김여행",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      rating: 5,
      date: "2024-03-15",
      content:
        "정말 좋은 여행이었습니다. 가이드님이 친절하게 설명해주셔서 더욱 즐거웠어요. 다음에도 꼭 참여하고 싶습니다!",
      images: [
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: 2,
      user: {
        name: "이여행",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      rating: 4,
      date: "2024-03-10",
      content:
        "일정이 잘 짜여있어서 편안하게 여행할 수 있었어요. 숙소도 깨끗하고 좋았습니다.",
      images: [],
    },
    {
      id: 3,
      user: {
        name: "박여행",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      rating: 5,
      date: "2024-03-05",
      content:
        "가이드님이 현지에 대해 정말 잘 알고 계셔서 좋았어요. 맛집도 많이 알려주셔서 만족스러웠습니다.",
      images: [
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
      ],
    },
  ],
};

export default function TripDetailClient({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    Array(tripData.images.length).fill(false)
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === tripData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? tripData.images.length - 1 : prev - 1
    );
  };

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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
            <div className="ml-auto flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <HiOutlineShare className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsWishlist(!isWishlist)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <HiOutlineHeart
                  className={`w-6 h-6 ${
                    isWishlist ? "text-red-500 fill-current" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 이미지 슬라이더 */}
      <div className="relative h-80">
        {tripData.images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`${tripData.title} - 이미지 ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 800px"
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        ))}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75"
        >
          <HiOutlineChevronDown className="w-6 h-6 transform rotate-90" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75"
        >
          <HiOutlineChevronDown className="w-6 h-6 transform -rotate-90" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {tripData.images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 여행 정보 */}
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold mb-2">{tripData.title}</h2>

        {/* 기본 정보 */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <HiOutlineCalendar className="w-4 h-4" />
            <span>{tripData.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineClock className="w-4 h-4" />
            <span>{tripData.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineMapPin className="w-4 h-4" />
            <span>{tripData.location}</span>
          </div>
        </div>

        {/* 가격 정보 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm line-through text-gray-400">
              {tripData.price.toLocaleString()}원
            </span>
            <span className="text-xl font-semibold text-blue-600">
              {tripData.discountPrice.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <HiOutlineMapPin className="w-4 h-4" />
            <span>{tripData.transport}</span>
          </div>
        </div>

        {/* 호스트 정보 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <Image
              src={tripData.host.avatar}
              alt={tripData.host.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold">{tripData.host.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                  <span>{tripData.host.rating}</span>
                </div>
                <span>•</span>
                <span>리뷰 {tripData.host.reviews}개</span>
                <span>•</span>
                <span>여행 {tripData.host.trips}회</span>
              </div>
            </div>
          </div>
        </div>

        {/* 여행 설명 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">여행 소개</h3>
          <div
            className={`text-gray-600 ${
              !showFullDescription && "line-clamp-3"
            }`}
          >
            {tripData.description}
          </div>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-500 text-sm mt-2 flex items-center gap-1"
          >
            {showFullDescription ? (
              <>
                접기 <HiOutlineChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                더보기 <HiOutlineChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* 일정 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">여행 일정</h3>
          <div className="space-y-4">
            {tripData.schedule
              .slice(0, showFullSchedule ? undefined : 1)
              .map((day) => (
                <div key={day.day} className="border-l-2 border-blue-500 pl-4">
                  <h4 className="font-medium mb-2">
                    Day {day.day} - {day.title}
                  </h4>
                  <ul className="space-y-2">
                    {day.activities.map((activity, index) => (
                      <li key={index} className="text-gray-600 text-sm">
                        • {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
          {tripData.schedule.length > 1 && (
            <button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="text-blue-500 text-sm mt-4 flex items-center gap-1"
            >
              {showFullSchedule ? (
                <>
                  접기 <HiOutlineChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  더보기 <HiOutlineChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* 참여자 정보 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">참여자 정보</h3>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {tripData.participantsPhotos.map((photo, index) => (
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
              {tripData.participants}
            </span>
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">리뷰</h3>
            <button
              onClick={() => router.push(`/trip/${params.id}/reviews`)}
              className="text-blue-500 text-sm flex items-center gap-1"
            >
              더보기
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {tripData.reviewList.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
              >
                {/* 리뷰어 정보 */}
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={review.user.avatar}
                    alt={review.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium">{review.user.name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <HiOutlineStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>

                {/* 리뷰 내용 */}
                <p className="text-gray-600 mb-3">{review.content}</p>

                {/* 리뷰 이미지 */}
                {review.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {review.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 flex-shrink-0"
                      >
                        <Image
                          src={image}
                          alt={`리뷰 이미지 ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 플로팅 참여하기 버튼 */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 max-w-md w-full px-4 pointer-events-none">
        <div className="relative w-full">
          <button
            onClick={() => router.push(`/trip/${params.id}/join`)}
            className="absolute cursor-pointer right-8 bottom-2 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center pointer-events-auto"
          >
            <span className="text-lg font-bold">참여</span>
          </button>
        </div>
      </div>
    </div>
  );
}
