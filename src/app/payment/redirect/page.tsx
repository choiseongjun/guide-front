"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import instance from "@/app/api/axios";
import { useUser } from "@/hooks/useUser";

function PaymentRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handlePaymentRedirect = async () => {
      if (!tripId) return;

      try {
        // 결제 정보 조회
        const response = await instance.get(
          `/api/payments/latest?tripId=${tripId}`
        );
        if (response.data.status === 200) {
          const payment = response.data.data;

          // 결제 성공 시
          if (payment?.transactionType === "PAYMENT") {
            // 결제 정보 저장
            const paymentData = {
              paymentId: payment.paymentId,
              transactionType: payment.transactionType,
              txId: payment.txId,
              userId: user?.id,
              productId: tripId,
              productName: payment.orderName,
              amount: payment.totalAmount,
              currency: "KRW",
              paymentMethod: "SIMPLE",
              paymentStatus: "COMPLETED",
              paymentDate: new Date().toISOString(),
              hostUserKey: payment.customData?.hostUserKey,
              cardInfo: "****-****-****-****",
            };

            const saveResponse = await instance.post(
              "/api/payments",
              paymentData
            );
            if (saveResponse.status === 200) {
              console.log("결제 정보 저장 성공");
              router.push(`/payment/complete?tripId=${tripId}`);
            } else {
              throw new Error("결제 정보 저장 실패");
            }
          } else {
            // 결제 실패 시
            alert("결제에 실패했습니다.");
            router.push(`/trip/${tripId}`);
          }
        }
      } catch (error) {
        console.error("결제 정보 조회/저장 실패:", error);
        alert("결제 정보를 처리하는데 실패했습니다.");
        router.push(`/trip/${tripId}`);
      } finally {
        setLoading(false);
      }
    };

    handlePaymentRedirect();
  }, [tripId, router, user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return null;
}

export default function PaymentRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <PaymentRedirectContent />
    </Suspense>
  );
}
