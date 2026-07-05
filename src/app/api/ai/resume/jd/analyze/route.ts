import { NextResponse } from "next/server";
import { resumeJdAnalysisPrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(resumeJdAnalysisPrompt, input, ["用户粘贴的目标 JD", "岗位名称", "公司名称"]),
  );
}
