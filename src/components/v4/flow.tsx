"use client";

import Image from "next/image";
import {
  ArrowRight,
  Bot,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  File,
  FileSearch,
  LoaderCircle,
  LockKeyhole,
  Paperclip,
  Play,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type {
  AIResponse,
  AvatarProfile,
  JobResult,
  MissionEvaluation,
  MissionPlan,
  UserProfileInput,
} from "@/lib/ai/types";
import { curatedJobs } from "./data";
import { knowledgeCourses } from "./learning-data";
import type {
  JobPrediction,
  LearningPlan,
  TrialAttachment,
  TrialJob,
  TrialReport,
  V4FlowState,
} from "./types";

type PageTarget = "avatar" | "recommend" | "mission" | "review" | "learning" | "radar" | "jd" | "dashboard";
type FlowPatch = (patch: Partial<V4FlowState>) => void;
type TraceHandler = (response: AIResponse<unknown>, action: string) => void;

const cx = (...values: Array<string | false | undefined>) => values.filter(Boolean).join(" ");

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

function Title({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between"><h2 className="border-l-[3px] border-[#6257ed] pl-2 text-[13px] font-bold">{children}</h2>{action}</div>;
}

function Button({ children, onClick, ghost = false, disabled = false, className = "" }: { children: ReactNode; onClick?: () => void; ghost?: boolean; disabled?: boolean; className?: string }) {
  return <button disabled={disabled} onClick={onClick} className={cx("inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45", ghost ? "border border-[#dedff0] bg-white text-[#5d53e8] hover:bg-[#f7f6ff]" : "bg-[#6257ed] text-white shadow-[0_8px_20px_rgba(98,87,237,.2)]", className)}>{children}</button>;
}

function Tag({ children, tone = "violet" }: { children: ReactNode; tone?: "violet" | "green" | "orange" | "blue" }) {
  const tones = {
    violet: "bg-[#f0eeff] text-[#6257ed]",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return <span className={cx("inline-flex rounded-lg px-2 py-1 text-[9px] font-medium", tones[tone])}>{children}</span>;
}

function Progress({ value, tone = "violet" }: { value: number; tone?: "violet" | "green" | "orange" }) {
  const color = tone === "green" ? "bg-emerald-500" : tone === "orange" ? "bg-orange-400" : "bg-[#6257ed]";
  return <div className="h-1.5 overflow-hidden rounded-full bg-[#ececf4]"><div className={cx("h-full rounded-full", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

function Metric({ label, value, tone = "violet" }: { label: string; value: number; tone?: "violet" | "green" | "orange" }) {
  return <div className="rounded-xl border border-[#ececf5] bg-[#fbfbfe] p-3"><div className="flex items-center justify-between text-[9px]"><span className="text-[#7d849d]">{label}</span><b className={tone === "green" ? "text-emerald-600" : tone === "orange" ? "text-orange-500" : "text-[#6257ed]"}>{value}</b></div><div className="mt-2"><Progress value={value} tone={tone} /></div></div>;
}

function FlowHeader({ active }: { active: number }) {
  const steps = ["训练分身", "分身预判", "亲自验证", "试岗报告", "成长路线"];
  return <Card className="py-3"><div className="relative grid grid-cols-5 gap-2"><div className="absolute left-[9%] right-[9%] top-3 h-px bg-[#dedfeb]" />{steps.map((step, index) => <div key={step} className="relative z-10 text-center"><span className={cx("mx-auto grid size-6 place-items-center rounded-full text-[9px] font-bold", index < active ? "bg-emerald-500 text-white" : index === active ? "bg-[#6257ed] text-white" : "bg-[#e8e9f1] text-[#9298ac]")}>{index < active ? <Check size={12} /> : index + 1}</span><b className={cx("mt-2 block text-[9px]", index === active ? "text-[#6257ed]" : "text-[#747d96]")}>{step}</b></div>)}</div></Card>;
}

export function V4TrialPlaza({ flow, patch, go }: { flow: V4FlowState; patch: FlowPatch; go: (page: PageTarget) => void }) {
  const choose = (job: (typeof curatedJobs)[number]) => {
    patch({
      trialSource: "curated",
      selectedJob: job,
      selectedSearchJob: null,
      prediction: job.prediction,
      mission: null,
      submission: { text: "", attachments: [], submittedAt: "" },
      evaluation: null,
      report: null,
      calibrationProposal: [],
      calibratedAt: "",
      learningPlan: null,
    });
    go("mission");
  };
  return <div className="space-y-3 pb-6">
    <FlowHeader active={1} />
    <Card className="relative min-h-[210px] overflow-hidden bg-[linear-gradient(115deg,#fff_0%,#fcfcff_58%,#f1efff_100%)] p-6">
      <div className="relative z-10 max-w-[720px]"><Tag>标准试岗路径</Tag><h1 className="mt-4 text-[28px] font-bold">选择一个精品岗位，让分身先替你判断</h1><p className="mt-2 max-w-[650px] text-[11px] leading-6 text-[#747d96]">分身会依据你的兴趣、经历证据、压力耐受和工作偏好，预测你是否喜欢、压力来自哪里、成就感如何，以及当前能力是否适配。</p><div className="mt-5 flex gap-2"><Button ghost onClick={() => go("avatar")}>完善分身依据</Button><Button ghost onClick={() => go("radar")}><FileSearch size={14} />搜索真实岗位定制</Button></div></div>
      <div className="absolute bottom-[-42px] right-12 h-[250px] w-[250px]"><Image src="/assets/avatar-student-tablet.png" alt="职业数字分身预演岗位" fill className="object-contain" /></div>
    </Card>
    <div className="grid grid-cols-3 gap-3">
      {curatedJobs.map(job => <Card key={job.id} className={cx("overflow-hidden p-0 transition hover:-translate-y-0.5 hover:border-[#cbc7f7]", flow.selectedJob?.id === job.id && "border-[#afa9f5]")}>
        <div className="relative h-32 overflow-hidden"><Image src={`/assets/${job.image}`} alt={job.title} fill className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#171a2d]/55 to-transparent" /><div className="absolute bottom-3 left-4 text-white"><Tag tone="green">分身预判已就绪</Tag><h2 className="mt-2 text-lg font-bold">{job.title}</h2></div></div>
        <div className="p-4"><p className="min-h-12 text-[10px] leading-5 text-[#747d96]">{job.description}</p><div className="mt-3 grid grid-cols-2 gap-2"><Metric label="预计兴趣" value={job.prediction.interest} /><Metric label="预计压力" value={job.prediction.pressure} tone="orange" /><Metric label="预计成就感" value={job.prediction.achievement} tone="green" /><Metric label="当前适配" value={job.prediction.fit} /></div><div className="mt-4 rounded-xl bg-[#fafaff] p-3"><b className="text-[9px]">判断依据</b>{job.prediction.evidence.slice(0, 2).map(item => <p key={item} className="mt-2 flex gap-2 text-[9px] text-[#747d96]"><Check size={11} className="mt-0.5 text-emerald-500" />{item}</p>)}</div><Button onClick={() => choose(job)} className="mt-4 w-full">让分身试岗 <ArrowRight size={14} /></Button></div>
      </Card>)}
    </div>
    <Card className="flex items-center justify-between"><div><b className="text-sm">没有想试的岗位？</b><p className="mt-1 text-[10px] text-[#7d849d]">进入高阶定制路径，搜索公开岗位并确认完整 JD 后生成专属试岗。</p></div><Button ghost onClick={() => go("radar")}><FileSearch size={14} />AI 搜索真实岗位</Button></Card>
  </div>;
}

export function V4TrialTask({ flow, patch, profile, avatar, go, toast, onTrace }: { flow: V4FlowState; patch: FlowPatch; profile: UserProfileInput; avatar: AvatarProfile | null; go: (page: PageTarget) => void; toast: (message: string) => void; onTrace: TraceHandler }) {
  const [loading, setLoading] = useState<"generate" | "evaluate" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const job = flow.selectedJob;

  const generate = async () => {
    if (!job) return go("recommend");
    setLoading("generate");
    try {
      const response = await callAI<MissionPlan>("/api/ai/mission/generate", { profile, avatar, targetRole: job.title, jd: job.jdText });
      patch({ mission: response.data, evaluation: null, report: null, calibratedAt: "", learningPlan: null });
      onTrace(response, "根据职业分身、岗位要求与能力缺口生成试岗任务");
      toast(response.mode === "live" ? "AI 试岗任务已生成" : "已使用稳定的演示任务");
    } catch (error) {
      toast(error instanceof Error ? error.message : "任务生成失败");
    } finally {
      setLoading(null);
    }
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: TrialAttachment[] = Array.from(files).map(file => ({ id: `${Date.now()}-${file.name}`, name: file.name, type: file.type || "application/octet-stream", size: file.size }));
    patch({ submission: { ...flow.submission, attachments: [...flow.submission.attachments, ...next] } });
    if (fileRef.current) fileRef.current.value = "";
  };

  const evaluate = async () => {
    if (!job || !flow.mission) return toast("请先生成试岗任务");
    if (flow.submission.text.trim().length < 80) return toast("请至少提交 80 字结构化任务材料");
    setLoading("evaluate");
    try {
      const evaluationResponse = await callAI<MissionEvaluation>("/api/ai/mission/evaluate", { mission: flow.mission, answer: flow.submission.text });
      onTrace(evaluationResponse, "严格依据用户文本与任务标准进行 AI 评价");
      const reportResponse = await callAI<TrialReport>("/api/ai/trial/report", {
        job,
        prediction: flow.prediction,
        reflection: flow.reflection,
        evaluation: evaluationResponse.data,
        submissionEvidence: flow.submission.text,
        attachmentMetadataOnly: flow.submission.attachments.map(({ name, type, size }) => ({ name, type, size })),
        instruction: "附件内容未解析，不得将文件名当作评价证据。",
      });
      onTrace(reportResponse, "综合分身预判、真实体验和任务表现生成试岗报告");
      const proposals = [
        `对${job.title}核心工作的兴趣得到真实任务验证`,
        `压力敏感度更新为 ${flow.reflection.pressure}/100`,
        ...reportResponse.data.strengths.slice(0, 1).map(item => `新增能力证据：${item}`),
        ...reportResponse.data.gaps.slice(0, 1).map(item => `待验证短板：${item}`),
      ];
      patch({
        evaluation: evaluationResponse.data,
        report: reportResponse.data,
        calibrationProposal: proposals,
        submission: { ...flow.submission, submittedAt: new Date().toISOString() },
      });
      toast("AI 评价与试岗报告已生成");
      go("review");
    } catch (error) {
      toast(error instanceof Error ? error.message : "AI 评价失败");
    } finally {
      setLoading(null);
    }
  };

  if (!job) return <Card className="grid min-h-[480px] place-items-center text-center"><div><BriefcaseBusiness className="mx-auto text-[#6257ed]" size={46} /><h1 className="mt-4 text-xl font-bold">请先选择一个试岗岗位</h1><p className="mt-2 text-xs text-[#7d849d]">标准岗位和真实 JD 定制岗位都会进入同一套验证流程。</p><Button className="mt-5" onClick={() => go("recommend")}>进入分身试岗</Button></div></Card>;

  return <div className="space-y-3 pb-6">
    <FlowHeader active={2} />
    <Card className="relative min-h-[200px] overflow-hidden bg-[linear-gradient(115deg,#fff_0%,#fcfcff_58%,#f1efff_100%)] p-6"><div className="relative z-10 max-w-[720px]"><div className="flex gap-2"><Tag>{flow.trialSource === "curated" ? "精品岗位" : "真实岗位定制"}</Tag><Tag tone="green">{job.title}</Tag></div><h1 className="mt-4 text-[28px] font-bold">现在，由你亲自验证分身的判断</h1><p className="mt-2 text-[11px] leading-6 text-[#747d96]">AI 不替你完成任务。你提交自己的分析与方案，系统再依据原文证据评价能力，并将体验结果返回分身。</p><Button className="mt-5" onClick={generate} disabled={loading !== null}>{loading === "generate" ? <LoaderCircle size={14} className="animate-spin" /> : <Sparkles size={14} />}{flow.mission ? "重新生成任务" : "AI 生成试岗任务"}</Button></div><div className="absolute bottom-[-50px] right-10 h-[235px] w-[235px]"><Image src="/assets/avatar-student-tablet.png" alt="数字分身试岗任务" fill className="object-contain" /></div></Card>
    {flow.mission ? <div className="grid grid-cols-[280px_minmax(0,1fr)_320px] gap-3">
      <Card><Title>岗位任务清单</Title><p className="mb-4 text-[9px] leading-5 text-[#7d849d]">{flow.mission.background}</p>{flow.mission.tasks.map((task, index) => <div key={task.title} className="mb-3 rounded-xl bg-[#fafaff] p-3"><Tag>任务 {index + 1}</Tag><b className="mt-2 block text-[10px]">{task.title}</b><p className="mt-2 text-[9px] text-[#727b94]">交付物：{task.deliverable}</p>{task.rubric.map(item => <p key={item} className="mt-1 flex gap-2 text-[8px]"><Check size={10} className="mt-0.5 text-emerald-500" />{item}</p>)}</div>)}</Card>
      <Card><Title>提交你的真实任务材料</Title><textarea value={flow.submission.text} onChange={event => patch({ submission: { ...flow.submission, text: event.target.value } })} className="min-h-[330px] w-full resize-none rounded-xl border border-[#e3e5ef] bg-[#fcfcff] p-4 text-xs leading-6 outline-none focus:border-[#8177ff]" placeholder="请按目标用户、问题判断、方案设计、关键流程、效果指标和风险进行结构化回答。AI 将引用你的原文作为评价证据。" /><div className="mt-3 flex items-center justify-between"><span className="text-[9px] text-[#8a91aa]">已输入 {flow.submission.text.length} 字，至少 80 字</span><input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,image/*" className="hidden" onChange={event => addFiles(event.target.files)} /><Button ghost onClick={() => fileRef.current?.click()}><Paperclip size={13} />添加证据附件</Button></div>{flow.submission.attachments.length > 0 && <div className="mt-3 space-y-2">{flow.submission.attachments.map(file => <div key={file.id} className="flex items-center gap-3 rounded-xl bg-[#fafaff] p-3"><File size={14} className="text-[#6257ed]" /><span className="min-w-0 flex-1"><b className="block truncate text-[9px]">{file.name}</b><small className="text-[8px] text-[#9298ac]">{(file.size / 1024).toFixed(1)} KB · 仅保存元数据，不解析内容</small></span><button onClick={() => patch({ submission: { ...flow.submission, attachments: flow.submission.attachments.filter(item => item.id !== file.id) } })} className="text-[#9298ac] hover:text-rose-500"><Trash2 size={13} /></button></div>)}</div>}</Card>
      <aside className="space-y-3"><Card><Title>分身预判</Title>{flow.prediction && <div className="grid grid-cols-2 gap-2"><Metric label="兴趣" value={flow.prediction.interest} /><Metric label="压力" value={flow.prediction.pressure} tone="orange" /><Metric label="成就感" value={flow.prediction.achievement} tone="green" /><Metric label="能力适配" value={flow.prediction.fit} /></div>}</Card><Card><Title>完成后的真实感受</Title>{([["interest", "喜欢程度"], ["pressure", "压力程度"], ["achievement", "成就感"], ["continueIntent", "继续意愿"]] as const).map(([key, label]) => <label key={key} className="mb-4 block text-[9px]"><span className="flex justify-between"><b>{label}</b><b className="text-[#6257ed]">{flow.reflection[key]}</b></span><input type="range" min="0" max="100" value={flow.reflection[key]} onChange={event => patch({ reflection: { ...flow.reflection, [key]: Number(event.target.value) } })} className="mt-2 w-full accent-[#6257ed]" /></label>)}<textarea value={flow.reflection.note} onChange={event => patch({ reflection: { ...flow.reflection, note: event.target.value } })} className="min-h-20 w-full rounded-xl border border-[#e3e5ef] p-3 text-[9px]" placeholder="哪一刻最投入？哪一刻最想放弃？" /></Card><Button className="w-full" onClick={evaluate} disabled={loading !== null}>{loading === "evaluate" ? <LoaderCircle size={14} className="animate-spin" /> : <Bot size={14} />}提交 AI 评价并生成报告</Button></aside>
    </div> : <Card className="grid min-h-[320px] place-items-center text-center"><div><Sparkles className="mx-auto text-[#6257ed]" size={44} /><h2 className="mt-4 text-lg font-bold">等待生成专属试岗任务</h2><p className="mt-2 text-xs text-[#7d849d]">任务会结合当前岗位、完整 JD 和你的职业数字分身。</p></div></Card>}
  </div>;
}

export function V4TrialReportPage({ flow, patch, profile, avatar, updateProfile, updateAvatar, go, toast, onTrace }: { flow: V4FlowState; patch: FlowPatch; profile: UserProfileInput; avatar: AvatarProfile | null; updateProfile: (profile: UserProfileInput) => void; updateAvatar: (avatar: AvatarProfile) => void; go: (page: PageTarget) => void; toast: (message: string) => void; onTrace: TraceHandler }) {
  const [loading, setLoading] = useState(false);
  const report = flow.report;
  const calibrate = async () => {
    if (!report || !flow.selectedJob) return;
    if (flow.calibratedAt) return toast("本次试岗已经校准过分身");
    setLoading(true);
    const calibratedAt = new Date().toISOString();
    const note = `试岗校准：${flow.selectedJob.title}，兴趣 ${flow.reflection.interest}，压力 ${flow.reflection.pressure}，成就感 ${flow.reflection.achievement}，继续意愿 ${flow.reflection.continueIntent}。`;
    updateProfile({ ...profile, preferences: profile.preferences.includes(note) ? profile.preferences : `${profile.preferences}\n${note}` });
    updateAvatar({
      summary: avatar?.summary ?? "职业分身会随真实试岗持续校准。",
      traits: avatar?.traits ?? [],
      strengths: Array.from(new Set([...(avatar?.strengths ?? []), ...report.strengths])).slice(0, 8),
      risks: Array.from(new Set([...(avatar?.risks ?? []), ...report.gaps])).slice(0, 8),
      suggestions: Array.from(new Set([...(avatar?.suggestions ?? []), ...report.path])).slice(0, 8),
      recommendedRoles: avatar?.recommendedRoles ?? [],
    });
    patch({
      calibratedAt,
      history: [...flow.history, { id: `${Date.now()}`, jobTitle: flow.selectedJob.title, source: flow.trialSource, verdict: report.verdict, fit: report.fit, completedAt: flow.submission.submittedAt || calibratedAt, calibratedAt }],
    });
    try {
      const response = await callAI<LearningPlan>("/api/ai/learning/plan", { profile, avatar, job: flow.selectedJob, report, evaluation: flow.evaluation, reflection: flow.reflection });
      patch({ learningPlan: response.data, calibratedAt, history: [...flow.history, { id: `${Date.now()}`, jobTitle: flow.selectedJob.title, source: flow.trialSource, verdict: report.verdict, fit: report.fit, completedAt: flow.submission.submittedAt || calibratedAt, calibratedAt }] });
      onTrace(response, "将试岗短板转化为四周学习路线");
      toast("分身已校准，成长路线已生成");
    } catch {
      toast("分身已校准，学习路线可稍后重新生成");
    } finally {
      setLoading(false);
    }
  };

  if (!report || !flow.selectedJob) return <Card className="grid min-h-[480px] place-items-center text-center"><div><FileSearch className="mx-auto text-[#6257ed]" size={46} /><h1 className="mt-4 text-xl font-bold">还没有本次试岗报告</h1><p className="mt-2 text-xs text-[#7d849d]">完成真实任务材料并提交 AI 评价后，这里会生成主客观报告。</p><Button className="mt-5" onClick={() => go(flow.selectedJob ? "mission" : "recommend")}>继续完成试岗</Button></div></Card>;

  const prediction = flow.prediction ?? { interest: 0, pressure: 0, achievement: 0, fit: 0, evidence: [], uncertainties: [] };
  return <div className="space-y-3 pb-6">
    <FlowHeader active={3} />
    <Card className="bg-[linear-gradient(120deg,#6257ed,#4d42e8)] p-6 text-white"><div className="grid grid-cols-[1.25fr_1fr_1fr] gap-5"><div><Tag tone="green">试岗报告 · {flow.selectedJob.title}</Tag><h1 className="mt-4 text-[28px] font-bold">{report.verdict}</h1><p className="mt-3 text-[11px] leading-6 text-white/75">{report.objective}</p><div className="mt-4 flex gap-2"><Tag tone="blue">{flow.trialSource === "curated" ? "精品岗位" : "真实岗位定制"}</Tag>{flow.selectedJob.sourceUrl && <a href={flow.selectedJob.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[9px] text-white/80">查看岗位来源 <ExternalLink size={10} /></a>}</div></div><div className="rounded-xl bg-white/10 p-4"><b className="text-xs">真实主观体验</b>{[["喜欢", flow.reflection.interest], ["压力", flow.reflection.pressure], ["成就感", flow.reflection.achievement], ["继续意愿", flow.reflection.continueIntent]].map(([label, value]) => <div className="mt-3" key={label}><div className="mb-1 flex justify-between text-[9px]"><span>{label}</span><b>{value}</b></div><div className="h-1 rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${value}%` }} /></div></div>)}</div><div className="rounded-xl bg-white/10 p-4"><b className="text-xs">系统客观评价</b><div className="mt-4 text-center"><b className="text-5xl">{report.fit}</b><small className="ml-1">岗位适配</small></div><p className="mt-4 text-[9px] leading-5 text-white/70">任务得分 {flow.evaluation?.score ?? report.fit}。评价仅依据用户文本、任务标准与分身资料，附件内容未被解析。</p></div></div></Card>
    <div className="grid grid-cols-2 gap-3"><Card><Title>分身预判与真实体验偏差</Title>{[["喜欢程度", prediction.interest, flow.reflection.interest], ["压力程度", prediction.pressure, flow.reflection.pressure], ["成就感", prediction.achievement, flow.reflection.achievement], ["能力适配", prediction.fit, report.fit]].map(([label, expected, actual]) => <div key={label as string} className="mb-3 grid grid-cols-[90px_1fr_55px] items-center gap-3 rounded-xl bg-[#fafaff] p-3"><b className="text-[9px]">{label}</b><div><div className="flex justify-between text-[8px] text-[#8a91aa]"><span>预判 {expected}</span><span>结果 {actual}</span></div><div className="mt-2"><Progress value={actual as number} /></div></div><Tag tone={Math.abs((expected as number) - (actual as number)) <= 10 ? "green" : "orange"}>{Math.abs((expected as number) - (actual as number)) <= 10 ? "较准确" : `偏差 ${Math.abs((expected as number) - (actual as number))}`}</Tag></div>)}</Card><Card><Title>AI 客观任务评价</Title>{flow.evaluation?.dimensions.map(item => <div key={item.name} className="mb-3 rounded-xl bg-[#fafaff] p-3"><div className="flex justify-between text-[9px]"><b>{item.name}</b><b className="text-[#6257ed]">{item.score}</b></div><p className="mt-2 text-[8px] leading-5 text-[#737b96]">引用证据：{item.evidence}</p></div>)}</Card></div>
    <div className="grid grid-cols-3 gap-3"><Card><Title>已验证长板</Title>{report.strengths.map(item => <p key={item} className="mb-2 flex gap-2 rounded-xl bg-emerald-50/60 p-3 text-[9px]"><Check size={12} className="text-emerald-500" />{item}</p>)}</Card><Card><Title>当前核心短板</Title>{report.gaps.map(item => <p key={item} className="mb-2 flex gap-2 rounded-xl bg-orange-50/60 p-3 text-[9px]"><Target size={12} className="text-orange-500" />{item}</p>)}</Card><Card><Title>推荐切入路径</Title>{report.path.map(item => <p key={item} className="mb-2 flex gap-2 rounded-xl bg-[#fafaff] p-3 text-[9px]"><ChevronRight size={12} className="text-[#6257ed]" />{item}</p>)}</Card></div>
    <Card><Title>确认后再校准数字分身</Title><div className="grid grid-cols-[1fr_auto] items-center gap-5"><div><p className="text-[10px] leading-5 text-[#737b96]">报告不会自动改写你的分身。请先检查本次拟更新内容，确认后只校准一次，并生成针对短板的 4 周成长路线。</p><div className="mt-3 flex flex-wrap gap-2">{flow.calibrationProposal.map(item => <Tag key={item}>{item}</Tag>)}</div></div><div className="flex gap-2"><Button ghost onClick={() => go("recommend")}>尝试其他岗位</Button><Button onClick={calibrate} disabled={loading || Boolean(flow.calibratedAt)}>{loading ? <LoaderCircle size={14} className="animate-spin" /> : flow.calibratedAt ? <Check size={14} /> : <RefreshCw size={14} />}{flow.calibratedAt ? "已完成分身校准" : "确认并校准分身"}</Button>{flow.learningPlan && <Button onClick={() => go("learning")}>进入成长路线 <ArrowRight size={14} /></Button>}</div></div></Card>
  </div>;
}

export function V4LearningPage({ flow, patch, go }: { flow: V4FlowState; patch: FlowPatch; go: (page: PageTarget) => void }) {
  const [view, setView] = useState<"route" | "knowledge">(flow.learningPlan ? "route" : "knowledge");
  const [category, setCategory] = useState("全部课程");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("career-copy-ai-v4-learning-center") || "[]");
      if (Array.isArray(saved)) queueMicrotask(() => setCompletedCourses(saved));
    } catch {
      localStorage.removeItem("career-copy-ai-v4-learning-center");
    }
  }, []);
  const toggleCourse = (id: string) => {
    setCompletedCourses(current => {
      const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
      localStorage.setItem("career-copy-ai-v4-learning-center", JSON.stringify(next));
      return next;
    });
  };
  const plan = flow.learningPlan;
  const categories = ["全部课程", "产品经理成长实操", "用户研究", "运营思维成长", "高敏商业分析"];
  const filteredCourses = knowledgeCourses.filter(course => (category === "全部课程" || course.category === category) && `${course.title}${course.description}${course.abilities.join("")}`.toLowerCase().includes(query.toLowerCase()));
  const toggle = (week: number) => {
    if (!plan) return;
    patch({ learningPlan: { ...plan, weeks: plan.weeks.map(item => item.week === week ? { ...item, completed: !item.completed } : item) } });
  };
  const completed = plan?.weeks.filter(item => item.completed).length ?? 0;
  return <div className="space-y-3 pb-6">
    <div className="flex items-end justify-between"><div><div className="flex items-center gap-2 text-[#6257ed]"><BookOpen size={22} /><b className="text-sm">职前学习知识中心</b></div><h1 className="mt-2 text-[28px] font-bold">把试岗短板变成可完成的学习行动</h1><p className="mt-1 text-[10px] text-[#7d849d]">既可以按照本次试岗报告学习，也可以从精选知识库补齐岗位通用能力。</p></div><div className="flex rounded-xl border border-[#e4e5ef] bg-white p-1"><button onClick={() => setView("route")} className={cx("h-9 rounded-lg px-4 text-[10px] font-semibold", view === "route" ? "bg-[#6257ed] text-white" : "text-[#68718b]")}>我的试岗学习路线</button><button onClick={() => setView("knowledge")} className={cx("h-9 rounded-lg px-4 text-[10px] font-semibold", view === "knowledge" ? "bg-[#6257ed] text-white" : "text-[#68718b]")}>精选知识中心</button></div></div>
    {view === "route" ? plan ? <>
      <FlowHeader active={4} />
      <Card className="flex items-center justify-between bg-[linear-gradient(110deg,#fff,#f2f0ff)] p-6"><div><Tag tone="green">报告短板已转化为行动</Tag><h2 className="mt-4 text-[25px] font-bold">{plan.title}</h2><p className="mt-2 max-w-[760px] text-[11px] leading-6 text-[#747d96]">{plan.summary}</p></div><div className="w-[220px] rounded-2xl bg-white p-4 text-center shadow-[0_8px_24px_rgba(70,63,132,.08)]"><b className="text-4xl text-[#6257ed]">{completed}/4</b><small className="mt-2 block text-[9px] text-[#7d849d]">已完成周任务</small><div className="mt-3"><Progress value={completed * 25} tone="green" /></div></div></Card>
      <div className="grid grid-cols-4 gap-3">{plan.weeks.map(week => <Card key={week.week} className={cx(week.completed && "border-emerald-200 bg-emerald-50/30")}><div className="flex items-start justify-between"><Tag tone={week.completed ? "green" : "violet"}>第 {week.week} 周</Tag><b className="text-[10px] text-amber-500">+{week.exp} EXP</b></div><h2 className="mt-3 text-sm font-bold">{week.theme}</h2><p className="mt-2 min-h-10 text-[9px] leading-5 text-[#747d96]">{week.goal}</p><div className="mt-4 space-y-2"><div className="rounded-xl bg-white p-3"><small className="text-[8px] text-[#9298ac]">学习任务</small><b className="mt-1 block text-[9px]">{week.learningTask}</b></div><div className="rounded-xl bg-white p-3"><small className="text-[8px] text-[#9298ac]">实践任务</small><b className="mt-1 block text-[9px]">{week.practiceTask}</b></div><div className="rounded-xl bg-white p-3"><small className="text-[8px] text-[#9298ac]">完成标准</small><b className="mt-1 block text-[9px]">{week.successCriteria}</b></div></div><div className="mt-3 flex items-center justify-between"><Tag tone="blue">{week.ability}</Tag><button onClick={() => toggle(week.week)} className={cx("inline-flex h-9 items-center gap-2 rounded-xl px-3 text-[9px] font-semibold", week.completed ? "bg-emerald-500 text-white" : "border border-[#dedff0] text-[#6257ed]")}><Check size={12} />{week.completed ? "已完成" : "标记完成"}</button></div></Card>)}</div>
      <Card className="flex items-center justify-between"><div><b className="text-sm">用下一次试岗验证成长结果</b><p className="mt-1 text-[10px] text-[#7d849d]">完成学习任务后，选择相同岗位或新的岗位再次试岗，分身会比较能力变化。</p></div><Button onClick={() => go("recommend")}>推荐下一次验证副本 <ArrowRight size={14} /></Button></Card>
    </> : <Card className="grid min-h-[420px] place-items-center text-center"><div><LockKeyhole className="mx-auto text-[#6257ed]" size={46} /><h2 className="mt-4 text-xl font-bold">完成一次试岗，生成你的专属路线</h2><p className="mt-2 max-w-[480px] text-xs leading-6 text-[#7d849d]">在此之前，你仍然可以进入精选知识中心学习通用岗位能力。</p><div className="mt-5 flex justify-center gap-2"><Button onClick={() => go(flow.report ? "review" : "recommend")}>{flow.report ? "确认分身校准" : "开始一次分身试岗"}</Button><Button ghost onClick={() => setView("knowledge")}>先逛知识中心</Button></div></div></Card>
    : <>
      <Card className="p-0"><div className="flex items-center justify-between border-b border-[#e8e9f2] px-5 py-4"><div className="flex gap-5">{categories.map(item => <button key={item} onClick={() => setCategory(item)} className={cx("relative h-8 text-[11px] font-semibold", category === item ? "text-[#6257ed] after:absolute after:inset-x-0 after:bottom-[-17px] after:h-0.5 after:bg-[#6257ed]" : "text-[#69728c]")}>{item}</button>)}</div><label className="flex h-9 w-[250px] items-center gap-2 rounded-xl border border-[#e2e4ee] bg-[#fafaff] px-3"><Search size={13} className="text-[#8f96ab]" /><input value={query} onChange={event => setQuery(event.target.value)} className="w-full bg-transparent text-[9px] outline-none" placeholder="搜索课程或能力关键词" /></label></div><div className="flex items-center justify-between px-5 py-3"><span className="text-[9px] text-[#8a91aa]">共 {filteredCourses.length} 节精选课程，已完成 {completedCourses.length} 节</span><span className="text-[9px] text-[#8a91aa]">课程摘要由公开权威资料整理，原文链接保留在每节课程中</span></div></Card>
      {filteredCourses.map(course => {
        const done = completedCourses.includes(course.id);
        const open = expanded === course.id;
        return <Card key={course.id} className={cx("p-6", done && "border-emerald-200")}><div className="flex items-start justify-between gap-6"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><Tag>{course.category}</Tag><span className="inline-flex items-center gap-1 text-[10px] text-[#8a91aa]"><Clock3 size={12} />{course.duration} 分钟</span>{done && <Tag tone="green">已完成</Tag>}</div><h2 className="mt-3 text-[16px] font-bold">{course.title}</h2><p className="mt-2 text-[10px] leading-5 text-[#69728c]">{course.description}</p></div><Button onClick={() => setExpanded(open ? null : course.id)}><Play size={13} />{open ? "收起课程" : "立即开始学习"}</Button></div><div className="mt-4 rounded-xl bg-[#f8f9fc] p-4"><b className="text-[12px] text-[#91a0bd]">精萃正文核心大纲：</b>{course.outline.map((item, index) => <p key={item} className="mt-2 text-[10px] leading-5 text-[#4f5c78]">{index + 1}. {item}</p>)}</div>{open && <div className="mt-4 grid grid-cols-[1fr_320px] gap-3"><div className="rounded-xl border border-[#e7e8f1] p-4"><b className="text-[11px]">本节实战任务</b><p className="mt-2 text-[10px] leading-5 text-[#69728c]">{course.practice}</p><div className="mt-3 flex flex-wrap gap-2">{course.abilities.map(item => <Tag tone="blue" key={item}>{item}</Tag>)}</div></div><div className="rounded-xl border border-[#e7e8f1] p-4"><b className="text-[11px]">参考资料</b><p className="mt-2 text-[9px] leading-5 text-[#7d849d]">{course.sourceName}</p><div className="mt-3 flex gap-2"><a href={course.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#dedff0] px-3 text-[9px] font-semibold text-[#6257ed]">查看原始资料 <ExternalLink size={11} /></a><button onClick={() => toggleCourse(course.id)} className={cx("inline-flex h-9 items-center gap-2 rounded-xl px-3 text-[9px] font-semibold", done ? "bg-emerald-500 text-white" : "bg-[#6257ed] text-white")}><Check size={11} />{done ? "取消完成" : "完成本节"}</button></div></div></div>}</Card>;
      })}
      {filteredCourses.length === 0 && <Card className="grid min-h-[280px] place-items-center text-center"><div><Search className="mx-auto text-[#6257ed]" size={38} /><h2 className="mt-3 font-bold">没有找到对应课程</h2><p className="mt-2 text-[10px] text-[#8a91aa]">换一个能力关键词，或切换到全部课程。</p></div></Card>}
    </>}
  </div>;
}

function jobToTrial(job: JobResult): TrialJob {
  return {
    id: `searched-${job.company}-${job.title}`,
    title: job.title,
    company: job.company,
    city: job.city,
    salary: job.salary,
    description: job.summary,
    image: "job-product-manager.png",
    keywords: job.keywords,
    sourceName: job.source,
    sourceUrl: job.url,
    jdText: job.summary,
  };
}

function jobPrediction(job: JobResult): JobPrediction {
  return {
    interest: Math.min(96, job.match + 3),
    pressure: Math.max(45, 90 - Math.round(job.match / 3)),
    achievement: Math.min(94, job.match + 1),
    fit: job.match,
    evidence: job.evidence,
    uncertainties: job.gaps,
  };
}

export function V4JDWorkspace({ flow, patch, profile, avatar, go, toast, onTrace }: { flow: V4FlowState; patch: FlowPatch; profile: UserProfileInput; avatar: AvatarProfile | null; go: (page: PageTarget) => void; toast: (message: string) => void; onTrace: TraceHandler }) {
  const source = flow.selectedSearchJob;
  const initialJob = flow.selectedJob ?? (source ? jobToTrial(source) : null);
  const [title, setTitle] = useState(initialJob?.title ?? profile.targetRole);
  const [company, setCompany] = useState(initialJob?.company ?? "待补充");
  const [jd, setJd] = useState(initialJob?.jdText ?? "");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!source) return;
    queueMicrotask(() => {
      setTitle(source.title);
      setCompany(source.company);
      setJd(current => current || source.summary);
    });
  }, [source]);
  const generate = async () => {
    if (jd.trim().length < 80) return toast("请确认或补充至少 80 字的完整 JD");
    setLoading(true);
    const job: TrialJob = initialJob ? { ...initialJob, title, company, jdText: jd } : { id: `manual-${Date.now()}`, title, company, city: profile.city, salary: "待确认", description: jd.slice(0, 120), image: "job-product-manager.png", keywords: [], sourceName: "用户手动输入", sourceUrl: "", jdText: jd };
    try {
      const response = await callAI<MissionPlan>("/api/ai/mission/generate", { profile, avatar, targetRole: title, jd });
      patch({
        trialSource: source ? "searched_job" : "manual_jd",
        selectedJob: job,
        prediction: source ? jobPrediction(source) : { interest: 80, pressure: 65, achievement: 82, fit: 75, evidence: ["基于当前职业分身与用户确认的完整 JD"], uncertainties: ["真实岗位节奏需要通过任务继续验证"] },
        mission: response.data,
        submission: { text: "", attachments: [], submittedAt: "" },
        evaluation: null,
        report: null,
        calibrationProposal: [],
        calibratedAt: "",
        learningPlan: null,
      });
      onTrace(response, "根据用户确认的完整 JD 生成定制试岗任务");
      toast("定制试岗已生成");
      go("mission");
    } catch (error) {
      toast(error instanceof Error ? error.message : "定制试岗生成失败");
    } finally {
      setLoading(false);
    }
  };
  return <div className="space-y-3 pb-6"><Card className="relative min-h-[190px] overflow-hidden bg-[linear-gradient(115deg,#fff_0%,#fcfcff_58%,#f1efff_100%)] p-6"><Tag>高阶定制路径</Tag><h1 className="mt-4 text-[28px] font-bold">确认真实 JD，再生成专属试岗</h1><p className="mt-2 max-w-[680px] text-[11px] leading-6 text-[#747d96]">公开搜索结果可能只有摘要。请补充岗位职责、硬性要求和加分项，AI 才会将真实岗位要求转化为可验证任务。</p></Card><div className="grid grid-cols-[minmax(0,1fr)_360px] gap-3"><Card><Title action={<Button ghost onClick={() => go("radar")}><FileSearch size={13} />重新搜索岗位</Button>}>岗位与 JD 信息</Title><div className="grid grid-cols-2 gap-3"><label className="text-[9px]">岗位名称<input value={title} onChange={event => setTitle(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-[#e3e5ef] px-3 text-xs outline-none focus:border-[#8177ff]" /></label><label className="text-[9px]">公司名称<input value={company} onChange={event => setCompany(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-[#e3e5ef] px-3 text-xs outline-none focus:border-[#8177ff]" /></label></div>{source && <div className="mt-3 rounded-xl bg-[#fafaff] p-3"><div className="flex items-center justify-between"><span><Tag tone="green">来自 AI 岗位搜索</Tag><b className="ml-2 text-[10px]">{source.city} · {source.salary}</b></span>{source.url && <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[9px] text-[#6257ed]">打开原始来源 <ExternalLink size={11} /></a>}</div><p className="mt-2 text-[9px] leading-5 text-[#747d96]">{source.summary}</p></div>}<label className="mt-4 block text-[9px]">完整岗位 JD<textarea value={jd} onChange={event => setJd(event.target.value)} className="mt-1 min-h-[300px] w-full resize-none rounded-xl border border-[#e3e5ef] bg-[#fcfcff] p-4 text-xs leading-6 outline-none focus:border-[#8177ff]" placeholder="粘贴完整岗位职责、任职要求、加分项和工作场景。搜索摘要已自动带入，但仍需你确认和补充。" /></label><div className="mt-3 flex items-center justify-between"><span className="text-[9px] text-[#8a91aa]">当前 {jd.length} 字。完整 JD 建议 150 字以上。</span><Button onClick={generate} disabled={loading}>{loading ? <LoaderCircle size={14} className="animate-spin" /> : <Sparkles size={14} />}生成定制试岗</Button></div></Card><aside className="space-y-3"><Card><Title>AI 已识别的试岗重点</Title>{(source?.keywords ?? ["岗位职责", "硬性要求", "协作场景", "结果标准"]).map(item => <p key={item} className="mb-2 flex gap-2 rounded-xl bg-[#fafaff] p-3 text-[9px]"><Check size={11} className="text-emerald-500" />{item}</p>)}</Card><Card><Title>当前能力缺口</Title>{(source?.gaps ?? avatar?.risks ?? ["等待完整 JD 后分析"]).slice(0, 5).map(item => <p key={item} className="mb-2 flex gap-2 text-[9px] leading-5"><Target size={12} className="mt-0.5 text-orange-500" />{item}</p>)}</Card><Card className="bg-[#fafaff]"><Title>后续共用同一闭环</Title>{["亲自提交任务材料", "AI 引用原文评价", "生成主客观试岗报告", "确认校准分身", "形成 4 周成长路线"].map((item, index) => <div key={item} className="mb-2 flex items-center gap-3 text-[9px]"><span className="grid size-5 place-items-center rounded-full bg-[#6257ed] text-[8px] text-white">{index + 1}</span>{item}</div>)}</Card></aside></div></div>;
}

export { jobPrediction, jobToTrial };
