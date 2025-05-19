"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlinePaperAirplane, HiOutlineUserGroup } from "react-icons/hi2";
import { HiOutlineX } from "react-icons/hi";

// 임시 채팅 데이터
const chatData = {
  id: 1,
  name: "서울 여행 그룹",
  avatar: "https://i.pravatar.cc/150?img=1",
  tripTitle: "제주도 3박 4일 힐링 여행",
  isGroup: true,
  members: [
    {
      id: 1,
      name: "김여행",
      avatar: "https://i.pravatar.cc/150?img=1",
      isOnline: true,
      role: "방장"
    },
    {
      id: 2,
      name: "이여행러",
      avatar: "https://i.pravatar.cc/150?img=2",
      isOnline: true,
      role: "참여자"
    },
    {
      id: 3,
      name: "박여행가",
      avatar: "https://i.pravatar.cc/150?img=3",
      isOnline: false,
      role: "참여자"
    },
    {
      id: 4,
      name: "최여행러",
      avatar: "https://i.pravatar.cc/150?img=4",
      isOnline: true,
      role: "참여자"
    },
    {
      id: 5,
      name: "정여행러",
      avatar: "https://i.pravatar.cc/150?img=5",
      isOnline: false,
      role: "참여자"
    },
    {
      id: 6,
      name: "강여행러",
      avatar: "https://i.pravatar.cc/150?img=6",
      isOnline: true,
      role: "참여자"
    },
    {
      id: 7,
      name: "조여행러",
      avatar: "https://i.pravatar.cc/150?img=7",
      isOnline: true,
      role: "참여자"
    },
    {
      id: 8,
      name: "윤여행러",
      avatar: "https://i.pravatar.cc/150?img=8",
      isOnline: false,
      role: "참여자"
    },
    {
      id: 9,
      name: "장여행러",
      avatar: "https://i.pravatar.cc/150?img=9",
      isOnline: true,
      role: "참여자"
    },
    {
      id: 10,
      name: "임여행러",
      avatar: "https://i.pravatar.cc/150?img=10",
      isOnline: false,
      role: "참여자"
    },
    {
      id: 11,
      name: "한여행러",
      avatar: "https://i.pravatar.cc/150?img=11",
      isOnline: true,
      role: "참여자"
    },
    {
      id: 12,
      name: "오여행러",
      avatar: "https://i.pravatar.cc/150?img=12",
      isOnline: true,
      role: "참여자"
    }
  ],
  messages: [
    {
      id: 1,
      sender: "김여행",
      content: "안녕하세요! 제주도 여행에 대해 문의드립니다.",
      time: "10:00",
      isMe: false
    },
    {
      id: 2,
      sender: "나",
      content: "네, 안녕하세요! 어떤 점이 궁금하신가요?",
      time: "10:05",
      isMe: true
    },
    {
      id: 3,
      sender: "김여행",
      content: "숙소는 어디인가요?",
      time: "10:10",
      isMe: false
    },
    {
      id: 4,
      sender: "나",
      content: "제주시 중심가에 위치한 프리미엄 호텔입니다.",
      time: "10:15",
      isMe: true
    },
    {
      id: 5,
      sender: "김여행",
      content: "네, 그럼 내일 뵙겠습니다!",
      time: "10:30",
      isMe: false
    }
  ]
};

export default function ChatDetailClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: 메시지 전송 로직 구현
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <HiOutlineArrowLeft className="w-6 h-6" />
              </button>
              <div className="ml-4 flex items-center gap-3">
                <Image
                  src={chatData.avatar}
                  alt={chatData.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h1 className="font-semibold">{chatData.name}</h1>
                  <p className="text-sm text-gray-500">{chatData.tripTitle}</p>
                </div>
              </div>
            </div>
            {chatData.isGroup && (
              <button
                onClick={() => setShowMembers(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <HiOutlineUserGroup className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 채팅 내용 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatData.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.isMe
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.isMe ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 메시지 입력 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-1 h-10 px-4 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
          >
            <HiOutlinePaperAirplane className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 참여자 목록 모달 */}
      {showMembers && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white w-full h-[50vh] rounded-t-2xl overflow-hidden flex flex-col">
            <div className="flex-none border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">참여자 목록</h2>
                <button
                  onClick={() => setShowMembers(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {chatData.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="relative">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    {member.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{member.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {member.isOnline ? "온라인" : "오프라인"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 