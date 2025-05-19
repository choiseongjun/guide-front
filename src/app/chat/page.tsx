"use client";
import { useState } from "react";
import Image from "next/image";
import { HiOutlineMagnifyingGlass, HiOutlineUserGroup, HiOutlineUser } from "react-icons/hi2";
import { motion } from "framer-motion";

// 임시 채팅 데이터
const groupChats = [
  {
    id: 1,
    name: "서울 여행 그룹",
    lastMessage: "내일 만나서 계획 세워볼까요?",
    timeAgo: "5분 전",
    unreadCount: 3,
    members: [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3",
      "https://i.pravatar.cc/150?img=4"
    ]
  },
  {
    id: 2,
    name: "제주도 여행 동호회",
    lastMessage: "숙소 예약 완료했습니다!",
    timeAgo: "1시간 전",
    unreadCount: 1,
    members: [
      "https://i.pravatar.cc/150?img=5",
      "https://i.pravatar.cc/150?img=6",
      "https://i.pravatar.cc/150?img=7"
    ]
  },
  {
    id: 3,
    name: "부산 여행 팁",
    lastMessage: "부산 맛집 추천해주세요!",
    timeAgo: "2시간 전",
    unreadCount: 0,
    members: [
      "https://i.pravatar.cc/150?img=8",
      "https://i.pravatar.cc/150?img=9",
      "https://i.pravatar.cc/150?img=10",
      "https://i.pravatar.cc/150?img=11"
    ]
  },
  {
    id: 4,
    name: "해외 여행 정보",
    lastMessage: "일본 여행 준비물 체크리스트 공유합니다",
    timeAgo: "3시간 전",
    unreadCount: 5,
    members: [
      "https://i.pravatar.cc/150?img=12",
      "https://i.pravatar.cc/150?img=13",
      "https://i.pravatar.cc/150?img=14"
    ]
  },
  {
    id: 5,
    name: "여행 사진 공유",
    lastMessage: "제주도 사진 올라왔어요!",
    timeAgo: "4시간 전",
    unreadCount: 2,
    members: [
      "https://i.pravatar.cc/150?img=15",
      "https://i.pravatar.cc/150?img=16",
      "https://i.pravatar.cc/150?img=17",
      "https://i.pravatar.cc/150?img=18"
    ]
  }
];

const directChats = [
  {
    id: 1,
    name: "김여행",
    lastMessage: "다음에 같이 여행 가요!",
    timeAgo: "30분 전",
    unreadCount: 2,
    avatar: "https://i.pravatar.cc/150?img=19",
    isOnline: true
  },
  {
    id: 2,
    name: "이여행러",
    lastMessage: "사진 보내드릴게요",
    timeAgo: "2시간 전",
    unreadCount: 0,
    avatar: "https://i.pravatar.cc/150?img=20",
    isOnline: false
  },
  {
    id: 3,
    name: "박여행가",
    lastMessage: "여행 일정 조정 가능할까요?",
    timeAgo: "3시간 전",
    unreadCount: 1,
    avatar: "https://i.pravatar.cc/150?img=21",
    isOnline: true
  },
  {
    id: 4,
    name: "최여행러",
    lastMessage: "추천 코스 알려드릴게요",
    timeAgo: "5시간 전",
    unreadCount: 0,
    avatar: "https://i.pravatar.cc/150?img=22",
    isOnline: false
  },
  {
    id: 5,
    name: "정여행러",
    lastMessage: "숙소 예약 완료했습니다",
    timeAgo: "6시간 전",
    unreadCount: 3,
    avatar: "https://i.pravatar.cc/150?img=23",
    isOnline: true
  },
  {
    id: 6,
    name: "강여행러",
    lastMessage: "여행 가이드 추천해주세요",
    timeAgo: "7시간 전",
    unreadCount: 0,
    avatar: "https://i.pravatar.cc/150?img=24",
    isOnline: false
  },
  {
    id: 7,
    name: "조여행러",
    lastMessage: "여행 후기 작성했습니다",
    timeAgo: "8시간 전",
    unreadCount: 1,
    avatar: "https://i.pravatar.cc/150?img=25",
    isOnline: true
  },
  {
    id: 8,
    name: "윤여행러",
    lastMessage: "여행 사진 공유해주세요",
    timeAgo: "9시간 전",
    unreadCount: 0,
    avatar: "https://i.pravatar.cc/150?img=26",
    isOnline: false
  }
];

export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"group" | "direct">("group");

  const filteredGroupChats = groupChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDirectChats = directChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 읽지 않은 메시지 총 개수 계산
  const totalUnreadGroupChats = groupChats.reduce((sum, chat) => sum + chat.unreadCount, 0);
  const totalUnreadDirectChats = directChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 검색바 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="채팅방 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === "group"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("group")}
          >
            <HiOutlineUserGroup className="w-5 h-5" />
            <span>그룹 채팅</span>
            {filteredGroupChats.length > 0 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {filteredGroupChats.length}
              </span>
            )}
            {totalUnreadGroupChats > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {totalUnreadGroupChats}
              </span>
            )}
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === "direct"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("direct")}
          >
            <HiOutlineUser className="w-5 h-5" />
            <span>1:1 채팅</span>
            {filteredDirectChats.length > 0 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {filteredDirectChats.length}
              </span>
            )}
            {totalUnreadDirectChats > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {totalUnreadDirectChats}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 채팅 목록 */}
      <div className="max-w-md mx-auto">
        {/* 그룹 채팅 섹션 */}
        {activeTab === "group" && (
          <div className="bg-white">
            <div className="divide-y divide-gray-100">
              {filteredGroupChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                        <div className="grid grid-cols-2 gap-0.5 w-full h-full">
                          {chat.members.slice(0, 4).map((member, index) => (
                            <Image
                              key={index}
                              src={member}
                              alt={`Member ${index + 1}`}
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {chat.members.length}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500">{chat.timeAgo}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <div className="mt-1 flex justify-end">
                          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {chat.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 1:1 채팅 섹션 */}
        {activeTab === "direct" && (
          <div className="bg-white">
            <div className="divide-y divide-gray-100">
              {filteredDirectChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Image
                        src={chat.avatar}
                        alt={chat.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      {chat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500">{chat.timeAgo}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <div className="mt-1 flex justify-end">
                          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {chat.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {searchQuery && 
          ((activeTab === "group" && filteredGroupChats.length === 0) ||
           (activeTab === "direct" && filteredDirectChats.length === 0)) && (
          <div className="text-center py-8 text-gray-500">
            검색 결과가 없습니다
          </div>
        )}
      </div>
    </div>
  );
} 