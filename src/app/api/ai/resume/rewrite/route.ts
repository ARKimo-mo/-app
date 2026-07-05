import { NextResponse } from "next/server";
import { resumeRewritePrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(resumeRewritePrompt, input, ["JD 画像", "简历 evidence_id", "匹配诊断 rewrite_plan", "用户补充信息"]),
  );
}
