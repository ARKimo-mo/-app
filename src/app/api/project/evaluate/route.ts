import { NextResponse } from "next/server";
import { callCompatibleModel } from "@/lib/server/ai";
import { evaluateProject } from "@/lib/growth";
import type { ProjectDeliverable } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const deliverables = (body.deliverables || []) as ProjectDeliverable[];
  const generated = await callCompatibleModel(
    `按用户洞察、结构、AI理解、可行性、指标和表达评审以下 AI 产品经理作品包：${JSON.stringify(deliverables)}。输出 {"score":0,"passed":true,"strengths":[],"improvements":[]}。`
  );
  return NextResponse.json(generated?.score ? { mode: "live", evaluation: generated } : { mode: "fallback", evaluation: evaluateProject(deliverables) });
}
