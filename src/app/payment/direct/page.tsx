"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function DirectPaymentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
          amount: 1000,
          goodsName: "맞춤 여행 계획",
          returnUrl: `${window.location.origin}/payment/complete`,
          failUrl: `${window.location.origin}/payment/fail`,
          dbProcessUrl: `${window.location.origin}/api/payment/complete`,
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

  return (
    <>
      <Script type="text/javascript" src="https://pay.nicepay.co.kr/v1/js/" />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">결제하기</h1>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="font-semibold mb-2">결제 정보</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품명</span>
                  <span>맞춤 여행 계획</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제 금액</span>
                  <span className="font-bold">10,000원</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {isLoading ? "결제 처리 중..." : "결제하기"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
