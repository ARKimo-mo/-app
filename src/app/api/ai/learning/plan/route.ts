import { NextResponse } from "next/server";
import { runPrompt } from "@/lib/ai/server";
import { learningPlanPrompt } from "@/lib/ai/v4";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(learningPlanPrompt, input, ["试岗报告", "岗位短板", "用户分身", "任务评价"]),
  );
}
