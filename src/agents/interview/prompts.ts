import type { PromptDefinition } from "@/lib/ai/prompts";
import type {
  InterviewAnswerScore,
  InterviewFinalReview,
  InterviewJDInput,
  InterviewJDProfile,
  InterviewMode,
  InterviewNextAction,
  InterviewQuestionPlan,
  InterviewResumeProfile,
  InterviewTurn,
} from "./types";
import {
  interviewAnswerScoreSchema,
  interviewFinalReviewSchema,
  interviewJdProfileSchema,
  interviewNextActionSchema,
  interviewQuestionPlanSchema,
  interviewResumeProfileSchema,
} from "./schemas";

const json = (value: unknown) => JSON.stringify(value);

const sharedRules = `
你是严谨的中文求职面试 AI。只能基于输入信息判断，不得编造经历、公司、岗位、数字、奖项、上线结果或用户职责。
如果信息不足，必须标记为“信息不足”或“需要用户确认”。
区分事实、推断、建议。
每个结论必须引用输入中的证据字段或原文片段。
只输出合法 JSON，不输出 Markdown，不输出解释性闲聊。
`;

const fallbackKeywords = (text: string) =>
  text.match(/[A-Za-z0-9+#.]+|[\u4e00-\u9fa5]{2,8}/g)?.slice(0, 12) ?? [];

export const jdParseAgentPrompt: PromptDefinition<InterviewJDInput, InterviewJDProfile> = {
  id: "interview-jd-parse",
  version: "1.0.0",
  model: "fast",
  schema: interviewJdProfileSchema,
  build: input => `${sharedRules}
你的任务是分析面试岗位画像，而不是评价候选人。
保留 JD 原文中的关键词表达。
hard/technical 类要求必须来自明确原文。
business_scenarios 和 interview_focus 可以基于职责合理推断，但必须写入 evidence。
如果 JD 没写公司或岗位背景，不要猜，填“信息不足”。
输入：${json(input)}
输出字段：job_title, company_name, role_summary, core_competencies, technical_skills, behavioral_skills, business_scenarios, keywords, interview_focus, evidence。`,
  fallback: input => ({
    job_title: input.job_title || "信息不足",
    company_name: input.company_name || "信息不足",
    role_summary: input.job_description.slice(0, 120) || "信息不足",
    core_competencies: ["结构化表达", "岗位理解", "真实经历举证"],
    technical_skills: fallbackKeywords(input.job_description).slice(0, 5),
    behavioral_skills: ["沟通协作", "问题拆解", "复盘意识"],
    business_scenarios: ["信息不足"],
    keywords: fallbackKeywords(input.job_description),
    interview_focus: ["围绕 JD 关键词回答", "用真实经历支撑观点", "补充行动和结果"],
    evidence: [input.job_description.slice(0, 180) || "用户未提供完整 JD"],
  }),
};

type ResumeParseInput = {
  resume_text: string;
};

export const resumeParseAgentPrompt: PromptDefinition<ResumeParseInput, InterviewResumeProfile> = {
  id: "interview-resume-parse",
  version: "1.0.0",
  model: "fast",
  schema: interviewResumeProfileSchema,
  build: input => `${sharedRules}
你的任务是把简历文本解析成面试可追问的证据索引，不要润色，不要扩写。
为每条经历生成 evidence_id。
如果经历缺少角色、动作、方法、结果或数据，写入 gaps 或 risk_notes。
不得把“参与”升级为“负责/主导”，除非原文明确支持。
输入：${json(input)}
输出字段：candidate_summary, education, experiences, skill_evidence, evidence_index, gaps。`,
  fallback: input => ({
    candidate_summary: input.resume_text.slice(0, 120) || "信息不足",
    education: [],
    experiences: [{
      evidence_id: "exp-1",
      section: "resume",
      role: "信息不足",
      text: input.resume_text.slice(0, 220) || "信息不足",
      skills: fallbackKeywords(input.resume_text).slice(0, 5),
      risk_notes: ["需要用户确认角色、动作和结果"],
    }],
    skill_evidence: fallbackKeywords(input.resume_text).slice(0, 5).map(skill => ({
      skill,
      evidence_id: "exp-1",
      evidence_text: input.resume_text.slice(0, 100) || "信息不足",
    })),
    evidence_index: [{ evidence_id: "exp-1", section: "resume", text: input.resume_text.slice(0, 220) || "信息不足" }],
    gaps: ["量化结果不足", "面试可讲案例需要补充"],
  }),
};

type QuestionInput = {
  mode: InterviewMode;
  jd_profile: InterviewJDProfile;
  resume_profile?: InterviewResumeProfile | null;
  question_count?: number;
  difficulty?: "easy" | "medium" | "hard";
};

export const questionGeneratorAgentPrompt: PromptDefinition<QuestionInput, InterviewQuestionPlan> = {
  id: "interview-question-generator",
  version: "1.0.0",
  model: "fast",
  schema: interviewQuestionPlanSchema,
  build: input => `${sharedRules}
你是面试题设计 Agent。请根据 mode 生成问题：
special_training：聚焦 JD 的关键能力，默认 5 题，适合专项训练。
mock_interview：结合 JD 和简历证据，生成完整模拟面试问题，必须包含简历深挖、岗位能力、情景题和动机题。
每个问题必须写明 target_competency、related_jd_keywords、expected_answer_points 和 followup_strategy。
related_evidence_ids 只能引用 resume_profile.evidence_index 中存在的 evidence_id；没有简历证据则留空。
不得暗示用户编造经历。
输入：${json(input)}
输出字段：mode, opening, questions, interview_goal, risk_reminders。`,
  fallback: input => {
    const base = input.jd_profile.keywords.length ? input.jd_profile.keywords : ["岗位理解", "沟通协作", "项目复盘", "问题拆解", "结果表达"];
    const count = Math.min(Math.max(input.question_count || 5, 3), 8);
    return {
      mode: input.mode,
      opening: input.mode === "mock_interview" ? "你好，我们开始一轮模拟面试。" : "你好，我们开始专项训练。",
      questions: Array.from({ length: count }).map((_, index) => ({
        id: `q-${index + 1}`,
        type: index === 0 ? "motivation" : index % 3 === 0 ? "case" : "behavioral",
        question: `请结合真实经历，说明你如何体现“${base[index % base.length]}”这项能力？`,
        target_competency: base[index % base.length],
        related_jd_keywords: [base[index % base.length]],
        related_evidence_ids: input.resume_profile?.evidence_index.slice(0, 1).map(item => item.evidence_id) ?? [],
        expected_answer_points: ["背景", "你的角色", "具体行动", "结果或复盘"],
        followup_strategy: "如果回答缺少行动或结果，追问具体做法和证据。",
        difficulty: input.difficulty || "medium",
        evidence: input.jd_profile.evidence.slice(0, 1),
      })),
      interview_goal: "训练用户用真实证据回答目标岗位问题。",
      risk_reminders: ["不要编造数字", "不要把参与说成主导", "不确定信息需要说明"],
    };
  },
};

type NextActionInput = {
  mode: InterviewMode;
  jd_profile: InterviewJDProfile;
  current_question: InterviewQuestionPlan["questions"][number];
  turns: InterviewTurn[];
  followup_depth: number;
  remaining_questions: number;
};

export const interviewerAgentPrompt: PromptDefinition<NextActionInput, InterviewNextAction> = {
  id: "interview-next-action",
  version: "1.0.0",
  model: "fast",
  schema: interviewNextActionSchema,
  build: input => `${sharedRules}
你是 AI 面试官，只决定下一步动作，不评分。
如果回答太短、偏题、缺少 STAR 中的行动/结果，且 followup_depth < 2，则 action=follow_up。
如果当前问题已足够回答，action=next_question。
如果没有剩余问题，action=end_interview。
追问必须具体，只引导用户补充真实事实，不得诱导编造。
输入：${json(input)}
输出字段：action, follow_up_question, reason, interviewer_feedback, evidence。`,
  fallback: input => {
    const latest = input.turns.at(-1)?.answer || "";
    const shouldFollow = latest.length < 80 && input.followup_depth < 2 && input.remaining_questions > 0;
    return {
      action: input.remaining_questions <= 0 ? "end_interview" : shouldFollow ? "follow_up" : "next_question",
      follow_up_question: shouldFollow ? "可以补充一下你当时具体做了什么，以及最后产生了什么结果吗？" : "",
      reason: shouldFollow ? "回答较短，缺少行动和结果证据。" : "当前回答可以进入下一步。",
      interviewer_feedback: "收到，我会继续围绕岗位要求追问。",
      evidence: [latest.slice(0, 120) || "用户尚未提供充分回答"],
    };
  },
};

type ScoreInput = {
  mode: InterviewMode;
  jd_profile: InterviewJDProfile;
  question: InterviewQuestionPlan["questions"][number];
  answer: string;
  previous_turns?: InterviewTurn[];
};

export const answerScorerAgentPrompt: PromptDefinition<ScoreInput, InterviewAnswerScore> = {
  id: "interview-score-answer",
  version: "1.0.0",
  model: "reasoning",
  schema: interviewAnswerScoreSchema,
  build: input => `${sharedRules}
你是面试回答评分 Agent。只根据问题、JD 画像和用户回答评分。
评分维度至少包含：岗位相关性、结构完整度、证据具体度、表达清晰度。
如果用户回答没有证据，不要替用户补事实，只指出缺口。
sample_rewrite 只能基于用户已经说出的事实进行更好的表达；不能新增数字、公司、职责或结果。
输入：${json(input)}
输出字段：question_id, total_score, dimension_scores, strengths, improvements, missing_points, risk_items, sample_rewrite。`,
  fallback: input => {
    const short = input.answer.trim().length < 80;
    return {
      question_id: input.question.id,
      total_score: short ? 62 : 78,
      dimension_scores: [
        { name: "岗位相关性", score: short ? 62 : 78, reason: "回答已尝试回应题目，但 JD 关键词覆盖仍可加强。", evidence: input.answer.slice(0, 80) || "无回答" },
        { name: "结构完整度", score: short ? 58 : 76, reason: "需要更清晰呈现背景、行动和结果。", evidence: input.answer.slice(0, 80) || "无回答" },
        { name: "证据具体度", score: short ? 55 : 74, reason: "缺少可验证细节或量化结果。", evidence: input.answer.slice(0, 80) || "无回答" },
        { name: "表达清晰度", score: short ? 70 : 82, reason: "表达基本清楚，可更凝练。", evidence: input.answer.slice(0, 80) || "无回答" },
      ],
      strengths: short ? ["回答方向与问题有关"] : ["能够结合经历回答", "表达较清楚"],
      improvements: ["补充真实场景、动作、方法和结果", "主动对齐 JD 关键词"],
      missing_points: input.question.expected_answer_points.filter(point => !input.answer.includes(point)).slice(0, 3),
      risk_items: short ? [{ text: input.answer || "空回答", risk_type: "too_short", severity: "medium", suggestion: "补充一个完整案例。" }] : [],
      sample_rewrite: input.answer ? `${input.answer}。建议进一步补充真实结果或复盘。` : "请先补充真实回答。",
    };
  },
};

type FinalReviewInput = {
  mode: InterviewMode;
  jd_profile: InterviewJDProfile;
  question_plan: InterviewQuestionPlan;
  turns: InterviewTurn[];
  scores: InterviewAnswerScore[];
};

export const reviewCoachAgentPrompt: PromptDefinition<FinalReviewInput, InterviewFinalReview> = {
  id: "interview-final-review",
  version: "1.0.0",
  model: "reasoning",
  schema: interviewFinalReviewSchema,
  build: input => `${sharedRules}
你是面试复盘教练。根据完整面试记录和逐题评分生成最终报告。
不要新增用户没说过的事实。
指出优势、薄弱点、关键词覆盖、下一轮训练计划。
如果某项能力没有回答证据，写入 missing_keywords 或 next_training_plan。
输入：${json(input)}
输出字段：overall_score, summary, dimension_summary, strongest_answers, weakest_answers, keyword_coverage, missing_keywords, next_training_plan, final_suggestions。`,
  fallback: input => {
    const average = input.scores.length
      ? Math.round(input.scores.reduce((sum, item) => sum + item.total_score, 0) / input.scores.length)
      : 65;
    const transcript = input.turns.map(turn => turn.answer).join("\n");
    const covered = input.jd_profile.keywords.filter(keyword => transcript.includes(keyword)).slice(0, 8);
    return {
      overall_score: average,
      summary: `本次训练整体得分 ${average}，建议继续强化结构化表达和真实证据呈现。`,
      dimension_summary: [
        { name: "岗位相关性", score: average, comment: "需要持续围绕 JD 关键词组织回答。" },
        { name: "结构完整度", score: Math.max(50, average - 4), comment: "建议使用 STAR 结构。" },
        { name: "证据具体度", score: Math.max(45, average - 8), comment: "补充真实数据、对象、产出或复盘。" },
      ],
      strongest_answers: input.turns.slice(0, 2).map(turn => turn.answer.slice(0, 120)).filter(Boolean),
      weakest_answers: input.scores.flatMap(score => score.missing_points).slice(0, 3),
      keyword_coverage: covered,
      missing_keywords: input.jd_profile.keywords.filter(keyword => !covered.includes(keyword)).slice(0, 8),
      next_training_plan: ["准备 2 个完整 STAR 案例", "每题回答控制在 90 秒内", "补充真实量化结果或复盘指标"],
      final_suggestions: ["不要编造经历", "先讲结论，再讲证据", "把行动和结果说具体"],
    };
  },
};
