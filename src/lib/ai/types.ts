export type AIResponse<T> = {
  mode: "live" | "fallback";
  traceId: string;
  promptVersion: string;
  model: string;
  generatedAt: string;
  evidence: string[];
  data: T;
  error?: string;
};

export type UserProfileInput = {
  name: string;
  targetRole: string;
  city: string;
  strengths: string;
  preferences: string;
  resume: string;
};

export type AvatarProfile = {
  summary: string;
  traits: Array<{ name: string; score: number; evidence: string[] }>;
  strengths: string[];
  risks: string[];
  suggestions: string[];
  recommendedRoles: Array<{ title: string; score: number; reason: string }>;
};

export type MissionPlan = {
  title: string;
  background: string;
  successCriteria: string[];
  tasks: Array<{ title: string; deliverable: string; rubric: string[] }>;
};

export type MissionEvaluation = {
  score: number;
  dimensions: Array<{ name: string; score: number; evidence: string }>;
  strengths: string[];
  improvements: string[];
  abilityGains: Array<{ name: string; delta: number }>;
};

export type JobResult = {
  title: string;
  company: string;
  city: string;
  salary: string;
  url: string;
  source: string;
  summary: string;
  keywords: string[];
  match: number;
  evidence: string[];
  gaps: string[];
  recommendation: string;
  risk: string;
};

export type ResumeJDAnalysis = {
  job_title: string;
  company_name: string;
  company_type: string;
  core_responsibilities: string[];
  hard_requirements: string[];
  soft_requirements: string[];
  priority_skills: string[];
  keywords: string[];
  hidden_expectations: string[];
  resume_optimization_direction: string[];
  evidence: string[];
};

export type ResumeProfile = {
  basic_info: Record<string, string>;
  education: string[];
  internships: Array<{
    evidence_id: string;
    company: string;
    role: string;
    time: string;
    bullets: string[];
    extracted_skills: string[];
    needs_quantification: boolean;
  }>;
  projects: Array<{
    evidence_id: string;
    name: string;
    role: string;
    bullets: string[];
    extracted_skills: string[];
    evidence_strength: "high" | "medium" | "low";
    needs_quantification: boolean;
  }>;
  skills: string[];
  certificates: string[];
  self_evaluation: string;
  raw_sections: string[];
  evidence_index: Array<{ evidence_id: string; section: string; text: string }>;
};

export type ResumeMatchReport = {
  overall_score: number;
  score_breakdown: {
    education: number;
    experience_relevance: number;
    keyword_coverage: number;
    result_quality: number;
    expression_quality: number;
  };
  strong_matches: string[];
  weak_matches: string[];
  missing_keywords: string[];
  missing_experience: string[];
  section_diagnosis: Array<{
    section: string;
    status: "已完善" | "建议优化" | "缺失";
    reason: string;
    optimization_priority: "high" | "medium" | "low";
    evidence_id: string;
  }>;
  rewrite_plan: Array<{
    section: string;
    evidence_id: string;
    target_keywords: string[];
    direction: string;
  }>;
  must_not_fake: string[];
};

export type ResumeDiscovery = {
  questions: Array<{
    target_skill: string;
    related_jd_requirement: string;
    related_evidence_id: string;
    question: string;
    why_ask: string;
    example_answer_structure: string;
    risk_if_unanswered: string;
  }>;
};

export type ResumeRewrite = {
  rewrites: Array<{
    section: string;
    evidence_id: string;
    original_text: string;
    rewritten_text: string;
    jd_keywords_used: string[];
    improvement_reason: string[];
    risk_level: "low" | "medium" | "high";
    need_user_confirmation: boolean;
    confirmation_question: string;
  }>;
  tailored_resume: {
    summary: string;
    education: string[];
    experience: string[];
    projects: string[];
    skills: string[];
  };
};

export type ResumeFactCheck = {
  pass: boolean;
  ats_score: number;
  keyword_coverage: string[];
  missing_keywords: string[];
  risk_items: Array<{
    text: string;
    risk_type: "unsupported_fact" | "exaggerated_role" | "unverified_number" | "ats_gap" | "too_ai_like" | "too_long";
    severity: "low" | "medium" | "high";
    reason: string;
    suggested_fix: string;
  }>;
  final_suggestions: string[];
};
