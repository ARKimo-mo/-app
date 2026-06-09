import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "AI岗位体验小镇",
  description: "让 AI 分身先去不同公司上一天班，再决定你要投哪里。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
