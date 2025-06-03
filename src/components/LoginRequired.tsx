import { HiOutlineLockClosed } from "react-icons/hi2";
import { useRouter } from "next/navigation";

interface LoginRequiredProps {
  title?: string;
  message?: string;
  buttonText?: string;
}

export default function LoginRequired({
  title = "로그인이 필요합니다",
  message = "이 페이지는 로그인이 필요한 서비스입니다.",
  buttonText = "로그인 하러가기",
}: LoginRequiredProps) {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 text-center shadow-sm w-full max-w-md">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiOutlineLockClosed className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-6">{message}</p>
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
} 