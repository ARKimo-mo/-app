import { NextResponse } from "next/server";
import { jdParseAgentPrompt } from "@/agents/interview/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(jdParseAgentPrompt, input, ["用户粘贴的目标 JD", "目标岗位名称", "目标方向"]),
  );
}
