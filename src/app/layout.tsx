"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlinePhone,
} from "react-icons/hi2";
import { BsHeadset } from "react-icons/bs";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <div className="main-container">
          <header className="header">
            <div className="header-content">
              <div className="header-left"></div>
              <h1 className="header-title">TripWithMe</h1>
              <div className="header-right">
                <Link href="/wishlist" className="header-icon">
                  <HiOutlineHeart />
                </Link>
                <Link href="/support" className="header-icon">
                  <BsHeadset />
                </Link>
              </div>
            </div>
          </header>

          <div className="content">{children}</div>

          <nav className="bottom-nav">
            <Link
              href="/"
              className={`nav-item ${pathname === "/" ? "active" : ""}`}
            >
              <HiOutlineHome className="nav-icon" />
              <span>여행</span>
            </Link>
            <Link
              href="/social"
              className={`nav-item ${pathname === "/social" ? "active" : ""}`}
            >
              <HiOutlineUserGroup className="nav-icon" />
              <span>소셜</span>
            </Link>
            <Link
              href="/chat"
              className={`nav-item ${pathname === "/chat" ? "active" : ""}`}
            >
              <HiOutlineChatBubbleLeftRight className="nav-icon" />
              <span>채팅</span>
            </Link>
            <Link
              href="/profile"
              className={`nav-item ${pathname === "/profile" ? "active" : ""}`}
            >
              <HiOutlineUser className="nav-icon" />
              <span>마이</span>
            </Link>
          </nav>
        </div>
      </body>
    </html>
  );
}
