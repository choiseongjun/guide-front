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

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const at = localStorage.getItem("at");
    if (!at) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      const response = await instance.get("/api/v1/users/me");

      if (response.data.status === 200) {
        setUser(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 로컬 스토리지 변경 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "at") {
        if (!e.newValue) {
          // 토큰이 삭제되었을 때 (로그아웃)
          setUser(null);
        } else {
          // 토큰이 새로 설정되었을 때 (로그인)
          fetchUser();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 현재 토큰 확인
  useEffect(() => {
    const at = localStorage.getItem("at");
    if (!at && user) {
      setUser(null);
    }
  }, [user]);

  return {
    user,
    isLoading: loading,
    refreshUser: fetchUser,
  };
}
