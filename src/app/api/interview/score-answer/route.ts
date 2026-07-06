import { NextResponse } from "next/server";
import { answerScorerAgentPrompt } from "@/agents/interview/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(answerScorerAgentPrompt, input, ["面试问题", "用户回答原文", "JD 岗位画像"]),
  );
}
