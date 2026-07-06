import { NextResponse } from "next/server";
import { reviewCoachAgentPrompt } from "@/agents/interview/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(reviewCoachAgentPrompt, input, ["完整面试 turns", "逐题评分", "JD 关键词"]),
  );
}
