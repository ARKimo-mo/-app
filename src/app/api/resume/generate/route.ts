import { NextResponse } from "next/server";
import { callCompatibleModel } from "@/lib/server/ai";
import { generateResume } from "@/lib/growth";
import type { ProjectDeliverable, ProjectEvaluation } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const deliverables = (body.deliverables || []) as ProjectDeliverable[];
  const evaluation = body.evaluation as ProjectEvaluation;
  const generated = await callCompatibleModel(
    `只根据以下真实交付物生成中文简历项目经历，不得编造数字；缺失数字写“待补充”：${JSON.stringify({ deliverables, evaluation })}。输出 {"title":"","summary":"","bullets":[],"interviewStory":""}。`
  );
  return NextResponse.json(generated?.title ? { mode: "live", resume: generated } : { mode: "fallback", resume: generateResume(deliverables, evaluation) });
}
