import { NextResponse } from "next/server";
import { resumeFactCheckPrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(resumeFactCheckPrompt, input, ["优化前后简历对比", "JD 关键词", "事实边界 evidence_index"]),
  );
}
