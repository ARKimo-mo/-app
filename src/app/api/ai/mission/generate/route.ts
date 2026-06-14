import { NextResponse } from "next/server";
import { missionPrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(missionPrompt, input, ["职业数字分身", "目标岗位", "能力缺口", "岗位 JD"]),
  );
}
