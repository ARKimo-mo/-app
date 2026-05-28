import type { Job } from "../types";

export const jobs: Job[] = [
  {
    jobId: "ai_pm",
    jobName: "AI 产品经理",
    match: 92,
    description: "负责 AI 产品的需求分析、功能设计、用户反馈整理和效果优化。",
    coreSkills: ["需求分析", "用户洞察", "AI 理解", "原型设计", "数据指标"],
    tags: ["产品设计", "需求分析", "项目管理"],
    reasons: ["对产品和用户需求有敏锐洞察", "具备跨团队沟通优势", "学习能力强，能快速掌握新工具"],
    risk: "需要持续学习技术和行业知识",
    color: "blue",
    task: {
      scenario: "为大学生设计一个 AI 求职助手功能",
      requirements: ["目标用户", "用户痛点", "核心功能", "使用流程", "效果指标"]
    }
  },
  {
    jobId: "new_media",
    jobName: "新媒体运营",
    match: 88,
    description: "负责内容策划、账号运营、用户增长和传播效果复盘。",
    coreSkills: ["内容策划", "用户增长", "数据分析", "活动运营"],
    tags: ["内容策划", "用户增长", "数据分析"],
    reasons: ["擅长内容创作与表达", "对用户情绪和热点敏感", "执行力强"],
    risk: "工作节奏快，需要持续创意输出和数据复盘",
    color: "mint"
  },
  {
    jobId: "data_analyst",
    jobName: "数据分析师",
    match: 86,
    description: "负责数据清洗、指标分析、可视化和业务决策支持。",
    coreSkills: ["数据清洗", "可视化分析", "业务洞察", "SQL"],
    tags: ["数据清洗", "可视化分析", "业务洞察"],
    reasons: ["对数据敏感", "逻辑思维较强", "具备学习动力"],
    risk: "需要提升数据建模能力和业务理解深度",
    color: "purple"
  }
];

export const getJobById = (jobId?: string) => jobs.find((job) => job.jobId === jobId) ?? jobs[0];
