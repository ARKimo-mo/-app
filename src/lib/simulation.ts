import { companies, roles, scenes } from "./templates";
import type { CompanyId, Profile, RoleId, SceneResult, SimulationReport } from "./types";

const clamp = (value: number, min = 45, max = 96) => Math.max(min, Math.min(max, Math.round(value)));

const keywordBonus = (resume: string, words: string[]) => {
  const text = resume.toLowerCase();
  return words.reduce((score, word) => score + (text.includes(word.toLowerCase()) ? 2 : 0), 0);
};

function roleBaseScore(profile: Profile, roleId: RoleId) {
  const resume = profile.resume || "";
  const map: Record<RoleId, number> = {
    "ai-pm":
      profile.communication * 0.22 +
      profile.structure * 0.22 +
      profile.business * 0.2 +
      profile.technical * 0.14 +
      profile.ambiguity * 0.12 +
      profile.pressure * 0.1 +
      keywordBonus(resume, ["产品", "用户", "需求", "prompt", "ai"]),
    "ai-engineer":
      profile.technical * 0.35 +
      profile.structure * 0.18 +
      profile.pressure * 0.16 +
      profile.ambiguity * 0.12 +
      profile.business * 0.1 +
      profile.communication * 0.09 +
      keywordBonus(resume, ["python", "模型", "算法", "机器学习", "llm"]),
    "data-analyst":
      profile.structure * 0.25 +
      profile.business * 0.22 +
      profile.technical * 0.18 +
      profile.communication * 0.14 +
      profile.pressure * 0.12 +
      profile.ambiguity * 0.09 +
      keywordBonus(resume, ["数据", "sql", "分析", "指标", "tableau"]),
    "ai-growth":
      profile.business * 0.25 +
      profile.communication * 0.23 +
      profile.ambiguity * 0.16 +
      profile.structure * 0.14 +
      profile.pressure * 0.12 +
      profile.technical * 0.1 +
      keywordBonus(resume, ["运营", "增长", "内容", "活动", "转化"])
  };
  return clamp(map[roleId]);
}

function companyBaseScore(profile: Profile, companyId: CompanyId) {
  const map: Record<CompanyId, number> = {
    enterprise:
      profile.structure * 0.28 +
      profile.communication * 0.22 +
      profile.pressure * 0.2 +
      profile.business * 0.14 +
      profile.technical * 0.1 +
      profile.ambiguity * 0.06,
    scaleup:
      profile.business * 0.23 +
      profile.structure * 0.21 +
      profile.communication * 0.18 +
      profile.technical * 0.14 +
      profile.pressure * 0.14 +
      profile.ambiguity * 0.1,
    startup:
      profile.ambiguity * 0.28 +
      profile.pressure * 0.22 +
      profile.business * 0.16 +
      profile.communication * 0.14 +
      profile.technical * 0.1 +
      profile.structure * 0.1
  };
  return clamp(map[companyId]);
}

function styleFromMbti(mbti: string) {
  const value = mbti.toUpperCase();
  if (value.includes("E") && value.includes("J")) return "主动拉齐信息，并把讨论迅速收束到行动项";
  if (value.includes("I") && value.includes("J")) return "先安静梳理逻辑，再用清晰结构表达判断";
  if (value.includes("E") && value.includes("P")) return "快速试探多种可能，擅长调动现场氛围";
  return "倾向先观察和发散，再从细节里找到可行路径";
}

function makeSceneResult(
  profile: Profile,
  roleId: RoleId,
  companyId: CompanyId,
  roleScore: number,
  companyScore: number,
  index: number
): SceneResult {
  const role = roles.find((item) => item.id === roleId)!;
  const company = companies.find((item) => item.id === companyId)!;
  const scene = scenes[index];
  const sceneWeight = [0.96, 1.01, 1.05, 0.98, 1.02][index];
  const score = clamp((roleScore * 0.58 + companyScore * 0.42) * sceneWeight + (index - 2) * 1.3);
  const style = styleFromMbti(profile.mbti);
  const challenge = role.challenges[index % role.challenges.length];
  const value = company.values[index % company.values.length];

  const actions = [
    `先把「${role.dailyMission}」拆成目标、约束和今天必须验证的一个假设。`,
    `用 ${company.title} 的协作方式同步进度，重点解释风险和需要团队支持的部分。`,
    `围绕「${challenge}」产出一版可执行方案，并标注最容易失败的环节。`,
    `面对分歧时没有急着证明自己，而是把争论转成标准、成本和下一步实验。`,
    `把一天的行动复盘为优势、消耗点和下一次进入类似岗位前要补的能力。`
  ];

  return {
    scene,
    action: actions[index],
    dialogue: `“我会先按${value}来判断优先级。我的分身风格是${style}，所以这一步会先把不确定信息摊开，再给出可执行选择。”`,
    evidence:
      score >= 82
        ? `表现很贴合：能把${role.strengths[index % role.strengths.length]}转化为具体行动，同时适应${company.environment}`
        : score >= 68
          ? `表现可发展：基本能完成任务，但在${challenge}出现时需要更多外部支持。`
          : `表现有压力：${company.pressure}会明显消耗当前画像，任务推进容易变慢。`,
    score
  };
}

function radar(profile: Profile, roleId: RoleId, roleScore: number, companyScore: number) {
  const role = roles.find((item) => item.id === roleId)!;
  const scoreMap: Record<string, number> = {
    用户洞察: profile.business,
    结构化表达: profile.structure,
    技术理解: profile.technical,
    业务判断: profile.business,
    协作推进: profile.communication,
    抗压迭代: profile.pressure,
    技术深度: profile.technical,
    实验意识: Math.round((profile.technical + profile.structure) / 2),
    问题定位: profile.structure,
    沟通解释: profile.communication,
    指标拆解: Math.round((profile.structure + profile.business) / 2),
    数据敏感度: profile.technical,
    内容表达: profile.communication,
    执行推进: Math.round((profile.pressure + profile.structure) / 2),
    数据意识: Math.round((profile.technical + profile.business) / 2)
  };

  return role.dimensions.map((dimension) => ({
    dimension,
    score: clamp((scoreMap[dimension] || roleScore) * 0.78 + companyScore * 0.22, 35, 100)
  }));
}

export function simulate(profile: Profile, roleId: RoleId, companyId: CompanyId): SimulationReport {
  const role = roles.find((item) => item.id === roleId)!;
  const company = companies.find((item) => item.id === companyId)!;
  const roleScore = roleBaseScore(profile, roleId);
  const companyScore = companyBaseScore(profile, companyId);
  const longTermScore = clamp(roleScore * 0.5 + companyScore * 0.35 + profile.pressure * 0.15);
  const fitScore = clamp(roleScore * 0.48 + companyScore * 0.34 + longTermScore * 0.18);
  const sceneResults = scenes.map((_, index) =>
    makeSceneResult(profile, roleId, companyId, roleScore, companyScore, index)
  );

  return {
    fitScore,
    roleScore,
    companyScore,
    longTermScore,
    verdict: fitScore >= 82 ? "强推荐体验" : fitScore >= 70 ? "谨慎推荐" : "建议先补能力或换组合",
    summary: `${profile.name || "你的 AI 分身"}在${company.title}${role.title}岗位中，最明显的匹配点是${role.strengths[0]}和${company.values[0]}；主要挑战来自${role.challenges[0]}以及${company.pressure}`,
    risks: [
      fitScore < 76 ? `当前组合可能带来较高消耗，尤其是${company.pressure}` : `高匹配不代表无压力，仍要关注${role.challenges[1]}。`,
      profile.technical < 62 ? "技术理解偏弱时，AI 相关岗位需要准备基础模型、数据和评估概念。" : "技术基础可以支撑岗位沟通，但仍需沉淀可展示项目。",
      profile.communication < 62 ? "沟通协作偏保守时，建议练习需求澄清、会议表达和冲突处理。" : "沟通优势明显，但要避免只靠表达推进，需保留数据和证据。"
    ],
    recommendations: [
      fitScore >= 82
        ? `优先投递${company.title}${role.title}，并准备一个能证明${role.strengths[0]}的项目案例。`
        : `可以先从实习、项目制任务或校园比赛验证${role.title}的真实工作感。`,
      companyId === "startup" ? "如果不确定性消耗过高，可对比中厂同岗位。" : "可额外体验初创环境，判断自己是否喜欢更高自由度。",
      roleId === "ai-pm" ? "补充 AI 产品 PRD、用户访谈和 prompt 评估案例。" : "准备一份能说明问题、过程、结果和复盘的作品集。"
    ],
    radar: radar(profile, roleId, roleScore, companyScore),
    scenes: sceneResults
  };
}
