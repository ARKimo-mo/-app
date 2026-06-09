import type {
  CareerAvatar,
  CareerStage,
  Competency,
  CompetencyId,
  GrowthEvidence,
  LearningResource,
  LearningTask,
  Profile,
  ProjectDeliverable,
  ProjectEvaluation,
  ResumeProject,
  RoleId,
  RoleMatch
} from "./types";
import { roles } from "./templates";

const clamp = (value: number, min = 35, max = 96) => Math.max(min, Math.min(max, Math.round(value)));

export const stageCopy: Record<CareerStage, { title: string; item: string }> = {
  explorer: { title: "职业探索者", item: "简历背包" },
  learner: { title: "岗位学习者", item: "知识手册" },
  intern: { title: "项目实习生", item: "企业工牌" },
  candidate: { title: "岗位候选人", item: "项目作品集" }
};

export const initialCompetencies: Competency[] = [
  { id: "knowledge", label: "岗位知识", current: 52, target: 82 },
  { id: "tools", label: "工具技能", current: 58, target: 78 },
  { id: "core", label: "核心岗位能力", current: 64, target: 85 },
  { id: "practice", label: "项目实战", current: 42, target: 80 },
  { id: "communication", label: "沟通与表达", current: 68, target: 82 }
];

const keywordScore = (resume: string, words: string[]) =>
  words.reduce((total, word) => total + (resume.toLowerCase().includes(word.toLowerCase()) ? 4 : 0), 0);

export function generateMatches(profile: Profile): RoleMatch[] {
  const values: Record<RoleId, number> = {
    "ai-pm":
      profile.communication * 0.24 +
      profile.structure * 0.22 +
      profile.business * 0.24 +
      profile.technical * 0.12 +
      profile.ambiguity * 0.18 +
      keywordScore(profile.resume, ["产品", "用户", "需求", "prd", "ai"]),
    "ai-engineer":
      profile.technical * 0.4 +
      profile.structure * 0.22 +
      profile.pressure * 0.18 +
      profile.ambiguity * 0.12 +
      profile.communication * 0.08 +
      keywordScore(profile.resume, ["python", "算法", "模型", "llm"]),
    "data-analyst":
      profile.structure * 0.3 +
      profile.technical * 0.22 +
      profile.business * 0.24 +
      profile.communication * 0.12 +
      profile.pressure * 0.12 +
      keywordScore(profile.resume, ["数据", "sql", "分析", "指标"]),
    "ai-growth":
      profile.communication * 0.26 +
      profile.business * 0.28 +
      profile.ambiguity * 0.22 +
      profile.structure * 0.12 +
      profile.pressure * 0.12 +
      keywordScore(profile.resume, ["运营", "增长", "活动", "内容"])
  };

  const reasons: Record<RoleId, string> = {
    "ai-pm": "善于理解用户、组织复杂信息并推动跨角色协作。",
    "ai-engineer": "技术理解和结构化解决问题能力更突出。",
    "data-analyst": "擅长从信息与指标中形成业务判断。",
    "ai-growth": "用户沟通、内容表达和快速试错倾向明显。"
  };
  const gaps: Record<RoleId, string> = {
    "ai-pm": "需要补足 AI 产品方法、原型工具和完整项目证据。",
    "ai-engineer": "需要补足工程项目、模型评估和代码作品。",
    "data-analyst": "需要补足 SQL、指标体系和分析报告作品。",
    "ai-growth": "需要补足增长实验、渠道数据和复盘案例。"
  };

  return (Object.keys(values) as RoleId[])
    .map((roleId) => ({ roleId, score: clamp(values[roleId], 45, 94), reason: reasons[roleId], gap: gaps[roleId] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function createAvatar(profile: Profile, matches: RoleMatch[]): CareerAvatar {
  const top = matches[0];
  const readiness = clamp((top?.score ?? 72) - 16, 55, 80);
  return {
    stage: "explorer",
    targetRole: null,
    initialFit: readiness,
    currentFit: readiness,
    competencies: initialCompetencies.map((item) => ({
      ...item,
      current:
        item.id === "communication"
          ? clamp(profile.communication)
          : item.id === "core"
            ? clamp((profile.structure + profile.business) / 2)
            : item.current
    })),
    evidence: [],
    unlockedItems: ["简历背包"]
  };
}

export function addEvidence(avatar: CareerAvatar, evidence: GrowthEvidence, nextStage?: CareerStage): CareerAvatar {
  if (avatar.evidence.some((item) => item.id === evidence.id)) return avatar;
  const competencies = avatar.competencies.map((item) =>
    item.id === evidence.competency ? { ...item, current: clamp(item.current + evidence.delta) } : item
  );
  const averageGain = competencies.reduce((sum, item) => sum + item.current, 0) / competencies.length;
  const stage = nextStage ?? avatar.stage;
  const stageItem = stageCopy[stage].item;
  return {
    ...avatar,
    stage,
    competencies,
    currentFit: clamp(avatar.initialFit * 0.55 + averageGain * 0.45, avatar.initialFit, 96),
    evidence: [evidence, ...avatar.evidence],
    unlockedItems: avatar.unlockedItems.includes(stageItem) ? avatar.unlockedItems : [...avatar.unlockedItems, stageItem]
  };
}

export const learningResources: LearningResource[] = [
  {
    id: "r1",
    title: "人人都是产品经理：AI 产品经理能力地图",
    source: "人人都是产品经理",
    url: "https://www.woshipm.com/",
    type: "文章",
    summary: "理解 AI 产品经理的职责、能力结构与常见工作方法。",
    read: false
  },
  {
    id: "r2",
    title: "Google PAIR Guidebook",
    source: "Google",
    url: "https://pair.withgoogle.com/guidebook/",
    type: "课程",
    summary: "学习以用户为中心设计 AI 产品的实践框架。",
    read: false
  },
  {
    id: "r3",
    title: "AI 产品经理面试高频问题整理",
    source: "公开面经汇总",
    url: "https://www.nowcoder.com/",
    type: "面经",
    summary: "覆盖模型理解、需求判断、指标设计和项目复盘问题。",
    read: false
  }
];

export const learningTasks: LearningTask[] = [
  { id: "l1", title: "理解 AI 产品生命周期与岗位边界", week: 1, done: false, kind: "learn" },
  { id: "l2", title: "完成用户问题与 AI 能力匹配测验", week: 1, done: false, kind: "quiz" },
  { id: "l3", title: "学习 PRD、原型与评估指标设计", week: 2, done: false, kind: "learn" },
  { id: "l4", title: "完成 AI 产品方案判断测验", week: 2, done: false, kind: "quiz" },
  { id: "l5", title: "整理面试高频题与个人回答", week: 3, done: false, kind: "learn" }
];

export const projectDeliverables: ProjectDeliverable[] = [
  { id: "p1", title: "用户问题与调研摘要", prompt: "目标用户是谁？当前求职流程里最痛的三个问题是什么？", content: "", submitted: false },
  { id: "p2", title: "需求分析与目标定义", prompt: "定义产品目标、核心场景、边界和成功标准。", content: "", submitted: false },
  { id: "p3", title: "核心方案与 PRD", prompt: "描述简历诊断和岗位推荐的关键流程、AI能力与异常处理。", content: "", submitted: false },
  { id: "p4", title: "指标与验证方案", prompt: "定义北极星指标、过程指标，以及如何验证推荐质量。", content: "", submitted: false },
  { id: "p5", title: "项目复盘", prompt: "总结你的关键决策、困难、迭代和下一步。", content: "", submitted: false }
];

export function evaluateProject(deliverables: ProjectDeliverable[]): ProjectEvaluation {
  const submitted = deliverables.filter((item) => item.submitted && item.content.trim().length >= 20);
  const score = clamp(48 + submitted.length * 9, 48, 93);
  return {
    score,
    passed: submitted.length >= 4,
    strengths: submitted.length >= 4
      ? ["问题、方案与指标形成了完整链路。", "交付物能够体现个人判断，而不只是 AI 生成文本。"]
      : ["已形成初步产品思路。"],
    improvements: submitted.length >= 4
      ? ["补充真实访谈或可用性测试证据。", "把关键成果替换为可验证数字。"]
      : ["至少完成四项交付物后再进入正式评审。", "每项内容需要写清自己的判断依据。"]
  };
}

export function generateResume(deliverables: ProjectDeliverable[], evaluation: ProjectEvaluation): ResumeProject {
  const available = deliverables.filter((item) => item.submitted && item.content.trim());
  const evidenceTitles = available.map((item) => item.title).join("、");
  return {
    title: "AI 求职助手产品设计项目",
    summary: `围绕应届生求职决策问题，完成 AI 简历诊断与岗位推荐功能的产品方案，作品评审 ${evaluation.score} 分。`,
    bullets: [
      `独立完成${evidenceTitles || "需求分析与产品方案"}，建立从用户问题到功能设计的完整链路。`,
      "设计简历诊断、岗位推荐核心流程，并明确 AI 能力边界、异常处理与人工反馈机制。",
      "构建产品指标与验证方案；实际用户量化结果待项目测试后补充。"
    ],
    interviewStory: "我先从应届生不知道自己适合什么岗位的问题出发，拆解用户决策链路，再判断哪些环节适合使用 AI。项目中最重要的取舍是避免把推荐结果做成黑盒，因此加入了匹配证据、能力缺口和用户反馈机制。"
  };
}

export function roleTitle(roleId: RoleId | null) {
  return roles.find((role) => role.id === roleId)?.title ?? "尚未选择";
}
