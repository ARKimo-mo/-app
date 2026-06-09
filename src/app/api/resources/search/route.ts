import { NextResponse } from "next/server";
import { learningResources } from "@/lib/growth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const query = body.query || "AI 产品经理 学习课程 面试经验";
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return NextResponse.json({ mode: "fallback", resources: learningResources });

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query: `${query} PRD 用户研究 产品实战 面试`,
      search_depth: "advanced",
      max_results: 6,
      include_domains: [
        "woshipm.com",
        "nowcoder.com",
        "pair.withgoogle.com",
        "coursera.org",
        "csdn.net",
        "bilibili.com"
      ]
    })
  });
  if (!response.ok) return NextResponse.json({ mode: "fallback", resources: learningResources });
  const data = await response.json();
  const resources = (data.results || []).map((item: { title: string; url: string; content: string }, index: number) => ({
    id: `web-${index}`,
    title: item.title,
    source: new URL(item.url).hostname,
    url: item.url,
    type: item.title.includes("面试") ? "面经" : "文章",
    summary: item.content?.slice(0, 140) || "公开网页资料",
    read: false
  }));
  return NextResponse.json({ mode: "live", resources });
}
