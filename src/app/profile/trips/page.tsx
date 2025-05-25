"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineMapPin, HiOutlineUserGroup, HiOutlineClock } from "react-icons/hi2";
import instance from "@/app/api/axios";

interface Participant {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
}

interface ChatRoom {
  id: number;
  name: string;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
  thumbnailUrl: string;
  participants: Participant[];
}

interface ChatRoomResponse {
  status: number;
  data: {
    directChats: ChatRoom[];
    groupChats: ChatRoom[];
  };
  message: string;
}

export default function TripsPage() {
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await instance.get<ChatRoomResponse>("/api/v1/chat-rooms/list", {
          params: {
            type: 'GROUP'
          }
        });
        if (response.data.status === 200) {
          setChatRooms(response.data.data.groupChats);
        }
      } catch (error) {
        console.error("채팅방 목록 조회 실패:", error);
        setChatRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            <h1 className="text-xl font-bold ml-4">나의 여행</h1>
          </div>
        </div>
      </header>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex gap-4">
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              대기중인 여행
            </button>
            <button
              className={`py-4 px-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              완료된 여행
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto p-4">
        <div className="space-y-4">
          {chatRooms.map((chatRoom) => (
            <div
              key={chatRoom.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              onClick={() => router.push(`/chat/${chatRoom.id}`)}
            >
              <div className="relative h-48">
                <Image
                  src={chatRoom.thumbnailUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60"}
                  alt={chatRoom.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{chatRoom.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <HiOutlineCalendar className="w-4 h-4" />
                    <span>{formatDate(chatRoom.lastMessageTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineUserGroup className="w-4 h-4" />
                    <span>참여자 {chatRoom.participants.length}명</span>
                  </div>
                  {chatRoom.unreadCount > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500">새 메시지 {chatRoom.unreadCount}개</span>
                    </div>
                  )}
                </div>

                {/* 참여자 프로필 사진 */}
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">참여자:</span>
                  <div className="flex -space-x-2">
                    {chatRoom.participants.map((participant) => (
                      <div
                        key={participant.userId}
                        className="relative w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-black"
                      >
                        {participant.profileImageUrl ? (
                          <Image
                            src={participant.profileImageUrl}
                            alt={participant.nickname}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-xs">
                            {participant.nickname.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
