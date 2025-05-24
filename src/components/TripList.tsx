import Image from "next/image";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineStar,
  HiOutlineHeart,
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
}

interface TripListProps {
  trips: Trip[];
  onTripClick: (tripId: number) => void;
}

export default function TripList({ trips, onTripClick }: TripListProps) {
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
            <h3 className="text-lg font-semibold mb-1">{trip.title}</h3>
            
            {/* 하이라이트 */}
            {trip.highlight && (
              <p className="text-sm text-gray-700 mb-2 font-medium italic">{trip.highlight}</p>
            )}

            {/* 여행 기간 */}
            {trip.startDate && trip.endDate && (
              <div className="text-sm text-gray-600 mb-3">
                {new Date(trip.startDate).toLocaleDateString()} ~ {new Date(trip.endDate).toLocaleDateString()}
              </div>
            )}

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
                <HiOutlineMap className="w-4 h-4" />
                <span>{trip.transport}</span>
              </div>
            </div>

            {/* 참여자 프로필 사진 */}
            {trip.participantsPhotos && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {trip.participantsPhotos.map((photo, index) => (
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
                  {trip.participants}
                </span>
              </div>
            )}

            {/* 리뷰와 찜 */}
            <div className="flex items-center gap-4 mb-3">
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
                {trip.discountPrice && trip.discountPrice >0 ? (
                  <>
                    <span className="text-sm line-through text-gray-400">
                      {trip.price?.toLocaleString() || '0'}원
                    </span>
                    <span className="text-lg font-semibold text-blue-600">
                      {trip.discountPrice?.toLocaleString() || '0'}원
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-semibold">
                    {trip.price?.toLocaleString() || '0'}원
                  </span>
                )}
              </div>
              {trip.location && (
                <div className="flex items-center gap-1 text-gray-500">
                  <HiOutlineMapPin className="w-4 h-4" />
                  <span>{trip.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
