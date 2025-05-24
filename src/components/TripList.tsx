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

  const getParticipantStatus = (participants: Trip['participants']) => {
    if (!participants) return { pendingCount: 0, approvedCount: 0 };
    // Ensure participants is an array
    const participantsArray = Array.isArray(participants) ? participants : [];
    const pendingCount = participantsArray.filter(p => p.status === 'PENDING').length;
    const approvedCount = participantsArray.filter(p => p.status === 'APPROVED').length;
    return { pendingCount, approvedCount };
  };

  console.log('trips==',trips)

  return (
    <div className="space-y-4">
      {trips.map((trip) => {
        const { pendingCount, approvedCount } = getParticipantStatus(trip.participants);
        const approvedParticipants = Array.isArray(trip.participants) 
          ? trip.participants.filter(p => p.status === 'APPROVED').slice(0, 3)
          : [];

        console.log("trip==",trip);
        return (
          <div
            key={trip.id}
            onClick={() => onTripClick(trip.id)}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="relative h-48">
              <Image
                src={trip.images?.[0]?.imageUrl || trip.image}
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
              </div>

              {/* 참여자 정보 */}
              <div className="flex flex-col gap-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <HiOutlineUserGroup className="w-4 h-4" />
                  <span>
                    참여자: {approvedCount}명 / 최대 {trip.maxParticipants}명
                  </span>
                </div>
                <div className="flex flex-col gap-2 pl-5">
                  {/* 승인된 참여자 */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {trip.participants && trip.participants
                        .filter(p => p.status === 'APPROVED')
                        .slice(0, 4)
                        .map((participant) => (
                          <div key={participant.id} className="relative w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                            <Image
                              src={getProfileImage(participant.user.profileImageUrl)}
                              alt={participant.user.nickname}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      {approvedCount > 4 && (
                        <div className="relative w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                          +{approvedCount - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 대기 중인 참여자 */}
                  {pendingCount > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 text-xs">대기중:</span>
                      <div className="flex -space-x-2">
                        {trip.participants && trip.participants
                          .filter(p => p.status === 'PENDING')
                          .slice(0, 4)
                          .map((participant) => (
                            <div key={participant.id} className="relative w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                              <Image
                                src={getProfileImage(participant.user.profileImageUrl)}
                                alt={participant.user.nickname}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        {pendingCount > 4 && (
                          <div className="relative w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                            +{pendingCount - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
        );
      })}
    </div>
  );
}
