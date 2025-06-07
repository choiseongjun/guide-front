"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlineCamera } from "react-icons/hi2";
import instance from "@/app/api/axios";
import { useUser } from "@/hooks/useUser";
import { getImageUrl } from "@/app/common/imgUtils";

interface ProfileData {
  nickname: string;
  email: string;
  phoneNumber: string;
  introduction: string;
  profileImageUrl: string | null;
  birthDate: string;
  gender: string;
  bankName: string;
  bankCode: string;
  bankAccountNumber: string;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [profileData, setProfileData] = useState<ProfileData>({
    nickname: "",
    email: "",
    phoneNumber: "",
    introduction: "",
    profileImageUrl: null,
    birthDate: "",
    gender: "",
    bankName: "",
    bankCode: "",
    bankAccountNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await instance.get("/api/v1/users/me");
        if (response.data.status === 200) {
          const data = response.data.data;
          setProfileData({
            nickname: data.nickname || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            introduction: data.introduction || "",
            profileImageUrl: data.profileImageUrl || null,
            birthDate: data.birthDate || "",
            gender: data.gender || "",
            bankName: data.bankName || "",
            bankCode: data.bankCode || "",
            bankAccountNumber: data.bankAccountNumber || "",
          });
        }
      } catch (error) {
        console.error("프로필 정보 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pathType", "profile");

    try {
      const response = await instance.post("/api/v1/s3/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);
      if (response.status === 200) {
        const imageUrl = response.data.fileUrl;
        setProfileData((prev) => ({
          ...prev,
          profileImageUrl: imageUrl,
        }));

        // await instance.put("/api/v1/users/me/profile", {
        //   ...profileData,
        //   profileImageUrl: imageUrl
        // });
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  // 전화번호 포맷팅 함수 추가
  const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/-/g, "");
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
        7
      )}`;
    }
    return phoneNumber;
  };

  // 전화번호에서 하이픈 제거하는 함수
  const removeHyphens = (phoneNumber: string) => {
    return phoneNumber.replace(/-/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await instance.put("/api/v1/users/me/profile", {
        nickname: profileData.nickname,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        introduction: profileData.introduction,
        profileImageUrl: profileData.profileImageUrl,
      });

      if (response.data.status === 200) {
        alert("프로필이 수정되었습니다.");
        router.push("/profile");
      }
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading || loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <HiOutlineArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-4">프로필 수정</h1>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              <Image
                src={
                  (profileData.profileImageUrl
                    ? getImageUrl(profileData.profileImageUrl)
                    : null) ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60"
                }
                alt="프로필 이미지"
                fill
                className="object-cover"
              />
              <label
                htmlFor="profile-image"
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
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
            <p className="text-sm text-gray-500 mt-2">프로필 이미지 변경</p>
          </div>

          {/* 닉네임 */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              value={profileData.nickname}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  nickname: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 이메일 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              전화번호
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formatPhoneNumber(profileData.phoneNumber)}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  phoneNumber: removeHyphens(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="010-0000-0000"
            />
          </div>

          {/* 자기소개 */}
          <div>
            <label
              htmlFor="introduction"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              자기소개
            </label>
            <textarea
              id="introduction"
              value={profileData.introduction}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  introduction: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="자기소개를 입력해주세요"
            />
          </div>

          {/* 성별 */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              성별
            </label>
            <select
              id="gender"
              value={profileData.gender}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택해주세요</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
              <option value="OTHER">기타</option>
            </select>
          </div>

          {/* 생년월일 */}
          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              생년월일
            </label>
            <input
              type="date"
              id="birthDate"
              value={profileData.birthDate}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  birthDate: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 정산 계좌 정보 섹션 */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">정산 계좌 정보</h2>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="bankName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    은행명
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    value={profileData.bankName || ""}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        bankName: e.target.value || "",
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="은행명을 입력하세요"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bankCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    은행 코드
                  </label>
                  <input
                    type="text"
                    id="bankCode"
                    value={profileData.bankCode || ""}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        bankCode: e.target.value || "",
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="은행 코드를 입력하세요"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bankAccountNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    계좌번호
                  </label>
                  <input
                    type="text"
                    id="bankAccountNumber"
                    value={profileData.bankAccountNumber || ""}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        bankAccountNumber: e.target.value || "",
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="계좌번호를 입력하세요"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {isSubmitting ? "저장 중..." : "저장하기"}
          </button>
        </form>
      </main>
    </div>
  );
}
