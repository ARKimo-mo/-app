import { NextResponse } from "next/server";
import { evaluationPrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(await runPrompt(evaluationPrompt, input, ["动态副本评分标准", "用户开放回答"]));
}
