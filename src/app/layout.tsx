import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import ServerStatusProvider from "./ServerStatusProvider";

const inter = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "여행메이트",
  description: "나만의 여행 가이드를 찾아보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <ServerStatusProvider>
          <ClientLayout>{children}</ClientLayout>
        </ServerStatusProvider>
      </body>
    </html>
  );
}
