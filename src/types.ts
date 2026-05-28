export type Job = {
  jobId: string;
  jobName: string;
  match: number;
  description: string;
  coreSkills: string[];
  tags: string[];
  reasons: string[];
  risk: string;
  color: "blue" | "mint" | "purple";
  task?: {
    scenario: string;
    requirements: string[];
  };
};

export type CareerProfile = {
  name: string;
  identity: string;
  major: string;
  grade: string;
  tags: string[];
  keywords: string[];
  strengths: string[];
  improvements: string[];
  environment: string[];
};

export type Evaluation = {
  totalScore: number;
  summary: string;
  dimensions: Array<{
    name: string;
    score: number;
    note: string;
  }>;
  strengths: string[];
  improvements: string[];
};
