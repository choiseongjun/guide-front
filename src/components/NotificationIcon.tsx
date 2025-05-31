import { useNotificationCount } from "@/hooks/useNotificationCount";
import { HiOutlineBell } from "react-icons/hi2";

export default function NotificationIcon() {
  const { count } = useNotificationCount();

  return (
    <div className="relative">
      <HiOutlineBell className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </div>
  );
} 