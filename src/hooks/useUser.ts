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

let userCache: User | null = null;
let isLoading = false;
let pendingCallbacks: ((user: User | null) => void)[] = [];

const fetchUserData = async (): Promise<User | null> => {
  const at = localStorage.getItem("at");
  if (!at) {
    userCache = null;
    return null;
  }

  try {
    const response = await instance.get("/api/v1/users/me");
    if (response.data.status === 200) {
      userCache = response.data.data;
      return userCache;
    }
    return null;
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    userCache = null;
    return null;
  }
};

export function useUser() {
  const [user, setUser] = useState<User | null>(userCache);

  useEffect(() => {
    if (userCache) {
      setUser(userCache);
      return;
    }

    if (isLoading) {
      pendingCallbacks.push(setUser);
      return;
    }

    isLoading = true;
    fetchUserData().then((userData) => {
      setUser(userData);
      pendingCallbacks.forEach((callback) => callback(userData));
      isLoading = false;
      pendingCallbacks = [];
    });
  }, []);

  // 로컬 스토리지 변경 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "at") {
        if (!e.newValue) {
          // 토큰이 삭제되었을 때 (로그아웃)
          userCache = null;
          setUser(null);
        } else {
          // 토큰이 새로 설정되었을 때 (로그인)
          isLoading = true;
          fetchUserData().then((userData) => {
            setUser(userData);
            pendingCallbacks.forEach((callback) => callback(userData));
            isLoading = false;
            pendingCallbacks = [];
          });
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
      userCache = null;
      setUser(null);
    }
  }, [user]);

  const refreshUser = async () => {
    isLoading = true;
    const userData = await fetchUserData();
    setUser(userData);
    pendingCallbacks.forEach((callback) => callback(userData));
    isLoading = false;
    pendingCallbacks = [];
  };

  return {
    user,
    isLoading,
    refreshUser,
  };
}
