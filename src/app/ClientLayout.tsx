"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
  HiOutlineStar,
  HiOutlineBell,
  HiOutlinePhone,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import { BsHeadset } from "react-icons/bs";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import GlobalLoading from "@/components/GlobalLoading";

// 임시 알림 데이터
const notifications = [
  { id: 1, type: "like", read: false },
  { id: 2, type: "comment", read: false },
  { id: 3, type: "follow", read: true },
];

// 임시 채팅 데이터
const chats = [
  { id: 1, unreadCount: 3 },
  { id: 2, unreadCount: 1 },
  { id: 3, unreadCount: 2 },
  { id: 4, unreadCount: 0 },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isNotificationsPage, setIsNotificationsPage] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [totalUnreadChats, setTotalUnreadChats] = useState(0);
  const [showSupportModal, setShowSupportModal] = useState(false);

  useEffect(() => {
    setIsNotificationsPage(pathname === "/notifications");

    // 읽지 않은 알림 개수 계산
    const unreadCount = notifications.filter((n) => !n.read).length;
    setUnreadNotifications(unreadCount);

    // 읽지 않은 채팅 메시지 총 개수 계산
    const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
    setTotalUnreadChats(totalUnread);
  }, [pathname]);

  // 현재 경로가 여행 관련 페이지인지 확인
  const isTravelPage = pathname === "/" || pathname.startsWith("/theme/");

  return (
    <>
      <GlobalLoading />
      <div className="main-container">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="flex items-center px-4 py-3 relative">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <HiOutlineGlobeAlt className="w-7 h-7 text-blue-500" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                </div>
              </motion.div>

              <div className="absolute left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-1">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    TripWithMe
                  </h1>
                  <HiOutlineMapPin className="w-5 h-5 text-pink-500" />
                </div>
              </div>

              <div className="flex items-center gap-1 ml-auto">
                <Link
                  href="/wishlist"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <HiOutlineHeart className="w-6 h-6" />
                </Link>
                <Link
                  href="/notifications"
                  className="text-gray-600 hover:text-blue-500 transition-colors relative"
                >
                  <HiOutlineBell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
                <div
                  onClick={() => setShowSupportModal(true)}
                  className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
                >
                  <BsHeadset className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="content">{children}</div>

        {!isNotificationsPage && !pathname.startsWith('/login') && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-around h-16">
                <Link
                  href="/"
                  className={`flex flex-col items-center flex-1 ${
                    isTravelPage ? "text-blue-500" : "text-gray-600"
                  }`}
                >
                  <HiOutlineHome className="w-6 h-6" />
                  <span className="text-xs mt-1">여행</span>
                </Link>
                <Link
                  href="/social"
                  className={`flex flex-col items-center flex-1 ${
                    pathname === "/social" ? "text-blue-500" : "text-gray-600"
                  }`}
                >
                  <HiOutlineUserGroup className="w-6 h-6" />
                  <span className="text-xs mt-1">소셜</span>
                </Link>
                <Link
                  href="/chat"
                  className={`flex flex-col items-center flex-1 relative ${
                    pathname === "/chat" ? "text-blue-500" : "text-gray-600"
                  }`}
                >
                  {totalUnreadChats > 0 && (
                    <span className="absolute -top-[0.5rem] -right-[-1.8rem] bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {totalUnreadChats}
                    </span>
                  )}
                  <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
                  <span className="text-xs mt-1">채팅</span>
                </Link>
                <Link
                  href="/profile"
                  className={`flex flex-col items-center flex-1 ${
                    pathname === "/profile"
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  <HiOutlineUser className="w-6 h-6" />
                  <span className="text-xs mt-1">마이</span>
                </Link>
              </div>
            </div>
          </nav>
        )}

        {showSupportModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowSupportModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">고객센터</h2>
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <HiOutlinePhone className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">전화 문의</p>
                    <p className="text-sm text-gray-600">02-1234-5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <HiOutlineChatBubbleLeftRight className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">카카오톡 문의</p>
                    <p className="text-sm text-gray-600">@TripWithMe</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <HiOutlineEnvelope className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">이메일 문의</p>
                    <p className="text-sm text-gray-600">
                      support@tripwithme.com
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center">
                  평일 09:00 - 18:00 (주말 및 공휴일 제외)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 