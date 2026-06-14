import type { z } from "zod";
import {
  avatarProfileSchema,
  jobsSchema,
  missionEvaluationSchema,
  missionPlanSchema,
} from "./schemas";
import type {
  AvatarProfile,
  JobResult,
  MissionEvaluation,
  MissionPlan,
  UserProfileInput,
} from "./types";

export type PromptDefinition<I, O> = {
  id: string;
  version: string;
  model: "fast" | "reasoning";
  schema: z.ZodType<O>;
  build: (input: I) => string;
  fallback: (input: I) => O;
};

const rules =
  "你是严谨的中文职业成长 AI。只根据输入判断，不得编造经历、公司、数字或链接；信息不足时明确说明。区分事实、推断与建议。每个评分和结论必须引用输入证据。只输出合法 JSON，不输出 Markdown。";
const json = (value: unknown) => JSON.stringify(value);

export const avatarPrompt: PromptDefinition<UserProfileInput, AvatarProfile> = {
  id: "avatar-profile",
  version: "1.1.0",
  model: "fast",
  schema: avatarProfileSchema,
  build: (input) =>
    `${rules}\n根据用户资料生成职业数字分身。输入：${json(input)}\n输出字段：summary, traits[{name,score,evidence[]}], strengths[], risks[], suggestions[], recommendedRoles[{title,score,reason}]。traits 至少 3 项，strengths 至少 2 项，recommendedRoles 至少 2 项。`,
  fallback: (input) => ({
    summary: `${input.name || "用户"}适合从${input.targetRole || "产品经理"}方向开始探索，当前优势集中在结构化思考与持续学习。`,
    traits: [
      { name: "逻辑分析", score: 86, evidence: [input.strengths || "用户自述擅长分析问题"] },
      { name: "学习成长", score: 88, evidence: [input.resume || "已提供个人经历文本"] },
      { name: "沟通协作", score: 78, evidence: [input.preferences || "偏好团队协作"] },
    ],
    strengths: ["能够拆解复杂问题", "具备持续学习意识"],
    risks: ["真实项目量化证据仍需补充"],
    suggestions: ["完成一个与目标岗位相关的定制副本", "补充可验证的项目成果"],
    recommendedRoles: [
      { title: input.targetRole || "产品经理", score: 88, reason: "与目标方向及现有能力较匹配" },
      { title: "数据分析师", score: 78, reason: "结构化分析能力可迁移" },
    ],
  }),
};

type MissionInput = {
  profile: UserProfileInput;
  avatar?: AvatarProfile;
  targetRole: string;
  jd?: string;
};

export const missionPrompt: PromptDefinition<MissionInput, MissionPlan> = {
  id: "mission-generate",
  version: "1.1.0",
  model: "reasoning",
  schema: missionPlanSchema,
  build: (input) =>
    `${rules}\n为候选人生成一个能验证能力的真实岗位副本，必须包含恰好三个任务。输入：${json(input)}\n输出字段：title, background, successCriteria[], tasks[{title,deliverable,rubric[]}]。`,
  fallback: (input) => ({
    title: `${input.targetRole}定制实战副本`,
    background: "围绕真实用户问题设计一套可验证方案。",
    successCriteria: ["结论有明确依据", "方案可执行且可验证"],
    tasks: [
      { title: "用户问题洞察", deliverable: "用户问题与证据摘要", rubric: ["识别关键用户", "引用有效证据"] },
      { title: "方案设计", deliverable: "核心方案说明", rubric: ["回应核心问题", "说明能力边界"] },
      { title: "验证与复盘", deliverable: "指标与验证计划", rubric: ["指标可衡量", "风险与迭代清晰"] },
    ],
  }),
};

type EvaluationInput = { mission: MissionPlan; answer: string };

export const evaluationPrompt: PromptDefinition<EvaluationInput, MissionEvaluation> = {
  id: "mission-evaluate",
  version: "1.1.0",
  model: "reasoning",
  schema: missionEvaluationSchema,
  build: (input) =>
    `${rules}\n严格依据任务标准评估用户回答。evidence 必须引用用户回答中的具体内容。score 和每个 dimensions.score 必须使用 0-100 整数；abilityGains.delta 使用 0-20。输入：${json(input)}\n输出字段：score, dimensions[{name,score,evidence}], strengths[], improvements[], abilityGains[{name,delta}]。`,
  fallback: (input) => ({
    score: input.answer.length > 120 ? 86 : 72,
    dimensions: [
      { name: "问题洞察", score: 84, evidence: input.answer.slice(0, 48) || "尚未提供充分回答" },
      { name: "方案设计", score: 80, evidence: "回答已包含初步方案" },
      { name: "可验证性", score: 74, evidence: "仍需补充更明确的指标" },
    ],
    strengths: ["形成了从问题到方案的基本链路"],
    improvements: ["补充真实证据和量化验证指标"],
    abilityGains: [
      { name: "需求洞察", delta: 8 },
      { name: "方案设计", delta: 6 },
    ],
  }),
};

type JobsInput = {
  query: string;
  profile: UserProfileInput;
  avatar?: AvatarProfile;
  searchResults: unknown[];
};

export const jobsPrompt: PromptDefinition<JobsInput, { jobs: JobResult[] }> = {
  id: "jobs-match",
  version: "1.1.0",
  model: "fast",
  schema: jobsSchema,
  build: (input) =>
    `${rules}\n将公开搜索结果整理为真实岗位，并根据用户分身进行匹配。不得修改来源 URL。match 必须为 0-100 数字。字段缺失时填写“信息不足”，数组字段必须为字符串数组。输入：${json(input)}\n输出 {"jobs":[{title,company,city,salary,url,source,summary,keywords,match,evidence,gaps,recommendation,risk}]}。`,
  fallback: (input) => ({
    jobs: [
      {
        title: input.profile.targetRole || "产品经理",
        company: "公开岗位示例",
        city: input.profile.city || "上海",
        salary: "面议",
        url: "",
        source: "演示数据",
        summary: "负责用户研究、需求分析和产品方案推进。",
        keywords: ["用户研究", "需求分析", "项目推进"],
        match: 82,
        evidence: [input.profile.strengths || "目标方向匹配"],
        gaps: ["需要补充量化项目证据"],
        recommendation: "建议先生成岗位定制副本并完善作品证据。",
        risk: "岗位详情需在原始招聘页面核验。",
      },
    ],
  }),
};
