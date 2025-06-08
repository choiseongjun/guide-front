import { useState, useEffect } from 'react';
import instance from '@/app/api/axios';
import { usePathname } from 'next/navigation';
import { useUser } from './useUser';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useNotificationCount() {
  const [count, setCount] = useState<number | null>(null);
  const pathname = usePathname();
  const { user } = useUser();

  const fetchCount = async () => {
    try {
      const response = await instance.get('/api/v1/notifications/me/unread/count');
      if (response.data.status === 200) {
        setCount(response.data.data);
      }
    } catch (error) {
      console.error('알림 카운트 조회 실패:', error);
      setCount(0);
    }
  };

  // useEffect(() => {
  //   if (!user) return;

  //   // 초기 카운트 조회
  //   // fetchCount();

  //   // WebSocket 연결 설정
  //   const wsUrl = process.env.NEXT_PUBLIC_BASE_URL + "/ws";
  //   const socket = new SockJS(wsUrl);
  //   const client = new Client({
  //     webSocketFactory: () => socket,
  //     connectHeaders: {
  //       Authorization: `Bearer ${localStorage.getItem("at")}`,
  //     },
  //     debug: function (str) {
  //       console.log("STOMP Debug:", str);
  //     },
  //     reconnectDelay: 5000,
  //     heartbeatIncoming: 4000,
  //     heartbeatOutgoing: 4000,
  //   });

  //   client.onConnect = () => {
  //     console.log("Connected to notification WebSocket");
  //     // 알림 구독
  //     client.subscribe('/user/queue/notifications', (message) => {
  //       const notification = JSON.parse(message.body);
  //       // 새 알림이 오면 카운트 증가
  //       setCount(prev => (prev !== null ? prev + 1 : 1));
  //     });
  //   };

  //   client.onStompError = (frame) => {
  //     console.error('STOMP error:', frame);
  //   };

  //   client.activate();

  //   // 10초마다 카운트 갱신 (폴백 메커니즘)
  //   const intervalId = setInterval(fetchCount, 10000);

  //   return () => {
  //     if (client.connected) {
  //       client.deactivate();
  //     }
  //     clearInterval(intervalId);
  //   };
  // }, [user, pathname]);

  const decrementCount = () => {
    setCount(prev => prev !== null ? Math.max(0, prev - 1) : 0);
  };

  return { count: count ?? 0, decrementCount, refreshCount: fetchCount };
} 