import { NextResponse } from "next/server";
import { resumeParseAgentPrompt } from "@/agents/interview/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(resumeParseAgentPrompt, input, ["用户粘贴的简历文本", "简历原文证据"]),
  );
}
