"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TripList from "@/components/TripList";
import instance from "@/app/api/axios";

interface Trip {
  id: number;
  title: string;
  image: string;
  price: number;
  discountPrice: number;
  duration: string;
  time: string;
  location: string;
  reviews: number;
  wishlist: number;
  participantsPhotos?: string[];
  transport?: string;
  highlight?: string;
  startDate?: string;
  endDate?: string;
  discountRate: number;
  originalPrice: number;
  facilities: string[];
  maxParticipants: number;
  currentParticipants: number | null;
  participants: {
    id: number;
    travelId: number;
    status: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      nickname: string;
      profileImageUrl: string | null;
    };
  }[];
  user: {
    id: number;
    nickname: string;
    profileImage: string;
  };
  images?: {
    id: number;
    imageUrl: string;
    displayOrder: number;
  }[];
  likes: {
    id: number;
    user: {
      id: number;
      nickname: string;
      profileImageUrl: string | null;
    };
    createdAt: string;
  }[];
  liked: boolean;
}

export default function SavedTripsPage() {
  const router = useRouter();
  const [likedTrips, setLikedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchLikedTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await instance.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/travels/liked-travels`,
          {
            params: {
              page,
              size: 10
            }
          }
        );
        if (response.data.status === 200) {
          const newTrips = response.data.data.content.map((travel: any) => ({
            id: travel.id,
            title: travel.title,
            image: travel.images.length > 0 ? travel.images[0].imageUrl : "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=60",
            price: travel.discountedPrice > 0 ? travel.discountedPrice : travel.price,
            discountPrice: travel.discountedPrice,
            originalPrice: travel.price,
            duration: `${Math.ceil((new Date(travel.endDate).getTime() - new Date(travel.startDate).getTime()) / (1000 * 60 * 60 * 24))}일`,
            time: travel.schedules[0]?.time || "",
            location: travel.address.split(" ")[0],
            reviews: travel.reviews?.length || 0,
            wishlist: travel.likes?.length || 0,
            highlight: travel.highlight,
            startDate: travel.startDate,
            endDate: travel.endDate,
            discountRate: travel.discountRate,
            facilities: [],
            maxParticipants: travel.maxParticipants,
            currentParticipants: 0,
            participants: [],
            liked: true,
            user: {
              id: travel.user.id,
              nickname: travel.user.nickname,
              profileImage: travel.user.profileImageUrl || ""
            },
            images: travel.images,
            likes: travel.likes || []
          }));

          if (page === 0) {
            setLikedTrips(newTrips);
          } else {
            setLikedTrips(prev => [...prev, ...newTrips]);
          }
          setHasMore(!response.data.data.last);
        }
      } catch (error: any) {
        console.error('찜한 여행 조회 실패:', error);
        if (error.message === 'Network Error') {
          setError('서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError('데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLikedTrips();
  }, [page]);

  const handleTripClick = (tripId: number) => {
    router.push(`/trip/${tripId}`);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">찜한 여행</h1>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              새로고침
            </button>
          </div>
        ) : loading && page === 0 ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : likedTrips.length > 0 ? (
          <div className="space-y-4">
            <TripList
              trips={likedTrips}
              onTripClick={handleTripClick}
            />
            {hasMore && (
              <button
                onClick={handleLoadMore}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                더보기
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">찜한 여행이 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}
