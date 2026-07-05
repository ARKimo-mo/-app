import { NextResponse } from "next/server";
import { resumeDiscoveryPrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(
    await runPrompt(resumeDiscoveryPrompt, input, ["JD 能力缺口", "简历弱匹配项", "可追问的真实经历证据"]),
  );
}
