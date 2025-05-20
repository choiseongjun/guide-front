"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineCamera,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { motion } from "framer-motion";

export default function AccountPage() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(
    "/images/default-profile.svg"
  );
  const [nickname, setNickname] = useState("여행러");
  const [email, setEmail] = useState("traveler@example.com");
  const [phone, setPhone] = useState("010-1234-5678");
  const [birthDate] = useState("1990-01-01");
  const [gender, setGender] = useState("남성");
  const [nationality, setNationality] = useState("대한민국");
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: 저장 로직 구현
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시 딜레이
    setIsSaving(false);
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiOutlineArrowLeft className="w-6 h-6 text-gray-600" />
            </motion.button>
            <h1 className="text-lg font-medium ml-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              계정 설정
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 프로필 이미지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg bg-gray-100">
                <Image
                  src={profileImage}
                  alt="프로필 이미지"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/default-profile.svg";
                  }}
                />
              </div>
              <label
                htmlFor="profile-image"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <HiOutlineCamera className="w-8 h-8 text-white" />
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <h2 className="mt-4 text-base font-medium text-gray-800 tracking-tight">
              프로필 이미지
            </h2>
            <p className="text-sm text-gray-500 mt-1 tracking-tight">
              클릭하여 이미지 변경
            </p>
          </div>
        </motion.div>

        {/* 계정 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="divide-y divide-gray-100">
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 tracking-tight">
                닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base tracking-tight placeholder:text-gray-400"
                placeholder="닉네임을 입력하세요"
              />
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 tracking-tight">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base tracking-tight placeholder:text-gray-400"
                placeholder="이메일을 입력하세요"
              />
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 tracking-tight">
                전화번호
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base tracking-tight placeholder:text-gray-400"
                placeholder="전화번호를 입력하세요"
              />
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 tracking-tight">
                생년월일
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={birthDate}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base tracking-tight text-gray-600"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <HiOutlineLockClosed className="w-5 h-5" />
                </div>
              </div>
              <p className="mt-1.5 text-xs text-gray-500 tracking-tight">
                생년월일은 변경할 수 없습니다
              </p>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 tracking-tight">
                성별
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base tracking-tight"
              >
                <option value="남성">남성</option>
                <option value="여성">여성</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 tracking-tight">
                국적
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base tracking-tight placeholder:text-gray-400"
                placeholder="국적을 입력하세요"
              />
            </div>
          </div>
        </motion.div>

        {/* 저장 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-4 rounded-xl text-white font-medium text-base tracking-tight transition-all ${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {isSaving ? "저장 중..." : "저장하기"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
