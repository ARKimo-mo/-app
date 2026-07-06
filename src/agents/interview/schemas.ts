import { z } from "zod";

const scored = z.preprocess(value => {
  if (typeof value === "string") return Number(value.replace("%", ""));
  return value;
}, z.number().min(0).max(100));

const text = z.string().catch("信息不足");
const list = z.array(z.string()).catch([]);

export const interviewJdProfileSchema = z.object({
  job_title: text,
  company_name: text,
  role_summary: text,
  core_competencies: list,
  technical_skills: list,
  behavioral_skills: list,
  business_scenarios: list,
  keywords: list,
  interview_focus: list,
  evidence: list,
});

export const interviewResumeProfileSchema = z.object({
  candidate_summary: text,
  education: list,
  experiences: z.array(z.object({
    evidence_id: text,
    section: text,
    role: text,
    text,
    skills: list,
    risk_notes: list,
  })).catch([]),
  skill_evidence: z.array(z.object({
    skill: text,
    evidence_id: text,
    evidence_text: text,
  })).catch([]),
  evidence_index: z.array(z.object({
    evidence_id: text,
    section: text,
    text,
  })).catch([]),
  gaps: list,
});

export const interviewQuestionPlanSchema = z.object({
  mode: z.enum(["special_training", "mock_interview"]).catch("special_training"),
  opening: text,
  questions: z.array(z.object({
    id: text,
    type: z.enum(["behavioral", "technical", "case", "resume_deep_dive", "motivation", "pressure"]).catch("behavioral"),
    question: text,
    target_competency: text,
    related_jd_keywords: list,
    related_evidence_ids: list,
    expected_answer_points: list,
    followup_strategy: text,
    difficulty: z.enum(["easy", "medium", "hard"]).catch("medium"),
    evidence: list,
  })).min(3).max(10),
  interview_goal: text,
  risk_reminders: list,
});

export const interviewNextActionSchema = z.object({
  action: z.enum(["follow_up", "next_question", "end_interview"]).catch("next_question"),
  follow_up_question: z.string().catch(""),
  reason: text,
  interviewer_feedback: text,
  evidence: list,
});

export const interviewAnswerScoreSchema = z.object({
  question_id: text,
  total_score: scored,
  dimension_scores: z.array(z.object({
    name: text,
    score: scored,
    reason: text,
    evidence: text,
  })).min(3).max(6),
  strengths: list,
  improvements: list,
  missing_points: list,
  risk_items: z.array(z.object({
    text,
    risk_type: z.enum(["unsupported_fact", "too_general", "off_topic", "too_short", "exaggerated"]).catch("too_general"),
    severity: z.enum(["low", "medium", "high"]).catch("medium"),
    suggestion: text,
  })).catch([]),
  sample_rewrite: text,
});

export const interviewFinalReviewSchema = z.object({
  overall_score: scored,
  summary: text,
  dimension_summary: z.array(z.object({
    name: text,
    score: scored,
    comment: text,
  })).min(3).max(8),
  strongest_answers: list,
  weakest_answers: list,
  keyword_coverage: list,
  missing_keywords: list,
  next_training_plan: list,
  final_suggestions: list,
});
