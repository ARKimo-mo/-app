import { NextResponse } from "next/server";
import { jobsPrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  let searchResults: unknown[] = [];
  const key = process.env.TAVILY_API_KEY;

  if (key) {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query: `${input.query} 招聘 职位 JD`,
        search_depth: "advanced",
        max_results: 8,
        include_domains: ["zhaopin.com", "jobs.51job.com", "liepin.com", "bosszhipin.com"],
      }),
      signal: AbortSignal.timeout(20000),
    }).catch(() => null);

    if (response?.ok) searchResults = (await response.json()).results || [];
  }

  return NextResponse.json(
    await runPrompt(
      jobsPrompt,
      { ...input, searchResults },
      ["Tavily 公开网页搜索结果", "职业数字分身", "用户搜索条件"],
    ),
  );
}
