"use client";

import Link from "next/link";
import {
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineHeart,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";

export default function MyPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">마이</h1>

      <div className="space-y-4">
        <Link href="/my/account" className="block">
          <div className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50">
            <HiOutlineUser className="w-6 h-6 text-gray-600 mr-3" />
            <span className="text-gray-800">계정 설정</span>
          </div>
        </Link>

        <Link href="/my/wishlist" className="block">
          <div className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50">
            <HiOutlineHeart className="w-6 h-6 text-gray-600 mr-3" />
            <span className="text-gray-800">찜 목록</span>
          </div>
        </Link>

        <Link href="/my/reviews" className="block">
          <div className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50">
            <HiOutlineChatBubbleLeftRight className="w-6 h-6 text-gray-600 mr-3" />
            <span className="text-gray-800">내 리뷰</span>
          </div>
        </Link>

        <Link href="/my/settings" className="block">
          <div className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50">
            <HiOutlineCog className="w-6 h-6 text-gray-600 mr-3" />
            <span className="text-gray-800">설정</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
