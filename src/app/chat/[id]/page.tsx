"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  HiOutlineArrowLeft,
  HiOutlinePaperAirplane,
  HiOutlineUserGroup,
  HiOutlineXMark,
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
  type?: 'SYSTEM' | 'MESSAGE';
  systemMessage?: boolean;
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
  const { user, isLoading: userLoading } = useUser();
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClient = useRef<Client | null>(null);
  const [showMemberList, setShowMemberList] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // 로그인 체크 및 리다이렉트
  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/login");
    }
  }, [userLoading, user, router]);

  // 채팅방 정보 조회
  useEffect(() => {
    if (userLoading || !user) return;

    const fetchChatRoom = async () => {
      try {
        const response = await instance.get(
          `/api/v1/chat-rooms/${resolvedParams.id}`
        );
        if (response.data.status === 200) {
          setChatRoom(response.data.data);
          markMessagesAsRead();

          // 초기 입장 메시지 전송
          if (isInitialLoad && stompClient.current?.connected) {
            stompClient.current.publish({
              destination: `/app/chat.room.${resolvedParams.id}.join`,
              body: JSON.stringify({
                userId: user.id,
                nickname: user.nickname,
                isInitial: true
              }),
              headers: {
                Authorization: `Bearer ${getUserToken()}`,
              },
            });
            setIsInitialLoad(false);
          }
        }
      } catch (error) {
        console.error("채팅방 정보 조회 실패:", error);
      }
    };

    fetchChatRoom();
  }, [resolvedParams.id, user, userLoading, isInitialLoad]);

  // WebSocket 연결
  useEffect(() => {
    if (userLoading || !user || isConnecting) return;

    const connectWebSocket = () => {
      if (isConnecting) return;
      setIsConnecting(true);

      const wsUrl = process.env.NEXT_PUBLIC_BASE_URL + "/ws";
      const socket = new SockJS(wsUrl);
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${getUserToken()}`,
        },
        debug: function (str) {
          if (str.includes("Opening Web Socket")) {
            console.log("WebSocket 연결 시도 중...");
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        console.log("WebSocket 연결 성공");
        setIsConnected(true);
        setIsConnecting(false);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }

        // 채팅방 메시지 구독
        client.subscribe(
          `/topic/chat.room.${resolvedParams.id}`,
          (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages((prev) => {
              const isDuplicate = prev.some((msg) => msg.id === newMessage.id);
              if (isDuplicate) return prev;
              return [...prev, newMessage];
            });
            markMessagesAsRead();
          }
        );

        // 입장/퇴장 메시지 구독
        client.subscribe(
          `/topic/chat.room.${resolvedParams.id}.system`,
          (message) => {
            const systemMessage = JSON.parse(message.body);
            setMessages((prev) => {
              const isDuplicate = prev.some((msg) => msg.id === systemMessage.id);
              if (isDuplicate) return prev;
              return [...prev, systemMessage];
            });
          }
        );

        // 읽지 않은 메시지 알림 구독
        client.subscribe(`/user/queue/chat.unread`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => {
            const isDuplicate = prev.some((msg) => msg.id === newMessage.id);
            if (isDuplicate) return prev;
            return [...prev, newMessage];
          });
          markMessagesAsRead();
        });

        // 메시지 읽음 상태 구독
        client.subscribe(
          `/topic/chat.room.${resolvedParams.id}.read`,
          (message) => {
            const userId = JSON.parse(message.body);
          }
        );
      };

      client.onStompError = (frame) => {
        console.error("STOMP 에러:", frame);
        setIsConnected(false);
        setIsConnecting(false);
        handleReconnect();
      };

      client.onWebSocketError = (event) => {
        console.error("WebSocket 에러:", event);
        setIsConnected(false);
        setIsConnecting(false);
        handleReconnect();
      };

      client.onWebSocketClose = (event) => {
        console.log("WebSocket 연결 종료:", event);
        setIsConnected(false);
        setIsConnecting(false);
        handleReconnect();
      };

      try {
        client.activate();
        stompClient.current = client;
      } catch (error) {
        console.error("STOMP 클라이언트 활성화 실패:", error);
        setIsConnecting(false);
        handleReconnect();
      }
    };

    const handleReconnect = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        if (!isConnected && !isConnecting) {
          connectWebSocket();
        }
      }, 5000);
    };

    connectWebSocket();

    return () => {
      // 퇴장 메시지 전송
      if (stompClient.current?.connected) {
        stompClient.current.publish({
          destination: `/app/chat.room.${resolvedParams.id}.leave`,
          body: JSON.stringify({
            userId: user.id,
            nickname: user.nickname,
            isInitial: false
          }),
          headers: {
            Authorization: `Bearer ${getUserToken()}`,
          },
        });
        stompClient.current.deactivate();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [resolvedParams.id, user, userLoading]);

  // 메시지 조회
  useEffect(() => {
    if (userLoading || !user) return;

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
        if (response.data.status === 200) {
          const { content, totalPages, number } = response.data.data;
          const sortedContent = [...content].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
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
  }, [resolvedParams.id, page, user, userLoading]);

  // 메시지 읽음 처리 요청
  const markMessagesAsRead = () => {
    if (!stompClient.current?.connected) {
      return;
    }

    stompClient.current.publish({
      destination: `/app/chat.room.${resolvedParams.id}.read`,
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
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
      return;
    }

    try {
      if (stompClient.current.connected) {
        const messageData = {
          chatRoomId: parseInt(resolvedParams.id),
          content: newMessage,
        };

        stompClient.current.publish({
          destination: "/app/chat.send",
          body: JSON.stringify(messageData),
          headers: {
            Authorization: `Bearer ${getUserToken()}`,
          },
        });

        setNewMessage("");
      } else {
        setIsConnected(false);
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
    // 시스템 메시지인 경우
    if (message.type === 'SYSTEM') {
      return (
        <div key={message.id} className="w-full flex justify-center items-center my-2">
          <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full inline-block">
            {message.content}
          </div>
        </div>
      );
    }

    // 일반 메시지인 경우
    const isMyMessage = message.sender?.id === user?.id;

    return (
      <div
        key={message.id}
        className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-4`}
      >
        {!isMyMessage && message.sender && (
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
          {!isMyMessage && message.sender && (
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

  // 채팅방 나가기 함수
  const handleLeaveChatRoom = async () => {
    try {
      if (stompClient.current?.connected) {
        // WebSocket을 통해 퇴장 메시지 전송
        stompClient.current.publish({
          destination: `/app/chat.room.${resolvedParams.id}.leave`,
          body: JSON.stringify({
            userId: user?.id,
            nickname: user?.nickname,
            isInitial: false
          }),
          headers: {
            Authorization: `Bearer ${getUserToken()}`,
          },
        });

        // WebSocket 연결 해제
        stompClient.current.deactivate();
        
        // 채팅 목록 페이지로 이동
        // router.push('/chat');
      } else {
        alert("연결이 끊어졌습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
      alert("채팅방을 나가는데 실패했습니다.");
    }
  };

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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMemberList(true)}
                className="p-1.5 hover:bg-gray-100 rounded-full"
              >
                <HiOutlineUserGroup className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowLeaveModal(true)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-red-500"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>
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
        <div className="space-y-2">
          {messages.map((message, index) => {
            console.log("message====",message)
            // 시스템 메시지인 경우
            if (message.systemMessage) {
              return (
                <div key={message.id} className="relative">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
                    <div className="w-full flex justify-center">
                      <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full inline-block">
                        {message.content}
                      </div>
                    </div>
                  </div>
                  <div className="h-8"></div> {/* 시스템 메시지를 위한 공간 */}
                </div>
              );
            }

            // 일반 메시지인 경우
            const isMyMessage = message.sender?.id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-4`}
              >
                {!isMyMessage && message.sender && (
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
                  {!isMyMessage && message.sender && (
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
          })}
        </div>
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

      {/* 나가기 확인 모달 */}
      {showLeaveModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowLeaveModal(false)}
        >
          <div
            className="bg-white w-full max-w-sm mx-4 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineXMark className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                채팅방 나가기
              </h3>
              <p className="text-sm text-gray-500">
                정말로 이 채팅방을 나가시겠습니까?
                <br />
                나가기를 하면 대화 내용이 모두 삭제됩니다.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
              >
                취소
              </button>
              <button
                onClick={handleLeaveChatRoom}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium"
              >
                나가기
              </button>
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
