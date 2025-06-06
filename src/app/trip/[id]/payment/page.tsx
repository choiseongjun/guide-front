"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import instance from "@/app/api/axios";
import PortOne from "@portone/browser-sdk/v2";
import { getImageUrl } from "@/app/common/imgUtils";
import Script from "next/script";

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

export default function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user } = useUser();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"simple" | "card">(
    "simple"
  );
  const [isLoading, setIsLoading] = useState(false);

  const resolvedParams = use(params);
  const searchParams = useSearchParams();

  const message = searchParams?.get("message");




  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await instance.get(
          `/api/v1/travels/${resolvedParams.id}`
        );
        if (response.data.status === 200) {
          setTrip(response.data.data);
        }
      } catch (error) {
        console.error("여행 정보 조회 실패:", error);
      }
    };

    fetchTrip();
  }, [resolvedParams.id]);

  function randomId() {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, "0"))
      .join("");
  }

  // const sendParticipant = async () => {
  //   try {
  //     const response = await instance.post(
  //       `/api/v1/travels/${resolvedParams.id}/participants`,
  //       {
  //         message,
  //       }
  //     );

  //     if (response.data.status === 200) {
  //       // router.push(`/trip/${resolvedParams.id}/payment`);
  //       router.push(`/payment/complete?tripId=${resolvedParams.id}`);
  //     } else {
  //       alert("참여 신청에 실패했습니다.");
  //     }
  //   } catch (error) {
  //     console.error("참여 신청 실패:", error);
  //     alert("참여 신청에 실패했습니다.");
  //   }
  // };
  // const handlePayment = async () => {
  //   if (!trip) return;

  //   const orderName = trip.title;
  //   const totalAmount = finalPrice;

  //   if (totalAmount > 0) {
  //     console.log("결제 진행:", paymentMethod);
  //     const payment = await PortOne.requestPayment({
  //       storeId: process.env.NEXT_PUBLIC_PG_STORE_ID as string,
  //       channelKey: process.env.NEXT_PUBLIC_PG_PAY_CHANNEL_ID as string,
  //       paymentId: randomId(),
  //       orderName: orderName,
  //       totalAmount: totalAmount,
  //       currency: "KRW" as any,
  //       payMethod: "CARD",
  //       redirectUrl: `${window.location.origin}/payment/redirect?tripId=${trip.id}&totalAmount=${finalPrice}`,
  //       customData: {
  //         tripId: trip.id,
  //         totalAmount: finalPrice,
  //       },
  //     });
  //     console.log("결제 결과:", payment);
  //     if (payment?.transactionType === "PAYMENT") {
  //       sendParticipant();
  //       try {
  //         const paymentData = {
  //           paymentId: payment.paymentId,
  //           transactionType: payment.transactionType,
  //           txId: payment.txId,
  //           userId: user?.id,
  //           productId: trip.id,
  //           productName: trip.title,
  //           amount: finalPrice,
  //           currency: "KRW",
  //           paymentMethod: paymentMethod === "simple" ? "SIMPLE" : "SIMPLE",
  //           paymentStatus: "COMPLETED",
  //           paymentDate: new Date().toISOString(),
  //           hostUserKey: trip.user.id.toString(),
  //           cardInfo: "****-****-****-****",
  //         };

  //         const response = await instance.post("/api/payments", paymentData);
  //         if (response.status === 200) {
  //           console.log("결제 정보 저장 성공");
  //           router.push(`/payment/complete?tripId=${trip.id}`);
  //         }
  //       } catch (error) {
  //         console.error("결제 정보 저장 실패:", error);
  //         alert("결제 정보 저장에 실패했습니다.");
  //       }
  //     }
  //     console.log("결제 결과:", payment);
  //   } else {
  //     sendParticipant();
  //   }
  // };
  const handlePayment = () => {
    try {
      setIsLoading(true);

      if (typeof window !== "undefined") {
        const payElem: any = window;
        const { AUTHNICE } = payElem;

        AUTHNICE.requestPay({
          clientId: "S2_73d2b43644334db8a44f9280c07f6388", // 테스트용 가맹점 식별코드
          method: "card",
          orderId: `TRIP_${Date.now()}`,
          amount: finalPrice,
          tripId: trip?.id,
          goodsName: trip?.title || "맞춤 여행 계획",
          returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/result?tripId=${trip?.id}&message=${message}&userId=${user?.id}`,
          failUrl: window.location.href,
          fnSuccess: (result: any) => {
            console.log("Payment result:", result);
            console.log("Transaction ID (tid):", result.tid);
          },
          fnError: (error: any) => {
            console.error("Payment error:", error);
            alert("결제 처리 중 오류가 발생했습니다.");
            setIsLoading(false);
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  if (!trip) {
    return null;
  }



  const finalPrice = trip.discountedPrice || trip.price;
  const location = `${trip.address} ${trip.detailAddress}`;

  return (
    <div className="min-h-screen bg-gray-50">
            <Script type="text/javascript" src="https://pay.nicepay.co.kr/v1/js/" />

      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <HiOutlineArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold ml-4">결제</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* 여행 썸네일 */}
        <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
          {trip.images[0] && (
            <Image
              src={getImageUrl(trip.images[0].imageUrl)}
              alt={trip.title}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* 여행 정보 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">{trip.title}</h2>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center">
              <HiOutlineCalendar className="w-5 h-5 mr-2" />
              <span>
                {new Date(trip.startDate).toLocaleDateString()} ~{" "}
                {new Date(trip.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <HiOutlineMapPin className="w-5 h-5 mr-2" />
              <span>{location}</span>
            </div>
            <div className="flex items-center">
              <HiOutlineUserGroup className="w-5 h-5 mr-2" />
              <span>
                현재 {trip.currentParticipants || 0}명 / 최대{" "}
                {trip.maxParticipants}명
              </span>
            </div>
          </div>
        </div>

        {/* 여행 설명 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">여행 소개</h3>
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

        {/* 결제 금액 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">결제 금액</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">참가비</span>
            <div className="text-right">
              {trip.discountRate > 0 && (
                <span className="text-gray-400 line-through mr-2">
                  {trip.price.toLocaleString()}원
                </span>
              )}
              <span className="text-xl font-bold text-blue-600">
                {finalPrice.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 환불 규정 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">환불 규정</h3>
          <div className="text-gray-600 space-y-2">
            <p>• 여행 시작 3일 전까지: 전액 환불</p>
            <p>• 여행 시작 3일 이내: 환불 불가</p>
            <p className="text-sm text-gray-500 mt-2">
              * 환불은 결제 수단으로 자동 처리됩니다.
            </p>
          </div>
        </div>

        {/* 결제 수단 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">결제 수단</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="simple"
                checked={paymentMethod === "simple"}
                onChange={() => setPaymentMethod("simple")}
                className="w-4 h-4 text-blue-600"
              />
              <span>간편결제</span>
            </label>
            {/* <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="w-4 h-4 text-blue-600"
              />
              <span>카드결제</span>
            </label> */}
          </div>
        </div>

        {/* 결제하기 버튼 */}
        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {finalPrice > 0
            ? finalPrice.toLocaleString() + "원 결제하기"
            : "무료로 참여하기"}
        </button>
      </div>
    </div>
  );
}
