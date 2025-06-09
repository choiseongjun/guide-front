"use client";

import { useState, useEffect, use, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineStar,
  HiStar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineXCircle,
  HiOutlinePencil,
  HiOutlinePhoto,
  HiOutlineTrash,
  HiOutlineShare,
  HiOutlineLink,
  HiMinus,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { HiOutlineChatBubbleLeft } from "react-icons/hi2";
import instance from "@/app/api/axios";
import { useUser } from "@/hooks/useUser";
import { getImageUrl, getProfileImage } from "@/app/common/imgUtils";
import { GiSiren } from "react-icons/gi";
import { AnimatePresence, motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { BsFacebook, BsTwitter } from "react-icons/bs";
import TripTabs from "./components/TripTabs";
import PhotoTab from "./components/PhotoTab";
import ErrorModal from "@/app/components/ErrorModal";

interface Participant {
  id: number;
  status: string;
  message?: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
}

interface Trip {
  hasSchedule: boolean;
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
  providedItems: string;
  notProvidedItems: string;
  status: "PENDING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  images: {
    id: number;
    imageUrl: string;
    displayOrder: number;
  }[];
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  schedules: {
    id: number;
    dayNumber: number;
    title: string;
    description: string;
    time: string;
  }[];
  tags: {
    id: number;
    name: string;
  }[];
  participants: Participant[];
  reviews: any[];
  likes: any[];
}

interface Review {
  id: number;
  travelId: number;
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  title: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  imageUrls?: string[];
}

interface ImageFile {
  fileUrl: string;
}

interface ParticipantEvaluation {
  id: number;
  evaluatorId: number;
  evaluatedId: number;
  rating: number;
  content: string;
  isBadManner: boolean;
  createdAt: string;
}

// 가데이터 리뷰 목록
const sampleReviews: Review[] = [
  {
    id: 1,
    travelId: 35,
    user: {
      id: 10,
      nickname: "여행러1",
      profileImageUrl:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60",
    },
    title: "정말 좋은 여행이었어요!",
    rating: 5,
    content:
      "정말 좋은 여행이었습니다! 가이드님이 친절하게 설명해주셔서 더욱 즐거웠어요. 다음에도 꼭 참여하고 싶네요.",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: 2,
    travelId: 35,
    user: {
      id: 11,
      nickname: "여행러2",
      profileImageUrl: null,
    },
    title: "일정이 잘 짜여있는 여행",
    rating: 4,
    content:
      "일정이 잘 짜여있어서 편안하게 여행할 수 있었어요. 특히 맛집 추천이 정말 좋았습니다!",
    createdAt: "2024-03-14T15:30:00Z",
    updatedAt: "2024-03-14T15:30:00Z",
  },
];

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: { id: number; imageUrl: string; displayOrder: number }[];
  initialIndex: number;
}

const ImageModal = ({
  isOpen,
  onClose,
  images,
  initialIndex,
}: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (!isOpen) return null;

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* 이미지 */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={getImageUrl(images[currentIndex].imageUrl)}
            alt={`여행 이미지 ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <HiOutlineXMark className="w-6 h-6" />
        </button>

        {/* 이전/다음 버튼 */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors disabled:opacity-30"
            >
              <HiOutlineChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              disabled={currentIndex === images.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors disabled:opacity-30"
            >
              <HiOutlineChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* 이미지 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface ReviewImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
}

const ReviewImageModal = ({
  isOpen,
  onClose,
  images,
  initialIndex,
}: ReviewImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (!isOpen) return null;

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* 이미지 */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={getImageUrl(images[currentIndex])}
            alt={`리뷰 이미지 ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <HiOutlineXMark className="w-6 h-6" />
        </button>

        {/* 이전/다음 버튼 */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors disabled:opacity-30"
            >
              <HiOutlineChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              disabled={currentIndex === images.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors disabled:opacity-30"
            >
              <HiOutlineChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* 이미지 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    number | null
  >(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewImages, setReviewImages] = useState<ImageFile[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  const [isWishlist, setIsWishlist] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [evaluationRating, setEvaluationRating] = useState(5);
  const [isNegativeRating, setIsNegativeRating] = useState(false);
  const [evaluationContent, setEvaluationContent] = useState("");
  const [evaluations, setEvaluations] = useState<ParticipantEvaluation[]>([]);
  const [isBadManner, setIsBadManner] = useState(false);
  const [badMannerReason, setBadMannerReason] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "info" | "schedule" | "reviews" | "photos"
  >("info");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviewImageModal, setShowReviewImageModal] = useState(false);
  const [selectedReviewImageIndex, setSelectedReviewImageIndex] = useState(0);
  const [selectedReviewImages, setSelectedReviewImages] = useState<string[]>(
    []
  );

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await instance.get(
          `/api/v1/travels/${resolvedParams.id}`
        );
        if (response.data.status === 200) {
          const tripData = response.data.data;
          setTrip(tripData);
          setIsCreator(user?.id === tripData.user.id);

          // 좋아요 상태 확인 API 호출
          if (user) {
            try {
              const likeResponse = await instance.get(
                `/api/v1/travels/${resolvedParams.id}/like`
              );
              // API 응답에서 실제 좋아요 상태 확인
              setIsWishlist(likeResponse.data.data || false);
            } catch (error) {
              setIsWishlist(false);
            }
          } else {
            setIsWishlist(false);
          }
          setWishlistCount(tripData.likes?.length || 0);
        }
      } catch (error) {
        console.error("여행 상세 정보 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [resolvedParams.id, user?.id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await instance.get(
          `/api/v1/travels/${resolvedParams.id}/reviews`
        );
        if (response.status === 200) {
          // API 응답 구조에 맞게 데이터 설정
          const reviewsData = response.data.data.content || [];
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error("리뷰 조회 실패:", error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [resolvedParams.id]);

  useEffect(() => {
    // 모바일 환경 체크
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // 카카오 SDK 초기화
    const initializeKakao = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
      }
    };

    // SDK가 로드되었는지 확인
    if (window.Kakao) {
      initializeKakao();
    } else {
      // SDK가 로드되지 않았다면 로드될 때까지 대기
      const script = document.querySelector('script[src*="kakao.js"]');
      if (script) {
        script.addEventListener("load", initializeKakao);
        return () => script.removeEventListener("load", initializeKakao);
      }
    }
  }, []);

  const nextImage = () => {
    if (trip && currentImageIndex < trip.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleParticipateClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push(`/trip/${resolvedParams.id}/participate`);
  };

  const handleApprove = async (participantId: number) => {
    try {
      const response = await instance.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/travels/${resolvedParams.id}/participants/${participantId}/approve`
      );
      if (response.data.status === 200) {
        // 상태 업데이트
        setTrip((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            participants: prev.participants.map((p) =>
              p.id === participantId ? { ...p, status: "APPROVED" } : p
            ),
          };
        });
      }
    } catch (error) {
      console.error("참여자 승인 실패:", error);
      alert("참여자 승인에 실패했습니다.");
    }
  };

  const handleReject = async (participantId: number) => {
    try {
      const response = await instance.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/travels/${resolvedParams.id}/participants/${participantId}/reject`
      );
      if (response.data.status === 200) {
        // 상태 업데이트
        setTrip((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            participants: prev.participants.map((p) =>
              p.id === participantId ? { ...p, status: "REJECTED" } : p
            ),
          };
        });
      }
    } catch (error) {
      console.error("참여자 거절 실패:", error);
      alert("참여자 거절에 실패했습니다.");
    }
  };

  const handleCancelClick = (participantId: number) => {
    setSelectedParticipantId(participantId);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    try {
      const response = await instance.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/travels/${resolvedParams.id}/participants/cancel`
      );
      if (response.data.status === 200) {
        // 상태 업데이트
        setTrip((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            participants: prev.participants.filter(
              (p) => p.user.id !== user?.id
            ),
          };
        });
        setShowCancelModal(false);
      }
    } catch (error: any) {
      console.error("참여 취소 실패:", error);
      const errMessage =
        error?.response?.data?.message || "참여 취소에 실패했습니다.";
      setErrorMessage(errMessage);
      setShowErrorModal(true);
    }
  };

  const handleReviewImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    for (const file of newFiles) {
      // FormData 생성 및 이미지 업로드
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pathType", "review");

      try {
        const uploadResponse = await instance.post(
          "/api/v1/s3/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // 업로드된 이미지 URL을 받아서 상태 업데이트
        setReviewImages((prev) => [
          ...prev,
          {
            fileUrl: uploadResponse.data.fileUrl,
          },
        ]);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
      }
    }
  };

  const removeReviewImage = (index: number) => {
    setReviewImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewTitle(review.title);
    setReviewContent(review.content);
    setRating(review.rating);
    setReviewImages(review.imageUrls?.map((url) => ({ fileUrl: url })) || []);
    setShowReviewForm(true);
  };

  const handleDeleteClick = (reviewId: number) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    try {
      const response = await instance.delete(
        `/api/v1/travels/${resolvedParams.id}/reviews/${reviewToDelete}`
      );
      if (response.status === 200) {
        // 리뷰 목록 새로고침
        const reviewsResponse = await instance.get(
          `/api/v1/travels/${resolvedParams.id}/reviews`
        );
        if (reviewsResponse.status === 200) {
          setReviews(reviewsResponse.data.data.content || []);
        }
      }
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert("리뷰 삭제에 실패했습니다.");
    } finally {
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const requestData = {
        title: reviewTitle,
        rating: rating,
        content: reviewContent,
        imageUrls: reviewImages.map((image) => image.fileUrl),
      };

      let response;
      if (editingReview) {
        // 수정
        response = await instance.put(
          `/api/v1/travels/${resolvedParams.id}/reviews/${editingReview.id}`,
          requestData
        );
      } else {
        // 새로 작성
        response = await instance.post(
          `/api/v1/travels/${resolvedParams.id}/reviews`,
          requestData
        );
      }

      if (response.status === 200) {
        // 리뷰 목록 새로고침
        const reviewsResponse = await instance.get(
          `/api/v1/travels/${resolvedParams.id}/reviews`
        );
        if (reviewsResponse.status === 200) {
          setReviews(reviewsResponse.data.data.content || []);
        }

        setShowReviewForm(false);
        setReviewContent("");
        setReviewTitle("");
        setRating(5);
        setReviewImages([]);
        setEditingReview(null);
      }
    } catch (error) {
      console.error("리뷰 작성/수정 실패:", error);
      alert("리뷰 작성/수정에 실패했습니다.");
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "방금 전";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return date.toLocaleDateString();
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      if (isWishlist) {
        // 찜하기 취소
        await instance.delete(`/api/v1/travels/${resolvedParams.id}/like`);
        setWishlistCount((prev) => Math.max(0, prev - 1));
      } else {
        // 찜하기 추가
        await instance.post(`/api/v1/travels/${resolvedParams.id}/like`);
        setWishlistCount((prev) => prev + 1);
      }
      setIsWishlist(!isWishlist);
    } catch (error) {
      console.error("찜하기 처리 실패:", error);
      alert("찜하기 처리에 실패했습니다.");
    }
  };

  const handleReportTrip = async () => {
    if (!reportReason.trim()) {
      alert("신고 사유를 입력해주세요.");
      return;
    }

    try {
      const response = await instance.post("/api/v1/reports", {
        reportedUserId: trip?.user.id,
        category: "TRAVEL",
        content: reportReason.trim(),
        targetId: parseInt(resolvedParams.id),
      });

      if (response.status === 200) {
        setShowReportModal(false);
        setReportReason("");
        showSuccessToast("신고가 접수되었습니다.");
      }
    } catch (error) {
      console.error("신고 실패:", error);
      alert("신고 처리 중 오류가 발생했습니다.");
    }
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleEvaluationSubmit = async () => {
    if (!selectedParticipant || !evaluationContent.trim() || !trip) {
      alert("평가 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await instance.post("/api/v1/user-reviews", {
        reviewedUserId: selectedParticipant.user.id,
        rating: isNegativeRating ? -evaluationRating : evaluationRating,
        content: evaluationContent.trim(),
        badMannerContent: isBadManner ? badMannerReason.trim() : null,
        travelId: trip.id,
        isVerified: true,
      });

      if (response.status === 200) {
        setShowEvaluationModal(false);
        setSelectedParticipant(null);
        setEvaluationContent("");
        setEvaluationRating(5);
        setIsNegativeRating(false);
        setIsBadManner(false);
        setBadMannerReason("");
        showSuccessToast("평가가 등록되었습니다.");
      }
    } catch (error) {
      console.error("평가 등록 실패:", error);
      alert("평가 등록에 실패했습니다.");
    }
  };

  const fetchEvaluations = async () => {
    try {
      const response = await instance.get(
        `/api/v1/travels/${resolvedParams.id}/reviews`
      );
      if (response.status === 200) {
        setEvaluations(response.data.data || []);
      }
    } catch (error) {
      console.error("평가 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    if (trip) {
      fetchEvaluations();
    }
  }, [trip]);

  const handleShare = async (type: string) => {
    const shareUrl = `${window.location.origin}/trip/${resolvedParams.id}`;
    const shareTitle = trip?.title || "여행 상세";
    const shareText = trip?.highlight || "";

    try {
      switch (type) {
        case "kakao":
          if (window.Kakao) {
            window.Kakao.Link.sendDefault({
              objectType: "feed",
              content: {
                title: shareTitle,
                description: shareText,
                imageUrl: trip?.images[0]?.imageUrl || "",
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
              buttons: [
                {
                  title: "여행 상세 보기",
                  link: {
                    mobileWebUrl: shareUrl,
                    webUrl: shareUrl,
                  },
                },
              ],
            });
          }
          break;

        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`
          );
          break;

        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareTitle
            )}&url=${encodeURIComponent(shareUrl)}`
          );
          break;

        case "instagram":
          // 인스타그램은 직접 공유가 불가능하므로 링크 복사
          await navigator.clipboard.writeText(shareUrl);
          showSuccessToast("인스타그램에 공유할 링크가 복사되었습니다.");
          break;

        case "link":
          await navigator.clipboard.writeText(shareUrl);
          showSuccessToast("링크가 복사되었습니다.");
          break;

        case "native":
          if (navigator.share) {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: shareUrl,
            });
          }
          break;
      }
      setShowShareModal(false);
    } catch (error) {
      console.error("공유하기 실패:", error);
      alert("공유하기에 실패했습니다.");
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120; // 헤더와 탭의 높이를 고려한 오프셋
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleTabClick = (tab: "info" | "schedule" | "reviews" | "photos") => {
    setActiveTab(tab);
    scrollToSection(tab);
  };

  if (userLoading || !trip || loading) {
    return null;
  }

  console.log("trip.status==", trip.status);
  return (
    <div className="min-h-screen bg-white">
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
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <HiOutlineShare className="w-6 h-6" />
              </button>
              <button
                onClick={handleWishlistClick}
                className="p-2 hover:bg-gray-100 rounded-full relative"
              >
                <HiOutlineHeart
                  className={`w-6 h-6 ${
                    isWishlist ? "text-red-500 fill-current" : "text-gray-600"
                  }`}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <GiSiren className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 탭 */}
      <div className="bg-white">
        <TripTabs activeTab={activeTab} onTabChange={handleTabClick} />
      </div>

      {/* 메인 컨텐츠 영역 */}
      <main className="max-w-md mx-auto relative">
        {/* 이미지 슬라이더 */}
        <div className="relative h-80">
          <Image
            src={getImageUrl(trip.images[currentImageIndex].imageUrl)}
            alt={trip.title}
            fill
            className="object-cover cursor-pointer"
            priority
            onClick={() => {
              setSelectedImageIndex(currentImageIndex);
              setShowImageModal(true);
            }}
          />
          {/* 이미지 네비게이션 버튼 */}
          {trip.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                disabled={currentImageIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 disabled:opacity-30"
              >
                <HiOutlineChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                disabled={currentImageIndex === trip.images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 disabled:opacity-30"
              >
                <HiOutlineChevronRight className="w-6 h-6" />
              </button>
              {/* 이미지 인디케이터 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {trip.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white bg-opacity-50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 가이드 정보 */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={
                  getProfileImage(trip.user.profileImageUrl) ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60"
                }
                alt={trip.user.nickname}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{trip.user.nickname}</h2>
              <p className="text-sm text-gray-500">여행 가이드</p>
            </div>
          </div>
        </div>

        {/* 여행 정보 섹션 */}
        <div id="info" className="bg-white p-4">
          {/* 여행 정보 */}
          <h1 className="text-2xl font-bold mb-2">{trip.title}</h1>
          <p className="text-gray-600 mb-4">{trip.highlight}</p>

          {/* 여행 상세 정보 */}
          <div className="space-y-3 mb-4">
            {/* 여행 기간 */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <HiOutlineCalendar className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">여행 기간</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(trip.startDate).toLocaleDateString()} ~{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* 참가 인원 */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <HiOutlineUserGroup className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">참가 인원</p>
                <p className="text-sm font-medium text-gray-900">
                  {trip.minParticipants}~{trip.maxParticipants}명
                </p>
              </div>
            </div>

            {/* 여행지 */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <HiOutlineMapPin className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">여행지</p>
                <p className="text-sm font-medium text-gray-900">
                  {trip.address}
                </p>
              </div>
            </div>

            {/* 여행 시간 */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <HiOutlineClock className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">여행 시간</p>
                <p className="text-sm font-medium text-gray-900">
                  {trip.schedules[0]?.time || "미정"}
                </p>
              </div>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">여행 비용</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {trip.discountedPrice.toLocaleString()}원
                  </span>
                  {trip.discountRate > 0 && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        {trip.price.toLocaleString()}원
                      </span>
                      <span className="text-xs text-red-500">
                        {trip.discountRate}% 할인
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 여행 설명 */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">여행 설명</h2>
            <div
              className="text-gray-600 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: trip.description.replace(
                  /<img/g,
                  '<img class="w-full h-auto rounded-lg my-4"'
                ),
              }}
            />
          </div>

          {/* 참여자 목록 */}
          {
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">참여자 목록</h2>
              <div className="space-y-4">
                {/* 참여 확정된 참여자 */}
                {trip.participants.filter((p) => p.status === "APPROVED")
                  .length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      참여 확정
                    </h3>
                    <div className="space-y-2">
                      {trip.participants
                        .filter(
                          (p) =>
                            p.status === "APPROVED" && p.user.id !== user?.id
                        )
                        .map((participant) => (
                          <div
                            key={participant.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={getProfileImage(
                                    participant.user.profileImageUrl
                                  )}
                                  alt={participant.user.nickname}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {participant.user.nickname}
                                </p>
                                <p className="text-sm text-gray-500">
                                  참여 확정
                                </p>
                              </div>
                            </div>
                            {trip.status === "ONGOING" && user && (
                              <button
                                onClick={() => {
                                  setSelectedParticipant(participant);
                                  setShowEvaluationModal(true);
                                }}
                                className="text-blue-500 text-sm flex items-center gap-1"
                              >
                                <HiOutlineStar className="w-5 h-5" />
                                평가하기
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 대기 중인 참여자 */}
                {trip.participants.filter((p) => p.status === "PENDING")
                  .length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      대기 중
                    </h3>
                    <div className="space-y-2">
                      {trip.participants
                        .filter((p) => p.status === "PENDING")
                        .map((participant) => (
                          <div
                            key={participant.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={getProfileImage(
                                    participant.user.profileImageUrl
                                  )}
                                  alt={participant.user.nickname}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {participant.user.nickname}
                                </p>
                                <p className="text-sm text-gray-500">대기 중</p>
                              </div>
                            </div>
                            {isCreator && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleApprove(participant.id)}
                                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                                >
                                  승인
                                </button>
                                <button
                                  onClick={() => handleReject(participant.id)}
                                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                                >
                                  거절
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {trip.participants.filter(
                  (p) => p.status === "APPROVED" || p.status === "PENDING"
                ).length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    아직 참여 신청한 사람이 없습니다.
                  </p>
                )}
              </div>
            </div>
          }

          {/* 제공/미제공 항목 */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">포함/불포함 항목</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">포함 항목</h3>
                <div className="bg-emerald-50 rounded-lg p-3">
                  <ul className="space-y-1">
                    {trip.providedItems.split(",").map((item, index) => (
                      <li key={index} className="text-emerald-700 text-sm">
                        • {item.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">불포함 항목</h3>
                <div className="bg-red-50 rounded-lg p-3">
                  <ul className="space-y-1">
                    {trip.notProvidedItems.split(",").map((item, index) => (
                      <li key={index} className="text-red-700 text-sm">
                        • {item.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 태그 */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">태그</h2>
            <div className="flex flex-wrap gap-2">
              {trip.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 일정 섹션 */}
        {trip.hasSchedule && (
          <div id="schedule" className="bg-white p-4">
            <h2 className="text-xl font-bold mb-4">여행 일정</h2>
            <div className="space-y-4">
              {trip.schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="border-l-2 border-blue-500 pl-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-blue-500">
                      Day {schedule.dayNumber}
                    </span>
                    <span className="text-sm text-gray-500">
                      {schedule.time}
                    </span>
                  </div>
                  <h3 className="font-medium mb-1">{schedule.title}</h3>
                  <p className="text-sm text-gray-600">
                    {schedule.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 리뷰 섹션 */}
        <div id="reviews" className="bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">리뷰</h2>
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
            >
              <HiOutlinePencil className="w-5 h-5" />
              <span>리뷰 작성</span>
            </button>
          </div>

          {/* 리뷰 목록 */}
          <div className="space-y-4">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                        {review.user?.profileImageUrl ? (
                          <Image
                            src={getProfileImage(review.user.profileImageUrl)}
                            alt={review.user?.nickname || "사용자"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {review.user?.nickname?.[0] || "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {review.user?.nickname || "알 수 없는 사용자"}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <HiStar
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span>{formatTimeAgo(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    {user?.id === review.user?.id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(review.id)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-3">
                    {review.content}
                  </p>

                  {/* 리뷰 이미지 */}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {review.imageUrls.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="relative aspect-square cursor-pointer"
                          onClick={() => {
                            setSelectedReviewImages(review.imageUrls || []);
                            setSelectedReviewImageIndex(index);
                            setShowReviewImageModal(true);
                          }}
                        >
                          <Image
                            src={getImageUrl(imageUrl)}
                            alt={`리뷰 이미지 ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                아직 작성된 리뷰가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 사진 섹션 */}
        {/* <div id="photos" className="bg-white p-4">
          <PhotoTab tripId={resolvedParams.id} isCreator={isCreator} />
        </div> */}

        {/* 플로팅 참가하기 버튼 */}
        {!isCreator && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 max-w-md w-full px-4">
            <div className="flex justify-end">
              {user &&
              trip.participants.some(
                (p) =>
                  p.user.id === user.id &&
                  (p.status === "APPROVED" || p.status === "PENDING")
              ) ? (
                <button
                  onClick={() => {
                    const participant = trip.participants.find(
                      (p) => p.user.id === user.id
                    );
                    if (participant) {
                      handleCancelClick(participant.id);
                    }
                  }}
                  className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <HiOutlineXCircle className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={handleParticipateClick}
                  className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
                >
                  <HiOutlineUserGroup className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 모달들 */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">참여 취소</h3>
              <p className="text-gray-600 mb-6">
                정말로 참여를 취소하시겠습니까?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  아니오
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  네, 취소합니다
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">리뷰 삭제</h3>
              <p className="text-gray-600 mb-6">
                정말로 이 리뷰를 삭제하시겠습니까?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setReviewToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  아니오
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  네, 삭제합니다
                </button>
              </div>
            </div>
          </div>
        )}

        {showReportModal && (
          <AnimatePresence>
            {showReportModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-sm bg-white rounded-2xl p-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GiSiren className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      여행 상품 신고
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      신고 사유를 입력해주세요.
                    </p>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full p-3 border rounded-lg text-sm"
                      rows={3}
                      placeholder="신고 사유를 입력하세요..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowReportModal(false);
                        setReportReason("");
                      }}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleReportTrip}
                      className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                    >
                      신고하기
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {showEvaluationModal && (
          <AnimatePresence>
            {showEvaluationModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-md bg-white rounded-2xl shadow-xl my-8 max-h-[90vh] flex flex-col"
                >
                  {/* 모달 헤더 */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-900">
                      동행자 평가
                    </h3>
                    <button
                      onClick={() => {
                        setShowEvaluationModal(false);
                        setSelectedParticipant(null);
                        setEvaluationContent("");
                        setEvaluationRating(5);
                        setIsNegativeRating(false);
                        setIsBadManner(false);
                        setBadMannerReason("");
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <HiOutlineXMark className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 모달 컨텐츠 */}
                  <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    {/* 평가할 동행자 선택 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        평가할 동행자
                      </label>
                      <div className="space-y-2">
                        {trip?.participants
                          .filter(
                            (p) =>
                              p.status === "APPROVED" && p.user.id !== user?.id
                          )
                          .map((participant) => (
                            <button
                              key={participant.id}
                              onClick={() =>
                                setSelectedParticipant(participant)
                              }
                              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                selectedParticipant?.id === participant.id
                                  ? "border-blue-500 bg-blue-50 shadow-sm"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-white">
                                <Image
                                  src={getProfileImage(
                                    participant.user.profileImageUrl || ""
                                  )}
                                  alt={participant.user.nickname}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-medium">
                                {participant.user.nickname}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* 별점 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        평가 점수
                      </label>
                      <div className="flex flex-col gap-4">
                        {/* 점수 타입 선택 */}
                        <div className="flex gap-4">
                          <button
                            onClick={() => setIsNegativeRating(false)}
                            className={`flex-1 py-2.5 px-4 rounded-xl border transition-all ${
                              !isNegativeRating
                                ? "border-blue-500 bg-blue-50 text-blue-500 shadow-sm"
                                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            좋은 평가
                          </button>
                          <button
                            onClick={() => setIsNegativeRating(true)}
                            className={`flex-1 py-2.5 px-4 rounded-xl border transition-all ${
                              isNegativeRating
                                ? "border-red-500 bg-red-50 text-red-500 shadow-sm"
                                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            나쁜 평가
                          </button>
                        </div>

                        {/* 별점 표시 */}
                        <div className="flex items-center justify-center gap-1 bg-gray-50 p-4 rounded-xl">
                          {isNegativeRating && (
                            <HiMinus className="w-6 h-6 text-red-500" />
                          )}
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setEvaluationRating(star)}
                              className="text-2xl transition-transform hover:scale-110"
                            >
                              {star <= evaluationRating ? (
                                <HiStar
                                  className={`w-8 h-8 ${
                                    isNegativeRating
                                      ? "text-red-500"
                                      : "text-yellow-400"
                                  }`}
                                />
                              ) : (
                                <HiOutlineStar
                                  className={`w-8 h-8 ${
                                    isNegativeRating
                                      ? "text-red-200"
                                      : "text-gray-300"
                                  }`}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="text-center text-sm font-medium text-gray-600">
                          {isNegativeRating
                            ? `-${evaluationRating}점`
                            : `+${evaluationRating}점`}
                        </div>
                      </div>
                    </div>

                    {/* 비매너 체크박스 */}
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={isBadManner}
                          onChange={(e) => {
                            setIsBadManner(e.target.checked);
                            if (!e.target.checked) {
                              setBadMannerReason("");
                            }
                          }}
                          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          비매너 동행자로 신고
                        </span>
                      </label>
                      {isBadManner && (
                        <div className="mt-4 space-y-3 bg-red-50 p-4 rounded-xl">
                          <p className="text-sm text-red-600 font-medium">
                            * 비매너 신고는 신중하게 해주세요. 허위 신고 시
                            제재를 받을 수 있습니다.
                          </p>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              비매너 신고 사유
                            </label>
                            <textarea
                              value={badMannerReason}
                              onChange={(e) =>
                                setBadMannerReason(e.target.value)
                              }
                              className="w-full p-3 border border-red-200 rounded-xl text-sm focus:ring-red-500 focus:border-red-500 bg-white"
                              rows={3}
                              placeholder="비매너 행동의 구체적인 사유를 작성해주세요..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 평가 내용 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        평가 내용
                      </label>
                      <textarea
                        value={evaluationContent}
                        onChange={(e) => setEvaluationContent(e.target.value)}
                        className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        rows={4}
                        placeholder={
                          isNegativeRating
                            ? "개선이 필요한 점을 작성해주세요..."
                            : "좋았던 점을 작성해주세요..."
                        }
                      />
                    </div>
                  </div>

                  {/* 모달 푸터 */}
                  <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowEvaluationModal(false);
                          setSelectedParticipant(null);
                          setEvaluationContent("");
                          setEvaluationRating(5);
                          setIsNegativeRating(false);
                          setIsBadManner(false);
                          setBadMannerReason("");
                        }}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleEvaluationSubmit}
                        disabled={
                          !selectedParticipant || !evaluationContent.trim()
                        }
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          selectedParticipant && evaluationContent.trim()
                            ? isNegativeRating
                              ? "bg-red-500 text-white hover:bg-red-600 shadow-sm"
                              : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        평가하기
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {showToast && (
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
              >
                <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
                  {toastMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {showShareModal && (
          <AnimatePresence>
            {showShareModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-sm bg-white rounded-2xl shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        공유하기
                      </h3>
                      <button
                        onClick={() => setShowShareModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <HiOutlineXMark className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      {isMobile ? (
                        <>
                          <button
                            onClick={() => handleShare("kakao")}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center">
                              <RiKakaoTalkFill className="w-6 h-6 text-[#3C1E1E]" />
                            </div>
                            <span className="text-xs text-gray-600">
                              카카오톡
                            </span>
                          </button>
                          <button
                            onClick={() => handleShare("instagram")}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center">
                              <FaInstagram className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs text-gray-600">
                              인스타그램
                            </span>
                          </button>
                          <button
                            onClick={() => handleShare("native")}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                              <HiOutlineShare className="w-6 h-6 text-gray-600" />
                            </div>
                            <span className="text-xs text-gray-600">
                              더보기
                            </span>
                          </button>
                          <button
                            onClick={() => handleShare("link")}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                              <HiOutlineLink className="w-6 h-6 text-gray-600" />
                            </div>
                            <span className="text-xs text-gray-600">
                              링크 복사
                            </span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleShare("kakao")}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center">
                              <RiKakaoTalkFill className="w-6 h-6 text-[#3C1E1E]" />
                            </div>
                            <span className="text-xs text-gray-600">
                              카카오톡
                            </span>
                          </button>
                          <button
                            onClick={() => handleShare("facebook")}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center">
                              <BsFacebook className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs text-gray-600">
                              페이스북
                            </span>
                          </button>
                          <button
                            onClick={() => handleShare("instagram")}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center">
                              <FaInstagram className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs text-gray-600">
                              인스타그램
                            </span>
                          </button>
                          <button
                            onClick={() => handleShare("link")}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                              <HiOutlineLink className="w-6 h-6 text-gray-600" />
                            </div>
                            <span className="text-xs text-gray-600">
                              링크 복사
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* 리뷰 작성 모달 */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">리뷰 작성123</h3>
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewContent("");
                    setReviewTitle("");
                    setRating(5);
                    setReviewImages([]);
                    setEditingReview(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  평점
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isHalf = rating === star - 0.5;
                    const isFull = rating >= star;
                    return (
                      <div key={star} className="relative">
                        <div className="text-2xl text-gray-300">★</div>
                        <div
                          className={`absolute inset-0 text-2xl text-yellow-400 overflow-hidden ${
                            isHalf ? "w-1/2" : isFull ? "w-full" : "w-0"
                          }`}
                        >
                          ★
                        </div>
                        <button
                          onClick={() => setRating(star)}
                          className="absolute inset-0 w-1/2"
                        />
                        <button
                          onClick={() => setRating(star - 0.5)}
                          className="absolute inset-0 w-1/2 left-1/2"
                        />
                      </div>
                    );
                  })}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="리뷰 제목을 입력하세요"
                  className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사진 첨부
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {reviewImages.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={getImageUrl(image.fileUrl)}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setReviewImages((prev) => {
                            const newImages = [...prev];
                            newImages.splice(index, 1);
                            return newImages;
                          });
                        }}
                        className="absolute top-1 right-1 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                      >
                        <HiOutlineXMark className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {reviewImages.length < 10 && (
                    <label
                      htmlFor="review-image-upload"
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <HiOutlinePhoto className="w-8 h-8 text-gray-400 mb-1" />
                      <span className="text-sm text-gray-500">사진 추가</span>
                      <input
                        id="review-image-upload"
                        type="file"
                        onChange={handleReviewImageUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  리뷰 내용
                </label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="여행에 대한 리뷰를 작성해주세요..."
                  className="w-full p-3 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewContent("");
                    setReviewTitle("");
                    setRating(5);
                    setReviewImages([]);
                    setEditingReview(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={!reviewContent.trim() || !reviewTitle.trim()}
                  className={`px-4 py-2 rounded-lg ${
                    reviewContent.trim() && reviewTitle.trim()
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  작성하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 에러 모달 */}
        <ErrorModal
          isOpen={showErrorModal}
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />

        {/* 이미지 모달 */}
        <AnimatePresence>
          {showImageModal && (
            <ImageModal
              isOpen={showImageModal}
              onClose={() => setShowImageModal(false)}
              images={trip.images}
              initialIndex={selectedImageIndex}
            />
          )}
        </AnimatePresence>

        {/* 리뷰 이미지 모달 */}
        <AnimatePresence>
          {showReviewImageModal && (
            <ReviewImageModal
              isOpen={showReviewImageModal}
              onClose={() => setShowReviewImageModal(false)}
              images={selectedReviewImages}
              initialIndex={selectedReviewImageIndex}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
