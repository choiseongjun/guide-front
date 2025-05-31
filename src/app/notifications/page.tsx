"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiXMark, HiOutlineBell, HiOutlineCheck } from "react-icons/hi2";
import Image from "next/image";
import instance from "@/app/api/axios";
import { useNotificationCount } from "@/hooks/useNotificationCount";

interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  read: boolean;
  createdAt: string;
  imageUrl?: string;
}

export default function NotificationPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { decrementCount } = useNotificationCount();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await instance.get("/api/v1/notifications/me");
      console.log("response==", response.data);
      if (response.data.status === 200) {
        setNotifications(response.data.data.content);
      }
    } catch (error) {
      console.error("알림 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.read) return;

    try {
      const response = await instance.patch(`/api/v1/notifications/${notification.id}/read`);
      if (response.data.status === 200) {
        setNotifications(prevNotifications =>
          prevNotifications.map(n =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
        decrementCount();
      }
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / (24 * 60))}일 전`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
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
            <h1 className="text-lg font-semibold">알림</h1>
            <div className="w-6" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">새로운 알림이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications?.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.read && handleNotificationClick(notification)}
                className={`bg-white rounded-lg shadow p-4 ${
                  !notification.read 
                    ? "cursor-pointer hover:bg-blue-50 border-l-4 border-blue-500" 
                    : "opacity-60 cursor-default"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      {notification.read && (
                        <HiOutlineCheck className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(notification.createdAt)}
                    </p>
                    {notification.imageUrl && (
                      <div className="mt-3 relative w-full h-40 rounded-lg overflow-hidden">
                        <Image
                          src={notification.imageUrl}
                          alt="알림 이미지"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {!notification.read && (
                    <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}