import Image from "next/image";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineChatBubbleLeft,
  HiOutlineStar,
  HiOutlineMap,
} from "react-icons/hi2";

interface Trip {
  id: number;
  title: string;
  image: string;
  price: number;
  discountPrice: number;
  duration: string;
  time: string;
  location: string;
  participants: string;
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
  user: {
    id: number;
    nickname: string;
    profileImage: string;
  };
}

interface TripListProps {
  trips: Trip[];
  onTripClick: (tripId: number) => void;
}

export default function TripList({ trips, onTripClick }: TripListProps) {
  const getProfileImage = (url: string | null) => {
    if (!url) {
      return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60";
    }
    return url;
  };

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <div
          key={trip.id}
          onClick={() => onTripClick(trip.id)}
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="relative h-48">
            <Image
              src={trip.image}
              alt={trip.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>
          <div className="p-4">
            {/* 가이드 프로필 */}
            <div className="flex items-center gap-2 mb-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={getProfileImage(trip.user.profileImage)}
                  alt={trip.user.nickname}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {trip.user.nickname}
              </span>
            </div>

            {/* 여행 제목 */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {trip.title}
            </h3>

            {/* 하이라이트 */}
            {trip.highlight && (
              <p className="text-sm text-gray-600 mb-3">{trip.highlight}</p>
            )}

            {/* 여행 정보 */}
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
                <HiOutlineCalendar className="w-4 h-4" />
                <span>{trip.startDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <HiOutlineCalendar className="w-4 h-4" />
                <span>{trip.endDate}</span>
              </div>
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
              <div className="flex items-center gap-1">
                <HiOutlineUserGroup className="w-4 h-4" />
                <span>{trip.participants}</span>
              </div>
            </div>

            {/* 가격 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-blue-600">
                  {trip.price.toLocaleString()}원
                </span>
                {trip.discountRate > 0 && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      {trip.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-sm text-red-500">
                      {trip.discountRate}% 할인
                    </span>
                  </>
                )}
              </div>
              
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 justify-end">
                <div className="flex items-center gap-1">
                  <HiOutlineChatBubbleLeft className="w-4 h-4" />
                  <span>{trip.reviews}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineHeart className="w-4 h-4" />
                  <span>{trip.wishlist}</span>
                </div>
              </div>
          </div>
        </div>
      ))}
    </div>
  );
}
