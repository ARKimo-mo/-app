import type { Evaluation } from "../types";

export const mockEvaluation: Evaluation = {
  totalScore: 82,
  summary: "你在本次任务中展现了扎实的思考能力和良好的执行力，已超过 82% 的同龄人。",
  dimensions: [
    { name: "岗位理解", score: 85, note: "理解到位" },
    { name: "逻辑结构", score: 80, note: "结构清晰" },
    { name: "专业能力", score: 78, note: "基础扎实" },
    { name: "可执行性", score: 83, note: "建议可落地" },
    { name: "表达质量", score: 84, note: "表达流畅" }
  ],
  strengths: ["能准确把握岗位核心需求", "逻辑结构清晰完整", "执行方案具备可落地性"],
  improvements: ["专业深度可以进一步加强", "数据支撑需要更充分", "表达亮点可以更突出"]
};

export const learningPath = [
  { week: "第 1 周", title: "夯实基础", items: ["系统学习岗位核心知识", "掌握基础方法与工具"], action: "学习基础知识，完成 2 个练习" },
  { week: "第 2 周", title: "强化能力", items: ["提升分析与解决问题能力", "学习结构化表达方法"], action: "完成案例分析，输出分析报告" },
  { week: "第 3 周", title: "实战应用", items: ["结合实际场景输出解决方案", "提升方案设计能力"], action: "完成方案设计，接受导师反馈" },
  { week: "第 4 周", title: "总结提升", items: ["复盘优化", "形成可复用的项目成果"], action: "总结复盘，输出项目成果" }
];

export const resumeProject = {
  title: "AI 求职助手产品方案设计",
  description:
    "针对大学生求职中职业规划不清、简历优化困难、投递效率低等问题，设计 AI 求职助手核心功能方案。完成目标用户分析、痛点拆解、功能流程设计与效果指标规划，结合 AI 能力提出职业画像、岗位匹配、任务训练和成长报告等功能模块，提升对 AI 产品岗位的理解与产品设计能力。",
  tags: ["用户研究", "需求分析", "产品设计", "AI 应用", "效果评估"],
  keywords: ["AI 产品实习生", "产品运营实习生", "用户研究实习生", "内容运营", "增长运营", "数据分析"]
};
