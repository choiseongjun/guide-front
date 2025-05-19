"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlinePhone, HiOutlineLockClosed, HiOutlineUserGroup, HiOutlineMap, HiOutlineCalendar } from "react-icons/hi2";

type LoginClientProps = {
  params: { id: string };
};

export default function LoginClient({ params }: LoginClientProps) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 로직 구현
    console.log("Login attempt:", { phone, password });
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">함께하는 여행</h1>
          <p className="text-gray-600 mt-2">여러분의 특별한 여행을 함께 만들어요</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            로그인
          </button>
        </form>

        {/* 소셜 로그인 */}
        <div className="mt-8">
          <h2 className="text-center text-sm font-medium text-gray-700 mb-4">
            소셜 계정으로 로그인
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              Google
            </button>
            <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              Kakao
            </button>
            <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              Naver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 