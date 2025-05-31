"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiXMark } from "react-icons/hi2";
import instance from "@/app/api/axios";

interface NotificationSettings {
  emailNotification: boolean;
  pushNotification: boolean;
  marketingNotification: boolean;
  travelNotification: boolean;
  chatNotification: boolean;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotification: true,
    pushNotification: true,
    marketingNotification: true,
    travelNotification: true,
    chatNotification: true,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await instance.get("/api/v1/users/notification/settings");
        if (response.data.status === 200) {
          setNotificationSettings(response.data.data);
        }
      } catch (error) {
        console.error("알림 설정 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationSettings();
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const response = await instance.put('/api/v1/users/notification/settings', {
        emailNotification: notificationSettings.emailNotification,
        pushNotification: notificationSettings.pushNotification,
        marketingNotification: notificationSettings.marketingNotification,
        travelNotification: notificationSettings.travelNotification,
        chatNotification: notificationSettings.chatNotification
      });

      if (response.data.status === 200) {
        alert('알림 설정이 저장되었습니다.');
      }
    } catch (error) {
      console.error('알림 설정 저장 실패:', error);
      alert('알림 설정 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              <HiXMark className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">알림 설정</h1>
            <div className="w-6" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">알림 설정</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">이메일 알림</h3>
                    <p className="text-sm text-gray-500">이메일로 알림을 받습니다</p>
                  </div>
                  <button
                    onClick={() => handleToggle('emailNotification')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      notificationSettings.emailNotification ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">이메일 알림</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationSettings.emailNotification ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">푸시 알림</h3>
                    <p className="text-sm text-gray-500">푸시 알림을 받습니다</p>
                  </div>
                  <button
                    onClick={() => handleToggle('pushNotification')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      notificationSettings.pushNotification ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">푸시 알림</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationSettings.pushNotification ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">마케팅 알림</h3>
                    <p className="text-sm text-gray-500">마케팅 정보를 받습니다</p>
                  </div>
                  <button
                    onClick={() => handleToggle('marketingNotification')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      notificationSettings.marketingNotification ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">마케팅 알림</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationSettings.marketingNotification ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">여행 알림</h3>
                    <p className="text-sm text-gray-500">여행 관련 알림을 받습니다</p>
                  </div>
                  <button
                    onClick={() => handleToggle('travelNotification')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      notificationSettings.travelNotification ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">여행 알림</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationSettings.travelNotification ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">채팅 알림</h3>
                    <p className="text-sm text-gray-500">채팅 메시지 알림을 받습니다</p>
                  </div>
                  <button
                    onClick={() => handleToggle('chatNotification')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      notificationSettings.chatNotification ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">채팅 알림</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationSettings.chatNotification ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
} 