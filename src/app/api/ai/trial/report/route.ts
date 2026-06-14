import { NextResponse } from "next/server";
import { runPrompt } from "@/lib/ai/server";
import { trialReportPrompt } from "@/lib/ai/v4";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(trialReportPrompt, input, [
      "数字分身预判",
      "用户真实体验",
      "任务表现与原文证据",
    ]),
  );
}
