import { NextResponse } from "next/server";
import { callCompatibleModel } from "@/lib/server/ai";
import { learningTasks } from "@/lib/growth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const generated = await callCompatibleModel(
    `根据能力缺口为 AI 产品经理候选人生成 3 周学习任务。用户信息：${JSON.stringify(body)}。输出 {"tasks":[{"id":"","title":"","week":1,"done":false,"kind":"learn或quiz"}]}`
  );
  return NextResponse.json(generated?.tasks ? { mode: "live", tasks: generated.tasks } : { mode: "fallback", tasks: learningTasks });
}
