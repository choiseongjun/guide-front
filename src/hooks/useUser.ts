import { useState, useEffect } from "react";
import instance from "@/app/api/axios";

interface User {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  gender: string;
  age: number;
  nationality: string;
  introduction: string;
  tripLevel: number;
  followers: number;
  following: number;
  reviews: number;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const at = localStorage.getItem("at");
      if (!at) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await instance.get("/api/v1/users/me");
      if (response.data.status === 200) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // 로그인 상태 변경 이벤트 리스너 추가
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "at") {
        fetchUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 로그인/로그아웃 시 강제로 사용자 정보 갱신
  const refreshUser = () => {
    fetchUser();
  };

  return { user, isLoading, refreshUser };
}
