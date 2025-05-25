"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlinePaperAirplane } from "react-icons/hi2";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import instance from "@/app/api/axios";

interface Participant {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
}

interface ChatMessage {
  id: number;
  chatRoomId: number;
  senderId: number;
  senderNickname: string;
  content: string;
  createdAt: string;
}

interface ChatRoom {
  id: number;
  name: string;
  thumbnailUrl: string;
  participants: Participant[];
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

export default function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClient = useRef<Client | null>(null);
  const currentUserId = parseInt(localStorage.getItem('userId') || '0');

  // 채팅방 정보 조회
  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        const response = await instance.get(`/api/v1/chat-rooms/${resolvedParams.id}`);
        if (response.data.status === 200) {
          setChatRoom(response.data.data);
        }
      } catch (error) {
        console.error("채팅방 정보 조회 실패:", error);
      }
    };

    fetchChatRoom();
  }, [resolvedParams.id]);

  // 메시지 조회
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await instance.get<ChatMessageResponse>(`/api/v1/chat-rooms/${resolvedParams.id}/messages`, {
          params: {
            page,
            size: 20
          }
        });
        if (response.data.status === 200) {
          const { content, totalPages, number } = response.data.data;
          setMessages(prev => [...prev, ...content]);
          setHasMore(number < totalPages - 1);
        }
      } catch (error) {
        console.error("메시지 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [resolvedParams.id, page]);

  // STOMP 연결
  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new SockJS('http://localhost:8080/ws');
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${localStorage.getItem('at')}`
        },
        debug: function (str) {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('Connected to STOMP');
          setIsConnected(true);
          
          // 채팅방 메시지 구독
          client.subscribe(`/topic/chat.room.${resolvedParams.id}`, (message) => {
            console.log('Received message:', message);
            const newMessage = JSON.parse(message.body);
            setMessages(prev => [...prev, newMessage]);
          });

          // 읽지 않은 메시지 알림 구독
          client.subscribe(`/user/queue/chat.unread`, (message) => {
            console.log('Received unread message:', message);
            const newMessage = JSON.parse(message.body);
            setMessages(prev => [...prev, newMessage]);
          });
        },
        onDisconnect: () => {
          console.log('Disconnected from STOMP');
          setIsConnected(false);
          setTimeout(connectWebSocket, 5000);
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
          setIsConnected(false);
          setTimeout(connectWebSocket, 5000);
        }
      });

      try {
        client.activate();
        stompClient.current = client;
      } catch (error) {
        console.error('Failed to activate STOMP client:', error);
        setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.deactivate();
      }
    };
  }, [resolvedParams.id]);

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !stompClient.current || !isConnected) {
      console.log('Cannot send message:', { 
        hasClient: !!stompClient.current, 
        isConnected, 
        hasMessage: !!newMessage.trim() 
      });
      return;
    }

    try {
      // STOMP로 메시지 전송
      if (stompClient.current.connected) {
        stompClient.current.publish({
          destination: '/app/chat.send',
          body: JSON.stringify({
            chatRoomId: parseInt(resolvedParams.id),
            content: newMessage
          }),
          headers: {
            Authorization: `Bearer ${localStorage.getItem('at')}`
          }
        });
        setNewMessage("");
      } else {
        console.error('STOMP client is not connected');
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 메시지 목록 렌더링
  const renderMessage = (message: ChatMessage) => {
    const isMyMessage = message.senderId === currentUserId;
    
    return (
      <div
        key={message.id}
        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!isMyMessage && (
          <div className="flex items-end mr-2">
            <div className="text-xs text-gray-500">{message.senderNickname}</div>
          </div>
        )}
        <div 
          className={`max-w-[70%] rounded-lg p-3 ${
            isMyMessage 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-900'
          }`}
        >
          <div className="text-sm">{message.content}</div>
          <div 
            className={`text-xs mt-1 ${
              isMyMessage ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
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
            <div className="ml-4 flex items-center">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={chatRoom?.thumbnailUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60"}
                  alt={chatRoom?.name || ""}
                  fill
                  className="object-cover"
                />
              </div>
              <h1 className="text-lg font-semibold ml-3">{chatRoom?.name}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!isConnected && (
          <div className="text-center text-sm text-red-500 mb-4">
            연결이 끊어졌습니다. 재연결 중...
          </div>
        )}
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "메시지를 입력하세요" : "연결 중..."}
            disabled={!isConnected}
            className={`flex-1 h-10 px-4 rounded-full border ${
              isConnected ? 'border-gray-200 focus:border-blue-500' : 'border-gray-300 bg-gray-100'
            } focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm`}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected}
            className={`p-2 rounded-full ${
              isConnected ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-400'
            }`}
          >
            <HiOutlinePaperAirplane className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
} 