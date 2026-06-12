import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "职前副本 AI",
  description: "面向大学生的 AI 求职成长平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
