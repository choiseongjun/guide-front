"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  HiOutlineArrowLeft,
  HiOutlinePaperAirplane,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { HiStar } from "react-icons/hi";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import instance from "@/app/api/axios";
import { useUser } from "@/hooks/useUser";
import { getUserToken } from "@/app/common/userUtils";

interface Participant {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
  role: string | null;
}

interface ChatMessage {
  id: number;
  chatRoomId: number;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  sender: {
    id: number;
    nickname: string;
    profileImageUrl: string;
  };
  read: boolean;
  links: any[];
}

interface ChatRoom {
  id: number;
  name: string;
  thumbnailUrl: string;
  participants: Participant[];
  owner: {
    id: number;
  };
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface ChatMessageResponse {
  status: number;
  data: PageResponse<ChatMessage>;
  message: string;
}

export default function ChatRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClient = useRef<Client | null>(null);
  const [showMemberList, setShowMemberList] = useState(false);

  // 로그인 체크
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } 
  }, [isLoading, user, router]);

  // 채팅방 정보 조회
  useEffect(() => {
    if (!user) return; // 로그인되지 않은 경우 API 호출하지 않음

    const fetchChatRoom = async () => {
      try {
        const response = await instance.get(
          `/api/v1/chat-rooms/${resolvedParams.id}`
        );
        if (response.data.status === 200) {
          console.log("채팅방 데이터:", response.data.data);
          setChatRoom(response.data.data);
          // 채팅방 정보를 받자마자 읽음 처리 요청
          markMessagesAsRead();
        }
      } catch (error) {
        console.error("채팅방 정보 조회 실패:", error);
      }
    };

    fetchChatRoom();
  }, [resolvedParams.id, user]);

  console.log("user==", user);
  // 메시지 조회
  useEffect(() => {
    if (!user) return; // 로그인되지 않은 경우 API 호출하지 않음

    const fetchMessages = async () => {
      try {
        const response = await instance.get<ChatMessageResponse>(
          `/api/v1/chat-rooms/${resolvedParams.id}/messages`,
          {
            params: {
              page,
              size: 20,
            },
          }
        );
        console.log("response==", response);
        if (response.data.status === 200) {
          const { content, totalPages, number } = response.data.data;
          // 시간순으로 정렬하여 최신 메시지가 아래에 오도록
          const sortedContent = [...content].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          // 중복 메시지 제거
          setMessages((prev) => {
            const existingIds = new Set(prev.map((msg) => msg.id));
            const newMessages = sortedContent.filter(
              (msg) => !existingIds.has(msg.id)
            );
            return [...prev, ...newMessages];
          });
          setHasMore(number < totalPages - 1);
        }
      } catch (error) {
        console.error("메시지 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [resolvedParams.id, page, user]);

  // STOMP 연결
  useEffect(() => {
    if (!user) return; // 로그인되지 않은 경우 WebSocket 연결하지 않음

    const wsUrl = process.env.NEXT_PUBLIC_BASE_URL + "/ws";
    const socket = new SockJS(wsUrl);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${getUserToken()}`,
      }, 
      debug: function (str) {
        console.log("STOMP Debug:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("Connected to STOMP");
      setIsConnected(true);

      // 채팅방 메시지 구독
      client.subscribe(
        `/topic/chat.room.${resolvedParams.id}`,
        (message) => {
          console.log("Received message:", message);
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => {
            // 중복 메시지 체크
            const isDuplicate = prev.some(
              (msg) => msg.id === newMessage.id
            );
            if (isDuplicate) return prev;
            return [...prev, newMessage];
          });
          // 메시지 수신 시 읽음 처리
          markMessagesAsRead();
        }
      );

      // 읽지 않은 메시지 알림 구독
      client.subscribe(`/user/queue/chat.unread`, (message) => {
        console.log("Received unread message:", message);
        const newMessage = JSON.parse(message.body);
        setMessages((prev) => {
          // 중복 메시지 체크
          const isDuplicate = prev.some((msg) => msg.id === newMessage.id);
          if (isDuplicate) return prev;
          return [...prev, newMessage];
        });
        // 메시지 수신 시 읽음 처리
        markMessagesAsRead();
      });

      // 메시지 읽음 상태 구독
      client.subscribe(
        `/topic/chat.room.${resolvedParams.id}.read`,
        (message) => {
          console.log("Message read status updated:", message);
          const userId = JSON.parse(message.body);
          // 여기서 필요한 경우 UI 업데이트 로직 추가
        }
      );
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame);
      setIsConnected(false);
    };

    client.onWebSocketError = (event) => {
      console.error("WebSocket Error:", event);
      setIsConnected(false);
    };

    client.onWebSocketClose = (event) => {
      console.log("WebSocket Closed:", event);
      setIsConnected(false);
    };

    try {
      client.activate();
      stompClient.current = client;
    } catch (error) {
      console.error("Failed to activate STOMP client:", error);
    }

    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.deactivate();
      }
    };
  }, [resolvedParams.id, user]);

  // 메시지 읽음 처리 요청
  const markMessagesAsRead = () => {
    console.log("markMessagesAsRead=",stompClient.current);
    if (!stompClient.current?.connected) {
      console.log("WebSocket not connected, retrying in 1 second...");
      setTimeout(markMessagesAsRead, 1000);
      return;
    }

    console.log("Sending read status request...");
    stompClient.current.publish({
      destination: `/app/chat.room.${resolvedParams.id}.read`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("at")}`,
      },
    });
  };

  // WebSocket 연결 시에도 읽음 처리 요청
  useEffect(() => {
    if (isConnected) {
      markMessagesAsRead();
    }
  }, [isConnected]);

  // 초기 스크롤 위치 설정
  useEffect(() => {
    // 채팅 컨테이너를 맨 아래로 스크롤
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, []);

  // 메시지가 추가될 때만 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // 스크롤 자동 이동
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 메시지 전송 함수 수정
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !stompClient.current || !isConnected) {
      console.log("Cannot send message:", {
        hasClient: !!stompClient.current,
        isConnected,
        hasMessage: !!newMessage.trim(),
      });
      return;
    }

    try {
      // STOMP로 메시지 전송
      if (stompClient.current.connected) {
        const messageData = {
          chatRoomId: parseInt(resolvedParams.id),
          content: newMessage,
        };

        stompClient.current.publish({
          destination: "/app/chat.send",
          body: JSON.stringify(messageData),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("at")}`,
          },
        });

        setNewMessage("");
      } else {
        console.error("STOMP client is not connected");
        setIsConnected(false);
        // 연결이 끊어진 경우 재연결 시도
        setTimeout(() => {
          if (stompClient.current) {
            stompClient.current.activate();
          }
        }, 5000);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 메시지 목록 렌더링
  const renderMessage = (message: ChatMessage) => {
    // 현재 로그인한 사용자가 보낸 메시지인지 확인
    const isMyMessage = message.sender.id === user?.id;

    return (
      <div
        key={message.id}
        className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-4`}
      >
        {!isMyMessage && (
          <div className="flex items-center mr-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
              <Image
                src={
                  message.sender.profileImageUrl ||
                  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60"
                }
                alt={`${message.sender.nickname}의 프로필 이미지`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col max-w-[70%]">
          {!isMyMessage && (
            <div className="text-sm font-semibold text-gray-700 mb-1.5">
              {message.sender.nickname}
            </div>
          )}
          <div className="flex items-end gap-2">
            <div
              className={`rounded-2xl p-3.5 ${
                isMyMessage
                  ? "bg-blue-500 text-white rounded-tr-none"
                  : "bg-white text-gray-900 rounded-tl-none shadow-sm"
              }`}
            >
              <div className="text-sm leading-relaxed">{message.content}</div>
            </div>
            <div
              className={`text-xs ${
                isMyMessage ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {formatTime(message.createdAt)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (showMemberList) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMemberList]);

  if (loading) {
    return null;
  }

  return (
    <div className="flex flex-col h-[80vh] bg-gray-50" id="chat-container">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="w-full px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="p-1.5 hover:bg-gray-100 rounded-full"
              >
                <HiOutlineArrowLeft className="w-5 h-5" />
              </button>
              <div className="ml-3 flex items-center">
                <div className="relative w-7 h-7 rounded-full overflow-hidden">
                  <Image
                    src={
                      chatRoom?.thumbnailUrl ||
                      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60"
                    }
                    alt={`${chatRoom?.name || "채팅방"} 썸네일`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h1 className="text-base font-semibold ml-2">
                  {chatRoom?.name}
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowMemberList(true)}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <HiOutlineUserGroup className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 메시지 목록 */}
      <div
        className="flex-1 overflow-y-auto px-3 py-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {!isConnected && (
          <div className="text-center text-sm text-red-500 mb-2">
            연결이 끊어졌습니다. 재연결 중...
          </div>
        )}
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} className="h-0" />
      </div>

      {/* 메시지 입력 */}
      <div className="bg-white border-t border-gray-200 p-2 flex-shrink-0">
        <div className="w-full flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "메시지를 입력하세요" : "연결 중..."}
            disabled={!isConnected}
            className={`flex-1 h-9 px-3 rounded-full border ${
              isConnected
                ? "border-gray-200 focus:border-blue-500"
                : "border-gray-300 bg-gray-100"
            } focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm`}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected}
            className={`p-1.5 rounded-full ${
              isConnected ? "text-blue-500 hover:bg-blue-50" : "text-gray-400"
            }`}
          >
            <HiOutlinePaperAirplane className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 멤버 리스트 모달 */}
      {showMemberList && (
        <div
          className="fixed inset-0 bg-black/70 flex items-end z-50"
          onClick={() => setShowMemberList(false)}
        >
          <div
            className="bg-white w-full h-[50vh] rounded-t-2xl p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">참여자 목록</h2>
              <button
                onClick={() => setShowMemberList(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <HiOutlineArrowLeft className="w-6 h-6 rotate-90" />
              </button>
            </div>
            <div className="space-y-4">
              {chatRoom?.participants?.map((participant, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={
                        participant.profileImageUrl ||
                        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60"
                      }
                      alt={`${participant.nickname}의 프로필 이미지`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-1">
                      {participant.nickname}
                      {chatRoom?.owner?.id === participant.id && (
                        <HiStar className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
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

// 푸터를 숨기기 위한 스타일 추가
const styles = `
  #chat-container {
    position: relative;
    z-index: 1;
  }
  #chat-container ~ footer {
    display: none !important;
  }
`;

// 스타일 태그 추가
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
