"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoginClient from "./LoginClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import instance from "../api/axios";

function LoginContent() {
  const searchParams = useSearchParams();
  const params = {
    id: searchParams.get('id') || ''
  };
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await instance.post("/api/auth/kakao/login", {
        code: code,
      });

      if (response.data.status === 200) {
        const { accessToken, refreshToken } = response.data.data;
        localStorage.setItem("at", accessToken);
        localStorage.setItem("rt", refreshToken);
        
        // 로그인 성공 후 사용자 정보 갱신을 위해 storage 이벤트 발생
        window.dispatchEvent(new Event('storage'));
        
        router.push("/");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return <LoginClient params={params} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
} 