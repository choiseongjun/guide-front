"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import instance from "@/app/api/axios";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiOutlineReceiptPercent,
} from "react-icons/hi2";
import { getProfileImage } from "@/app/common/imgUtils";

interface Payment {
  id: number;
  paymentId: string;
  transactionType: string;
  txId: string;
  userId: number;
  productId: number;
  productName: string;
  productNumber: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: "COMPLETED" | "CANCELLED" | "PENDING";
  paymentDate: string;
  hostUserKey: string;
  hostInfo: {
    id: number;
    nickname: string;
    profileImageUrl: string;
  };
  cardInfo: string;
  failureReason: string | null;
  refundReason: string | null;
  refundDate: string | null;
  metadata: any;
}

interface PaymentResponse {
  content: Payment[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 결제 요약 정보 계산
  const summary = payments.reduce(
    (acc, curr) => {
      if (curr.paymentStatus === "COMPLETED") {
        acc.completedCount++;
        acc.totalCompletedAmount += curr.amount;
      } else if (curr.paymentStatus === "CANCELLED") {
        acc.cancelledCount++;
        acc.totalCancelledAmount += curr.amount;
      }
      return acc;
    },
    {
      completedCount: 0,
      cancelledCount: 0,
      totalCompletedAmount: 0,
      totalCancelledAmount: 0,
    }
  );

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await instance.get<PaymentResponse>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments`
      );

      console.log("response===", response);
      if (response.status === 200) {
        setPayments(response.data.content);
      }
    } catch (error: any) {
      console.error("결제 내역 조회 실패:", error);
      if (error.message === "Network Error") {
        setError("서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError(
          "결제 내역을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount) + "원";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "결제 완료";
      case "CANCELLED":
        return "결제 취소";
      case "PENDING":
        return "결제 대기";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      case "PENDING":
        return "text-yellow-600";
      default:
        return "text-gray-600";
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
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-1">
                결제 완료
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {summary.completedCount}건
              </p>
              <p className="text-sm text-green-600 mt-1">
                {formatAmount(summary.totalCompletedAmount)}
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
                {formatAmount(summary.totalCancelledAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 py-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              새로고침
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-lg shadow-sm p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900">
                    {payment.productName}
                  </h3>
                  <span
                    className={`text-sm font-medium ${getStatusColor(
                      payment.paymentStatus
                    )}`}
                  >
                    {getStatusText(payment.paymentStatus)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">상품 번호</span>
                    <span className="text-gray-900">
                      {payment.productNumber}
                    </span>
                  </div>

                  {payment.hostInfo && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">가이드</span>
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            getProfileImage(payment.hostInfo.profileImageUrl) ||
                            "https://via.placeholder.com/24"
                          }
                          alt={payment.hostInfo.nickname}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-gray-900">
                          {payment.hostInfo.nickname}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-500">결제 금액</span>
                    <span className="text-gray-900">
                      {formatAmount(payment.amount)}
                    </span>
                  </div>

                  {/* <div className="flex justify-between">
                    <span className="text-gray-500">결제 수단</span>
                    <span className="text-gray-900">{payment.cardInfo}</span>
                  </div> */}

                  <div className="flex justify-between">
                    <span className="text-gray-500">결제 일시</span>
                    <span className="text-gray-900">
                      {formatDate(payment.paymentDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">결제 내역이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}
