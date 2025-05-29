interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "로딩 중..." }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-[1px] z-[9999] flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-700 font-medium">{message}</p>
    </div>
  );
} 