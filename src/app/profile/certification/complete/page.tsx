"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import instance from "@/app/api/axios";

export default function CertificationCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCertificationComplete = async () => {
      try {
        const code = searchParams.get("code");
        const identityVerificationId = searchParams.get("identityVerificationId");

        if (!code || !identityVerificationId) {
          alert("본인인증 정보가 올바르지 않습니다.");
          router.push("/profile");
          return;
        }

        // 본인인증 완료 처리 API 호출
        const response = await instance.post("/api/v1/users/certification/complete", {
          code,
          identityVerificationId,
        });

        if (response.status === 200) {
          // 성공 메시지 표시 후 프로필 페이지로 이동
          setTimeout(() => {
            router.push("/profile");
          }, 2000);
        }
      } catch (error) {
        console.error("본인인증 완료 처리 실패:", error);
        alert("본인인증 처리 중 오류가 발생했습니다.");
        router.push("/profile");
      }
    };

    handleCertificationComplete();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4 text-center">
        <div className="flex justify-center mb-6">
          <HiOutlineCheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          본인인증이 완료되었습니다
        </h1>
        <p className="text-gray-600 mb-8">
          잠시 후 프로필 페이지로 이동합니다.
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
} 