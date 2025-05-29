"use client";

import { useState, useEffect } from "react";
import instance from "@/app/api/axios";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlineCalendar } from "react-icons/hi2";
import { useRouter } from "next/navigation";

interface Payment {
  id: number;
  travelId: number;
  productNumber: string;
  title: string;
  amount: number;
  status: "COMPLETED" | "CANCELLED" | "REFUNDED";
  paymentMethod: string;
  paymentDate: string;
  refundDate?: string;
  guide: {
    id: number;
    name: string;
    profileImage: string;
  };
}

// 가데이터
const mockPayments: Payment[] = [
  {
    id: 1,
    travelId: 101,
    productNumber: "TRIP-2024-001",
    title: "제주도 3박 4일 힐링 여행",
    amount: 350000,
    status: "COMPLETED",
    paymentMethod: "신용카드",
    paymentDate: "2024-03-15T10:00:00",
    guide: {
      id: 1,
      name: "김제주",
      profileImage: "https://i.pravatar.cc/150?img=1"
    }
  },
  {
    id: 2,
    travelId: 102,
    productNumber: "TRIP-2024-002",
    title: "부산 2박 3일 맛집 투어",
    amount: 250000,
    status: "CANCELLED",
    paymentMethod: "계좌이체",
    paymentDate: "2024-03-20T14:30:00",
    guide: {
      id: 2,
      name: "이부산",
      profileImage: "https://i.pravatar.cc/150?img=2"
    }
  },
  {
    id: 3,
    travelId: 103,
    productNumber: "TRIP-2024-003",
    title: "강원도 스키장 투어",
    amount: 400000,
    status: "REFUNDED",
    paymentMethod: "신용카드",
    paymentDate: "2024-03-10T09:15:00",
    refundDate: "2024-03-12T11:20:00",
    guide: {
      id: 3,
      name: "박강원",
      profileImage: "https://i.pravatar.cc/150?img=3"
    }
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 결제 요약 정보 계산
  const summary = payments.reduce(
    (acc, curr) => {
      if (curr.status === "COMPLETED") {
        acc.completedCount++;
        acc.totalCompletedAmount += curr.amount;
      } else if (curr.status === "REFUNDED") {
        acc.refundedCount++;
        acc.totalRefundedAmount += curr.amount;
      } else if (curr.status === "CANCELLED") {
        acc.cancelledCount++;
        acc.totalCancelledAmount += curr.amount;
      }
      return acc;
    },
    {
      completedCount: 0,
      refundedCount: 0,
      cancelledCount: 0,
      totalCompletedAmount: 0,
      totalRefundedAmount: 0,
      totalCancelledAmount: 0,
    }
  );

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await instance.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/payments`
      );

      if (response.data.status === 200) {
        setPayments(response.data.data);
      }
    } catch (error) {
      console.error('결제 내역 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 실제 API 호출 대신 가데이터 사용
    setTimeout(() => {
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);
  }, []);

  // 날짜 필터링된 결제 내역
  const filteredPayments = payments.filter((payment) => {
    if (!startDate && !endDate) return true;
    const paymentDate = new Date(payment.paymentDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return paymentDate >= start && paymentDate <= end;
    } else if (start) {
      return paymentDate >= start;
    } else if (end) {
      return paymentDate <= end;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "결제완료";
      case "CANCELLED":
        return "결제취소";
      case "REFUNDED":
        return "환불완료";
      default:
        return status;
    }
  };

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
            <h1 className="text-xl font-bold ml-4">결제 내역</h1>
          </div>
        </div>
      </header>

      {/* 결제 요약 정보 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-1">결제 완료</h3>
              <p className="text-2xl font-bold text-green-600">
                {summary.completedCount}건
              </p>
              <p className="text-sm text-green-600 mt-1">
                {summary.totalCompletedAmount.toLocaleString()}원
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-1">
                환불 완료
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {summary.refundedCount}건
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                {summary.totalRefundedAmount.toLocaleString()}원
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800 mb-1">
                결제 취소
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {summary.cancelledCount}건
              </p>
              <p className="text-sm text-red-600 mt-1">
                {summary.totalCancelledAmount.toLocaleString()}원
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
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            결제 내역이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">{payment.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      payment.status
                    )}`}
                  >
                    {getStatusText(payment.status)}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>상품 번호</span>
                    <span>{payment.productNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>가이드</span>
                    <div className="flex items-center gap-2">
                      <Image
                        src={payment.guide.profileImage}
                        alt={payment.guide.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span>{payment.guide.name}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>결제 금액</span>
                    <span>{payment.amount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>결제 수단</span>
                    <span>{payment.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>결제 일시</span>
                    <span>
                      {new Date(payment.paymentDate).toLocaleString()}
                    </span>
                  </div>
                  {payment.refundDate && (
                    <div className="flex justify-between">
                      <span>환불 일시</span>
                      <span>
                        {new Date(payment.refundDate).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 