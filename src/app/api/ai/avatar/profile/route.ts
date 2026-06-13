import { NextResponse } from "next/server";
import { avatarPrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(await runPrompt(avatarPrompt, input, ["引导问卷", "用户粘贴的经历文本", "目标岗位与城市"]));
}
