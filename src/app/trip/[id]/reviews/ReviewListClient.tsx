"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlineStar } from "react-icons/hi2";

// 임시 리뷰 데이터
const reviewData = {
  tripTitle: "제주도 3박 4일 힐링 여행",
  totalReviews: 15,
  averageRating: 4.8,
  reviews: [
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
    {
      id: 4,
      user: {
        name: "최여행",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      rating: 5,
      date: "2024-03-01",
      content:
        "제주도의 아름다운 자연을 만끽할 수 있었던 좋은 여행이었습니다. 특히 올레길 트레킹이 인상적이었어요.",
      images: [
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: 5,
      user: {
        name: "정여행",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      rating: 4,
      date: "2024-02-28",
      content: "가격 대비 만족스러운 여행이었습니다. 다음에도 추천하고 싶어요.",
      images: [],
    },
    {
      id: 6,
      user: {
        name: "강여행",
        avatar: "https://i.pravatar.cc/150?img=6",
      },
      rating: 5,
      date: "2024-02-25",
      content:
        "일정이 타이트하지 않아서 여유롭게 즐길 수 있었어요. 특히 스파 체험이 좋았습니다.",
      images: [
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: 7,
      user: {
        name: "조여행",
        avatar: "https://i.pravatar.cc/150?img=7",
      },
      rating: 5,
      date: "2024-02-20",
      content: "가이드님의 친절한 설명과 함께하는 여행이라 더욱 특별했어요.",
      images: [],
    },
    {
      id: 8,
      user: {
        name: "윤여행",
        avatar: "https://i.pravatar.cc/150?img=8",
      },
      rating: 4,
      date: "2024-02-15",
      content: "숙소 위치가 좋아서 이동이 편했어요. 맛집 투어도 좋았습니다.",
      images: [
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: 9,
      user: {
        name: "장여행",
        avatar: "https://i.pravatar.cc/150?img=9",
      },
      rating: 5,
      date: "2024-02-10",
      content: "제주도의 매력을 제대로 느낄 수 있었던 여행이었습니다.",
      images: [],
    },
    {
      id: 10,
      user: {
        name: "임여행",
        avatar: "https://i.pravatar.cc/150?img=10",
      },
      rating: 4,
      date: "2024-02-05",
      content: "일정이 잘 짜여있어서 많은 곳을 둘러볼 수 있었어요.",
      images: [
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop&q=60",
      ],
    },
  ],
};

export default function ReviewListClient({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<"latest" | "rating">("latest");

  const sortedReviews = [...reviewData.reviews].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

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
            <h1 className="text-xl font-bold ml-4">리뷰</h1>
          </div>
        </div>
      </header>

      {/* 리뷰 요약 */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-2">{reviewData.tripTitle}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <HiOutlineStar className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-semibold">{reviewData.averageRating}</span>
          </div>
          <span className="text-gray-500">
            리뷰 {reviewData.totalReviews}개
          </span>
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("latest")}
            className={`px-4 py-2 rounded-full text-sm ${
              sortBy === "latest"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortBy("rating")}
            className={`px-4 py-2 rounded-full text-sm ${
              sortBy === "rating"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            평점순
          </button>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="divide-y divide-gray-100">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-white p-4">
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
                  <div key={index} className="relative w-24 h-24 flex-shrink-0">
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
  );
}
