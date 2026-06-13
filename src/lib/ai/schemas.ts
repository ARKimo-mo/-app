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
