import { z } from "zod";
import type { PromptDefinition } from "./prompts";

const rules =
  "你是严谨的中文职业试岗 AI。只根据输入证据判断，不得编造用户经历。信息不足时必须明确说明。只输出合法 JSON，不输出 Markdown。";

const trialReportSchema = z.object({
  verdict: z.string(),
  subjective: z.string(),
  objective: z.string(),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  path: z.array(z.string()),
  fit: z.number().min(0).max(100),
});

const learningPlanSchema = z.object({
  title: z.string(),
  summary: z.string(),
  weeks: z.array(z.object({
    week: z.number().min(1).max(4),
    theme: z.string(),
    goal: z.string(),
    learningTask: z.string(),
    practiceTask: z.string(),
    successCriteria: z.string(),
    exp: z.number().min(0).max(1000),
    ability: z.string(),
    completed: z.boolean(),
  })).length(4),
});

export type TrialReportOutput = z.infer<typeof trialReportSchema>;
export type LearningPlanOutput = z.infer<typeof learningPlanSchema>;

export const trialReportPrompt: PromptDefinition<unknown, TrialReportOutput> = {
  id: "v4-trial-report",
  version: "1.0.0",
  model: "reasoning",
  schema: trialReportSchema,
  build: input =>
    `${rules}\n结合数字分身预判、用户真实体验、任务评价和用户原文，生成一次主客观试岗报告。附件仅有元数据，不能作为已解析证据。输入：${JSON.stringify(input)}\n输出字段：verdict,subjective,objective,strengths[],gaps[],path[],fit。fit 为 0-100 整数。`,
  fallback: () => ({
    verdict: "喜欢，但暂未完全适配",
    subjective: "用户对岗位核心工作兴趣较高，压力主要来自需求变化与协作推进，并能从方案落地中获得成就感。",
    objective: "当前已具备用户洞察和方案设计基础，仍需补齐数据分析与复杂项目推进能力。",
    strengths: ["用户洞察", "方案设计"],
    gaps: ["数据分析", "项目推进"],
    path: ["完成下一次岗位验证", "补齐关键能力短板", "沉淀作品与面试证据"],
    fit: 82,
  }),
};

export const learningPlanPrompt: PromptDefinition<unknown, LearningPlanOutput> = {
  id: "v4-learning-plan",
  version: "1.0.0",
  model: "reasoning",
  schema: learningPlanSchema,
  build: input =>
    `${rules}\n根据试岗报告、目标岗位、用户分身和能力短板生成恰好 4 周学习路线。每周必须包含学习任务、实践任务和可验证的完成标准。输入：${JSON.stringify(input)}\n输出字段：title,summary,weeks:[{week,theme,goal,learningTask,practiceTask,successCriteria,exp,ability,completed}]。`,
  fallback: () => ({
    title: "AI 产品岗位 4 周成长路线",
    summary: "围绕试岗暴露的数据分析与项目推进短板，用学习、实践和复盘形成可验证的能力证据。",
    weeks: [
      {
        week: 1,
        theme: "夯实岗位基础",
        goal: "建立岗位核心方法框架",
        learningTask: "学习需求分析与指标定义",
        practiceTask: "拆解一个真实产品案例",
        successCriteria: "输出一页结构化案例拆解",
        exp: 120,
        ability: "岗位理解",
        completed: false,
      },
      {
        week: 2,
        theme: "补齐数据能力",
        goal: "能够用数据支持产品判断",
        learningTask: "学习漏斗分析与指标体系",
        practiceTask: "完成一次产品数据复盘",
        successCriteria: "提出至少 3 条有证据的结论",
        exp: 160,
        ability: "数据分析",
        completed: false,
      },
      {
        week: 3,
        theme: "强化方案落地",
        goal: "形成可执行的产品方案",
        learningTask: "学习优先级判断与项目推进",
        practiceTask: "输出 MVP 方案与排期",
        successCriteria: "包含范围、风险和验收标准",
        exp: 200,
        ability: "方案设计",
        completed: false,
      },
      {
        week: 4,
        theme: "沉淀求职证据",
        goal: "将成果转化为作品与面试故事",
        learningTask: "学习 STAR 证据表达",
        practiceTask: "完成作品卡与面试回答",
        successCriteria: "形成一份可展示的项目成果",
        exp: 240,
        ability: "表达呈现",
        completed: false,
      },
    ],
  }),
};
