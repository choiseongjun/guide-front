"use client";
import { useState } from "react";
import Image from "next/image";
import { HiOutlineBell, HiOutlineChatBubbleLeftRight, HiOutlineHeart, HiOutlineUserGroup, HiOutlineArrowLeft } from "react-icons/hi2";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// 임시 알림 데이터
const notifications = [
  {
    id: 1,
    type: "like",
    user: {
      name: "김여행",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    content: "귀하의 게시물을 좋아합니다",
    timeAgo: "5분 전",
    post: {
      image: "https://picsum.photos/seed/post1/200/120"
    },
    isRead: false
  },
  {
    id: 2,
    type: "comment",
    user: {
      name: "이여행러",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    content: "멋진 여행이네요! 다음에 같이 가요!",
    timeAgo: "1시간 전",
    post: {
      image: "https://picsum.photos/seed/post2/200/120"
    },
    isRead: true
  },
  {
    id: 3,
    type: "follow",
    user: {
      name: "박여행러",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    content: "회원님을 팔로우하기 시작했습니다",
    timeAgo: "3시간 전",
    isRead: false
  },
  {
    id: 4,
    type: "group",
    user: {
      name: "서울여행그룹",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    content: "새로운 그룹 활동이 있습니다",
    timeAgo: "1일 전",
    isRead: true
  }
];

// 알림 타입에 따른 아이콘 컴포넌트
const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "like":
      return <HiOutlineHeart className="w-5 h-5 text-pink-500" />;
    case "comment":
      return <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-blue-500" />;
    case "follow":
      return <HiOutlineUserGroup className="w-5 h-5 text-green-500" />;
    case "group":
      return <HiOutlineBell className="w-5 h-5 text-purple-500" />;
    default:
      return <HiOutlineBell className="w-5 h-5 text-gray-500" />;
  }
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationsList, setNotificationsList] = useState(notifications);
  const router = useRouter();

  const filteredNotifications = activeTab === "all" 
    ? notificationsList 
    : notificationsList.filter(notification => !notification.isRead);

  const handleNotificationClick = (id: number) => {
    setNotificationsList(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center px-4 ">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <HiOutlineArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="flex-1 text-center text-lg font-semibold">알림</h1>
            <div className="w-10" /> {/* 오른쪽 여백을 위한 더미 요소 */}
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex">
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === "all" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("all")}
            >
              전체
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === "unread" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("unread")}
            >
              읽지 않음
            </button>
          </div>
        </div>
      </div>

      {/* 알림 리스트 */}
      <div className="max-w-md mx-auto">
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 ${notification.isRead ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-50 transition-colors cursor-pointer`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="flex items-start gap-3">
                {/* 알림 아이콘 */}
                <div className="flex-shrink-0">
                  <NotificationIcon type={notification.type} />
                </div>

                {/* 알림 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Image
                      src={notification.user.avatar}
                      alt={notification.user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{notification.user.name}</span>
                        <span className="text-gray-600"> {notification.content}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.timeAgo}</p>
                    </div>
                  </div>

                  {/* 게시물 이미지 (있는 경우) */}
                  {notification.post?.image && (
                    <div className="mt-2">
                      <Image
                        src={notification.post.image}
                        alt="게시물 이미지"
                        width={200}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}