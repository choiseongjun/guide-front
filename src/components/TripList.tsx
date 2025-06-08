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
  HiOutlinePencil,
} from "react-icons/hi2";
import { useState, useEffect } from "react";
import instance from "@/app/api/axios";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { getImageUrl, getProfileImage } from "@/app/common/imgUtils";
import { ProcessedTravel } from "@/app/common/travelUtils";
import { categoryName } from "@/utils/category";

interface TripListProps {
  trips: ProcessedTravel[];
  onTripClick: (tripId: number) => void;
  showEditButton?: boolean;
}

// 여행 시작 여부 확인 함수
const isTripStarted = (startDate: string, startTime: string) => {
  const now = new Date();
  const tripStart = new Date(`${startDate}T${startTime}`);
  return now > tripStart;
};

export default function TripList({ trips, onTripClick, showEditButton = false }: TripListProps) {
  const router = useRouter();
  const { user } = useUser();
  const [wishlistStatus, setWishlistStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [wishlistCounts, setWishlistCounts] = useState<{
    [key: number]: number;
  }>({});

  // 초기 상태 설정
  useEffect(() => {
    const initialWishlistStatus: { [key: number]: boolean } = {};
    const initialWishlistCounts: { [key: number]: number } = {};

    trips.forEach((trip) => {
      initialWishlistStatus[trip.id] = trip.liked;
      initialWishlistCounts[trip.id] = trip.likes?.length || 0;
    });

    setWishlistStatus(initialWishlistStatus);
    setWishlistCounts(initialWishlistCounts);
  }, [trips, user?.id]);

  const handleWishlistClick = async (e: React.MouseEvent, tripId: number) => {
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      if (wishlistStatus[tripId]) {
        await instance.delete(`/api/v1/travels/${tripId}/like`);
        setWishlistCounts((prev) => ({
          ...prev,
          [tripId]: Math.max(0, prev[tripId] - 1),
        }));
      } else {
        await instance.post(`/api/v1/travels/${tripId}/like`);
        setWishlistCounts((prev) => ({
          ...prev,
          [tripId]: prev[tripId] + 1,
        }));
      }

      setWishlistStatus((prev) => ({
        ...prev,
        [tripId]: !prev[tripId],
      }));
    } catch (error) {
      console.error("찜하기 처리 실패:", error);
      alert("찜하기 처리에 실패했습니다.");
    }
  };

  const getParticipantStatus = (
    participants: ProcessedTravel["participants"]
  ) => {
    if (!participants) return { pendingCount: 0, approvedCount: 0 };
    const participantsArray = Array.isArray(participants) ? participants : [];
    const pendingCount = participantsArray.filter(
      (p) => p.status === "PENDING"
    ).length;
    const approvedCount = participantsArray.filter(
      (p) => p.status === "APPROVED"
    ).length;
    return { pendingCount, approvedCount };
  };
  console.log("trips===",trips)

  return (
    <div className="space-y-4">
      {trips.map((trip) => {
        const { pendingCount, approvedCount } = getParticipantStatus(
          trip.participants
        );
        const approvedParticipants = Array.isArray(trip.participants)
          ? trip.participants.filter((p) => p.status === "APPROVED").slice(0, 3)
          : [];
        const isStarted = isTripStarted(trip.startDate, trip.startTime??"00:00:00");

        return (
          <div
            key={trip.id}
            className={`bg-white rounded-lg shadow-sm overflow-hidden relative ${
              isStarted ? "opacity-60" : "cursor-pointer hover:shadow-md transition-shadow"
            }`}
            onClick={() => !isStarted && onTripClick(trip.id)}
          >
            {/* 마감 표시 */}
            {isStarted && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                마감
              </div>
            )}

            <div className="relative h-48">
              <Image
                src={getImageUrl(trip.image)}
                alt={trip.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {/* 찜하기 버튼 */}
                <button
                  onClick={(e) => handleWishlistClick(e, trip.id)}
                  className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <HiOutlineHeart
                    className={`w-6 h-6 ${
                      wishlistStatus[trip.id]
                        ? "text-red-500 fill-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>
                {/* 수정 버튼 */}
                {showEditButton && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/trip/${trip.id}/edit`);
                    }}
                    className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    <HiOutlinePencil className="w-6 h-6 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            <div className="p-4">
              {/* 가이드 프로필 */}
              <div
                className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/guide/${trip.user.id}`);
                }}
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={getProfileImage(trip.user.profileImage)}
                    alt={`${trip.user.nickname}의 프로필`}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {trip.user.nickname}
                </span>
              </div>

              {/* 여행 제목 */}
              <h3 className="text-base font-semibold text-gray-800 mb-1.5">
                {trip.title}
              </h3>
              {/* 카테고리 */}    
              {trip.highlight && (
                <p className="text-xs text-gray-500 mb-2 font-bold">{"주제: "+categoryName(trip.categoryId)}</p>
              )}

              {/* 하이라이트 */}
              {trip.highlight && (
                <p className="text-xs text-gray-500 mb-2">{trip.highlight}</p>
              )}
              

              {/* 여행 정보 */}
              <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <HiOutlineCalendar className="w-3.5 h-3.5" />
                  <span>{trip.startDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineCalendar className="w-3.5 h-3.5" />
                  <span>{trip.endDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineCalendar className="w-3.5 h-3.5" />
                  <span>{trip.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineClock className="w-3.5 h-3.5" />
                  <span>{trip.startTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineMapPin className="w-3.5 h-3.5" />
                  <span>{trip.location}</span>
                </div>
              </div>

              {/* 참여자 정보 */}
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <HiOutlineUserGroup className="w-3.5 h-3.5" />
                <span>
                  참여자: {approvedCount}명 / 최소 {trip.minParticipants || 1}명
                  / 최대 {trip.maxParticipants}명
                </span>
              </div>
              <div className="flex flex-col gap-1.5 pl-5 mb-2">
                {/* 승인된 참여자 */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {trip.participants &&
                      trip.participants
                        .filter((p) => p.status === "APPROVED")
                        .slice(0, 4)
                        .map((participant) => (
                          <div
                            key={participant.id}
                            className="relative w-5 h-5 rounded-full border-2 border-white overflow-hidden"
                          >
                            <Image
                              src={getProfileImage(
                                participant.user.profileImageUrl
                              )}
                              alt={participant.user.nickname}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                    {approvedCount > 4 && (
                      <div className="relative w-5 h-5 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600">
                        +{approvedCount - 4}
                      </div>
                    )}
                  </div>
                </div>

                {/* 대기 중인 참여자 */}
                {pendingCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-[10px]">대기중:</span>
                    <div className="flex -space-x-2">
                      {trip.participants &&
                        trip.participants
                          .filter((p) => p.status === "PENDING")
                          .slice(0, 4)
                          .map((participant) => (
                            <div
                              key={participant.id}
                              className="relative w-5 h-5 rounded-full border-2 border-white overflow-hidden"
                            >
                              <Image
                                src={getProfileImage(
                                  participant.user.profileImageUrl
                                )}
                                alt={participant.user.nickname}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                      {pendingCount > 4 && (
                        <div className="relative w-5 h-5 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600">
                          +{pendingCount - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 가격 정보 */}
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-blue-600">
                  {trip.price === 0
                    ? "무료"
                    : `${trip.price.toLocaleString()}원`}
                </span>
                {trip.discountRate > 0 && (
                  <>
                    <span className="text-xs text-gray-500 line-through">
                      {trip.originalPrice?.toLocaleString()}원
                    </span>
                    <span className="text-xs text-red-500">
                      {trip.discountRate}% 할인
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 justify-end mt-1.5">
                <div className="flex items-center gap-1">
                  <HiOutlineChatBubbleLeft className="w-3.5 h-3.5" />
                  <span>{trip.reviews}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineHeart
                    className={`w-3.5 h-3.5 ${
                      wishlistStatus[trip.id] ? "text-red-500 fill-current" : ""
                    }`}
                  />
                  <span>{wishlistCounts[trip.id] || 0}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
