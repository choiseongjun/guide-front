"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  HiOutlineArrowLeft,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineUserGroup,
  HiOutlineMap,
  HiOutlineCalendar,
} from "react-icons/hi2";
import { log } from "console";
import axios from "axios";
import instance from "../api/axios";

type LoginClientProps = {
  params: { id: string };
};

export default function LoginClient({ params }: LoginClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams) {
      const code = searchParams.get("code");
      console.log("code==", code);

      if (code) {
        handleKakaoLogin(code);
      }
    }

    // 환경 변수 디버깅
    console.log("All env variables:", {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    // FCM 토큰 확인
    const checkFcmToken = () => {
      const fcmInput = document.querySelector('input[name="fcmToken"]') as HTMLInputElement;
      if (fcmInput) {
        setFcmToken(fcmInput.value);
      }
    };

    // 초기 확인
    checkFcmToken();

    // MutationObserver를 사용하여 DOM 변경 감지
    const observer = new MutationObserver(checkFcmToken);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [searchParams]);

  const handleKakaoLogin = async (code: string) => {
    try {
      const response = await instance.post(`/api/auth/kakao`, {
        code: code,
      });

      if (response.status === 200) {
        const { accessToken, refreshToken, user } = response.data;
        console.log("user=", user);

        // 토큰 저장 (at, rt로 키 이름 변경)
        localStorage.setItem("at", accessToken);
        localStorage.setItem("rt", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // 로그인 성공 후 사용자 정보 갱신을 위해 커스텀 이벤트 발생
        window.dispatchEvent(new Event("loginChange"));

        // 메인 페이지로 리다이렉션
        router.push("/");
      }
    } catch (error) {
      console.error("카카오 로그인 에러:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };
  const handleKakaoLoginClick = () => {

    // 임시로 하드코딩된 URL 사용
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login/page`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 전화번호 형식 정리 (하이픈 제거)
      const cleanPhone = phone.replace(/-/g, "");

      console.log("로그인 요청 데이터:", {
        phone: cleanPhone,
        password: password,
      });

      const response = await instance.post(`/api/v1/users/login`, {
        phoneNumber: cleanPhone, // phone -> phoneNumber로 변경
        password: password,
      });

      console.log("로그인 응답:", response.data);

      if (response.status === 200) {
        const { accessToken, refreshToken, user } = response.data;

        // 토큰 저장
        localStorage.setItem("at", accessToken);
        localStorage.setItem("rt", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // 로그인 성공 후 사용자 정보 갱신을 위해 커스텀 이벤트 발생
        window.dispatchEvent(new Event("loginChange"));

        // 메인 페이지로 리다이렉션
        router.push("/");
      }
    } catch (error: any) {
      console.error("로그인 에러:", error);
      if (error.response) {
        // 서버에서 응답이 왔지만 에러인 경우
        console.error("에러 응답 데이터:", error.response.data);
        console.error("에러 응답 상태:", error.response.status);
        console.error("에러 응답 헤더:", error.response.headers);
        setError(error.response.data.message || "로그인에 실패했습니다.");
      } else if (error.request) {
        // 요청은 보냈지만 응답이 없는 경우
        console.error("요청 에러:", error.request);
        setError("서버와 통신할 수 없습니다.");
      } else {
        // 요청 설정 중 에러가 발생한 경우
        console.error("에러 메시지:", error.message);
        setError("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <HiOutlineArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 로그인 폼 */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full shadow-lg animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-24 h-24">
                {/* 여행 가방 */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <HiOutlineUserGroup className="w-5 h-5 text-white" />
                  </div>
                </div>
                {/* 지도 */}
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                    <HiOutlineMap className="w-5 h-5 text-white" />
                  </div>
                </div>
                {/* 캘린더 */}
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <HiOutlineCalendar className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            함께하는 여행
          </h1>
          <p className="text-gray-600 mt-2">
            여러분의 특별한 여행을 함께 만들어요
          </p>
           {/* FCM 토큰 디버그 표시 */}
       
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
        {fcmToken && (
          <div className="">
            <p className="font-mono">FCM Token: {fcmToken}</p>
          </div>
        )}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              전화번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlinePhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="전화번호를 입력하세요"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="text-blue-600 hover:text-blue-500"
            >
              회원가입
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/find-id")}
                className="text-blue-600 hover:text-blue-500"
              >
                아이디 찾기
              </button>
              <button
                type="button"
                onClick={() => router.push("/find-password")}
                className="text-blue-600 hover:text-blue-500"
              >
                비밀번호 찾기
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>

          {/* 둘러보기 버튼 */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            둘러보기
          </button>
        </form>

        {/* 소셜 로그인 */}
        <div className="mt-8">
          <h2 className="text-center text-sm font-medium text-gray-700 mb-4">
            소셜 계정으로 로그인
          </h2>
          <div className="flex justify-center">
            <button
              className="w-full h-[45px] p-1 rounded-lg focus:outline-none transition-colors"
              onClick={handleKakaoLoginClick}
            >
              <Image
                src="/images/login/kakao_login_large_narrow.png"
                alt="카카오 로그인"
                width={300}
                height={45}
                className="w-full h-[45px] object-cover rounded-lg"
                style={{ height: "45px", width: "100%" }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
