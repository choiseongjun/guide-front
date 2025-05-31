"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiXMark, HiOutlineCheck } from "react-icons/hi2";
import instance from "@/app/api/axios";

interface SuggestionForm {
  category: string;
  content: string;
  email: string;
}

const categories = [
  { id: "SERVICE_USE", label: "서비스 이용" },
  { id: "BUG_REPORT", label: "버그 신고" },
  { id: "FEATURE_REQUEST", label: "기능 제안" },
  { id: "ETC", label: "기타" },
];

export default function SuggestionPage() {
  const router = useRouter();
  const [form, setForm] = useState<SuggestionForm>({
    category: "",
    content: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const resetForm = () => {
    setForm({
      category: "",
      content: "",
      email: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.category || !form.content) {
      alert("카테고리와 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await instance.post("/api/v1/suggestions", {
        category: form.category,
        content: form.content,
        email: form.email || undefined,
      });

      if (response.data.status === 200) {
        setShowSuccessModal(true);
        resetForm();
      }
    } catch (error) {
      console.error("건의사항 등록 실패:", error);
      alert("건의사항 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-lg font-semibold">건의사항</h1>
            <div className="w-6" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">카테고리</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, category: category.id }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    form.category === category.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-200 text-gray-700"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">내용</h2>
            <textarea
              value={form.content}
              onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="건의사항 내용을 입력해주세요."
              className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none"
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">이메일 (선택)</h2>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="답변을 받으실 이메일을 입력해주세요."
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            />
            <p className="mt-2 text-sm text-gray-500">
              이메일을 입력하시면 답변을 받으실 수 있습니다.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "등록 중..." : "건의사항 등록하기"}
          </button>
        </form>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <HiOutlineCheck className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">건의사항을 주셔서 감사합니다</h3>
              <p className="text-gray-600 text-center mb-6">
                소중한 의견 감사합니다. 더 나은 서비스로 보답하겠습니다.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.back();
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 