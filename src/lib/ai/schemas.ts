import { z } from "zod";

const scored = z.preprocess(value => {
  if (typeof value === "string") return Number(value.replace("%", ""));
  return value;
}, z.number().min(0).max(100));
const jobText = z.string().catch("信息不足");
const jobList = z.array(z.string()).catch([]);

export const avatarProfileSchema = z.object({
  summary: z.string(),
  traits: z.array(z.object({ name: z.string(), score: scored, evidence: z.array(z.string()) })).min(3).max(6),
  strengths: z.array(z.string()).min(2),
  risks: z.array(z.string()).min(1),
  suggestions: z.array(z.string()).min(1),
  recommendedRoles: z.array(z.object({ title: z.string(), score: scored, reason: z.string() })).min(2).max(5),
});

export const missionPlanSchema = z.object({
  title: z.string(),
  background: z.string(),
  successCriteria: z.array(z.string()).min(2),
  tasks: z.array(z.object({ title: z.string(), deliverable: z.string(), rubric: z.array(z.string()).min(2) })).length(3),
});

export const missionEvaluationSchema = z.object({
  score: scored,
  dimensions: z.array(z.object({ name: z.string(), score: scored, evidence: z.string() })).min(3).max(6),
  strengths: z.array(z.string()).min(1),
  improvements: z.array(z.string()).min(1),
  abilityGains: z.array(z.object({ name: z.string(), delta: z.number().min(0).max(20) })).min(1),
});

export const jobsSchema = z.object({
  jobs: z.array(z.object({
    title: jobText, company: jobText, city: jobText, salary: jobText, url: z.string().catch(""),
    source: jobText, summary: jobText, keywords: jobList, match: scored,
    evidence: jobList, gaps: jobList, recommendation: jobText, risk: jobText,
  })).max(8),
});

export const resumeJdAnalysisSchema = z.object({
  job_title: jobText,
  company_name: jobText,
  company_type: jobText,
  core_responsibilities: jobList,
  hard_requirements: jobList,
  soft_requirements: jobList,
  priority_skills: jobList,
  keywords: jobList,
  hidden_expectations: jobList,
  resume_optimization_direction: jobList,
  evidence: jobList,
});

export const resumeProfileSchema = z.object({
  basic_info: z.record(z.string(), z.string()).catch({}),
  education: jobList,
  internships: z.array(z.object({
    evidence_id: jobText,
    company: jobText,
    role: jobText,
    time: jobText,
    bullets: jobList,
    extracted_skills: jobList,
    needs_quantification: z.boolean().catch(true),
  })).catch([]),
  projects: z.array(z.object({
    evidence_id: jobText,
    name: jobText,
    role: jobText,
    bullets: jobList,
    extracted_skills: jobList,
    evidence_strength: z.enum(["high", "medium", "low"]).catch("medium"),
    needs_quantification: z.boolean().catch(true),
  })).catch([]),
  skills: jobList,
  certificates: jobList,
  self_evaluation: z.string().catch(""),
  raw_sections: jobList,
  evidence_index: z.array(z.object({
    evidence_id: jobText,
    section: jobText,
    text: jobText,
  })).catch([]),
});

export const resumeMatchReportSchema = z.object({
  overall_score: scored,
  score_breakdown: z.object({
    education: scored,
    experience_relevance: scored,
    keyword_coverage: scored,
    result_quality: scored,
    expression_quality: scored,
  }),
  strong_matches: jobList,
  weak_matches: jobList,
  missing_keywords: jobList,
  missing_experience: jobList,
  section_diagnosis: z.array(z.object({
    section: jobText,
    status: z.enum(["已完善", "建议优化", "缺失"]).catch("建议优化"),
    reason: jobText,
    optimization_priority: z.enum(["high", "medium", "low"]).catch("medium"),
    evidence_id: z.string().catch(""),
  })).catch([]),
  rewrite_plan: z.array(z.object({
    section: jobText,
    evidence_id: jobText,
    target_keywords: jobList,
    direction: jobText,
  })).catch([]),
  must_not_fake: jobList,
});

export const resumeDiscoverySchema = z.object({
  questions: z.array(z.object({
    target_skill: jobText,
    related_jd_requirement: jobText,
    related_evidence_id: z.string().catch(""),
    question: jobText,
    why_ask: jobText,
    example_answer_structure: jobText,
    risk_if_unanswered: jobText,
  })).min(1).max(8),
});

export const resumeRewriteSchema = z.object({
  rewrites: z.array(z.object({
    section: jobText,
    evidence_id: jobText,
    original_text: jobText,
    rewritten_text: jobText,
    jd_keywords_used: jobList,
    improvement_reason: jobList,
    risk_level: z.enum(["low", "medium", "high"]).catch("medium"),
    need_user_confirmation: z.boolean().catch(true),
    confirmation_question: z.string().catch(""),
  })).catch([]),
  tailored_resume: z.object({
    summary: z.string().catch(""),
    education: jobList,
    experience: jobList,
    projects: jobList,
    skills: jobList,
  }),
});

export const resumeFactCheckSchema = z.object({
  pass: z.boolean(),
  ats_score: scored,
  keyword_coverage: jobList,
  missing_keywords: jobList,
  risk_items: z.array(z.object({
    text: jobText,
    risk_type: z.enum(["unsupported_fact", "exaggerated_role", "unverified_number", "ats_gap", "too_ai_like", "too_long"]).catch("unsupported_fact"),
    severity: z.enum(["low", "medium", "high"]).catch("medium"),
    reason: jobText,
    suggested_fix: jobText,
  })).catch([]),
  final_suggestions: jobList,
});
