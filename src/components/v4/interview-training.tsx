"use client";

import Image from "next/image";
import {
  Bot,
  Check,
  ChevronRight,
  LoaderCircle,
  MessageCircle,
  Mic,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  InterviewAnswerScore,
  InterviewFinalReview,
  InterviewJDProfile,
  InterviewMode,
  InterviewQuestionPlan,
  InterviewResumeProfile,
  InterviewTurn,
} from "@/agents/interview/types";
import type { AIResponse, UserProfileInput } from "@/lib/ai/types";
import type { V4FlowState } from "./types";

type Stage = "setup" | "training" | "review";

type InterviewState = {
  mode: InterviewMode;
  targetRole: string;
  jdText: string;
  resumeText: string;
  stage: Stage;
  jdProfile: InterviewJDProfile | null;
  resumeProfile: InterviewResumeProfile | null;
  questionPlan: InterviewQuestionPlan | null;
  currentIndex: number;
  answerDraft: string;
  turns: InterviewTurn[];
  scores: InterviewAnswerScore[];
  finalReview: InterviewFinalReview | null;
};

type Props = {
  toast: (message: string) => void;
  profile: UserProfileInput;
  flow: V4FlowState;
  onTrace: (response: AIResponse<unknown>, action: string) => void;
};

const cacheKey = "career-copy-ai-v4-interview-session-v2";
const cx = (...values: Array<string | false | undefined>) => values.filter(Boolean).join(" ");

const makeDefaultState = (profile: UserProfileInput, flow: V4FlowState): InterviewState => ({
  mode: "special_training",
  targetRole: flow.selectedJob?.title || flow.selectedSearchJob?.title || profile.targetRole || "产品经理",
  jdText: flow.selectedJob?.jdText || flow.selectedSearchJob?.summary || "",
  resumeText: profile.resume || "",
  stage: "setup",
  jdProfile: null,
  resumeProfile: null,
  questionPlan: null,
  currentIndex: 0,
  answerDraft: "",
  turns: [],
  scores: [],
  finalReview: null,
});

async function callAI<T>(url: string, input: unknown): Promise<AIResponse<T>> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(`AI 请求失败：${response.status}`);
  return response.json();
}

function speakText(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={cx("rounded-2xl border border-[#e8e9f4] bg-white p-4 shadow-[0_8px_28px_rgba(70,63,132,.055)]", className)}>
      {children}
    </section>
  );
}

function Title({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="border-l-[3px] border-[#6257ed] pl-2 text-[13px] font-bold">{children}</h2>
      {action}
    </div>
  );
}

function Button({
  children,
  onClick,
  disabled = false,
  ghost = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ghost?: boolean;
  className?: string;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-45",
        ghost ? "border border-[#dedff0] bg-white text-[#5d53e8] hover:bg-[#f7f6ff]" : "bg-[#6257ed] text-white shadow-[0_8px_20px_rgba(98,87,237,.2)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

function Pill({ children, tone = "violet" }: { children: ReactNode; tone?: "violet" | "green" | "orange" }) {
  const tones = {
    violet: "bg-[#f0eeff] text-[#6257ed]",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return <span className={cx("inline-flex rounded-lg px-2 py-1 text-[9px] font-medium", tones[tone])}>{children}</span>;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between text-[9px]">
        <b>{label}</b>
        <span>{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#eceef5]">
        <div className="h-full rounded-full bg-[#6257ed]" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export function V4InterviewTraining({ toast, profile, flow, onTrace }: Props) {
  const defaultState = useMemo(() => makeDefaultState(profile, flow), [profile, flow]);
  const [state, setState] = useState<InterviewState>(defaultState);
  const [running, setRunning] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(cacheKey);
      if (saved) setState(current => ({ ...current, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(state));
    } catch {}
  }, [state]);

  const patch = (value: Partial<InterviewState>) => setState(current => ({ ...current, ...value }));
  const questions = state.questionPlan?.questions ?? [];
  const currentQuestion = questions[state.currentIndex];
  const averageScore = state.scores.length
    ? Math.round(state.scores.reduce((sum, item) => sum + item.total_score, 0) / state.scores.length)
    : 0;

  const runStep = async <T,>(label: string, url: string, input: unknown) => {
    setRunning(label);
    const response = await callAI<T>(url, input);
    onTrace(response, label);
    return response.data;
  };

  const startTraining = async () => {
    if (!state.targetRole.trim() && !state.jdText.trim()) {
      toast("请先填写目标岗位或 JD");
      return;
    }
    if (state.mode === "mock_interview" && state.resumeText.trim().length < 20) {
      toast("模拟面试需要先粘贴简历文本");
      return;
    }
    try {
      const jdProfile = await runStep<InterviewJDProfile>("面试训练：JD 解析 Agent", "/api/interview/jd-parse", {
        job_title: state.targetRole,
        company_name: flow.selectedJob?.company || flow.selectedSearchJob?.company || "",
        target_direction: profile.targetRole,
        job_description: state.jdText || state.targetRole,
      });

      let resumeProfile: InterviewResumeProfile | null = null;
      if (state.mode === "mock_interview") {
        resumeProfile = await runStep<InterviewResumeProfile>("面试训练：简历解析 Agent", "/api/interview/resume-parse", {
          resume_text: state.resumeText,
        });
      }

      const questionPlan = await runStep<InterviewQuestionPlan>("面试训练：问题生成 Agent", "/api/interview/generate-questions", {
        mode: state.mode,
        jd_profile: jdProfile,
        resume_profile: resumeProfile,
        question_count: state.mode === "special_training" ? 5 : 7,
        difficulty: "medium",
      });

      patch({
        jdProfile,
        resumeProfile,
        questionPlan,
        stage: "training",
        currentIndex: 0,
        answerDraft: "",
        turns: [],
        scores: [],
        finalReview: null,
      });
      speakText(questionPlan.questions[0]?.question || questionPlan.opening);
      toast("面试题已生成");
    } catch (error) {
      toast(error instanceof Error ? error.message : "面试训练启动失败");
    } finally {
      setRunning("");
    }
  };

  const submitAnswer = async () => {
    if (!state.jdProfile || !state.questionPlan || !currentQuestion) return;
    const answer = state.answerDraft.trim();
    if (answer.length < 8) {
      toast("请先输入一段回答");
      return;
    }
    try {
      const turn: InterviewTurn = {
        question_id: currentQuestion.id,
        question: currentQuestion.question,
        answer,
        followup_depth: 0,
      };
      const score = await runStep<InterviewAnswerScore>("面试训练：回答评分 Agent", "/api/interview/score-answer", {
        mode: state.mode,
        jd_profile: state.jdProfile,
        question: currentQuestion,
        answer,
        previous_turns: state.turns,
      });
      const nextIndex = state.currentIndex + 1;
      const nextTurns = [...state.turns, turn];
      const nextScores = [...state.scores, score];
      if (nextIndex < questions.length) {
        patch({ turns: nextTurns, scores: nextScores, currentIndex: nextIndex, answerDraft: "" });
        speakText(questions[nextIndex].question);
      } else {
        const review = await runStep<InterviewFinalReview>("面试训练：最终复盘 Agent", "/api/interview/final-review", {
          mode: state.mode,
          jd_profile: state.jdProfile,
          question_plan: state.questionPlan,
          turns: nextTurns,
          scores: nextScores,
        });
        patch({ turns: nextTurns, scores: nextScores, finalReview: review, stage: "review", answerDraft: "" });
        toast("本次面试复盘已生成");
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : "回答提交失败");
    } finally {
      setRunning("");
    }
  };

  const reset = () => {
    localStorage.removeItem(cacheKey);
    setState(defaultState);
  };

  return (
    <div className="space-y-3">
      <Card className="relative min-h-[210px] overflow-hidden border-[#dfdcff] bg-[radial-gradient(circle_at_82%_45%,#ded9ff,transparent_34%),linear-gradient(135deg,#ffffff_0%,#f7f5ff_55%,#eef7ff_100%)]">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <Pill>面试训练</Pill>
            <h1 className="mt-4 text-[29px] font-bold tracking-tight">AI 面试官训练室</h1>
            <p className="mt-2 max-w-[650px] text-xs leading-6 text-[#68718c]">
              在原有 V4 面试训练模块里接入 DeepSeek Agent，支持专项训练和模拟面试，回答评分与复盘都基于你的真实信息。
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={startTraining} disabled={Boolean(running)}>
                {running ? <><LoaderCircle size={14} className="animate-spin" />{running}</> : <><Sparkles size={14} />生成面试题</>}
              </Button>
              <Button ghost onClick={() => patch({ mode: state.mode === "special_training" ? "mock_interview" : "special_training" })}>
                {state.mode === "special_training" ? "切到模拟面试" : "切到专项训练"}
              </Button>
              <Button ghost onClick={reset}><RotateCcw size={14} />重置</Button>
            </div>
          </div>
          <div className="mr-10 hidden items-center gap-4 lg:flex">
            <div className="rounded-2xl bg-white/85 p-4 text-xs leading-6 text-[#68718c] shadow-[0_12px_35px_rgba(80,70,160,.12)]">
              <b className="block text-[#171a2d]">你好，我是你的 AI 面试官</b>
              {state.mode === "special_training" ? "今天先做专项能力补强。" : "我们按真实面试节奏走一轮。"}
            </div>
            <div className="relative h-[210px] w-[230px]">
              <Image src="/assets/avatar-interviewer-suit.png" alt="AI 面试官" fill sizes="230px" className="object-contain" priority />
            </div>
          </div>
        </div>
      </Card>

      {state.stage === "setup" && (
        <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-3">
          <main className="space-y-3">
            <Card>
              <Title>训练模式</Title>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["special_training", "专项训练", "围绕 JD 关键能力生成 5 道训练题，适合短时间补强。"],
                  ["mock_interview", "模拟面试", "结合 JD 与简历进行完整追问，更接近真实面试。"],
                ].map(([id, title, desc]) => (
                  <button
                    key={id}
                    onClick={() => patch({ mode: id as InterviewMode })}
                    className={cx("rounded-2xl border p-4 text-left transition", state.mode === id ? "border-[#6257ed] bg-[#f3f1ff]" : "border-[#e8e9f4] bg-white hover:bg-[#fafaff]")}
                  >
                    <b className="text-sm">{title}</b>
                    <p className="mt-2 text-[10px] leading-5 text-[#68718c]">{desc}</p>
                  </button>
                ))}
              </div>
            </Card>
            <Card>
              <Title>目标岗位与 JD</Title>
              <input
                value={state.targetRole}
                onChange={event => patch({ targetRole: event.target.value })}
                className="mb-3 h-10 w-full rounded-xl border border-[#e3e5ef] px-3 text-xs outline-none focus:border-[#8177ff]"
                placeholder="目标岗位，例如 AI 产品经理"
              />
              <textarea
                value={state.jdText}
                onChange={event => patch({ jdText: event.target.value })}
                className="min-h-[180px] w-full resize-none rounded-xl border border-[#e3e5ef] bg-[#fcfcff] p-4 text-xs leading-6 outline-none focus:border-[#8177ff]"
                placeholder="粘贴 JD，或写清目标岗位要求、职责、加分项。"
              />
            </Card>
            {state.mode === "mock_interview" && (
              <Card>
                <Title>简历文本</Title>
                <textarea
                  value={state.resumeText}
                  onChange={event => patch({ resumeText: event.target.value })}
                  className="min-h-[150px] w-full resize-none rounded-xl border border-[#e3e5ef] bg-[#fcfcff] p-4 text-xs leading-6 outline-none focus:border-[#8177ff]"
                  placeholder="粘贴简历文本。AI 只会基于这里的事实追问。"
                />
              </Card>
            )}
          </main>
          <aside className="space-y-3">
            <Card>
              <Title>Agent 流水线</Title>
              {(state.mode === "mock_interview"
                ? ["JD 解析", "简历解析", "问题生成", "回答评分", "最终复盘"]
                : ["JD 解析", "问题生成", "回答评分", "最终复盘"]
              ).map((item, index) => (
                <div key={item} className="mb-2 flex items-center gap-2 rounded-xl bg-[#fafaff] p-3 text-[10px]">
                  <Pill>{String(index + 1).padStart(2, "0")}</Pill>
                  <b>{item}</b>
                </div>
              ))}
            </Card>
            <Card>
              <Title>安全边界</Title>
              {["不编造经历和数字", "没有证据就标记需要确认", "追问只帮助你回忆真实事实", "评分不自动修改简历"].map(item => (
                <p key={item} className="mb-2 text-[10px] text-[#68718c]">✓ {item}</p>
              ))}
            </Card>
          </aside>
        </div>
      )}

      {state.stage === "training" && currentQuestion && (
        <div className="grid grid-cols-[260px_minmax(0,1fr)_320px] gap-3">
          <Card>
            <Title>面试进度</Title>
            <div className="mb-4 text-4xl font-bold text-[#6257ed]">
              {state.currentIndex + 1}<small className="text-xs text-[#8a91aa]"> / {questions.length}</small>
            </div>
            {questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => patch({ currentIndex: index, answerDraft: "" })}
                className={cx("mb-2 w-full rounded-xl p-3 text-left text-[10px]", index === state.currentIndex ? "bg-[#f0eeff] text-[#6257ed]" : "bg-[#fafaff] text-[#68718c]")}
              >
                <b>0{index + 1}</b><span className="ml-2">{question.target_competency}</span>
              </button>
            ))}
          </Card>
          <main className="space-y-3">
            <Card>
              <div className="flex items-center justify-between">
                <Pill>当前问题</Pill>
                <Button ghost onClick={() => speakText(currentQuestion.question)}><Volume2 size={14} />播放</Button>
              </div>
              <h2 className="my-6 text-[23px] font-bold leading-9">{currentQuestion.question}</h2>
              <textarea
                value={state.answerDraft}
                onChange={event => patch({ answerDraft: event.target.value })}
                className="min-h-[220px] w-full resize-none rounded-xl border border-[#e3e5ef] bg-[#fcfcff] p-4 text-xs leading-6 outline-none focus:border-[#8177ff]"
                placeholder="输入你的回答。建议用 STAR：背景、任务、行动、结果。"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button ghost onClick={() => toast("语音识别会作为下一步接入，当前请先用文字回答")}><Mic size={14} />语音回答</Button>
                <Button onClick={submitAnswer} disabled={Boolean(running)}>{running ? <><LoaderCircle size={14} className="animate-spin" />处理中</> : <><Send size={14} />提交回答</>}</Button>
              </div>
            </Card>
          </main>
          <aside className="space-y-3">
            <Card>
              <Title>综合表现</Title>
              <div className="text-center">
                <b className="text-5xl text-[#6257ed]">{averageScore || "--"}</b>
                <span className="text-xs text-[#8a91aa]"> /100</span>
              </div>
            </Card>
            <Card>
              <Title>回答提示</Title>
              {currentQuestion.expected_answer_points.map(item => <p key={item} className="mb-2 text-[10px] text-[#68718c]">• {item}</p>)}
            </Card>
            <Card>
              <Title>关键词</Title>
              <div className="flex flex-wrap gap-2">{currentQuestion.related_jd_keywords.map(item => <Pill key={item} tone="green">{item}</Pill>)}</div>
            </Card>
          </aside>
        </div>
      )}

      {state.stage === "review" && state.finalReview && (
        <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-3">
          <main className="space-y-3">
            <Card>
              <Pill tone="green">复盘完成</Pill>
              <h2 className="mt-3 text-2xl font-bold">{state.finalReview.summary}</h2>
            </Card>
            <Card>
              <Title>维度表现</Title>
              {state.finalReview.dimension_summary.map(item => (
                <div key={item.name} className="mb-4">
                  <ScoreBar label={item.name} value={item.score} />
                  <p className="mt-1 text-[10px] text-[#68718c]">{item.comment}</p>
                </div>
              ))}
            </Card>
          </main>
          <aside className="space-y-3">
            <Card>
              <Title>最终建议</Title>
              {state.finalReview.final_suggestions.map(item => <p key={item} className="mb-2 text-[10px] text-[#68718c]"><Check size={12} className="mr-1 inline text-emerald-500" />{item}</p>)}
              <Button className="mt-3 w-full" onClick={() => patch({ stage: "setup" })}><ChevronRight size={14} />再练一轮</Button>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
