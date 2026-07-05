import type { z } from "zod";
import {
  avatarProfileSchema,
  jobsSchema,
  missionEvaluationSchema,
  missionPlanSchema,
  resumeDiscoverySchema,
  resumeFactCheckSchema,
  resumeJdAnalysisSchema,
  resumeMatchReportSchema,
  resumeProfileSchema,
  resumeRewriteSchema,
} from "./schemas";
import type {
  AvatarProfile,
  JobResult,
  MissionEvaluation,
  MissionPlan,
  ResumeDiscovery,
  ResumeFactCheck,
  ResumeJDAnalysis,
  ResumeMatchReport,
  ResumeProfile,
  ResumeRewrite,
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
const resumeRules =
  "你是严谨的中文求职简历 AI。只能基于输入信息判断，不得编造经历、公司、岗位、数字、奖项、上线结果或用户职责。如果信息不足，必须标记为“信息不足”或“需要用户确认”。区分事实、推断、建议。每个结论必须引用输入中的证据字段或原文片段。只输出合法 JSON，不输出 Markdown，不输出解释性闲聊。";

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

type ResumeJdInput = {
  job_title: string;
  company_name: string;
  target_direction: string;
  job_description: string;
};

export const resumeJdAnalysisPrompt: PromptDefinition<ResumeJdInput, ResumeJDAnalysis> = {
  id: "resume-jd-analysis",
  version: "1.0.0",
  model: "fast",
  schema: resumeJdAnalysisSchema,
  build: input =>
    `${resumeRules}
你的任务是分析 JD，而不是评价候选人。请保留 JD 原文中的关键词表达。hard_requirements 必须来自明确要求。hidden_expectations 只能基于职责合理推断，并标记 evidence。如果 JD 没写公司类型，不要猜，填“信息不足”。
输入：${json(input)}
输出字段：job_title, company_name, company_type, core_responsibilities, hard_requirements, soft_requirements, priority_skills, keywords, hidden_expectations, resume_optimization_direction, evidence。`,
  fallback: input => ({
    job_title: input.job_title || "信息不足",
    company_name: input.company_name || "信息不足",
    company_type: "信息不足",
    core_responsibilities: [input.job_description.slice(0, 80) || "信息不足"],
    hard_requirements: [],
    soft_requirements: [],
    priority_skills: [],
    keywords: input.job_description.match(/[A-Za-z0-9+#.]+|[\u4e00-\u9fa5]{2,8}/g)?.slice(0, 12) ?? [],
    hidden_expectations: ["信息不足"],
    resume_optimization_direction: ["补充完整 JD 后重新分析"],
    evidence: [input.job_description.slice(0, 120) || "用户未提供完整 JD"],
  }),
};

type ResumeParseInput = {
  resume_text: string;
  sections?: Record<string, string>;
};

export const resumeParsePrompt: PromptDefinition<ResumeParseInput, ResumeProfile> = {
  id: "resume-parse",
  version: "1.0.0",
  model: "fast",
  schema: resumeProfileSchema,
  build: input =>
    `${resumeRules}
你的任务是解析，不是润色。保留用户原始事实和原始表述。为每条经历生成 evidence_id，后续 Agent 必须通过 evidence_id 引用。如果缺少量化结果，标记 needs_quantification=true。如果职责强度不明确，不要把“参与”升级成“负责/主导”。
输入：${json(input)}
输出字段：basic_info, education, internships, projects, skills, certificates, self_evaluation, raw_sections, evidence_index。`,
  fallback: input => {
    const text = input.resume_text || Object.values(input.sections ?? {}).join("\n");
    return {
      basic_info: { name: "信息不足" },
      education: [],
      internships: [],
      projects: [{
        evidence_id: "project-1",
        name: "用户简历片段",
        role: "信息不足",
        bullets: [text.slice(0, 160) || "信息不足"],
        extracted_skills: [],
        evidence_strength: "low",
        needs_quantification: true,
      }],
      skills: [],
      certificates: [],
      self_evaluation: "",
      raw_sections: [text],
      evidence_index: [{ evidence_id: "project-1", section: "projects", text: text.slice(0, 200) || "信息不足" }],
    };
  },
};

type ResumeMatchInput = { jd_analysis: ResumeJDAnalysis; resume_json: ResumeProfile };

export const resumeMatchPrompt: PromptDefinition<ResumeMatchInput, ResumeMatchReport> = {
  id: "resume-match-diagnosis",
  version: "1.0.0",
  model: "fast",
  schema: resumeMatchReportSchema,
  build: input =>
    `${resumeRules}
只判断“已有证据”和 JD 的匹配关系。如果某能力没有简历证据，写入 missing_experience，不要建议直接改写成已具备。rewrite_plan 只能包含可基于已有 evidence_id 改写的内容。must_not_fake 列出不能编造的数字、职责、结果。评分权重：教育 20%，项目/实习相关性 35%，技能关键词 20%，成果量化 15%，表达质量 10%。
输入：${json(input)}
输出字段：overall_score, score_breakdown, strong_matches, weak_matches, missing_keywords, missing_experience, section_diagnosis, rewrite_plan, must_not_fake。`,
  fallback: input => ({
    overall_score: 68,
    score_breakdown: { education: 60, experience_relevance: 68, keyword_coverage: 60, result_quality: 55, expression_quality: 72 },
    strong_matches: input.resume_json.evidence_index.slice(0, 2).map(item => `已有经历证据：${item.text}`),
    weak_matches: ["量化结果和 JD 关键词覆盖仍需补充"],
    missing_keywords: input.jd_analysis.keywords.slice(0, 5),
    missing_experience: input.jd_analysis.priority_skills.slice(0, 3),
    section_diagnosis: input.resume_json.evidence_index.slice(0, 4).map(item => ({
      section: item.section,
      status: "建议优化" as const,
      reason: "可基于原始事实强化岗位关键词和结果表达",
      optimization_priority: "medium" as const,
      evidence_id: item.evidence_id,
    })),
    rewrite_plan: input.resume_json.evidence_index.slice(0, 4).map(item => ({
      section: item.section,
      evidence_id: item.evidence_id,
      target_keywords: input.jd_analysis.keywords.slice(0, 3),
      direction: "保持事实不变，强化动作、方法和与 JD 相关的关键词",
    })),
    must_not_fake: ["未证实的数据", "未证实的主导职责", "未证实的上线结果"],
  }),
};

type ResumeDiscoveryInput = { jd_analysis: ResumeJDAnalysis; resume_json: ResumeProfile; match_report: ResumeMatchReport };

export const resumeDiscoveryPrompt: PromptDefinition<ResumeDiscoveryInput, ResumeDiscovery> = {
  id: "resume-experience-discovery",
  version: "1.0.0",
  model: "fast",
  schema: resumeDiscoverySchema,
  build: input =>
    `${resumeRules}
问题必须具体，不能问“你还有什么经历”。每个问题必须对应一个 JD 能力或一个弱匹配项。问题只能引导用户回忆真实事实，不得诱导编造。优先追问：角色、动作、方法、产出、数据、协作对象、结果。
输入：${json(input)}
输出 {"questions":[{target_skill, related_jd_requirement, related_evidence_id, question, why_ask, example_answer_structure, risk_if_unanswered}]}。`,
  fallback: input => ({
    questions: (input.match_report.missing_keywords.length ? input.match_report.missing_keywords : input.jd_analysis.priority_skills).slice(0, 5).map((skill, index) => ({
      target_skill: skill,
      related_jd_requirement: input.jd_analysis.hard_requirements[index] || "信息不足",
      related_evidence_id: input.match_report.rewrite_plan[index]?.evidence_id || "",
      question: `围绕“${skill}”，你是否有真实项目中的角色、动作、产出或数据可以补充？`,
      why_ask: "该能力与目标 JD 相关，但当前简历证据不足。",
      example_answer_structure: "我在……项目中负责/参与……，使用……方法，产出……，结果……",
      risk_if_unanswered: "如果无法补充真实证据，简历中不应强行写成已具备该能力。",
    })),
  }),
};

type ResumeRewriteInput = {
  jd_analysis: ResumeJDAnalysis;
  resume_json: ResumeProfile;
  match_report: ResumeMatchReport;
  user_extra_info?: string;
};

export const resumeRewritePrompt: PromptDefinition<ResumeRewriteInput, ResumeRewrite> = {
  id: "resume-rewrite",
  version: "1.0.0",
  model: "reasoning",
  schema: resumeRewriteSchema,
  build: input =>
    `${resumeRules}
不得新增原文没有支持的事实。不得虚构数字；缺少数字时写“可补充量化结果”，不要编数字。不得把参与改成主导，除非 evidence 或用户补充明确支持。rewritten_text 要更贴合 JD，但必须可被 evidence_id 支撑。高风险内容必须 need_user_confirmation=true。只能改写 match_report.rewrite_plan 中允许的 section。
输入：${json(input)}
输出字段：rewrites, tailored_resume。`,
  fallback: input => ({
    rewrites: input.match_report.rewrite_plan.slice(0, 5).map(plan => {
      const source = input.resume_json.evidence_index.find(item => item.evidence_id === plan.evidence_id);
      const original = source?.text || "信息不足";
      return {
        section: plan.section,
        evidence_id: plan.evidence_id,
        original_text: original,
        rewritten_text: `${original}（建议补充与 ${plan.target_keywords.join("、") || "目标岗位"} 相关的真实动作、方法和可验证结果）`,
        jd_keywords_used: plan.target_keywords,
        improvement_reason: ["保持原始事实边界", "强化与 JD 相关的表达"],
        risk_level: "medium" as const,
        need_user_confirmation: true,
        confirmation_question: "请确认是否有真实数据或产出可以支撑这条表达。",
      };
    }),
    tailored_resume: {
      summary: `面向${input.jd_analysis.job_title}的岗位版简历摘要仍需基于真实经历补充。`,
      education: input.resume_json.education,
      experience: input.resume_json.internships.flatMap(item => item.bullets),
      projects: input.resume_json.projects.flatMap(item => item.bullets),
      skills: input.resume_json.skills,
    },
  }),
};

type ResumeFactCheckInput = {
  jd_analysis: ResumeJDAnalysis;
  resume_json: ResumeProfile;
  rewrite_result: ResumeRewrite;
};

export const resumeFactCheckPrompt: PromptDefinition<ResumeFactCheckInput, ResumeFactCheck> = {
  id: "resume-fact-check",
  version: "1.0.0",
  model: "reasoning",
  schema: resumeFactCheckSchema,
  build: input =>
    `${resumeRules}
你是审核员，不是改写员。逐条对比 original_text、rewritten_text、jd_keywords。重点检查：是否新增无证据事实；是否把弱参与夸大成主导；是否出现未证实数字；是否关键词覆盖不足；是否表达过长、不像中文简历；是否过度 AI 化、空泛化。如果有中高风险，pass=false。
输入：${json(input)}
输出字段：pass, ats_score, keyword_coverage, missing_keywords, risk_items, final_suggestions。`,
  fallback: input => {
    const coverage = input.jd_analysis.keywords.filter(keyword =>
      JSON.stringify(input.rewrite_result.tailored_resume).includes(keyword),
    );
    return {
      pass: input.rewrite_result.rewrites.every(item => item.risk_level === "low" && !item.need_user_confirmation),
      ats_score: Math.min(85, 45 + coverage.length * 5),
      keyword_coverage: coverage,
      missing_keywords: input.jd_analysis.keywords.filter(keyword => !coverage.includes(keyword)).slice(0, 8),
      risk_items: input.rewrite_result.rewrites.filter(item => item.need_user_confirmation).map(item => ({
        text: item.rewritten_text,
        risk_type: "unsupported_fact" as const,
        severity: item.risk_level === "high" ? "high" as const : "medium" as const,
        reason: "该改写需要用户确认真实依据后才能采纳。",
        suggested_fix: item.confirmation_question || "补充真实证据或改回更保守表达。",
      })),
      final_suggestions: ["优先采纳低风险改写", "含数字或职责升级的内容需人工确认"],
    };
  },
};
