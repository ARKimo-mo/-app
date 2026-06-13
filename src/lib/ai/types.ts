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
