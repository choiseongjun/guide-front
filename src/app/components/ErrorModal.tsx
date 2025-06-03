"use client";

import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

/**
 * 전역 에러 메시지 모달 컴포넌트
 * 
 * 사용 방법:
 * ```tsx
 * const [showError, setShowError] = useState(false);
 * const [errorMessage, setErrorMessage] = useState("");
 * 
 * // 에러 발생 시
 * setErrorMessage("에러 메시지");
 * setShowError(true);
 * 
 * // 컴포넌트에서 사용
 * <ErrorModal 
 *   isOpen={showError}
 *   message={errorMessage}
 *   onClose={() => setShowError(false)}
 * />
 * ```
 */
export default function ErrorModal({ isOpen, message, onClose }: ErrorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <HiOutlineExclamationTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">오류 발생</h3>
            <p className="text-gray-600 text-center mb-6">
              {message}
            </p>
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                확인
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 