"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { HiOutlineCheckCircle, HiOutlineHome } from "react-icons/hi2";
import instance from "@/app/api/axios";
import { getImageUrl } from "@/app/common/imgUtils";
import { useNotificationCount } from "@/hooks/useNotificationCount";

interface Trip {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  address: string;
  detailAddress: string;
  price: number;
  discountRate: number;
  discountedPrice: number;
  minParticipants: number;
  maxParticipants: number;
  currentParticipants: number | null;
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
}

// 클라이언트 컴포넌트
function PaymentCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams?.get("tripId");
  const message = searchParams?.get("message");
  const finalPrice = searchParams?.get("finalPrice");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { refreshCount } = useNotificationCount();
  const [paymentResult, setPaymentResult] = useState<any>(null);


  // const sendParticipant = async () => {
  //   try {
  //     const response = await instance.post(
  //       `/api/v1/travels/${tripId}/participants`,
  //       {
  //         message,
  //       }
  //     );

  //     if (response.data.status === 200) {
  //       // router.push(`/trip/${resolvedParams.id}/payment`);
  //       // router.push(`/payment/complete?tripId=${tripId}`);
  //     } else {
  //       alert("참여 신청에 실패했습니다.");
  //     }
  //   } catch (error) {
  //     console.error("참여 신청 실패:", error);
  //     alert("참여 신청에 실패했습니다.");
  //   }
  // };
  useEffect(() => {
    // URL 파라미터에서 결제 응답값 가져오기
    console.log("All search params:", Object.fromEntries(searchParams?.entries() || []));

    // sendParticipant()

    const paymentData = {
      authResultCode: searchParams?.get('authResultCode'),
      authResultMsg: searchParams?.get('authResultMsg'),
      tid: searchParams?.get('tid'),
      clientId: searchParams?.get('clientId'),
      orderId: searchParams?.get('orderId'),
      amount: searchParams?.get('amount'),
      mallReserved: searchParams?.get('mallReserved'),
      authToken: searchParams?.get('authToken'),
      signature: searchParams?.get('signature')
    };

    console.log("Payment data from URL:", paymentData);
    
    // 결제 결과가 있는 경우에만 처리
    if (paymentData.authResultCode || paymentData.tid) {
      setPaymentResult(paymentData);
      // 결제 성공 시 서버로 데이터 전송
      if (paymentData.authResultCode === '0000') {
        instance.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/approve`, paymentData)
          .then(response => {
            
            console.log('Payment approved:', response.data);
          })
          .catch(error => {
            console.error('Failed to approve payment:', error);
          });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) return;
      try {
        const response = await instance.get(`/api/v1/travels/${tripId}`);
        if (response.data.status === 200) {
          setTrip(response.data.data);
        }
      } catch (error) {
        console.error("여행 정보 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (loading || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* 결제 응답 정보 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">결제 응답 정보</h3>
          <div className="space-y-2 text-sm">
            {paymentResult && Object.entries(paymentResult).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium text-gray-600">{key}:</span>
                <span className="text-gray-800">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 성공 메시지 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <HiOutlineCheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            참여 신청이 완료되었습니다!
          </h1>
          <p className="text-gray-600">여행 일정에 맞춰 준비해 주세요.</p>
        </div>

        {/* 여행 정보 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            {trip.images[0] && (
              <Image
                src={getImageUrl(trip.images[0].imageUrl)}
                alt={trip.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <h2 className="text-xl font-bold mb-4">{trip.title}</h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-semibold">여행 기간:</span>{" "}
              {new Date(trip.startDate).toLocaleDateString()} ~{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">여행 장소:</span> {trip.address}{" "}
              {trip.detailAddress}
            </p>
            {/* <p>
              <span className="font-semibold">참가 인원:</span>{" "}
              {trip.currentParticipants || 0}명 / {trip.maxParticipants}명
            </p> */}
            <p>
              <span className="font-semibold">결제 금액:</span>{" "}
              {(trip.discountedPrice || trip.price).toLocaleString()}원
            </p>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">안내사항</h3>
          <ul className="text-blue-700 space-y-2">
            <li>• 여행 시작 3일 전까지 전액 환불이 가능합니다.</li>
            <li>• 여행 시작 3일 이내에는 환불이 불가능합니다.</li>
            <li>• 여행 일정 변경이나 취소는 호스트에게 문의해 주세요.</li>
          </ul>
        </div>

        {/* 홈으로 가기 버튼 */}
        <button
          onClick={() => router.push("/")}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <HiOutlineHome className="w-5 h-5 mr-2" />
          홈으로 가기
        </button>
      </div>
    </div>
  );
}

export default function PaymentCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <PaymentCompleteContent />
    </Suspense>
  );
}
