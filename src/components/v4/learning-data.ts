export type KnowledgeCourse = {
  id: string;
  category: "产品经理成长实操" | "用户研究" | "运营思维成长" | "高敏商业分析";
  title: string;
  duration: number;
  description: string;
  outlineTitle: string;
  outline: string[];
  practice: string;
  sourceName: string;
  sourceUrl: string;
  abilities: string[];
};

export const knowledgeCourses: KnowledgeCourse[] = [
  {
    id: "prd",
    category: "产品经理成长实操",
    title: "从岗位问题到可协作 PRD",
    duration: 18,
    description: "把模糊需求转化为目标、用户故事、范围、成功指标和明确的非目标，让团队形成共同理解。",
    outlineTitle: "一份可协作 PRD 的核心结构",
    outline: [
      "先说明为什么要做：背景、用户问题、目标和成功指标。",
      "用用户故事描述场景，明确功能范围、假设、依赖与不做什么。",
      "让设计、研发和业务共同参与评审，并随验证结果持续更新。",
    ],
    practice: "选择一个校园场景，输出一页 PRD，至少包含目标、用户故事、范围、指标和非目标。",
    sourceName: "Atlassian Agile Product Requirements",
    sourceUrl: "https://www.atlassian.com/agile/product-management/requirements",
    abilities: ["需求分析", "结构化表达", "协作推进"],
  },
  {
    id: "interview",
    category: "用户研究",
    title: "用户访谈：从观点走向真实经历",
    duration: 16,
    description: "学习访谈适用边界、研究问题、提问顺序和追问方式，避免用诱导问题验证自己的答案。",
    outlineTitle: "访谈获得有效证据的四步法",
    outline: [
      "先写研究问题，再把研究问题转成开放式访谈问题。",
      "从最近一次真实行为切入，追问当时的目标、阻力、决策和结果。",
      "区分用户说的偏好与真实行为，不把访谈当成可用性测试。",
      "访谈后按主题整理原话、行为证据和仍待验证的假设。",
    ],
    practice: "围绕大学生求职准备，设计 8 个问题并完成 1 次访谈，整理 5 条用户原话。",
    sourceName: "Nielsen Norman Group User Interviews 101",
    sourceUrl: "https://www.nngroup.com/articles/user-interviews/",
    abilities: ["用户洞察", "访谈设计", "证据意识"],
  },
  {
    id: "funnel",
    category: "运营思维成长",
    title: "用转化漏斗定位增长问题",
    duration: 15,
    description: "把用户完成目标任务的路径拆成连续步骤，用进入人数、完成率和流失点定位最值得解决的问题。",
    outlineTitle: "漏斗分析不只是计算转化率",
    outline: [
      "围绕一个明确任务定义步骤，例如访问、开始、提交、完成。",
      "统一事件口径和时间窗口，避免不同人群、渠道和版本混在一起。",
      "先找最大流失步骤，再结合用户研究解释原因并设计实验。",
    ],
    practice: "为职前副本设计“进入试岗到生成报告”的漏斗，写出每一步事件和核心诊断问题。",
    sourceName: "Google Analytics Funnel Reporting",
    sourceUrl: "https://developers.google.com/analytics/devguides/reporting/data/v1/funnels",
    abilities: ["数据分析", "增长诊断", "指标设计"],
  },
  {
    id: "north-star",
    category: "高敏商业分析",
    title: "北极星指标与输入指标设计",
    duration: 14,
    description: "建立用户价值、产品策略和长期商业结果之间的联系，并拆出团队可以影响的关键输入指标。",
    outlineTitle: "判断北极星指标是否有效",
    outline: [
      "指标应代表用户获得的核心价值，而不是单纯流量或收入结果。",
      "指标需要处于产品和运营可影响的范围内，并能领先反映长期结果。",
      "将北极星指标拆成少量可行动的输入指标，明确每个指标的假设。",
    ],
    practice: "为一个校园产品定义 1 个北极星指标和 3 个输入指标，并解释它们如何连接用户价值。",
    sourceName: "Amplitude North Star Framework",
    sourceUrl: "https://amplitude.com/books/north-star/about-north-star-framework",
    abilities: ["商业分析", "指标体系", "产品策略"],
  },
  {
    id: "usability",
    category: "用户研究",
    title: "小样本可用性测试实战",
    duration: 12,
    description: "用小规模、可重复的测试尽早暴露交互问题，记录用户行为、卡点和完成任务的真实过程。",
    outlineTitle: "可用性测试的核心不是问喜不喜欢",
    outline: [
      "设置具体任务，让用户自然操作，主持人避免解释和引导。",
      "记录用户在哪里犹豫、失败、绕路，以及他们如何理解页面信息。",
      "每轮测试后修正高频问题，再开展下一轮小规模验证。",
    ],
    practice: "邀请 1 位同学完成一次分身试岗，记录 3 个卡点并提出页面优化建议。",
    sourceName: "Nielsen Norman Group Usability Testing",
    sourceUrl: "https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/",
    abilities: ["体验评估", "问题发现", "方案迭代"],
  },
  {
    id: "user-story",
    category: "产品经理成长实操",
    title: "用用户故事对齐需求价值",
    duration: 10,
    description: "通过角色、目标和价值描述需求，再用验收标准把抽象期待变成团队能够验证的结果。",
    outlineTitle: "用户故事的三个层次",
    outline: [
      "明确谁在什么情境下，希望完成什么目标以及为什么。",
      "补充关键约束、异常情况和不属于本次范围的内容。",
      "用可观察、可判断的验收标准替代“体验更好”等模糊表达。",
    ],
    practice: "为岗位搜索功能编写 3 条用户故事，并为每条故事补充 2 条验收标准。",
    sourceName: "Atlassian User Stories",
    sourceUrl: "https://www.atlassian.com/agile/project-management/user-stories",
    abilities: ["需求表达", "范围管理", "验收设计"],
  },
];
