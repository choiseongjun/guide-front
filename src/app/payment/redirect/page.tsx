"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import instance from "@/app/api/axios";

export default function PaymentRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handlePaymentRedirect = async () => {
      try {
        // URL 파라미터에서 필요한 정보 추출
        const paymentId = searchParams.get("paymentId");
        const status = searchParams.get("status");
        const errorCode = searchParams.get("errorCode");
        const errorMessage = searchParams.get("errorMessage");
        const tripId = searchParams.get("tripId");
        
        console.log("전체 URL 파라미터:", Object.fromEntries(searchParams.entries()));
        console.log("tripId=", tripId);
        console.log("status===", status);
        console.log("errorCode===", errorCode);

        if (!tripId) {
          console.error("tripId를 찾을 수 없습니다.");
          return;
        }

        // 결제 취소 또는 실패 시 바로 결제 페이지로 이동
        if (status !== "DONE" || errorCode === "FAILURE_TYPE_PG" || errorCode === "PAY_PROCESS_CANCELED") {
          const errorMsg = errorMessage || "결제가 취소되었습니다.";
          alert(errorMsg);
          router.push(`/trip/${tripId}/payment`);
          return;
        }

        // 결제 성공 처리
        const response = await instance.post("/api/v1/payments/complete", {
          paymentId,
          tripId,
        });

        if (response.data.status === 200) {
          // 결제 성공 후 여행 상세 페이지로 이동
          router.push(`/trip/${tripId}`);
        }
      } catch (error) {
        console.error("결제 처리 중 오류 발생:", error);
        alert("결제 처리 중 오류가 발생했습니다.");
        router.push("/");
      }
    };

    handlePaymentRedirect();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">결제를 처리중입니다...</p>
      </div>
    </div>
  );
} 