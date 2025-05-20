"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
  HiOutlineStar,
  HiOutlineBell,
} from "react-icons/hi2";
import { BsHeadset } from "react-icons/bs";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

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

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isNotificationsPage, setIsNotificationsPage] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [totalUnreadChats, setTotalUnreadChats] = useState(0);

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
    <html lang="en">
      <body>
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
                  <Link
                    href="/support"
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <BsHeadset className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <div className="content">{children}</div>

          {!isNotificationsPage && (
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
        </div>
      </body>
    </html>
  );
}
