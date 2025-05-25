"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import instance from "@/app/api/axios";

interface NotificationSettings {
  emailNotification: boolean;
  pushNotification: boolean;
  marketingNotification: boolean;
  tripNotification: boolean;
  chatNotification: boolean;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotification: true,
    pushNotification: true,
    marketingNotification: false,
    tripNotification: true,
    chatNotification: true,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await instance.get("/api/v1/users/me/notifications");
        if (response.data.status === 200) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error("알림 설정 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationSettings();
  }, []);

  const handleToggle = async (key: keyof NotificationSettings) => {
    try {
      setIsSubmitting(true);
      const newSettings = { ...settings, [key]: !settings[key] };
      
      const response = await instance.put("/api/v1/users/me/notifications", {
        [key]: !settings[key]
      });

      if (response.data.status === 200) {
        setSettings(newSettings);
      }
    } catch (error) {
      console.error("알림 설정 변경 실패:", error);
      alert("알림 설정 변경에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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
            <h1 className="text-xl font-bold ml-4">알림 설정</h1>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm">
          {/* 이메일 알림 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h3 className="font-medium">이메일 알림</h3>
              <p className="text-sm text-gray-500">이메일로 알림을 받습니다</p>
            </div>
            <button
              onClick={() => handleToggle("emailNotification")}
              disabled={isSubmitting}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.emailNotification ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotification ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* 푸시 알림 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h3 className="font-medium">푸시 알림</h3>
              <p className="text-sm text-gray-500">앱 푸시 알림을 받습니다</p>
            </div>
            <button
              onClick={() => handleToggle("pushNotification")}
              disabled={isSubmitting}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.pushNotification ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.pushNotification ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* 마케팅 알림 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h3 className="font-medium">마케팅 알림</h3>
              <p className="text-sm text-gray-500">이벤트 및 프로모션 알림을 받습니다</p>
            </div>
            <button
              onClick={() => handleToggle("marketingNotification")}
              disabled={isSubmitting}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.marketingNotification ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.marketingNotification ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* 여행 알림 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h3 className="font-medium">여행 알림</h3>
              <p className="text-sm text-gray-500">여행 관련 업데이트를 받습니다</p>
            </div>
            <button
              onClick={() => handleToggle("tripNotification")}
              disabled={isSubmitting}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.tripNotification ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.tripNotification ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* 채팅 알림 */}
          <div className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-medium">채팅 알림</h3>
              <p className="text-sm text-gray-500">새로운 메시지 알림을 받습니다</p>
            </div>
            <button
              onClick={() => handleToggle("chatNotification")}
              disabled={isSubmitting}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.chatNotification ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.chatNotification ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 