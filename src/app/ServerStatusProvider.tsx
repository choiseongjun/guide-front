"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import instance from "./api/axios";

const ServerStatusContext = createContext<{ isServerUp: boolean }>({
  isServerUp: true,
});

export const useServerStatus = () => useContext(ServerStatusContext);

export default function ServerStatusProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isServerUp, setIsServerUp] = useState(true);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await instance.get("/api/health");
        setIsServerUp(true);
      } catch (error) {
        console.error("서버 상태 체크 실패:", error);
        setIsServerUp(false);
      }
    };

    // 초기 체크
    // checkServerStatus();

    // 30초마다 체크
    const interval = setInterval(checkServerStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ServerStatusContext.Provider value={{ isServerUp }}>
      {children}
    </ServerStatusContext.Provider>
  );
}
