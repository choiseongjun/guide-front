import { useState, useEffect } from 'react';
import instance from '@/app/api/axios';
import { usePathname } from 'next/navigation';
import { useUser } from './useUser';

export function useNotificationCount() {
  const [count, setCount] = useState<number | null>(null);
  const pathname = usePathname();
  const { user } = useUser();

  const fetchCount = async () => {
    try {
      const response = await instance.get('/api/v1/notifications/me/unread/count');
      console.log('알림 카운트 응답:', response.data);
      if (response.data.status === 200) {
        setCount(response.data.data);
      }
    } catch (error) {
      console.error('알림 카운트 조회 실패:', error);
      setCount(0);
    }
  };

  useEffect(() => {
    if(user) {
      // 컴포넌트가 마운트될 때와 경로가 변경될 때마다 카운트 갱신
      fetchCount();

    // 30초마다 자동 갱신
    const intervalId = setInterval(fetchCount, 30000);

    return () => {
        clearInterval(intervalId);
      };
    }
  }, [pathname]); // pathname이 변경될 때마다 실행

  const decrementCount = () => {
    setCount(prev => prev !== null ? Math.max(0, prev - 1) : 0);
  };

  return { count: count ?? 0, decrementCount, refreshCount: fetchCount };
} 