"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMapPin,
} from "react-icons/hi2";

// 임시 데이터 (실제로는 API에서 가져올 데이터)
const tripData = {
  id: 1,
  title: "제주도 3박 4일 힐링 여행",
  image:
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=60",
  duration: "4일",
  date: "2024-04-15",
  time: "09:00",
  location: "제주시",
  price: 450000,
  discountPrice: 380000,
  participants: "2-4명",
};

const refundPolicy = `환불 규정
- 여행 시작 7일 전: 전액 환불
- 여행 시작 3일 전: 50% 환불
- 여행 시작 1일 전: 환불 불가

* 천재지변, 호스트 사정으로 인한 여행 취소 시 전액 환불됩니다.`;

const termsAndConditions = `이용약관
1. 여행 참가자는 여행 일정을 준수해야 합니다.
2. 여행 중 발생하는 개인적인 사고나 질병에 대한 책임은 참가자 본인에게 있습니다.
3. 여행 중 발생하는 추가 비용은 참가자 부담입니다.
4. 여행 중 촬영된 사진은 홍보 목적으로 사용될 수 있습니다.`;

interface JoinTripClientProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function JoinTripClient({
  params,
  searchParams,
}: JoinTripClientProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [isAgreed, setIsAgreed] = useState(false);

  const handlePayment = () => {
    if (!isAgreed) {
      alert("이용약관에 동의해주세요.");
      return;
    }
    // TODO: 결제 로직 구현
    console.log("결제 진행", { paymentMethod });
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
            <h1 className="text-xl font-bold ml-4">여행 참가</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* 여행 정보 */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="relative h-48">
            <Image
              src={tripData.image}
              alt={tripData.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{tripData.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
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
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {tripData.participants}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm line-through text-gray-400">
                  {tripData.price.toLocaleString()}원
                </span>
                <span className="text-lg font-semibold text-blue-600">
                  {tripData.discountPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-4">결제 정보</h3>

          {/* 결제 금액 */}
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <span className="text-gray-600">결제 금액</span>
            <span className="text-lg font-semibold text-blue-600">
              {tripData.discountPrice.toLocaleString()}원
            </span>
          </div>

          {/* 환불 규정 */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">환불 규정</h4>
            <div className="text-sm text-gray-600 whitespace-pre-line">
              {refundPolicy}
            </div>
          </div>

          {/* 결제 수단 */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">결제 수단</h4>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="w-4 h-4 text-blue-600"
                />
                <span>신용카드</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="w-4 h-4 text-blue-600"
                />
                <span>계좌이체</span>
              </label>
            </div>
          </div>

          {/* 이용약관 동의 */}
          <div className="mb-6">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                결제내용, 환불 규정, 이용약관을 확인했으며 동의합니다.
              </label>
            </div>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 max-h-32 overflow-y-auto">
              {termsAndConditions}
            </div>
          </div>

          {/* 결제하기 버튼 */}
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
