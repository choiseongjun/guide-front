"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import instance from "@/app/api/axios";

function CertificationCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  if (!searchParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleCertificationComplete = async () => {
    try {
      const code = searchParams.get("code");
      const identityVerificationId = searchParams.get("identityVerificationId");

      if (!code || !identityVerificationId) {
        throw new Error("필수 파라미터가 누락되었습니다.");
      }

      const response = await instance.post("/api/v1/users/identity-verification/complete", {
        code,
        identityVerificationId,
      });

      if (response.status === 200) {
        router.push("/profile");
      }
    } catch (error) {
      console.error("본인인증 완료 처리 실패:", error);
      alert("본인인증 완료 처리에 실패했습니다.");
      router.push("/profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

export default function CertificationComplete() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CertificationCompleteContent />
    </Suspense>
  );
}
