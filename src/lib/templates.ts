import type { CompanyTemplate, RoleTemplate, Scene } from "./types";

export const roles: RoleTemplate[] = [
  {
    id: "ai-pm",
    title: "AI产品经理",
    tagline: "把真实用户问题翻译成可落地的 AI 产品方案",
    dailyMission: "为求职助手设计一套简历诊断与岗位推荐的新功能。",
    strengths: ["用户洞察", "需求拆解", "跨团队沟通", "方案取舍"],
    dimensions: ["用户洞察", "结构化表达", "技术理解", "业务判断", "协作推进", "抗压迭代"],
    challenges: ["研发认为需求太散", "运营要求快速上线", "老板追问商业价值"]
  },
  {
    id: "ai-engineer",
    title: "算法/AI工程师",
    tagline: "把模型能力变成稳定、可评估、可上线的服务",
    dailyMission: "优化岗位匹配模型的召回质量，并解释一次效果波动。",
    strengths: ["技术实现", "实验设计", "问题排查", "模型评估"],
    dimensions: ["技术深度", "实验意识", "问题定位", "业务理解", "沟通解释", "抗压迭代"],
    challenges: ["线上指标波动", "产品希望当天给方案", "数据质量不稳定"]
  },
  {
    id: "data-analyst",
    title: "数据分析师",
    tagline: "从指标变化里找到业务判断和下一步行动",
    dailyMission: "分析 AI 简历优化功能的转化下滑原因。",
    strengths: ["指标拆解", "数据表达", "业务归因", "决策建议"],
    dimensions: ["指标拆解", "结构化表达", "业务判断", "数据敏感度", "协作推进", "抗压迭代"],
    challenges: ["口径不一致", "业务方要结论很急", "样本量不足"]
  },
  {
    id: "ai-growth",
    title: "AI运营/增长",
    tagline: "用内容、活动和实验推动 AI 产品被更多人使用",
    dailyMission: "策划一次面向应届生的 AI 求职工具增长活动。",
    strengths: ["用户触达", "内容策略", "转化优化", "复盘迭代"],
    dimensions: ["用户洞察", "内容表达", "业务判断", "执行推进", "数据意识", "抗压迭代"],
    challenges: ["预算有限", "渠道反馈一般", "活动效果需要快速复盘"]
  }
];

export const companies: CompanyTemplate[] = [
  {
    id: "enterprise",
    title: "大厂",
    tagline: "流程规范、协作复杂、汇报要求高",
    environment: "跨部门会议密集，方案要能经得起追问和对齐。",
    pressure: "需要在复杂协作里稳定推进，少犯低级错。",
    values: ["规范", "协作", "影响力", "稳定交付"]
  },
  {
    id: "scaleup",
    title: "中厂",
    tagline: "业务成熟、资源有限、效率优先",
    environment: "团队目标明确，但人手和资源都要精打细算。",
    pressure: "需要在质量和速度之间做现实取舍。",
    values: ["落地", "效率", "资源权衡", "业务结果"]
  },
  {
    id: "startup",
    title: "初创公司",
    tagline: "变化快、任务杂、自由度和不确定性都高",
    environment: "今天的方向可能下午就变，岗位边界很模糊。",
    pressure: "需要主动找问题、快速试错，并接受信息不完整。",
    values: ["主动性", "速度", "试错", "抗不确定性"]
  }
];

export const scenes: Scene[] = [
  {
    id: "briefing",
    title: "接到任务",
    time: "09:30",
    place: "项目工位",
    prompt: "你需要快速理解今天的任务目标、成功标准和关键限制。",
    visual: {
      zone: "desk",
      avatarPosition: { x: 19, y: 61 },
      activeNpc: "mentor",
      objectFocus: "laptop",
      bubbleTone: "task"
    }
  },
  {
    id: "standup",
    title: "晨会沟通",
    time: "10:30",
    place: "会议室",
    prompt: "你要向团队说明判断、同步风险，并争取必要支持。",
    visual: {
      zone: "meeting",
      avatarPosition: { x: 62, y: 33 },
      activeNpc: "teammate",
      objectFocus: "meeting-table",
      bubbleTone: "sync"
    }
  },
  {
    id: "core-task",
    title: "核心挑战",
    time: "14:00",
    place: "协作区",
    prompt: "你进入岗位最关键的任务，需要交出一个能落地的中间成果。",
    visual: {
      zone: "whiteboard",
      avatarPosition: { x: 76, y: 59 },
      activeNpc: "engineer",
      objectFocus: "whiteboard",
      bubbleTone: "idea"
    }
  },
  {
    id: "conflict",
    title: "突发冲突",
    time: "16:30",
    place: "讨论角",
    prompt: "协作者提出不同意见，你需要处理冲突并推动继续前进。",
    visual: {
      zone: "discussion",
      avatarPosition: { x: 43, y: 75 },
      activeNpc: "boss",
      objectFocus: "chat-board",
      bubbleTone: "conflict"
    }
  },
  {
    id: "reflection",
    title: "日终复盘",
    time: "18:30",
    place: "复盘室",
    prompt: "你总结今天的表现，判断这个岗位和公司环境是否适合长期发展。",
    visual: {
      zone: "review",
      avatarPosition: { x: 17, y: 28 },
      activeNpc: "hr",
      objectFocus: "report-screen",
      bubbleTone: "reflection"
    }
  }
];
