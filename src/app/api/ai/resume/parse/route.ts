import { NextResponse } from "next/server";
import { resumeParsePrompt } from "@/lib/ai/prompts";
import { runPrompt } from "@/lib/ai/server";
import type { ResumeProfile } from "@/lib/ai/types";

type ResumeParseInput = {
  resume_text?: string;
  sections?: Partial<Record<"basic" | "education" | "internships" | "projects" | "skills" | "selfEvaluation", string>>;
};

const infoFallback = "信息不足";

function ensureResumeEvidence(data: ResumeProfile, input: ResumeParseInput): ResumeProfile {
  const sections = input.sections ?? {};
  const internshipsText = sections.internships?.trim() ?? "";
  const projectsText = sections.projects?.trim() ?? "";
  const educationText = sections.education?.trim() ?? "";
  const skillsText = sections.skills?.trim() ?? "";
  const selfEvaluationText = sections.selfEvaluation?.trim() ?? "";
  const rawText = input.resume_text?.trim() ?? Object.values(sections).filter(Boolean).join("\n");

  const internships = [...data.internships];
  const projects = [...data.projects];
  const evidenceIndex = [...data.evidence_index];

  if (!internships.length && internshipsText) {
    internships.push({
      evidence_id: "internship-1",
      company: internshipsText.split("｜")[0] || infoFallback,
      role: internshipsText.split("｜")[1] || infoFallback,
      time: infoFallback,
      bullets: [internshipsText],
      extracted_skills: [],
      needs_quantification: true,
    });
  }

  if (!projects.length && projectsText) {
    projects.push({
      evidence_id: "project-1",
      name: projectsText.split("｜")[0] || infoFallback,
      role: projectsText.split("｜")[1] || infoFallback,
      bullets: [projectsText],
      extracted_skills: [],
      evidence_strength: "medium",
      needs_quantification: true,
    });
  }

  const appendEvidence = (evidenceId: string, section: string, text: string) => {
    if (!text) return;
    if (evidenceIndex.some(item => item.evidence_id === evidenceId)) return;
    evidenceIndex.push({ evidence_id: evidenceId, section, text });
  };

  internships.forEach((item, index) => appendEvidence(item.evidence_id || `internship-${index + 1}`, "internships", item.bullets.join("；") || internshipsText));
  projects.forEach((item, index) => appendEvidence(item.evidence_id || `project-${index + 1}`, "projects", item.bullets.join("；") || projectsText));

  if (!evidenceIndex.length && rawText) {
    appendEvidence("resume-1", "resume", rawText.slice(0, 300));
  }

  return {
    ...data,
    education: data.education.length ? data.education : (educationText ? [educationText] : []),
    internships,
    projects,
    skills: data.skills.length ? data.skills : skillsText.split(/[、,，/]/).map(item => item.trim()).filter(Boolean),
    self_evaluation: data.self_evaluation || selfEvaluationText,
    raw_sections: data.raw_sections.length ? data.raw_sections : (rawText ? [rawText] : []),
    evidence_index: evidenceIndex,
  };
}

export async function POST(request: Request) {
  const rawInput = (await request.json()) as ResumeParseInput;
  const input = {
    resume_text: rawInput.resume_text ?? "",
    sections: rawInput.sections ?? {},
  };
  const response = await runPrompt(resumeParsePrompt, input, ["用户基础简历原文", "页面分区表单内容"]);
  return NextResponse.json({
    ...response,
    data: ensureResumeEvidence(response.data, input),
  });
}
