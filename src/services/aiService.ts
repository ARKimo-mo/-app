import { jobs } from "../data/jobs";
import { mockEvaluation } from "../data/mockReport";
import { mockCareerProfile } from "../data/mockUser";
import type { CareerProfile, Evaluation, Job } from "../types";

export type UserInput = {
  major: string;
  grade: string;
  city: string;
  interests: string[];
  dislikes: string[];
  workStyles: string[];
  experience: string;
  skills: string[];
  tools: string[];
};

const delay = (ms = 260) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function generateCareerProfile(userInput: Partial<UserInput>): Promise<CareerProfile> {
  await delay();
  return {
    ...mockCareerProfile,
    major: userInput.major || mockCareerProfile.major,
    grade: userInput.grade || mockCareerProfile.grade
  };
}

export async function recommendJobs(_careerProfile: CareerProfile): Promise<Job[]> {
  await delay();
  return jobs;
}

export async function generateJobTask(job: Job, jdText?: string): Promise<NonNullable<Job["task"]>> {
  await delay();
  return (
    job.task ?? {
      scenario: jdText ? `结合目标 JD，完成一个${job.jobName}典型任务` : `完成一个${job.jobName}典型任务`,
      requirements: ["目标用户", "核心问题", "解决方案", "执行路径", "效果指标"]
    }
  );
}

export async function evaluateTask(_answer: string, _job: Job): Promise<Evaluation> {
  await delay();
  return mockEvaluation;
}

export async function generateGrowthReport(evaluation: Evaluation) {
  await delay();
  return evaluation;
}
