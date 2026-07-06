import { NextResponse } from "next/server";
import { resumeMatchPrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";
import type { ResumeJDAnalysis, ResumeMatchReport, ResumeProfile } from "@/lib/ai/types";

type ResumeMatchInput = {
  jd_analysis: ResumeJDAnalysis;
  resume_json: ResumeProfile;
};

function ensureMatchPlan(data: ResumeMatchReport, input: ResumeMatchInput): ResumeMatchReport {
  const evidence = input.resume_json.evidence_index;
  const keywords = input.jd_analysis.keywords.slice(0, 3);

  const sectionDiagnosis = data.section_diagnosis.length
    ? data.section_diagnosis
    : evidence.slice(0, 4).map(item => ({
        section: item.section,
        status: "建议优化" as const,
        reason: "已有真实证据，可继续贴合 JD 关键词并补强动作、方法和结果表达。",
        optimization_priority: "medium" as const,
        evidence_id: item.evidence_id,
      }));

  const rewritePlan = data.rewrite_plan.length
    ? data.rewrite_plan
    : evidence.slice(0, 4).map(item => ({
        section: item.section,
        evidence_id: item.evidence_id,
        target_keywords: keywords,
        direction: "保持原始事实不变，强化与目标岗位相关的动作、方法、产出和关键词表达。",
      }));

  const strongMatches = data.strong_matches.length
    ? data.strong_matches
    : evidence.slice(0, 2).map(item => `已有可引用经历证据：${item.text}`);

  return {
    ...data,
    strong_matches: strongMatches,
    section_diagnosis: sectionDiagnosis,
    rewrite_plan: rewritePlan,
  };
}

export async function POST(request: Request) {
  const input = (await request.json()) as ResumeMatchInput;
  const response = await runPrompt(resumeMatchPrompt, input, ["JD 结构化画像", "结构化简历证据索引"]);
  return NextResponse.json({
    ...response,
    data: ensureMatchPlan(response.data, input),
  });
}
