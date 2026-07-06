import { NextResponse } from "next/server";
import { interviewerAgentPrompt } from "@/agents/interview/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(interviewerAgentPrompt, input, ["当前问题", "用户回答记录", "追问次数", "剩余题目"]),
  );
}
