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

interface TravelResponse {
  id: number;
  title: string;
  highlight: string;
  description: string;
  address: string;
  detailAddress: string;
  startDate: string;
  endDate: string;
  minParticipants: number;
  maxParticipants: number;
  price: number;
  discountRate: number;
  discountedPrice: number;
  productNumber: string;
  categoryId: number;
  status: string;
}

interface PaymentCancel {
  code: number;
  message: string;
  response: null;
  tid: string;
  cancelledTid: string;
  orderId: string;
  amount: number;
  reason: string;
  cancelledAt: string;
  status: string;
  resultCode: string;
  resultMsg: string;
  hostInfo: {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string;
    phoneNumber: string | null;
    birthDate: string | null;
    gender: string | null;
    nationality: string | null;
    introduction: string | null;
  };
  travelResponse: TravelResponse;
}

interface PaymentCancelResponse {
  content: PaymentCancel[];
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
  const [cancellations, setCancellations] = useState<PaymentCancel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'completed' | 'cancelled'>('completed');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 결제 요약 정보 계산
  const summary = payments.reduce(
    (acc, curr) => {
      if (curr.paymentStatus === "COMPLETED") {
        acc.completedCount++;
        acc.totalCompletedAmount += curr.amount;
      }
      return acc;
    },
    {
      completedCount: 0,
      totalCompletedAmount: 0,
    }
  );

  useEffect(() => {
    fetchPayments();
  }, []);

  // 탭 변경 시 해당하는 데이터 로드
  useEffect(() => {
    if (activeTab === 'cancelled' && cancellations.length === 0) {
      fetchCancellations();
    }
  }, [activeTab]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await instance.get<PaymentResponse>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments`
      );

      if (response.status === 200) {
        setPayments(response.data.content);
      }
    } catch (error: any) {
      console.error("결제 내역 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCancellations = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const response = await instance.get<PaymentCancelResponse>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/cancellations`,
        {
          params: {
            page: pageNumber,
            size: 10,
          },
        }
      );

      console.log("response==", response);

      if (response.status === 200) {
        if (pageNumber === 0) {
          setCancellations(response.data.content);
        } else {
          setCancellations((prev) => [...prev, ...response.data.content]);
        }
        setHasMore(!response.data.last);
        setPage(pageNumber);
      }
    } catch (error: any) {
      console.error("취소 내역 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreCancellations = () => {
    if (hasMore && !loading) {
      fetchCancellations(page + 1);
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
                0건
              </p>
              <p className="text-sm text-red-600 mt-1">
                0원
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === 'completed'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              결제 완료
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === 'cancelled'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              결제 취소
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : activeTab === 'completed' ? (
          payments.length > 0 ? (
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
                    <span className="text-sm font-medium text-green-600">
                      결제 완료
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
                            src={getProfileImage(payment.hostInfo.profileImageUrl)}
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
              <p className="text-gray-500">결제 완료 내역이 없습니다.</p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            {cancellations && cancellations.length > 0 ? (
              <>
                {cancellations.map((cancel) => (
                  <div
                    key={cancel.tid}
                    className="bg-white rounded-lg shadow-sm p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-gray-900">
                        {cancel.travelResponse.title}
                      </h3>
                      <span className="text-sm font-medium text-red-600">
                        결제 취소
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">상품 번호</span>
                        <span className="text-gray-900">
                          {cancel.travelResponse.productNumber}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">가이드</span>
                        <div className="flex items-center gap-2">
                          <img
                            src={getProfileImage(cancel.hostInfo.profileImageUrl)}
                            alt={cancel.hostInfo.nickname}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-gray-900">
                            {cancel.hostInfo.nickname}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">결제 금액</span>
                        <span className="text-gray-900">
                          {formatAmount(cancel.amount)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">취소 일시</span>
                        <span className="text-gray-900">
                          {formatDate(cancel.cancelledAt)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">취소 사유</span>
                        <span className="text-gray-900">{cancel.reason}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">처리 결과</span>
                        <span className="text-gray-900">{cancel.resultMsg}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">주문 번호</span>
                        <span className="text-gray-900">{cancel.orderId}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">거래 번호</span>
                        <span className="text-gray-900">{cancel.tid}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <button
                    onClick={loadMoreCancellations}
                    className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    더 보기
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">결제 취소 내역이 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
