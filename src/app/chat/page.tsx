"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineArrowLeft,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import instance from "@/app/api/axios";
import { getImageUrl, getProfileImage } from "../common/imgUtils";
import { useUser } from "@/hooks/useUser";
import LoginRequired from "@/components/LoginRequired";

interface Participant {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
  role: string;
  thumbnailUrl:string|null;
}

interface ChatRoom {
  id: number;
  myUserId: number;
  name: string;
  otherNickname: string;
  myNickname: string;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
  thumbnailUrl: string | null;
  participants: Participant[];
  type: string;
  otherProfileImageUrl:string;
  myProfileImageUrl:string;
  otherNicknameImg:string;
  myNicknameImg:string;
}

interface ChatRoomResponse {
  status: number;
  data: {
    directChats: ChatRoom[];
    groupChats: ChatRoom[];
  };
  message: string;
}

interface ChatRoomStats {
  status: number;
  data: {
    totalDirectChats: number;
    totalGroupChats: number;
    unreadDirectMessages: number;
    unreadGroupMessages: number;
  };
  message: string;
}

export default function ChatListPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"group" | "direct">("group");
  const [chatRooms, setChatRooms] = useState<ChatRoomResponse["data"]>({
    directChats: [],
    groupChats: [],
  });
  const [stats, setStats] = useState<ChatRoomStats["data"]>({
    totalDirectChats: 0,
    totalGroupChats: 0,
    unreadDirectMessages: 0,
    unreadGroupMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // 로그인 체크
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } 
  }, [isLoading, user, router]);

  useEffect(() => {
    if (isLoading) return; // 로딩 중이면 API 호출하지 않음
    if (!user) return; // 로그인되지 않았으면 API 호출하지 않음

    const fetchData = async () => {
      try {
        const [chatRoomsResponse, statsResponse] = await Promise.all([
          instance.get<ChatRoomResponse>("/api/v1/chat-rooms/list", {
            params: {
              type: activeTab === "group" ? "GROUP" : "DIRECT",
            },
          }),
          instance.get<ChatRoomStats>("/api/v1/chat-rooms/stats"),
        ]);

        console.log("chatRoomsResponse===",chatRoomsResponse)
        if (chatRoomsResponse.data.status === 200) {
          setChatRooms(chatRoomsResponse.data.data);
        }
        if (statsResponse.data.status === 200) {
          setStats(statsResponse.data.data);
        }
      } catch (error) {
        console.error("데이터 조회 실패:", error);
        setChatRooms({ directChats: [], groupChats: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user, isLoading]);
  const fetchCurrentUser = async () => {
    try {
      const response = await instance.get('/api/v1/users/me');
      if (response.data.status === 200) {
        setCurrentUserId(response.data.data.id);
      }
    } catch (error) {
      console.error("현재 사용자 정보 조회 실패:", error);
    }
  };
  useEffect(() => {
    // if (!isLoading && !user) {
    //   router.push("/login");
    //   return;
    // }
    fetchCurrentUser();
  }, [isLoading, user, router]);

  const filteredChats =
    activeTab === "group"
      ? chatRooms.groupChats.filter((chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : chatRooms.directChats.filter((chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // 읽지 않은 메시지 총 개수 계산
  const totalUnreadGroupChats = chatRooms.groupChats.reduce(
    (sum, chat) => sum + chat.unreadCount,
    0
  );
  const totalUnreadDirectChats = chatRooms.directChats.reduce(
    (sum, chat) => sum + chat.unreadCount,
    0
  );

  const privateNickNameRender =(chat:ChatRoom)=>{

    console.log("chat.myUserId===",chat)
    if(chat.myUserId === currentUserId){
      return(
        <div>
          {chat.otherNickname}
        </div>
      )
    }else{
      return(
        <div>
          {chat.myNickname}
        </div>
      )
    }
    
  }

  const renderProfileImgPrivate= (chat:ChatRoom)=>{
    
    console.log("chat.myUserId===",chat)


    if(chat.myUserId === currentUserId){
      return(
        <Image
          src={getProfileImage(chat.otherNicknameImg)}
          alt={chat.otherNickname}
          fill
          className="object-cover"
        />
      )
    }else{
      return(
        <Image
          src={getProfileImage(chat.myNicknameImg)}
          alt={chat.myNickname}
          fill
          className="object-cover"
        />
      )
    }
  }

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 24 * 60)
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / (24 * 60))}일 전`;
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 로그인되지 않은 경우 LoginRequired 컴포넌트 표시
  if (!user) {
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
              <h1 className="text-xl font-bold ml-4">채팅</h1>
            </div>
          </div>
        </header>

        <LoginRequired
          title="채팅 서비스 이용을 위해 로그인이 필요합니다"
          message="채팅 기능을 이용하기 위해서는 로그인이 필요합니다. 로그인 하시겠습니까?"
          buttonText="로그인 하러가기"
        />
      </div>
    );
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
            <h1 className="text-xl font-bold ml-4">채팅</h1>
          </div>
        </div>
      </header>

      {/* 검색바 */}
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="채팅 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
          />
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
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
              {stats.totalGroupChats > 0 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {stats.totalGroupChats}
                </span>
              )}
              {stats.unreadGroupMessages > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.unreadGroupMessages}
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
              {stats.totalDirectChats > 0 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {stats.totalDirectChats}
                </span>
              )}
              {stats.unreadDirectMessages > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.unreadDirectMessages}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* 채팅 목록 */}
      <div className="max-w-md mx-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-4 bg-white border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
            
            {/* 채팅방 이미지 */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
              {chat.type === "DIRECT" ? (
                <>
                  {renderProfileImgPrivate(chat)}
                </> 
              ) : (
                <Image
                  src={
                    (chat.thumbnailUrl && getImageUrl(chat.thumbnailUrl)) ||
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60"
                  }
                  alt={chat.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* 채팅방 정보 */}
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                
                {chat.type === "DIRECT"?
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {/* {chat.otherNickname} */}
                  {privateNickNameRender(chat)}
                </h3>
                :
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {chat.name}
                </h3>
                }
                
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(chat.lastMessageTime)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage || "새로운 채팅방입니다"}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
