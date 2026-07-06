export type InterviewMode = "special_training" | "mock_interview";

export type InterviewJDInput = {
  job_title: string;
  company_name?: string;
  target_direction?: string;
  job_description: string;
};

export type InterviewJDProfile = {
  job_title: string;
  company_name: string;
  role_summary: string;
  core_competencies: string[];
  technical_skills: string[];
  behavioral_skills: string[];
  business_scenarios: string[];
  keywords: string[];
  interview_focus: string[];
  evidence: string[];
};

export type InterviewResumeProfile = {
  candidate_summary: string;
  education: string[];
  experiences: Array<{
    evidence_id: string;
    section: string;
    role: string;
    text: string;
    skills: string[];
    risk_notes: string[];
  }>;
  skill_evidence: Array<{
    skill: string;
    evidence_id: string;
    evidence_text: string;
  }>;
  evidence_index: Array<{
    evidence_id: string;
    section: string;
    text: string;
  }>;
  gaps: string[];
};

export type InterviewQuestion = {
  id: string;
  type: "behavioral" | "technical" | "case" | "resume_deep_dive" | "motivation" | "pressure";
  question: string;
  target_competency: string;
  related_jd_keywords: string[];
  related_evidence_ids: string[];
  expected_answer_points: string[];
  followup_strategy: string;
  difficulty: "easy" | "medium" | "hard";
  evidence: string[];
};

export type InterviewQuestionPlan = {
  mode: InterviewMode;
  opening: string;
  questions: InterviewQuestion[];
  interview_goal: string;
  risk_reminders: string[];
};

export type InterviewTurn = {
  question_id: string;
  question: string;
  answer: string;
  followup_depth: number;
  score?: number;
};

export type InterviewNextAction = {
  action: "follow_up" | "next_question" | "end_interview";
  follow_up_question: string;
  reason: string;
  interviewer_feedback: string;
  evidence: string[];
};

export type InterviewAnswerScore = {
  question_id: string;
  total_score: number;
  dimension_scores: Array<{
    name: string;
    score: number;
    reason: string;
    evidence: string;
  }>;
  strengths: string[];
  improvements: string[];
  missing_points: string[];
  risk_items: Array<{
    text: string;
    risk_type: "unsupported_fact" | "too_general" | "off_topic" | "too_short" | "exaggerated";
    severity: "low" | "medium" | "high";
    suggestion: string;
  }>;
  sample_rewrite: string;
};

export type InterviewFinalReview = {
  overall_score: number;
  summary: string;
  dimension_summary: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strongest_answers: string[];
  weakest_answers: string[];
  keyword_coverage: string[];
  missing_keywords: string[];
  next_training_plan: string[];
  final_suggestions: string[];
};
