import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "트래블윗미 - 함께하는 여행의 시작",
  description:
    "트래블윗미는 여행자들을 위한 커뮤니티 플랫폼입니다. 여행 후기, 맛집 추천, 숙소 정보, 여행 팁, 동행 구하기 등 다양한 여행 정보를 공유하고 소통하세요.",
  keywords: [
    "트래블윗미",
    "여행 커뮤니티",
    "여행 후기",
    "맛집 추천",
    "숙소 추천",
    "여행 팁",
    "동행 구하기",
    "여행 정보",
    "여행 가이드",
    "여행 소셜",
    "여행 메이트",
    "여행 일정",
    "여행 계획",
    "여행 경험 공유",
    "여행자 커뮤니티",
  ].join(", "),
  openGraph: {
    title: "트래블윗미 - 함께하는 여행의 시작",
    description:
      "여행자들을 위한 커뮤니티 플랫폼. 여행 후기, 맛집 추천, 숙소 정보, 여행 팁, 동행 구하기 등 다양한 여행 정보를 공유하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "트래블윗미",
  },
  twitter: {
    card: "summary_large_image",
    title: "트래블윗미 - 함께하는 여행의 시작",
    description:
      "여행자들을 위한 커뮤니티 플랫폼. 여행 후기, 맛집 추천, 숙소 정보, 여행 팁, 동행 구하기 등 다양한 여행 정보를 공유하세요.",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  verification: {
    google: "your-google-site-verification", // Google Search Console 인증 코드
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
