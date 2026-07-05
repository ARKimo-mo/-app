import { NextResponse } from "next/server";
import { resumeParsePrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(resumeParsePrompt, input, ["用户基础简历原文", "页面分区表单内容"]),
  );
}
