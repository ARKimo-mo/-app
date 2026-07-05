"use client";

import { Check, LoaderCircle, WandSparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type {
  AIResponse,
  JobResult,
  ResumeDiscovery,
  ResumeFactCheck,
  ResumeJDAnalysis,
  ResumeMatchReport,
  ResumeProfile,
  ResumeRewrite,
  UserProfileInput,
} from "@/lib/ai/types";
import type { V4FlowState } from "./types";

type ResumeSections = {
  basic: string;
  education: string;
  internships: string;
  projects: string;
  skills: string;
  selfEvaluation: string;
};

type ResumeCenterState = {
  sections: ResumeSections;
  jdText: string;
  extraInfo: string;
  acceptedIds: string[];
  jdAnalysis: ResumeJDAnalysis | null;
  resumeJson: ResumeProfile | null;
  matchReport: ResumeMatchReport | null;
  discovery: ResumeDiscovery | null;
  rewrite: ResumeRewrite | null;
  factCheck: ResumeFactCheck | null;
};

type Props = {
  toast: (message: string) => void;
  profile: UserProfileInput;
  flow: V4FlowState;
  onTrace: (response: AIResponse<unknown>, action: string) => void;
};

const cacheKey = "career-copy-ai-v4-resume-center";
const cx = (...values: Array<string | false | undefined>) => values.filter(Boolean).join(" ");

const defaultSections: ResumeSections = {
  basic: "林同学｜产品经理｜北京｜138****8888｜lintongxue@email.com",
  education: "北京大学｜计算机科学与技术｜本科",
  internships: "字节跳动｜产品实习生｜负责用户调研与需求洞察，协同设计研发推动方案落地。",
  projects: "校园二手交易平台｜产品设计｜完成用户访谈、发布流程梳理和原型设计。",
  skills: "用户调研、PRD、需求分析、数据分析、AI 应用、项目协作",
  selfEvaluation: "关注 AI 产品和用户成长场景，擅长结构化分析与方案表达。",
};

const sectionText = (sections: ResumeSections) =>
  `个人信息：${sections.basic}\n教育背景：${sections.education}\n实习经历：${sections.internships}\n项目经历：${sections.projects}\n技能证书：${sections.skills}\n自我评价：${sections.selfEvaluation}`;

async function callAI<T>(url: string, input: unknown): Promise<AIResponse<T>> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(`AI 请求失败：${response.status}`);
  return response.json();
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={cx("rounded-2xl border border-[#e8e9f4] bg-white p-4 shadow-[0_8px_28px_rgba(70,63,132,.055)]", className)}>{children}</section>;
}

function Title({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 border-l-[3px] border-[#6257ed] pl-2 text-[13px] font-bold">{children}</h2>;
}

function Button({ children, onClick, disabled = false, ghost = false, className = "" }: { children: ReactNode; onClick?: () => void; disabled?: boolean; ghost?: boolean; className?: string }) {
  return <button disabled={disabled} onClick={onClick} className={cx("inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-45", ghost ? "border border-[#dedff0] bg-white text-[#5d53e8] hover:bg-[#f7f6ff]" : "bg-[#6257ed] text-white shadow-[0_8px_20px_rgba(98,87,237,.2)]", className)}>{children}</button>;
}

function Pill({ children, tone = "violet" }: { children: ReactNode; tone?: "violet" | "green" | "orange" }) {
  const tones = { violet: "bg-[#f0eeff] text-[#6257ed]", green: "bg-emerald-50 text-emerald-600", orange: "bg-orange-50 text-orange-600" };
  return <span className={cx("inline-flex rounded-lg px-2 py-1 text-[9px] font-medium", tones[tone])}>{children}</span>;
}

function jobFallback(flow: V4FlowState): JobResult | null {
  return flow.selectedSearchJob;
}

export function V4ResumeCenter({ toast, profile, flow, onTrace }: Props) {
  const [tab, setTab] = useState<"resume" | "diagnosis" | "match" | "delivery">("resume");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState("");
  const sourceJob = jobFallback(flow);
  const [state, setState] = useState<ResumeCenterState>(() => ({
    sections: defaultSections,
    jdText: flow.selectedJob?.jdText || sourceJob?.summary || "",
    extraInfo: "",
    acceptedIds: [],
    jdAnalysis: null,
    resumeJson: null,
    matchReport: null,
    discovery: null,
    rewrite: null,
    factCheck: null,
  }));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => setState(current => ({ ...current, ...parsed })));
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(cacheKey, JSON.stringify(state));
  }, [state]);

  const patch = (patchValue: Partial<ResumeCenterState>) => setState(current => ({ ...current, ...patchValue }));
  const updateSection = (key: keyof ResumeSections, value: string) => patch({ sections: { ...state.sections, [key]: value } });
  const runStep = async <T,>(label: string, url: string, input: unknown) => {
    setStep(label);
    const response = await callAI<T>(url, input);
    onTrace(response, label);
    return response.data;
  };

  const runAgents = async () => {
    if (state.jdText.trim().length < 80) {
      toast("请先粘贴至少 80 字的完整 JD");
      return;
    }
    setRunning(true);
    try {
      const jdAnalysis = await runStep<ResumeJDAnalysis>("1/6 JD 解析 Agent：拆解岗位画像", "/api/ai/resume/jd/analyze", {
        job_title: flow.selectedJob?.title || profile.targetRole,
        company_name: flow.selectedJob?.company || sourceJob?.company || "",
        target_direction: profile.targetRole,
        job_description: state.jdText,
      });
      patch({ jdAnalysis });

      const resumeJson = await runStep<ResumeProfile>("2/6 简历解析 Agent：生成 evidence_id", "/api/ai/resume/parse", {
        resume_text: sectionText(state.sections),
        sections: state.sections,
      });
      patch({ resumeJson });

      const matchReport = await runStep<ResumeMatchReport>("3/6 匹配诊断 Agent：计算 JD 匹配度", "/api/ai/resume/match", {
        jd_analysis: jdAnalysis,
        resume_json: resumeJson,
      });
      patch({ matchReport });

      const discovery = await runStep<ResumeDiscovery>("4/6 经历挖掘 Agent：生成真实追问", "/api/ai/resume/discovery", {
        jd_analysis: jdAnalysis,
        resume_json: resumeJson,
        match_report: matchReport,
      });
      patch({ discovery });

      const rewrite = await runStep<ResumeRewrite>("5/6 简历改写 Agent：生成岗位版表达", "/api/ai/resume/rewrite", {
        jd_analysis: jdAnalysis,
        resume_json: resumeJson,
        match_report: matchReport,
        user_extra_info: state.extraInfo,
      });
      const acceptedIds = rewrite.rewrites.filter(item => item.risk_level === "low" && !item.need_user_confirmation).map(item => item.evidence_id);
      patch({ rewrite, acceptedIds });

      const factCheck = await runStep<ResumeFactCheck>("6/6 事实审核 Agent：拦截夸大与 ATS 风险", "/api/ai/resume/fact-check", {
        jd_analysis: jdAnalysis,
        resume_json: resumeJson,
        rewrite_result: rewrite,
      });
      patch({ factCheck });
      setTab("diagnosis");
      toast("6 个简历 Agent 已完成一轮联动");
    } catch (error) {
      toast(error instanceof Error ? error.message : "简历 Agent 运行失败，已保留已有结果");
    } finally {
      setRunning(false);
      setStep("");
    }
  };

  const toggleAccept = (id: string) => patch({ acceptedIds: state.acceptedIds.includes(id) ? state.acceptedIds.filter(item => item !== id) : [...state.acceptedIds, id] });
  const acceptedRewrites = state.rewrite?.rewrites.filter(item => state.acceptedIds.includes(item.evidence_id)) ?? [];
  const preview = state.rewrite?.tailored_resume;
  const displayExperience = acceptedRewrites.length ? acceptedRewrites.map(item => item.rewritten_text) : [state.sections.internships, state.sections.projects].filter(Boolean);
  const metricCards = [
    ["匹配度", state.matchReport ? `${state.matchReport.overall_score}%` : "待分析"],
    ["关键词覆盖", state.factCheck ? `${state.factCheck.keyword_coverage.length} 个` : "待分析"],
    ["可改写证据", state.matchReport ? `${state.matchReport.rewrite_plan.length} 条` : "待分析"],
    ["审核状态", state.factCheck ? (state.factCheck.pass ? "通过" : "需确认") : "待审核"],
  ];
  const tabs = [["resume", "我的简历"], ["diagnosis", "简历诊断"], ["match", "岗位匹配"], ["delivery", "投递记录"]] as const;

  return <div className="space-y-3">
    <div className="flex items-end justify-between">
      <div><Pill>简历中心</Pill><h1 className="mt-2 text-[27px] font-bold">JD 驱动的简历适配工作流</h1><p className="text-xs text-[#7e859e]">6 个 Agent 串联：JD 解析、简历解析、匹配诊断、经历挖掘、简历改写、事实审核。</p></div>
      <Button onClick={runAgents} disabled={running}>{running ? <><LoaderCircle className="animate-spin" size={14} />{step || "运行中"}</> : <><WandSparkles size={14} />一键优化</>}</Button>
    </div>
    <Card className="flex gap-2">{tabs.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={cx("rounded-xl px-5 py-2 text-xs font-semibold", tab === id ? "bg-[#efedff] text-[#6257ed]" : "text-[#68718c] hover:bg-[#fafaff]")}>{label}</button>)}</Card>
    <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-3">
      <main className="space-y-3">
        {tab === "resume" && <>
          <Card><Title>目标 JD</Title><textarea value={state.jdText} onChange={event => patch({ jdText: event.target.value })} placeholder="粘贴完整岗位 JD，至少包含职责、要求、加分项。" className="min-h-[170px] w-full resize-none rounded-xl border border-[#e3e5f0] bg-[#fcfcff] p-4 text-xs leading-6 outline-none focus:border-[#8177ff]" /><p className="mt-2 text-[9px] text-[#8a91aa]">当前 {state.jdText.length} 字。少于 80 字时不会启动完整 Agent 流程。</p></Card>
          <Card><Title>简历内容编辑</Title>{([
            ["basic", "个人信息"],
            ["education", "教育背景"],
            ["internships", "实习经历"],
            ["projects", "项目经历"],
            ["skills", "技能证书"],
            ["selfEvaluation", "自我评价"],
          ] as const).map(([key, label]) => <label key={key} className="mb-3 block text-[10px] font-semibold">{label}<textarea value={state.sections[key]} onChange={event => updateSection(key, event.target.value)} className="mt-1 min-h-[72px] w-full resize-y rounded-xl border border-[#e3e5f0] bg-[#fcfcff] p-3 text-xs font-normal leading-6 outline-none focus:border-[#8177ff]" /></label>)}<label className="block text-[10px] font-semibold">补充给 AI 的真实信息<textarea value={state.extraInfo} onChange={event => patch({ extraInfo: event.target.value })} placeholder="可补充真实数据、产出、协作对象；不确定的内容请写需要确认。" className="mt-1 min-h-[90px] w-full rounded-xl border border-[#e3e5f0] bg-[#fcfcff] p-3 text-xs font-normal leading-6 outline-none focus:border-[#8177ff]" /></label></Card>
        </>}
        {tab === "diagnosis" && <>
          <Card><Title>JD 解析结果</Title><div className="grid grid-cols-3 gap-2">{["core_responsibilities", "hard_requirements", "priority_skills"].map(key => <div key={key} className="rounded-xl bg-[#fafaff] p-3"><b className="text-[10px]">{key}</b>{((state.jdAnalysis?.[key as keyof ResumeJDAnalysis] as string[] | undefined) ?? []).slice(0, 5).map(item => <p key={item} className="mt-2 text-[9px] text-[#68718c]">✓ {item}</p>)}</div>)}</div></Card>
          <Card><Title>简历诊断</Title><div className="grid grid-cols-5 gap-2">{Object.entries(state.matchReport?.score_breakdown ?? {}).map(([key, value]) => <div key={key} className="rounded-xl bg-[#fafaff] p-3"><small className="text-[8px] text-[#8a91aa]">{key}</small><b className="block text-xl">{value}</b></div>)}</div>{state.matchReport?.section_diagnosis.map(item => <div key={`${item.section}-${item.evidence_id}`} className="mt-3 rounded-xl border border-[#e9eaf3] p-3"><div className="flex justify-between"><b className="text-[10px]">{item.section}</b><Pill tone={item.status === "已完善" ? "green" : "orange"}>{item.status}</Pill></div><p className="mt-2 text-[9px] text-[#68718c]">{item.reason}</p></div>)}</Card>
        </>}
        {tab === "match" && <>
          <Card><Title>经历挖掘追问</Title>{state.discovery?.questions.map(question => <div key={question.question} className="mb-3 rounded-xl bg-[#fafaff] p-3"><Pill>{question.target_skill}</Pill><b className="mt-2 block text-[10px]">{question.question}</b><p className="mt-2 text-[9px] text-[#68718c]">{question.why_ask}</p><p className="mt-2 rounded-lg bg-white p-2 text-[9px] text-[#8a91aa]">{question.example_answer_structure}</p></div>) ?? <p className="text-xs text-[#8a91aa]">运行一键优化后会生成追问。</p>}</Card>
          <Card><Title>改写建议</Title>{state.rewrite?.rewrites.map(item => <div key={item.evidence_id} className="mb-3 rounded-xl border border-[#e9eaf3] p-3"><div className="flex items-center justify-between"><b className="text-[10px]">{item.section}</b><div className="flex gap-2"><Pill tone={item.risk_level === "low" ? "green" : "orange"}>{item.risk_level}</Pill><button onClick={() => toggleAccept(item.evidence_id)} className={cx("rounded-lg px-2 py-1 text-[9px] font-semibold", state.acceptedIds.includes(item.evidence_id) ? "bg-emerald-50 text-emerald-600" : "bg-[#efedff] text-[#6257ed]")}>{state.acceptedIds.includes(item.evidence_id) ? "已采纳" : "采纳"}</button></div></div><p className="mt-2 text-[9px] text-[#8a91aa]">原文：{item.original_text}</p><p className="mt-2 text-[10px] leading-5 text-[#171a2d]">优化：{item.rewritten_text}</p>{item.need_user_confirmation && <p className="mt-2 rounded-lg bg-orange-50 p-2 text-[9px] text-orange-600">需要确认：{item.confirmation_question}</p>}</div>) ?? <p className="text-xs text-[#8a91aa]">运行一键优化后会生成前后对比。</p>}</Card>
        </>}
        {tab === "delivery" && <Card><Title>事实审核与投递状态</Title>{state.factCheck ? <><div className="grid grid-cols-3 gap-2"><div className="rounded-xl bg-[#fafaff] p-3"><small className="text-[9px]">ATS 分</small><b className="block text-2xl">{state.factCheck.ats_score}</b></div><div className="rounded-xl bg-[#fafaff] p-3"><small className="text-[9px]">审核</small><b className="block text-2xl">{state.factCheck.pass ? "通过" : "需确认"}</b></div><div className="rounded-xl bg-[#fafaff] p-3"><small className="text-[9px]">风险</small><b className="block text-2xl">{state.factCheck.risk_items.length}</b></div></div>{state.factCheck.risk_items.map(item => <div key={item.text} className="mt-3 rounded-xl bg-orange-50 p-3 text-[9px] text-orange-700"><b>{item.severity} · {item.risk_type}</b><p className="mt-1">{item.reason}</p><p className="mt-1">建议：{item.suggested_fix}</p></div>)}<Button className="mt-4" disabled={!state.factCheck.pass} onClick={() => toast(state.factCheck?.pass ? "已保存为投递版本" : "仍有审核风险，暂不建议投递")}>保存为投递版本</Button></> : <p className="text-xs text-[#8a91aa]">完成一键优化后，这里会显示事实审核和 ATS 检查。</p>}</Card>}
      </main>
      <aside className="space-y-3">
        <Card><Title>简历预览</Title><div className="min-h-[520px] rounded-xl border border-[#e3e5ef] bg-white p-6 text-[9px] leading-6"><h2 className="text-xl font-bold">{state.sections.basic.split("｜")[0] || "林同学"}</h2><p>{state.sections.basic}</p><hr className="my-3" /><b>求职摘要</b><p>{preview?.summary || state.sections.selfEvaluation}</p><b className="mt-3 block">教育背景</b>{(preview?.education.length ? preview.education : [state.sections.education]).map(item => <p key={item}>{item}</p>)}<b className="mt-3 block">核心经历</b>{displayExperience.map(item => <p key={item}>• {item}</p>)}<b className="mt-3 block">技能证书</b><p>{(preview?.skills.length ? preview.skills : [state.sections.skills]).join(" / ")}</p></div></Card>
        <Card><Title>工作流状态</Title><div className="grid grid-cols-2 gap-2">{metricCards.map(([label, value]) => <div key={label} className="rounded-xl bg-[#fafaff] p-3"><small className="text-[9px] text-[#8a91aa]">{label}</small><b className="block text-lg">{value}</b></div>)}</div>{["JD 解析", "简历解析", "匹配诊断", "经历挖掘", "简历改写", "事实审核"].map((name, index) => { const done = [state.jdAnalysis, state.resumeJson, state.matchReport, state.discovery, state.rewrite, state.factCheck][index]; return <p key={name} className="mt-2 flex items-center gap-2 text-[9px]"><span className={cx("grid size-5 place-items-center rounded-full", done ? "bg-emerald-500 text-white" : "bg-[#eef0f6] text-[#8a91aa]")}>{done ? <Check size={11} /> : index + 1}</span>{name}</p>; })}</Card>
      </aside>
    </div>
  </div>;
}
