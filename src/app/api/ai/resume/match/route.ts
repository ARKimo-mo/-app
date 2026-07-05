import { NextResponse } from "next/server";
import { resumeMatchPrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(resumeMatchPrompt, input, ["JD 结构化画像", "结构化简历证据索引"]),
  );
}
