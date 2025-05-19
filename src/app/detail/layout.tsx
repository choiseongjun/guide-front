import type { Metadata } from "next";
import "./globals.css";

export default function DetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="main-container">
          <div className="content">{children}</div>
        </div>
      </body>
    </html>
  );
}
