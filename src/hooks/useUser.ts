import { useState, useEffect } from 'react';
import instance from '@/app/api/axios';

interface User {
  id: number;
  email: string | null;
  nickname: string;
  profileImageUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

let cachedUser: User | null = null;
let isLoading = false;
let error: Error | null = null;

export function useUser() {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(!cachedUser);

  useEffect(() => {
    const fetchUser = async () => {
      // 이미 캐시된 데이터가 있거나 로딩 중이면 중복 요청 방지
      if (cachedUser || isLoading) {
        setLoading(false);
        return;
      }

      try {
        isLoading = true;
        setLoading(true);
        const response = await instance.get('/api/v1/users/me');
        
        if (response.data.status === 200) {
          cachedUser = response.data.data;
          setUser(cachedUser);
        }
      } catch (err) {
        error = err as Error;
        console.error('사용자 정보 조회 실패:', err);
      } finally {
        isLoading = false;
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const clearUserCache = () => {
    cachedUser = null;
    setUser(null);
  };

  return {
    user,
    isLoading: loading,
    error,
    clearUserCache
  };
} 