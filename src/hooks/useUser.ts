import { useState, useEffect } from "react";
import instance from "@/app/api/axios";

interface User {
  id: number;
  email: string | null;
  nickname: string;
  profileImageUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  age: number;
  nationality: string;
  tripLevel: number;
  followers: number;
  following: number;
  reviews: number;
  gender: string;
}

let cachedUser: User | null = null;
let isLoading = false;
let error: Error | null = null;

export function useUser() {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(!cachedUser);

  const fetchUser = async () => {
    if (cachedUser) {
      return cachedUser;
    }

    const at = localStorage.getItem("at");
    if (!at) {
      setLoading(false);
      return null;
    }

    try {
      isLoading = true;
      setLoading(true);
      const response = await instance.get("/api/v1/users/me");

      if (response.data.status === 200) {
        cachedUser = response.data.data;
        setUser(cachedUser);
        return cachedUser;
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      setUser(null);
      return null;
    } finally {
      isLoading = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // 초기 로드 시에만 실행
    if (!cachedUser) {
      fetchUser();
    }
  }, []);

  // 토큰 변경 감지를 위한 이벤트 리스너
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        // 토큰이 삭제되었을 때 (로그아웃)
        cachedUser = null;
        setUser(null);
      } else if (e.key === "token" && e.newValue) {
        // 토큰이 새로 설정되었을 때 (로그인)
        fetchUser();
      }
    };

    // 로컬 스토리지 변경 감지
    window.addEventListener("storage", handleStorageChange);

    // 현재 토큰 확인
    const token = localStorage.getItem("token");
    if (!token && cachedUser) {
      // 토큰이 없는데 캐시된 사용자 정보가 있는 경우
      cachedUser = null;
      setUser(null);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const clearUserCache = () => {
    cachedUser = null;
    setUser(null);
  };

  return {
    user,
    isLoading: loading,
    error,
    clearUserCache,
    refreshUser: fetchUser,
  };
}
