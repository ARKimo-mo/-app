import { NextResponse } from "next/server";
import { questionGeneratorAgentPrompt } from "@/agents/interview/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(questionGeneratorAgentPrompt, input, ["JD 岗位画像", "简历 evidence_id", "训练模式"]),
  );
}
