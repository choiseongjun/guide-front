"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiXMark, HiChevronDown } from "react-icons/hi2";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    id: "travel-1",
    category: "여행",
    question: "여행 일정은 어떻게 구성되나요?",
    answer: "각 여행은 가이드가 최적의 경로와 일정을 계획하여 제공합니다. 여행지의 주요 명소, 맛집, 숙소 등을 포함하며, 현지 문화와 특색을 경험할 수 있도록 구성됩니다."
  },
  {
    id: "travel-2",
    category: "여행",
    question: "여행 인원은 몇 명까지 가능한가요?",
    answer: "각 여행마다 최소/최대 인원이 정해져 있습니다. 일반적으로 소규모 그룹(4-8명)으로 운영되어 더 나은 여행 경험을 제공합니다."
  },
  {
    id: "reservation-1",
    category: "예약",
    question: "예약은 언제까지 가능한가요?",
    answer: "여행 출발 3일 전까지 예약이 가능합니다. 단, 인기 여행의 경우 조기 마감될 수 있으니 빠른 예약을 권장드립니다."
  },
  {
    id: "reservation-2",
    category: "예약",
    question: "예약 취소는 어떻게 하나요?",
    answer: "마이페이지 > 나의 여행에서 예약한 여행을 선택하여 취소할 수 있습니다. 출발일 기준 7일 전까지는 전액 환불, 3일 전까지는 50% 환불이 가능합니다."
  },
  {
    id: "payment-1",
    category: "결제",
    question: "결제 방법은 어떤 것이 있나요?",
    answer: "신용카드, 계좌이체, 간편결제(카카오페이, 네이버페이) 등 다양한 결제 방법을 제공합니다."
  },
  {
    id: "payment-2",
    category: "결제",
    question: "환불은 언제 처리되나요?",
    answer: "환불 요청 후 영업일 기준 3-5일 내에 처리됩니다. 결제 수단에 따라 실제 입금까지는 1-3일이 추가로 소요될 수 있습니다."
  },
  {
    id: "account-1",
    category: "계정",
    question: "회원가입은 어떻게 하나요?",
    answer: "카카오 계정으로 간편하게 가입할 수 있습니다. 카카오 로그인 버튼을 클릭하여 계정 연동 후 프로필 정보를 입력하시면 됩니다."
  },
  {
    id: "account-2",
    category: "계정",
    question: "로그인이 안 되나요.",
    answer: "카카오 계정으로 로그인해주세요. 카카오 계정에 문제가 있는 경우 카카오 고객센터로 문의해주시기 바랍니다."
  },
  {
    id: "guide-1",
    category: "가이드",
    question: "가이드는 어떤 분들이신가요?",
    answer: "우리의 가이드들은 특별한 자격증이나 전문 교육이 필요하지 않습니다. 자신이 사랑하는 지역과 문화를 공유하고 싶은 누구나 가이드가 될 수 있습니다. 다만, 여행자들의 안전과 만족을 위해 기본적인 심사 과정을 거치게 됩니다."
  },
  {
    id: "guide-2",
    category: "가이드",
    question: "가이드가 되고 싶어요.",
    answer: "가이드가 되고 싶으시다면, 마이페이지에서 '가이드 신청하기'를 통해 지원하실 수 있습니다. 자신이 가이드하고 싶은 지역과 여행 주제를 정하고, 간단한 자기소개와 함께 신청해주세요. 검토 후 승인되면 바로 가이드 활동을 시작하실 수 있습니다."
  },
  {
    id: "guide-3",
    category: "가이드",
    question: "가이드와 직접 연락이 가능한가요?",
    answer: "네, 가이드의 프로필 페이지에서 '연락하기' 버튼을 통해 언제든지 가이드와 대화를 시작할 수 있습니다. 여행 확정 여부와 관계없이 가이드에게 궁금한 점을 물어보거나 여행 상담을 받으실 수 있습니다."
  }
];

export default function FAQPage() {
  const router = useRouter();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              <HiXMark className="w-6 h-6" />
            </button>
            <h1 className="text-base font-medium tracking-tight">자주 묻는 질문</h1>
            <div className="w-6" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 mb-3 tracking-wide">
              {category}
            </h2>
            <div className="space-y-2">
              {faqItems
                .filter(item => item.category === category)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900 leading-relaxed">
                        {item.question}
                      </span>
                      <HiChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          openItems.includes(item.id) ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openItems.includes(item.id) && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 