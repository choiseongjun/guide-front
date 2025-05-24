"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import instance from "./api/axios";

export default function ServerStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [serverError, setServerError] = useState(false);

  // 서버 상태 체크
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await instance.get('/api/health');
        setServerError(false);
      } catch (error) {
        setServerError(true);
      }
    };

    const interval = setInterval(checkServerStatus, 30000); // 30초마다 체크
    checkServerStatus(); // 초기 체크

    return () => clearInterval(interval);
  }, []);

  // 5초 후 자동으로 알림 숨기기
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (serverError) {
      timer = setTimeout(() => {
        setServerError(false);
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [serverError]);

  return (
    <>
      {/* 서버 상태 알림 */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 bg-red-500 text-white py-3 px-4 text-center z-[9999]"
          >
            서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
} 