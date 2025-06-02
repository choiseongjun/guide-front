"use client";

import { useState, useEffect } from "react";

interface TripTabsProps {
  activeTab: "info" | "schedule" | "reviews" | "photos";
  onTabChange: (tab: "info" | "schedule" | "reviews" | "photos") => void;
}

export default function TripTabs({ activeTab, onTabChange }: TripTabsProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      const tabs = document.querySelector('.trip-tabs');
      
      if (header && tabs) {
        const headerBottom = header.getBoundingClientRect().bottom;
        setIsSticky(headerBottom <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`trip-tabs ${
        isSticky
          ? "fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm"
          : "relative bg-white border-b"
      }`}
    >
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-4">
          <button
            onClick={() => onTabChange("info")}
            className={`py-4 text-sm font-medium ${
              activeTab === "info"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            상세정보
          </button>
          <button
            onClick={() => onTabChange("schedule")}
            className={`py-4 text-sm font-medium ${
              activeTab === "schedule"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            일정
          </button>
          <button
            onClick={() => onTabChange("reviews")}
            className={`py-4 text-sm font-medium ${
              activeTab === "reviews"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            리뷰
          </button>
          <button
            onClick={() => onTabChange("photos")}
            className={`py-4 text-sm font-medium ${
              activeTab === "photos"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            사진
          </button>
        </div>
      </div>
    </div>
  );
} 