"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import instance from "@/app/api/axios";
import { useUser } from "@/hooks/useUser";

function PaymentRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const paymentId = searchParams.get("paymentId");
  const transactionType = searchParams.get("transactionType");
  const status = searchParams.get("status");
  const txId = searchParams.get("txId");
  const errorCode = searchParams.get("errorCode");
  const errorMessage = searchParams.get("errorMessage");
  const totalAmount = searchParams.get("totalAmount");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handlePaymentRedirect = async () => {
      if (!tripId) return;

      try {
        // 결제 취소 또는 실패 시
        if (transactionType !== "PAYMENT") {
          const errorMsg = errorMessage || "결제가 취소되었습니다.";
          alert(errorMsg);
          router.push(`/trip/${tripId}`);
          return;
        }

        // 결제 정보 저장
        const paymentData = {
          paymentId: paymentId,
          transactionType: "PAYMENT",
          txId: txId, // paymentId를 txId로 사용
          userId: user?.id,
          productId: tripId,
          productName: "",
          amount: "",
          currency: "KRW",
          paymentMethod: "SIMPLE",
          paymentStatus: "COMPLETED",
          paymentDate: new Date().toISOString(),
          cardInfo: "****-****-****-****",
        };

        const saveResponse = await instance.post("/api/payments", paymentData);
        if (saveResponse.status === 200) {
          console.log("결제 정보 저장 성공");
          router.push(`/payment/complete?tripId=${tripId}`);
        } else {
          throw new Error("결제 정보 저장 실패");
        }
      } catch (error) {
        console.error("결제 정보 저장 실패:", error);
        alert("결제 정보를 처리하는데 실패했습니다.");
        router.push(`/trip/${tripId}`);
      } finally {
        setLoading(false);
      }
    };

    handlePaymentRedirect();
  }, [
    tripId,
    router,
    user?.id,
    paymentId,
    status,
    errorCode,
    errorMessage,
    orderName,
    totalAmount,
  ]);

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
