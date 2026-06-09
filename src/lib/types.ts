export type RoleId = "ai-pm" | "ai-engineer" | "data-analyst" | "ai-growth";
export type CompanyId = "enterprise" | "scaleup" | "startup";

export type Profile = {
  name: string;
  mbti: string;
  communication: number;
  structure: number;
  technical: number;
  ambiguity: number;
  pressure: number;
  business: number;
  resume: string;
};

export type RoleTemplate = {
  id: RoleId;
  title: string;
  tagline: string;
  dailyMission: string;
  strengths: string[];
  dimensions: string[];
  challenges: string[];
};

export type CompanyTemplate = {
  id: CompanyId;
  title: string;
  tagline: string;
  environment: string;
  pressure: string;
  values: string[];
};

export type PixelPosition = {
  x: number;
  y: number;
};

export type NpcRole = "mentor" | "teammate" | "engineer" | "operator" | "boss" | "hr";

export type SceneVisual = {
  zone: "desk" | "meeting" | "whiteboard" | "discussion" | "review";
  avatarPosition: PixelPosition;
  activeNpc: NpcRole;
  objectFocus: "laptop" | "meeting-table" | "whiteboard" | "chat-board" | "report-screen";
  bubbleTone: "task" | "sync" | "idea" | "conflict" | "reflection";
};

export type Scene = {
  id: string;
  title: string;
  time: string;
  place: string;
  prompt: string;
  visual: SceneVisual;
};

export type SceneResult = {
  scene: Scene;
  action: string;
  dialogue: string;
  evidence: string;
  score: number;
};

export type SimulationReport = {
  fitScore: number;
  roleScore: number;
  companyScore: number;
  longTermScore: number;
  verdict: string;
  summary: string;
  risks: string[];
  recommendations: string[];
  radar: Array<{ dimension: string; score: number }>;
  scenes: SceneResult[];
};

export type CareerStage = "explorer" | "learner" | "intern" | "candidate";
export type CompetencyId = "knowledge" | "tools" | "core" | "practice" | "communication";

export type Competency = {
  id: CompetencyId;
  label: string;
  current: number;
  target: number;
};

export type GrowthEvidence = {
  id: string;
  competency: CompetencyId;
  title: string;
  detail: string;
  delta: number;
  source: "quiz" | "deliverable" | "review";
  createdAt: string;
};

export type Milestone = {
  id: CareerStage;
  title: string;
  description: string;
  unlocked: boolean;
};

export type CareerAvatar = {
  stage: CareerStage;
  targetRole: RoleId | null;
  initialFit: number;
  currentFit: number;
  competencies: Competency[];
  evidence: GrowthEvidence[];
  unlockedItems: string[];
};

export type RoleMatch = {
  roleId: RoleId;
  score: number;
  reason: string;
  gap: string;
};

export type LearningResource = {
  id: string;
  title: string;
  source: string;
  url: string;
  type: "课程" | "文章" | "面经";
  summary: string;
  read: boolean;
};

export type LearningTask = {
  id: string;
  title: string;
  week: number;
  done: boolean;
  kind: "learn" | "quiz";
};

export type ProjectDeliverable = {
  id: string;
  title: string;
  prompt: string;
  content: string;
  submitted: boolean;
};

export type ProjectEvaluation = {
  score: number;
  strengths: string[];
  improvements: string[];
  passed: boolean;
};

export type ResumeProject = {
  title: string;
  summary: string;
  bullets: string[];
  interviewStory: string;
};
