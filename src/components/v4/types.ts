import type { JobResult, MissionEvaluation, MissionPlan } from "@/lib/ai/types";

export type TrialSource = "curated" | "searched_job" | "manual_jd";

export type TrialJob = {
  id: string;
  title: string;
  company: string;
  city: string;
  salary: string;
  description: string;
  image: string;
  keywords: string[];
  sourceName: string;
  sourceUrl: string;
  jdText: string;
};

export type JobPrediction = {
  interest: number;
  pressure: number;
  achievement: number;
  fit: number;
  evidence: string[];
  uncertainties: string[];
};

export type TrialAttachment = {
  id: string;
  name: string;
  type: string;
  size: number;
};

export type TrialReflection = {
  interest: number;
  pressure: number;
  achievement: number;
  continueIntent: number;
  note: string;
};

export type TrialReport = {
  verdict: string;
  subjective: string;
  objective: string;
  strengths: string[];
  gaps: string[];
  path: string[];
  fit: number;
};

export type LearningWeek = {
  week: number;
  theme: string;
  goal: string;
  learningTask: string;
  practiceTask: string;
  successCriteria: string;
  exp: number;
  ability: string;
  completed: boolean;
};

export type LearningPlan = {
  title: string;
  summary: string;
  weeks: LearningWeek[];
};

export type TrialHistoryItem = {
  id: string;
  jobTitle: string;
  source: TrialSource;
  verdict: string;
  fit: number;
  completedAt: string;
  calibratedAt: string;
};

export type V4FlowState = {
  trialSource: TrialSource;
  selectedJob: TrialJob | null;
  selectedSearchJob: JobResult | null;
  prediction: JobPrediction | null;
  mission: MissionPlan | null;
  submission: {
    text: string;
    attachments: TrialAttachment[];
    submittedAt: string;
  };
  evaluation: MissionEvaluation | null;
  reflection: TrialReflection;
  report: TrialReport | null;
  calibrationProposal: string[];
  calibratedAt: string;
  history: TrialHistoryItem[];
  learningPlan: LearningPlan | null;
};
