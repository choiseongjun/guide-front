"use client";
import Link from "next/link";
import {
  HiOutlineEnvelope,
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 회사 정보 아코디언 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">회사 정보</h3>
              {/* <span className="text-sm text-gray-500">(클릭하여 펼치기)</span> */}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiOutlineChevronDown className="w-5 h-5 text-gray-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 space-y-6">
                  {/* 회사 정보 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      회사 정보
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>회사명: 트윗</li>
                      <li>대표이사: 최성준</li>
                      <li>사업자등록번호: 880-05-02957</li>
                      <li>주소: 서울시 동작구 상도동 211-114 201호</li>
                      {/* <li className="flex items-center gap-2">
                        <HiOutlineEnvelope className="w-4 h-4" />
                        <span>tripcsj2702@gmail.com</span>
                      </li> */}
                    </ul>
                  </div>

                  {/* 고객센터 */}
                  {/* <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      고객센터
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <HiOutlineClock className="w-4 h-4" />
                        <span>운영시간: 평일 10:00 - 18:00</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <HiOutlineClock className="w-4 h-4" />
                        <span>점심시간: 12:00 - 13:00</span>
                      </li>
                      <li>주말 및 공휴일 휴무</li>
                      <li className="flex items-center gap-2">
                        <HiOutlineEnvelope className="w-4 h-4" />
                        <span>문의메일: travelwithmemaster@gmail.com</span>
                      </li>
                    </ul>
                  </div> */}

                  {/* 서비스 정보 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      서비스
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>
                        <Link
                          href="https://www.notion.so/203f6533a0e28064a3b0c4dfc8729dd8?source=copy_link"
                          className="hover:text-blue-600 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          이용약관
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://www.notion.so/203f6533a0e280a8b602f5a0c7bfc87e?source=copy_link"
                          className="hover:text-blue-600 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          개인정보처리방침
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://www.notion.so/204f6533a0e28002a75cd1eba80fbec5?source=copy_link"
                          className="hover:text-blue-600 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          환불 정책
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 저작권 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} 트윗. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
