"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function AccountPage() {
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [nickname, setNickname] = useState("사용자");
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [reviewCount, setReviewCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);

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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">계정 설정</h1>

      <Card className="p-6">
        <div className="flex flex-col items-center space-y-6">
          {/* 프로필 이미지 */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={profileImage}
                alt="프로필 이미지"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* 사용자 정보 */}
          <div className="w-full max-w-md space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="birthDate">생년월일</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            </div>

            {/* 활동 통계 */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">리뷰 수</p>
                <p className="text-2xl font-bold">{reviewCount}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">찜 수</p>
                <p className="text-2xl font-bold">{wishCount}</p>
              </div>
            </div>

            <Button className="w-full mt-6">저장하기</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
