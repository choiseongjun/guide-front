"use client";

import { useState, useEffect } from "react";
import instance from "@/app/api/axios";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlineCalendar } from "react-icons/hi2";
import { useRouter } from "next/navigation";

interface Settlement {
  id: number;
  travelId: number;
  title: string;
  price: number;
  isPaid: boolean;
  participantCount: number;
  totalAmount: number;
  taxAmount: number;
  finalAmount: number;
  status: "PENDING" | "COMPLETED";
  createdAt: string;
}

// 가데이터
const mockSettlements: Settlement[] = [
  {
    id: 1,
    travelId: 101,
    title: "제주도 3박 4일 힐링 여행",
    price: 350000,
    isPaid: true,
    participantCount: 8,
    totalAmount: 2800000,
    taxAmount: 280000,
    finalAmount: 2520000,
    status: "COMPLETED",
    createdAt: "2024-03-15T10:00:00",
  },
  {
    id: 2,
    travelId: 102,
    title: "부산 2박 3일 맛집 투어",
    price: 250000,
    isPaid: true,
    participantCount: 6,
    totalAmount: 1500000,
    taxAmount: 150000,
    finalAmount: 1350000,
    status: "PENDING",
    createdAt: "2024-03-20T14:30:00",
  },
  {
    id: 3,
    travelId: 103,
    title: "강원도 스키장 투어",
    price: 400000,
    isPaid: true,
    participantCount: 10,
    totalAmount: 4000000,
    taxAmount: 400000,
    finalAmount: 3600000,
    status: "COMPLETED",
    createdAt: "2024-03-10T09:15:00",
  },
  {
    id: 4,
    travelId: 104,
    title: "여수 바다 여행",
    price: 300000,
    isPaid: true,
    participantCount: 5,
    totalAmount: 1500000,
    taxAmount: 150000,
    finalAmount: 1350000,
    status: "PENDING",
    createdAt: "2024-03-22T16:45:00",
  },
  {
    id: 5,
    travelId: 105,
    title: "경주 문화 유적지 투어",
    price: 200000,
    isPaid: true,
    participantCount: 7,
    totalAmount: 1400000,
    taxAmount: 140000,
    finalAmount: 1260000,
    status: "COMPLETED",
    createdAt: "2024-03-05T11:20:00",
  },
];

export default function SettlementPage() {
  const router = useRouter();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 정산 요약 정보 계산
  const summary = settlements.reduce(
    (acc, curr) => {
      if (curr.status === "COMPLETED") {
        acc.completedCount++;
        acc.totalCompletedAmount += curr.finalAmount;
      } else {
        acc.pendingCount++;
        acc.totalPendingAmount += curr.finalAmount;
      }
      return acc;
    },
    {
      completedCount: 0,
      pendingCount: 0,
      totalCompletedAmount: 0,
      totalPendingAmount: 0,
    }
  );

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const response = await instance.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/guides/settlements`
      );

      if (response.data.status === 200) {
        setSettlements(response.data.data);
      }
    } catch (error) {
      console.error('정산 내역 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 실제 API 호출 대신 가데이터 사용
    setTimeout(() => {
      setSettlements(mockSettlements);
      setLoading(false);
    }, 1000);
  }, []);

  // 날짜 필터링된 정산 내역
  const filteredSettlements = settlements.filter((settlement) => {
    if (!startDate && !endDate) return true;
    const settlementDate = new Date(settlement.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return settlementDate >= start && settlementDate <= end;
    } else if (start) {
      return settlementDate >= start;
    } else if (end) {
      return settlementDate <= end;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <HiOutlineArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-4">정산 내역</h1>
          </div>
        </div>
      </header>

      {/* 정산 요약 정보 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto p-4">
          <div className="mb-4 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-1">총 가이드 횟수</h3>
            <p className="text-2xl font-bold text-gray-900">
              {settlements.length}회
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(settlements[0]?.createdAt).getFullYear()}년부터 현재까지
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-1">정산 완료</h3>
              <p className="text-2xl font-bold text-blue-600">
                {summary.completedCount}건
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {summary.totalCompletedAmount.toLocaleString()}원
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-1">
                정산 대기
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {summary.pendingCount}건
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                {summary.totalPendingAmount.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 기간 조회 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              <HiOutlineCalendar className="w-5 h-5" />
              <span>
                {startDate && endDate
                  ? `${startDate} ~ ${endDate}`
                  : "전체 기간"}
              </span>
            </button>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                초기화
              </button>
            )}
          </div>
          {showDatePicker && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredSettlements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            정산 내역이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSettlements.map((settlement) => (
              <div
                key={settlement.id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">{settlement.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      settlement.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {settlement.status === "COMPLETED" ? "정산완료" : "정산대기"}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>참가자 수</span>
                    <span>{settlement.participantCount}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span>정산 전 금액</span>
                    <span>{settlement.totalAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>세금</span>
                    <span>{settlement.taxAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between font-semibold text-blue-600">
                    <span>최종 정산 금액</span>
                    <span>{settlement.finalAmount.toLocaleString()}원</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(settlement.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 