"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, BadgeCheck, BarChart3, Bell, BookOpen, Bot, BriefcaseBusiness, Check, ChevronRight,
  CircleUserRound, ClipboardCheck, Clock3, FileSearch, FileText, FolderKanban, Home,
  ExternalLink, Flame, LoaderCircle, MessageCircle, Radar, Search, Send, Settings, Sparkles,
  Star, Target, Trophy, UploadCloud, WandSparkles, X, Zap,
} from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  Area, AreaChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar as RadarShape,
  RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  AvatarPage as V2AvatarPage, Dashboard as V2Dashboard, Interview as V2Interview,
  Learning as V2Learning, Mission as V2Mission, Portfolio as V2Portfolio,
  Recommend as V2Recommend, Resume as V2Resume, Review as V2Review,
  SettingsPage as V2SettingsPage, SkillPage as V2SkillPage, type V2PageId,
} from "@/components/v2/app";
import { V4Dashboard } from "@/components/v4/dashboard";
import { V4AvatarPage, V4Onboarding } from "@/components/v4/avatar";
import { defaultFlowState } from "@/components/v4/data";
import {
  jobPrediction,
  jobToTrial,
  V4JDWorkspace,
  V4LearningPage,
  V4TrialPlaza,
  V4TrialReportPage,
  V4TrialTask,
} from "@/components/v4/flow";
import { V4ResumeCenter } from "@/components/v4/resume-center";
import type { V4FlowState } from "@/components/v4/types";
import type { AIResponse, AvatarProfile, JobResult, MissionEvaluation, MissionPlan, UserProfileInput } from "@/lib/ai/types";

type PageId = "home" | "jd" | "radar" | "applications" | "customMission" | "customResume" | V2PageId;
type Job = { title: string; company: string; match: number; city: string; salary: string; tags: string[]; image: string; fresh: string };
type AITrace = Pick<AIResponse<unknown>, "mode" | "traceId" | "promptVersion" | "model" | "generatedAt" | "evidence" | "error"> & { action: string };
const cx = (...v: Array<string | false | undefined>) => v.filter(Boolean).join(" ");
const defaultProfile: UserProfileInput = { name: "林同学", targetRole: "产品经理", city: "上海", strengths: "逻辑分析、用户洞察、持续学习", preferences: "希望参与有挑战的 AI 产品项目，偏好团队协作和数据驱动决策", resume: "参与校园二手交易平台产品设计，完成用户调研、需求分析和方案设计。" };
async function callAI<T>(url:string,input:unknown):Promise<AIResponse<T>> { const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input)}); if(!response.ok) throw new Error(`请求失败：${response.status}`); return response.json(); }
function mergeFlowState(value:Partial<V4FlowState>|undefined):V4FlowState {
  return {
    ...defaultFlowState,
    ...value,
    submission:{...defaultFlowState.submission,...value?.submission,attachments:Array.isArray(value?.submission?.attachments)?value.submission.attachments:[]},
    reflection:{...defaultFlowState.reflection,...value?.reflection},
    calibrationProposal:Array.isArray(value?.calibrationProposal)?value.calibrationProposal:[],
    history:Array.isArray(value?.history)?value.history:[],
    learningPlan:value?.learningPlan??null,
  };
}

const jobs: Job[] = [
  { title: "产品经理（AI 应用）", company: "星河智能", match: 94, city: "上海", salary: "18-25K", tags: ["AI 产品", "用户研究", "PRD"], image: "job-product-manager.png", fresh: "刚刚更新" },
  { title: "产品经理校招", company: "云杉科技", match: 91, city: "杭州", salary: "16-22K", tags: ["B 端产品", "数据分析", "项目管理"], image: "job-data-analyst.png", fresh: "2 小时前" },
  { title: "用户增长产品助理", company: "跃动互娱", match: 88, city: "上海", salary: "15-20K", tags: ["增长实验", "用户洞察", "A/B 测试"], image: "job-content-operations.png", fresh: "今日发布" },
  { title: "产品策划管培生", company: "未来生活", match: 85, city: "北京", salary: "14-20K", tags: ["产品策划", "商业分析", "沟通协作"], image: "job-market-specialist.png", fresh: "1 天前" },
];

const radarData = [
  { name: "用户洞察", mine: 88, target: 92 }, { name: "方案设计", mine: 86, target: 90 },
  { name: "数据分析", mine: 72, target: 86 }, { name: "项目推进", mine: 81, target: 84 },
  { name: "AI 应用", mine: 68, target: 88 },
];

const trend = [
  { d: "周一", v: 12 }, { d: "周二", v: 26 }, { d: "周三", v: 38 },
  { d: "周四", v: 51 }, { d: "周五", v: 68 }, { d: "今天", v: 82 },
];

function Button({ children, onClick, ghost, className = "", disabled }: { children: ReactNode; onClick?: () => void; ghost?: boolean; className?: string; disabled?: boolean }) {
  return <motion.button disabled={disabled} whileTap={{ scale: .97 }} whileHover={disabled ? undefined : { y: -1 }} onClick={onClick} className={cx("inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-45", ghost ? "border border-[#dfe1f2] bg-white text-[#5a50e8] hover:bg-[#f5f3ff]" : "bg-gradient-to-r from-[#675cf5] to-[#4d42e8] text-white shadow-[0_8px_20px_rgba(94,80,235,.25)]", className)}>{children}</motion.button>;
}
function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <motion.section whileHover={onClick ? { y: -2 } : undefined} onClick={onClick} className={cx("rounded-2xl border border-[#e8e9f4] bg-white p-4 shadow-[0_8px_25px_rgba(63,57,122,.055)]", onClick && "cursor-pointer", className)}>{children}</motion.section>;
}
function Title({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between"><h3 className="border-l-[3px] border-[#655af3] pl-2 text-sm font-bold">{children}</h3>{action}</div>;
}
function Pill({ children, green, orange }: { children: ReactNode; green?: boolean; orange?: boolean }) {
  return <span className={cx("inline-flex rounded-lg px-2 py-1 text-[10px] font-medium", green ? "bg-emerald-50 text-emerald-600" : orange ? "bg-orange-50 text-orange-500" : "bg-[#f0eeff] text-[#6257ed]")}>{children}</span>;
}
function Progress({ value, green }: { value: number; green?: boolean }) {
  return <div className="h-1.5 overflow-hidden rounded-full bg-[#eceef5]"><motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={cx("h-full rounded-full", green ? "bg-emerald-500" : "bg-gradient-to-r from-[#675cf5] to-[#8d83ff]")} /></div>;
}
function useMounted() { return useSyncExternalStore(() => () => {}, () => true, () => false); }
function RadarGraph() {
  const mounted = useMounted();
  return <div className="h-52 min-w-0">{mounted && <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}><RadarChart data={radarData}><PolarGrid stroke="#e7e8f4" /><PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: "#6e7590" }} /><RadarShape dataKey="target" stroke="#c4c6d8" fill="#c4c6d8" fillOpacity={.12} /><RadarShape dataKey="mine" stroke="#655af3" fill="#655af3" fillOpacity={.3} /></RadarChart></ResponsiveContainer>}</div>;
}
function TrendGraph() {
  const mounted = useMounted();
  return <div className="h-36 min-w-0">{mounted && <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}><AreaChart data={trend}><defs><linearGradient id="v3trend" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#655af3" stopOpacity=".25" /><stop offset="1" stopColor="#655af3" stopOpacity="0" /></linearGradient></defs><CartesianGrid vertical={false} stroke="#f0f1f7" /><XAxis dataKey="d" axisLine={false} tick={{ fontSize: 8 }} /><YAxis hide /><Tooltip /><Area dataKey="v" stroke="#655af3" strokeWidth={2} fill="url(#v3trend)" /></AreaChart></ResponsiveContainer>}</div>;
}

const nav = [
  ["dashboard", "首页", Home], ["avatar", "我的分身", CircleUserRound],
  ["recommend", "推荐试岗", BriefcaseBusiness], ["radar", "岗位雷达", Radar],
  ["skill", "能力成长", BarChart3], ["mission", "副本挑战", Star],
  ["jd", "JD 定制工作台", FileSearch], ["customMission", "JD 定制副本", Sparkles],
  ["review", "成长复盘", ClipboardCheck], ["portfolio", "作品集", FolderKanban],
  ["learning", "学习中心", BookOpen], ["resume", "简历中心", FileText],
  ["customResume", "岗位版简历", FileSearch], ["applications", "智能投递中心", Send],
  ["interview", "面试训练", MessageCircle], ["settings", "设置", Settings],
] as const;

const v4NavGroups = [
  { label: "核心试岗", items: [["avatar", "职业数字分身", CircleUserRound], ["recommend", "分身试岗", BriefcaseBusiness], ["mission", "亲自验证", Star], ["review", "试岗报告", ClipboardCheck]] },
  { label: "成长沉淀", items: [["skill", "成长路线", BarChart3], ["portfolio", "成长记录与作品集", FolderKanban], ["learning", "学习中心", BookOpen]] },
  { label: "高阶定制", items: [["radar", "AI 岗位搜索", Radar], ["jd", "JD 定制工作台", FileSearch], ["resume", "简历中心", FileText], ["applications", "投递中心", Send], ["interview", "面试训练", MessageCircle]] },
] as const;

function Sidebar({ page, go, grouped = false }: { page: PageId; go: (p: PageId) => void; grouped?: boolean }) {
  return <aside className="fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col border-r border-[#e9eaf4] bg-white px-4 py-5">
    <button onClick={() => go("dashboard")} className="mb-5 flex items-center gap-3 px-1 text-left"><span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#7a70ff] to-[#4d42e8] text-white shadow-lg shadow-violet-200"><Sparkles size={19} /></span><span><b className="block text-[17px]">职前副本 AI</b><small className="text-[9px] text-[#8a91aa]">先试岗，再成长，拿证据证明自己</small></span></button>
    <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
      {grouped ? <>
        <button onClick={() => go("dashboard")} className={cx("mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[11px] transition", page === "dashboard" ? "bg-gradient-to-r from-[#efedff] to-[#faf9ff] font-semibold text-[#594ee8]" : "text-[#56617c] hover:bg-[#f7f7fc]")}><Home size={15} />首页</button>
        {v4NavGroups.map(group => <div key={group.label} className="pt-2"><p className="px-3 pb-1 text-[8px] font-semibold text-[#a0a6ba]">{group.label}</p>{group.items.map(([id, label, Icon]) => <button key={id} onClick={() => go(id)} className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[10px] transition", page === id ? "bg-gradient-to-r from-[#efedff] to-[#faf9ff] font-semibold text-[#594ee8]" : "text-[#56617c] hover:bg-[#f7f7fc]")}><Icon size={14} />{label}{id === "radar" && <span className="ml-auto rounded-full bg-[#655af3] px-1.5 py-0.5 text-[8px] text-white">AI</span>}</button>)}</div>)}
        <button onClick={() => go("settings")} className={cx("mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[10px] transition", page === "settings" ? "bg-gradient-to-r from-[#efedff] to-[#faf9ff] font-semibold text-[#594ee8]" : "text-[#56617c] hover:bg-[#f7f7fc]")}><Settings size={14} />设置</button>
      </> : nav.map(([id, label, Icon]) => <button key={id} onClick={() => go(id)} className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[11px] transition", page === id ? "bg-gradient-to-r from-[#efedff] to-[#faf9ff] font-semibold text-[#594ee8]" : "text-[#56617c] hover:bg-[#f7f7fc]")}><Icon size={15} />{label}{id === "radar" && <span className="ml-auto rounded-full bg-[#655af3] px-1.5 py-0.5 text-[8px] text-white">12</span>}</button>)}
    </nav>
    <div className="mt-auto space-y-3"><Card className="p-3"><div className="flex items-center gap-2"><div className="relative size-10 overflow-hidden rounded-full bg-[#ebe9ff]"><Image src="/assets/avatar-student-profile.png" alt="林同学" fill className="object-cover" /></div><div><b className="block text-xs">林同学</b><small className="text-[9px] text-[#8a91aa]">Lv.4 成长探索者</small></div></div><div className="mt-3 flex justify-between text-[9px] text-[#8a91aa]"><span>经验值 1280 / 2000</span><span>64%</span></div><div className="mt-1"><Progress value={64} /></div></Card><Card className="p-3"><div className="flex justify-around text-amber-500"><Trophy size={22} /><BadgeCheck size={22} /><Star size={22} /></div><p className="mt-2 text-[10px] text-[#737b98]">已解锁 7 枚成长徽章</p></Card></div>
  </aside>;
}
function Topbar({ go }: { go: (p: PageId) => void }) {
  const mounted = useMounted();
  const dateText = mounted
    ? `今天是 ${new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(new Date())}`
    : "今天";
  return <header className="fixed left-[240px] right-0 top-0 z-20 flex h-[66px] items-center justify-between border-b border-[#e9eaf4] bg-white/95 px-6 backdrop-blur"><span className="text-xs text-[#69718d]">{dateText}</span><div className="flex items-center gap-5"><span className="text-[10px] text-[#7d849c]">今日成长值<strong className="block text-sm text-[#171a2d]">120</strong></span><span className="text-[10px] text-[#7d849c]">成长记录<strong className="block text-sm text-[#171a2d]">8</strong></span><Button ghost onClick={() => go("jd")}><FileSearch size={14} />JD 定制</Button><Button onClick={() => go("radar")}><Radar size={14} />岗位雷达</Button><button className="grid size-9 place-items-center rounded-xl border border-[#e3e5f1] text-[#6257ed]"><Bell size={16} /></button></div></header>;
}

function HomePage({ go }: { go: (p: PageId) => void }) {
  return <div className="space-y-3">
    <div className="grid grid-cols-[1fr_300px] gap-3"><Card className="relative min-h-[250px] overflow-hidden bg-[radial-gradient(circle_at_80%_40%,#e7e4ff,transparent_35%)]"><Pill>投递前，先试玩未来工作</Pill><h1 className="mt-4 max-w-[650px] text-[30px] font-bold tracking-tight">让职业数字分身，先替你试岗一天</h1><p className="mt-2 max-w-[610px] text-xs leading-6 text-[#737b96]">分身根据你的经历、兴趣、压力耐受和工作偏好预演真实岗位；你再通过关键任务亲自验证，判断自己是否喜欢、是否适配。</p><div className="mt-6 flex gap-3"><Button onClick={() => go("recommend")}><BriefcaseBusiness size={14} />开始一次试岗</Button><Button ghost onClick={() => go("avatar")}><CircleUserRound size={14} />完善我的分身</Button></div><div className="absolute bottom-[-35px] right-6 h-[260px] w-[280px]"><Image src="/assets/avatar-student-tablet.png" alt="职业数字分身" fill className="object-contain" /></div></Card><Card><Title>最近试岗结论</Title><Pill green>喜欢，但暂未完全适配</Pill><b className="mt-4 block text-lg">AI 产品经理</b><p className="mt-2 text-[10px] leading-5 text-[#737b96]">兴趣与成就感较高；数据分析和项目推进是当前主要短板。</p><div className="mt-4 grid grid-cols-2 gap-2">{[["兴趣度","92"],["适配度","82"],["压力感","68"],["成就感","90"]].map(x=><div className="rounded-xl bg-[#fafaff] p-3" key={x[0]}><small className="text-[9px] text-[#8b91aa]">{x[0]}</small><b className="block text-xl">{x[1]}</b></div>)}</div><Button ghost className="mt-3 w-full" onClick={()=>go("review")}>查看试岗报告</Button></Card></div>
    <Card><Title>一次试岗，回答两个关键问题</Title><div className="grid grid-cols-5 gap-2">{[["01","训练职业分身","让 AI 理解真实的你"],["02","分身预演岗位","先经历岗位的一天"],["03","亲自完成验证","用真实任务校准判断"],["04","获得试岗报告","同时看主观感受与客观适配"],["05","进入成长路线","把短板变成成长任务"]].map(x=><button onClick={()=>go(x[0]==="01"?"avatar":x[0]==="02"?"recommend":x[0]==="03"?"mission":x[0]==="04"?"review":"skill")} className="rounded-xl bg-[#fafaff] p-4 text-left" key={x[0]}><Pill>{x[0]}</Pill><b className="mt-3 block text-xs">{x[1]}</b><p className="mt-1 text-[9px] leading-5 text-[#8b91aa]">{x[2]}</p></button>)}</div></Card>
    <div className="grid grid-cols-[1.25fr_1fr_1fr] gap-3"><Card><Title action={<button onClick={() => go("recommend")} className="text-[10px] text-[#6257ed]">继续探索</button>}>分身正在预演</Title>{[["上午 09:30","理解用户需求并制定计划","兴趣高 · 压力中"],["中午 13:40","面对需求变化并协调协作","兴趣中 · 压力高"],["下午 17:20","汇报方案、复盘结果指标","兴趣高 · 成就感高"]].map(x=><div key={x[0]} className="mb-2 grid grid-cols-[80px_1fr_auto] items-center gap-2 rounded-xl bg-[#fafaff] p-3"><Pill>{x[0]}</Pill><b className="text-[10px]">{x[1]}</b><span className="text-[9px] text-[#6257ed]">{x[2]}</span></div>)}</Card><Card><Title>正在亲自验证</Title><div className="rounded-xl bg-gradient-to-br from-[#f3f1ff] to-[#fbfaff] p-4"><Pill>AI 产品经理试岗 · 第 2/3 关</Pill><b className="mt-3 block text-sm">设计 AI 求职助手方案</b><p className="mt-1 text-[9px] leading-5 text-[#7c849e]">验证用户洞察、方案设计和数据意识，也记录你的真实感受。</p><div className="my-3"><Progress value={62}/></div><Button className="w-full" onClick={()=>go("mission")}>继续亲自验证</Button></div></Card><Card><Title>目标岗位成长路线</Title><div className="text-center"><b className="text-5xl text-[#6257ed]">72</b><span className="text-xs text-emerald-500"> 当前能力</span></div><RadarGraph/><Button ghost className="w-full" onClick={()=>go("skill")}>进入成长路线</Button></Card></div>
    <Card><Title action={<button onClick={()=>go("recommend")} className="text-[10px] text-[#6257ed]">进入试岗广场</button>}>选择岗位，让分身先替你试一天</Title><div className="grid grid-cols-4 gap-3">{jobs.map(j=><JobMini key={j.title} job={j} onClick={()=>go("recommend")}/>)}</div></Card>
  </div>;
}

function JobMini({ job, onClick }: { job: Job; onClick?: () => void }) {
  return <motion.button whileHover={{ y: -2 }} onClick={onClick} className="overflow-hidden rounded-xl border border-[#e8e9f3] bg-white text-left"><div className="relative h-20"><Image src={`/assets/${job.image}`} alt={job.title} fill className="object-cover"/><Pill green><span className="absolute left-2 top-2">预计兴趣 {job.match}%</span></Pill></div><div className="p-3"><b className="block text-[11px]">{job.title}</b><small className="text-[9px] text-[#8b91aa]">{job.company} · 预计压力中等 · 成就感高</small><div className="mt-2 flex gap-1">{job.tags.slice(0,2).map(t=><Pill key={t}>{t}</Pill>)}</div></div></motion.button>;
}

function JDWorkspace({ go, toast }: { go: (p: PageId) => void; toast: (s: string) => void }) {
  const [jd,setJd]=useState("负责 AI 求职产品的需求分析与方案设计，基于用户反馈和数据推动功能迭代；能独立输出 PRD，协调设计与研发推进项目落地。要求具备用户研究、数据分析、AI 产品理解与优秀沟通能力。");
  const [analyzed,setAnalyzed]=useState(true); const [tab,setTab]=useState<"mission"|"resume">("mission"); const [generated,setGenerated]=useState(false);
  const analyze=()=>{setAnalyzed(false); setTimeout(()=>{setAnalyzed(true);toast("JD 解析完成，已更新匹配建议")},650)};
  return <div className="space-y-3"><div className="flex items-end justify-between"><div><Pill>JD 定制工作台</Pill><h1 className="mt-2 text-[27px] font-bold">从一份真实 JD，生成你的专属求职方案</h1><p className="mt-1 text-xs text-[#7e859e]">分析岗位需求，自动组合最有说服力的副本、简历与面试准备。</p></div><Button onClick={analyze}><WandSparkles size={14}/>重新分析</Button></div>
    <div className="grid grid-cols-[1fr_360px] gap-3"><Card><Title action={<div className="flex gap-2"><Button ghost onClick={()=>toast("招聘链接已识别")}>粘贴招聘链接</Button><Button ghost onClick={()=>toast("JD 文件上传成功")}><UploadCloud size={13}/>上传文件</Button></div>}>导入岗位 JD</Title><div className="mb-3 grid grid-cols-3 gap-2"><div className="rounded-xl bg-[#fafaff] p-3"><small className="text-[9px] text-[#8b91aa]">目标岗位</small><b className="block text-xs">AI 产品经理</b></div><div className="rounded-xl bg-[#fafaff] p-3"><small className="text-[9px] text-[#8b91aa]">公司</small><b className="block text-xs">星河智能</b></div><div className="rounded-xl bg-[#fafaff] p-3"><small className="text-[9px] text-[#8b91aa]">来源</small><b className="block text-xs">招聘官网</b></div></div><textarea value={jd} onChange={e=>setJd(e.target.value)} className="min-h-40 w-full resize-none rounded-xl border border-[#e3e5f0] bg-[#fcfcff] p-4 text-xs leading-6 outline-none focus:border-[#8177ff]"/><div className="mt-3 flex items-center justify-between"><span className="text-[9px] text-[#8a91aa]">已识别 {jd.length} 个字符 · 内容仅用于生成求职方案</span><Button onClick={analyze} disabled={!jd}>{analyzed?"分析 JD":"AI 正在解析..."}</Button></div></Card><Card className="bg-gradient-to-br from-[#6760f6] to-[#493de0] text-white"><div className="flex items-start justify-between"><div><small className="text-white/70">综合岗位匹配度</small><b className="mt-2 block text-6xl">89<span className="text-base">%</span></b><Pill green>值得重点投递</Pill></div><Target size={42} className="text-white/30"/></div><div className="mt-6 space-y-3 text-[10px]">{[["硬性要求",94],["能力匹配",86],["经历证据",82],["关键词覆盖",91]].map(x=><div key={x[0] as string}><div className="mb-1 flex justify-between"><span>{x[0]}</span><b>{x[1]}%</b></div><div className="h-1.5 rounded-full bg-white/15"><div className="h-full rounded-full bg-white" style={{width:`${x[1]}%`}}/></div></div>)}</div></Card></div>
    <div className="grid grid-cols-[1.3fr_1fr] gap-3"><Card><Title>JD 需求拆解</Title><div className="grid grid-cols-3 gap-3">{[["核心职责",["需求分析与产品方案","推动跨团队落地","基于数据持续迭代"]],["硬性要求",["独立输出 PRD","用户研究能力","数据分析能力"]],["高价值加分项",["AI 应用理解","增长实验经验","复杂项目推进"]]].map((g,i)=><div className="rounded-xl bg-[#fafaff] p-4" key={g[0] as string}><span className={cx("grid size-8 place-items-center rounded-lg",i===0?"bg-[#efedff] text-[#6257ed]":i===1?"bg-blue-50 text-blue-500":"bg-emerald-50 text-emerald-500")}>{i===0?<ClipboardCheck size={16}/>:i===1?<BadgeCheck size={16}/>:<Zap size={16}/>}</span><b className="my-3 block text-xs">{g[0]}</b>{(g[1] as string[]).map(x=><p className="mb-2 text-[9px] text-[#69728e]" key={x}>✓ {x}</p>)}</div>)}</div></Card><Card><Title>能力缺口优先级</Title>{[["AI 产品理解","高","建议完成 1 个定制副本",68],["数据分析","中","补充量化项目证据",72],["增长实验","中","学习 A/B 测试案例",76]].map(x=><div className="mb-2 rounded-xl bg-[#fafaff] p-3" key={x[0] as string}><div className="flex justify-between"><b className="text-[10px]">{x[0]}</b><Pill orange>{x[1]}</Pill></div><p className="my-2 text-[9px] text-[#8b91aa]">{x[2]}</p><Progress value={x[3] as number}/></div>)}</Card></div>
    <Card><div className="mb-4 flex items-center justify-between"><div className="flex gap-2"><button onClick={()=>setTab("mission")} className={cx("rounded-xl px-4 py-2 text-xs font-semibold",tab==="mission"?"bg-[#efedff] text-[#6257ed]":"text-[#7b829a]")}>定制副本方案</button><button onClick={()=>setTab("resume")} className={cx("rounded-xl px-4 py-2 text-xs font-semibold",tab==="resume"?"bg-[#efedff] text-[#6257ed]":"text-[#7b829a]")}>定制简历方案</button></div><Button onClick={()=>{setGenerated(true);toast(tab==="mission"?"专属副本已生成":"岗位版简历已生成")}}><Sparkles size={14}/>{generated?"重新生成":"一键生成"}</Button></div>{tab==="mission"?<div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3"><PlanStep n="01" title="洞察 AI 求职用户痛点" note="产出用户洞察报告"/><PlanStep n="02" title="设计 AI 求职助手 MVP" note="产出产品方案与 PRD"/><PlanStep n="03" title="制定增长验证方案" note="产出指标与实验设计"/><Button onClick={()=>go("customMission")}>进入定制副本<ChevronRight size={13}/></Button></div>:<div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3"><PlanStep n="01" title="重组经历证据" note="选择 3 个匹配项目"/><PlanStep n="02" title="强化岗位关键词" note="覆盖 12 个核心词"/><PlanStep n="03" title="量化成果表达" note="优化 8 条项目描述"/><Button onClick={()=>go("customResume")}>编辑岗位版简历<ChevronRight size={13}/></Button></div>}</Card>
  </div>;
}
function PlanStep({n,title,note}:{n:string;title:string;note:string}) { return <div className="rounded-xl bg-[#fafaff] p-3"><Pill>{n}</Pill><b className="mt-2 block text-[10px]">{title}</b><small className="text-[9px] text-[#8a91aa]">{note}</small></div> }

function AIAvatarPage({ profile, avatar, loading, generate, openTrace }:{profile:UserProfileInput;avatar:AvatarProfile|null;loading:boolean;generate:()=>void;openTrace:()=>void}) {
  const traits=avatar?.traits ?? [{name:"逻辑分析",score:88,evidence:["用户自述擅长分析问题"]},{name:"用户思维",score:82,evidence:["目标岗位为产品经理"]},{name:"学习成长",score:90,evidence:["持续积累项目经历"]}];
  return <div className="space-y-3"><div className="grid grid-cols-[1.5fr_1fr] gap-3"><Card className="relative min-h-[280px] overflow-hidden bg-[radial-gradient(circle_at_25%_50%,#e8e6ff,transparent_38%)]"><div className="relative z-10 ml-[280px] pt-4"><Pill>训练职业数字分身</Pill><h1 className="mt-3 text-[26px] font-bold">让分身真正理解你，再替你试岗</h1><p className="mt-3 max-w-[600px] text-[11px] leading-6 text-[#737b98]">{avatar?.summary ?? "分身越了解真实的你，试岗预测越准确。它会根据经历、兴趣、压力耐受和工作偏好预演岗位，并通过你的真实反馈持续更新。"}</p><div className="mt-4 flex gap-2"><Button onClick={generate} disabled={loading}>{loading?<><LoaderCircle className="animate-spin" size={14}/>训练中</>:<><Sparkles size={14}/>继续训练分身</>}</Button><Button ghost onClick={openTrace}><Bot size={14}/>查看 AI 依据</Button></div></div><div className="absolute bottom-[-20px] left-7 h-[280px] w-[270px]"><Image src="/assets/avatar-student-tablet.png" alt="数字分身" fill className="object-contain"/></div></Card><Card><Title>分身理解完整度</Title><div className="text-center"><b className="text-5xl text-[#6257ed]">{Math.round(traits.reduce((s,x)=>s+x.score,0)/traits.length)}</b><p className="mt-2 text-[10px] text-emerald-500">已有经历与行为证据支持</p></div><div className="mt-5 flex flex-wrap gap-2"><Pill>工作兴趣：产品创造</Pill><Pill>压力耐受：中高</Pill><Pill>成就来源：解决真实问题</Pill></div></Card></div><div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3"><Card><Title>核心特质与经历证据</Title>{traits.map(x=><div className="mb-4" key={x.name}><div className="mb-1 flex justify-between text-[10px]"><b>{x.name}</b><b>{x.score}</b></div><Progress value={x.score}/><p className="mt-1 text-[9px] text-[#8a91aa]">依据：{x.evidence.join("；")}</p></div>)}</Card><Card><Title>工作偏好与成就感</Title>{["喜欢解决开放问题和设计方案","偏好团队协作与及时反馈","完成可落地成果时成就感最高"].map(x=><p className="mb-2 rounded-xl bg-emerald-50 p-3 text-[10px]" key={x}>✓ {x}</p>)}{(avatar?.suggestions ?? ["继续用真实试岗反馈校准分身"]).slice(0,2).map(x=><p className="mb-2 rounded-xl bg-[#f0eeff] p-3 text-[10px]" key={x}>→ {x}</p>)}</Card><Card><Title>压力风险与不喜欢</Title>{["高频需求变化会带来明显压力","不喜欢长期重复机械的工作","面对信息不完整时容易过度分析",...(avatar?.risks ?? [])].slice(0,4).map(x=><p className="mb-2 rounded-xl bg-orange-50 p-3 text-[10px]" key={x}>• {x}</p>)}</Card></div></div>;
}

function AIProcessPanel({ trace, close }:{trace:AITrace|null;close:()=>void}) {
  return <motion.aside initial={{x:380}} animate={{x:0}} exit={{x:380}} className="fixed bottom-0 right-0 top-0 z-[70] w-[380px] border-l border-[#e6e7f2] bg-white p-5 shadow-2xl"><div className="flex items-center justify-between"><div><Pill green={trace?.mode==="live"} orange={trace?.mode==="fallback"}>{trace?.mode==="live"?"真实 AI":"降级演示"}</Pill><h2 className="mt-2 text-lg font-bold">AI 过程与依据</h2></div><button onClick={close}><X size={18}/></button></div>{trace?<div className="mt-6 space-y-4 text-[10px]"><Card><b>执行动作</b><p className="mt-2 text-[#69728e]">{trace.action}</p></Card><Card><b>模型与提示词</b><p className="mt-2 text-[#69728e]">{trace.model} · Prompt v{trace.promptVersion}</p><p className="mt-1 text-[#8a91aa]">Trace: {trace.traceId}</p></Card><Card><b>本次使用依据</b>{trace.evidence.map(x=><p className="mt-2 rounded-lg bg-[#fafaff] p-2" key={x}>✓ {x}</p>)}</Card><Card><b>生成时间</b><p className="mt-2 text-[#69728e]">{new Date(trace.generatedAt).toLocaleString()}</p>{trace.error&&<p className="mt-2 text-orange-500">降级原因：{trace.error}</p>}</Card></div>:<p className="mt-8 text-xs text-[#8a91aa]">完成一次 AI 操作后，这里会显示模型、依据和追踪信息。</p>}</motion.aside>;
}

function Onboarding({ profile, setProfile, finish, close, loading }:{profile:UserProfileInput;setProfile:(p:UserProfileInput)=>void;finish:()=>void;close:()=>void;loading:boolean}) {
  const [step,setStep]=useState(0);
  return <Modal close={close} title={`训练职业数字分身 · ${step+1}/4`}><div className="mb-5"><Progress value={(step+1)*25}/></div>{step===0&&<div className="py-8 text-center"><Bot className="mx-auto text-[#6257ed]" size={48}/><h3 className="mt-4 text-xl font-bold">让分身了解真实的你，再替你试岗</h3><p className="mx-auto mt-3 max-w-[420px] text-xs leading-6 text-[#737b96]">请提供经历证据、工作兴趣、压力来源、成就感来源和工作偏好。信息越真实，分身预演岗位时越准确。</p></div>}{step===1&&<div className="grid grid-cols-2 gap-3">{[["name","你的称呼"],["targetRole","想探索的岗位"],["city","目标城市"],["strengths","优势与支撑证据"]].map(([k,l])=><label className="text-[10px]" key={k}>{l}<input value={profile[k as keyof UserProfileInput]} onChange={e=>setProfile({...profile,[k]:e.target.value})} className="mt-1 h-10 w-full rounded-xl border border-[#e3e5f0] px-3 outline-none focus:border-[#8177ff]"/></label>)}</div>}{step===2&&<div className="space-y-3"><label className="text-[10px]">工作兴趣、厌恶、压力耐受与成就感来源<textarea value={profile.preferences} onChange={e=>setProfile({...profile,preferences:e.target.value})} placeholder="例如：喜欢解决开放问题；不喜欢重复机械任务；能接受阶段性高压；看到方案落地时最有成就感。" className="mt-1 min-h-28 w-full rounded-xl border border-[#e3e5f0] p-3 outline-none"/></label><label className="text-[10px]">粘贴简历、项目或真实经历证据<textarea value={profile.resume} onChange={e=>setProfile({...profile,resume:e.target.value})} className="mt-1 min-h-32 w-full rounded-xl border border-[#e3e5f0] p-3 outline-none"/></label></div>}{step===3&&<div className="py-6"><Title>分身将依据这些信息预演岗位</Title>{[["探索方向",`${profile.targetRole} · ${profile.city}`],["优势证据",profile.strengths],["兴趣 / 压力 / 成就感",profile.preferences],["经历证据",profile.resume]].map(x=><div className="mb-2 rounded-xl bg-[#fafaff] p-3 text-[10px]" key={x[0]}><b>{x[0]}：</b>{x[1]}</div>)}</div>}<div className="mt-5 flex justify-between"><Button ghost onClick={()=>step===0?close():setStep(x=>x-1)}>返回</Button>{step<3?<Button onClick={()=>setStep(x=>x+1)}>下一步</Button>:<Button onClick={finish} disabled={loading}>{loading?<><LoaderCircle className="animate-spin" size={14}/>训练中</>:"完成分身训练"}</Button>}</div></Modal>;
}

// Preserved for V3; V4 uses the AI-backed radar below.
function JobRadarPageLegacy({ go, toast }: { go:(p:PageId)=>void; toast:(s:string)=>void }) {
  const [query,setQuery]=useState(""); const [saved,setSaved]=useState<string[]>([]); const [selected,setSelected]=useState<Job|null>(null);
  const shown=useMemo(()=>jobs.filter(j=>j.title.includes(query)||j.company.includes(query)),[query]);
  return <div className="grid grid-cols-[1fr_320px] gap-3"><div className="space-y-3"><div><Pill>岗位雷达</Pill><h1 className="mt-2 text-[27px] font-bold">发现真正值得你投入时间的岗位</h1><p className="text-xs text-[#7e859e]">根据目标、能力与投递反馈持续刷新推荐，不做无意义海投。</p></div><Card className="flex items-center gap-2"><div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e3e5f0] px-3"><Search size={14} className="text-[#8b91aa]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索岗位或公司" className="h-10 flex-1 bg-transparent text-xs outline-none"/></div>{["上海","产品经理","校招","15K+"].map(x=><button key={x} className="rounded-xl border border-[#e3e5f0] px-4 py-2.5 text-[10px] hover:border-[#8177ff]">{x}</button>)}<Button ghost>更多筛选</Button></Card><div className="grid grid-cols-2 gap-3">{shown.map(j=><Card key={j.title} onClick={()=>setSelected(j)} className={cx("overflow-hidden p-0",selected?.title===j.title&&"border-[#8177ff] ring-2 ring-[#eeecff]")}><div className="relative h-28"><Image src={`/assets/${j.image}`} alt={j.title} fill className="object-cover"/><span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold text-emerald-600">{j.match}% 匹配</span><span className="absolute right-3 top-3 rounded-lg bg-[#171a2d]/60 px-2 py-1 text-[9px] text-white">{j.fresh}</span></div><div className="p-4"><div className="flex justify-between"><div><b className="text-sm">{j.title}</b><p className="mt-1 text-[9px] text-[#8b91aa]">{j.company} · {j.city} · {j.salary}</p></div><button onClick={e=>{e.stopPropagation();setSaved(v=>v.includes(j.title)?v.filter(x=>x!==j.title):[...v,j.title])}}><Star size={17} className={saved.includes(j.title)?"fill-amber-400 text-amber-400":"text-[#a5abc0]"}/></button></div><div className="my-3 flex gap-1">{j.tags.map(t=><Pill key={t}>{t}</Pill>)}</div><div className="flex gap-2"><Button ghost className="flex-1" onClick={()=>go("jd")}>生成求职方案</Button><Button className="flex-1" onClick={()=>{toast("已加入待确认投递");go("applications")}}>准备投递</Button></div></div></Card>)}</div></div><aside className="space-y-3"><Card><Title>今日雷达概览</Title><div className="grid grid-cols-2 gap-2">{[["新增岗位","36"],["高匹配","12"],["已收藏",`${saved.length}`],["待确认","4"]].map(x=><div className="rounded-xl bg-[#fafaff] p-3" key={x[0]}><small className="text-[9px] text-[#8a91aa]">{x[0]}</small><b className="block text-2xl">{x[1]}</b></div>)}</div></Card><Card><Title>推荐偏好</Title>{["上海 / 杭州","产品经理 / 产品策划","15K - 25K","互联网 / AI 应用","校招 / 应届生"].map(x=><p key={x} className="mb-2 rounded-xl bg-[#fafaff] p-3 text-[10px]">✓ {x}</p>)}<Button ghost className="w-full" onClick={()=>toast("推荐偏好已打开")}>调整推荐偏好</Button></Card><Card><Title>自动化边界</Title><p className="text-[10px] leading-6 text-[#737b96]">系统自动发现岗位、准备对应材料并提醒你确认；只有得到你的确认，才会进入投递流程。</p></Card></aside></div>;
}

function JobRadarPage({ profile, avatar, go, toast, onTrace }:{profile:UserProfileInput;avatar:AvatarProfile|null;go:(p:PageId)=>void;toast:(s:string)=>void;onTrace:(r:AIResponse<unknown>,action:string)=>void}) {
  const [query,setQuery]=useState(`${profile.targetRole} ${profile.city} 校招`);
  const [results,setResults]=useState<JobResult[]>([]);
  const [loading,setLoading]=useState(false);
  const search=async()=>{setLoading(true);try{const r=await callAI<{jobs:JobResult[]}>("/api/ai/jobs/search",{query,profile,avatar});setResults(r.data.jobs);onTrace(r,"Tavily 公开岗位搜索与 DeepSeek 匹配分析");toast(r.mode==="live"?"已完成真实岗位搜索与 AI 匹配":"搜索服务不可用，已展示降级岗位示例");}catch(e){toast(e instanceof Error?e.message:"岗位搜索失败");}finally{setLoading(false)}};
  return <div className="grid grid-cols-[1fr_330px] gap-3"><div className="space-y-3"><div><Pill>AI 岗位雷达</Pill><h1 className="mt-2 text-[27px] font-bold">搜索公开招聘网页，并用职业分身判断匹配度</h1><p className="text-xs text-[#7e859e]">优先搜索智联招聘、前程无忧、猎聘、BOSS 直聘公开页和企业招聘官网，不模拟登录或自动投递。</p></div><Card className="flex gap-2"><div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e3e5f0] px-3"><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} className="h-10 flex-1 text-xs outline-none" placeholder="例如：产品经理 上海 校招"/></div><Button onClick={search} disabled={loading}>{loading?<><LoaderCircle className="animate-spin" size={14}/>AI 搜索中</>:<><Radar size={14}/>搜索并匹配</>}</Button></Card>{results.length===0?<Card className="grid min-h-[420px] place-items-center text-center"><div><Radar className="mx-auto text-[#6257ed]" size={48}/><h3 className="mt-4 font-bold">输入岗位条件，启动真实岗位雷达</h3><p className="mt-2 text-[10px] text-[#8a91aa]">搜索结果会保留原始来源链接，并展示匹配证据、能力缺口和风险。</p></div></Card>:<div className="grid grid-cols-2 gap-3">{results.map(j=><Card key={`${j.url}-${j.title}`}><div className="flex justify-between gap-3"><div><Pill green>{j.match}% 匹配</Pill><h3 className="mt-3 text-sm font-bold">{j.title}</h3><p className="mt-1 text-[9px] text-[#8a91aa]">{j.company} · {j.city} · {j.salary}</p></div>{j.url&&<a href={j.url} target="_blank" rel="noreferrer" className="grid size-9 place-items-center rounded-xl border border-[#e3e5f0] text-[#6257ed]"><ExternalLink size={14}/></a>}</div><p className="mt-3 text-[10px] leading-5 text-[#69728e]">{j.summary}</p><div className="mt-3 flex flex-wrap gap-1">{j.keywords.map(x=><Pill key={x}>{x}</Pill>)}</div><div className="mt-3 rounded-xl bg-emerald-50 p-3 text-[9px]"><b>匹配证据</b>{j.evidence.map(x=><p className="mt-1" key={x}>✓ {x}</p>)}</div><div className="mt-2 rounded-xl bg-orange-50 p-3 text-[9px]"><b>缺口与风险</b>{j.gaps.map(x=><p className="mt-1" key={x}>• {x}</p>)}<p className="mt-1">• {j.risk}</p></div><div className="mt-3 flex gap-2"><Button ghost className="flex-1" onClick={()=>go("customMission")}>生成定制副本</Button><Button className="flex-1" onClick={()=>{toast("已加入待确认投递");go("applications")}}>准备投递</Button></div></Card>)}</div>}</div><aside className="space-y-3"><Card><Title>搜索依据</Title>{[`${profile.targetRole} · ${profile.city}`,profile.strengths,profile.preferences].map(x=><p className="mb-2 rounded-xl bg-[#fafaff] p-3 text-[10px]" key={x}>✓ {x}</p>)}</Card><Card><Title>数据边界</Title><p className="text-[10px] leading-6 text-[#737b96]">仅搜索公开网页并保留来源链接。岗位详情与时效请在原招聘页面核验，系统不会绕过验证码或代替用户投递。</p></Card></aside></div>;
}

const jobResultKey = (job: JobResult) => job.url || `${job.company}::${job.title}::${job.city}`;
const JOB_RADAR_CACHE_KEY = "career-copy-ai-v4-job-radar";

function PersistentJobRadarPage({ profile, avatar, go, toast, onTrace, onCustomize }:{profile:UserProfileInput;avatar:AvatarProfile|null;go:(p:PageId)=>void;toast:(s:string)=>void;onTrace:(r:AIResponse<unknown>,action:string)=>void;onCustomize:(job:JobResult)=>void}) {
  const [query,setQuery]=useState(`${profile.targetRole} ${profile.city} 校招`);
  const [results,setResults]=useState<JobResult[]>([]);
  const [savedJobs,setSavedJobs]=useState<JobResult[]>([]);
  const [view,setView]=useState<"results"|"saved">("results");
  const [lastUpdated,setLastUpdated]=useState("");
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    try {
      const cached=localStorage.getItem(JOB_RADAR_CACHE_KEY);
      if(!cached)return;
      const state=JSON.parse(cached);
      queueMicrotask(()=>{
        setQuery(state.query || `${profile.targetRole} ${profile.city} 校招`);
        setResults(Array.isArray(state.results)?state.results:[]);
        setSavedJobs(Array.isArray(state.savedJobs)?state.savedJobs:[]);
        setLastUpdated(state.lastUpdated || "");
      });
    } catch {
      localStorage.removeItem(JOB_RADAR_CACHE_KEY);
    }
  },[profile.targetRole,profile.city]);

  useEffect(()=>{
    localStorage.setItem(JOB_RADAR_CACHE_KEY,JSON.stringify({query,results,savedJobs,lastUpdated}));
  },[query,results,savedJobs,lastUpdated]);

  const toggleSaved=(job:JobResult)=>{
    const key=jobResultKey(job);
    const exists=savedJobs.some(item=>jobResultKey(item)===key);
    setSavedJobs(current=>exists?current.filter(item=>jobResultKey(item)!==key):[job,...current]);
    toast(exists?"已取消保存岗位":"已保存岗位，下次搜索不会覆盖");
  };

  const search=async()=>{
    setLoading(true);
    try{
      const r=await callAI<{jobs:JobResult[]}>("/api/ai/jobs/search",{query,profile,avatar});
      setResults(r.data.jobs);
      setLastUpdated(new Date().toISOString());
      setView("results");
      onTrace(r,"Tavily 公开岗位搜索与 DeepSeek 匹配分析");
      toast(r.mode==="live"?"搜索结果已更新并自动保存":"搜索服务不可用，已保存降级岗位示例");
    }catch(e){
      toast(e instanceof Error?e.message:"岗位搜索失败");
    }finally{
      setLoading(false);
    }
  };

  const shown=view==="saved"?savedJobs:results;
  const updatedText=lastUpdated?new Date(lastUpdated).toLocaleString("zh-CN"):"尚未搜索";

  return <div className="grid grid-cols-[1fr_330px] gap-3"><div className="space-y-3">
    <div><Pill>AI 岗位雷达</Pill><h1 className="mt-2 text-[27px] font-bold">搜索结果自动保存，重点岗位由你收藏</h1><p className="text-xs text-[#7e859e]">每次搜索会更新“最近结果”，已保存岗位独立保留，不会被下一次搜索覆盖。</p></div>
    <Card className="space-y-3"><div className="flex gap-2"><div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e3e5f0] px-3"><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} className="h-10 flex-1 text-xs outline-none" placeholder="例如：产品经理 上海 校招"/></div><Button onClick={search} disabled={loading}>{loading?<><LoaderCircle className="animate-spin" size={14}/>AI 搜索中</>:<><Radar size={14}/>搜索并更新</>}</Button></div><div className="flex items-center justify-between"><div className="flex gap-2"><button onClick={()=>setView("results")} className={cx("rounded-xl px-4 py-2 text-[10px] font-semibold",view==="results"?"bg-[#6257ed] text-white":"bg-[#f4f3ff] text-[#6257ed]")}>最近结果 {results.length}</button><button onClick={()=>setView("saved")} className={cx("rounded-xl px-4 py-2 text-[10px] font-semibold",view==="saved"?"bg-amber-400 text-white":"bg-amber-50 text-amber-600")}>已保存 {savedJobs.length}</button></div><span className="text-[9px] text-[#8a91aa]">最近更新：{updatedText}</span></div></Card>
    {shown.length===0?<Card className="grid min-h-[420px] place-items-center text-center"><div>{view==="saved"?<Star className="mx-auto text-amber-400" size={48}/>:<Radar className="mx-auto text-[#6257ed]" size={48}/>}<h3 className="mt-4 font-bold">{view==="saved"?"还没有保存岗位":"输入岗位条件，启动真实岗位雷达"}</h3><p className="mt-2 text-[10px] text-[#8a91aa]">{view==="saved"?"点击岗位卡片右上角的星标进行保存。":"搜索完成后结果会自动保存在当前浏览器中。"}</p></div></Card>:<div className="grid grid-cols-2 gap-3">{shown.map(j=>{const saved=savedJobs.some(item=>jobResultKey(item)===jobResultKey(j));return <Card key={jobResultKey(j)}><div className="flex justify-between gap-3"><div><Pill green>{j.match}% 匹配</Pill><h3 className="mt-3 text-sm font-bold">{j.title}</h3><p className="mt-1 text-[9px] text-[#8a91aa]">{j.company} · {j.city} · {j.salary}</p></div><div className="flex gap-2"><button onClick={()=>toggleSaved(j)} title={saved?"取消保存":"保存岗位"} className={cx("grid size-9 place-items-center rounded-xl border",saved?"border-amber-200 bg-amber-50 text-amber-500":"border-[#e3e5f0] text-[#a5abc0]")}><Star size={15} className={saved?"fill-amber-400":""}/></button>{j.url&&<a href={j.url} target="_blank" rel="noreferrer" className="grid size-9 place-items-center rounded-xl border border-[#e3e5f0] text-[#6257ed]"><ExternalLink size={14}/></a>}</div></div><p className="mt-3 text-[10px] leading-5 text-[#69728e]">{j.summary}</p><div className="mt-3 flex flex-wrap gap-1">{j.keywords.map(x=><Pill key={x}>{x}</Pill>)}</div><div className="mt-3 rounded-xl bg-emerald-50 p-3 text-[9px]"><b>匹配证据</b>{j.evidence.map(x=><p className="mt-1" key={x}>✓ {x}</p>)}</div><div className="mt-2 rounded-xl bg-orange-50 p-3 text-[9px]"><b>缺口与风险</b>{j.gaps.map(x=><p className="mt-1" key={x}>• {x}</p>)}<p className="mt-1">• {j.risk}</p></div><div className="mt-3 flex gap-2"><Button ghost className="flex-1" onClick={()=>onCustomize(j)}>用此岗位定制试岗</Button><Button className="flex-1" onClick={()=>{toast("已加入待确认投递");go("applications")}}>准备投递</Button></div></Card>})}</div>}
  </div><aside className="space-y-3"><Card><Title>岗位数据</Title><div className="grid grid-cols-2 gap-2">{[["最近结果",`${results.length}`],["已保存",`${savedJobs.length}`]].map(x=><div className="rounded-xl bg-[#fafaff] p-3" key={x[0]}><small className="text-[9px] text-[#8a91aa]">{x[0]}</small><b className="block text-2xl">{x[1]}</b></div>)}</div><p className="mt-3 text-[9px] leading-5 text-[#737b96]">最近结果会在下次搜索时更新；已保存岗位需要用户手动取消，始终独立保留。</p></Card><Card><Title>搜索依据</Title>{[`${profile.targetRole} · ${profile.city}`,profile.strengths,profile.preferences].map(x=><p className="mb-2 rounded-xl bg-[#fafaff] p-3 text-[10px]" key={x}>✓ {x}</p>)}</Card><Card><Title>数据边界</Title><p className="text-[10px] leading-6 text-[#737b96]">岗位数据保存在当前浏览器。仅搜索公开网页并保留来源链接，岗位详情与时效请在原招聘页面核验。</p></Card></aside></div>;
}

function Applications({ toast }: { toast:(s:string)=>void }) {
  const [stage,setStage]=useState("待确认"); const [modal,setModal]=useState(false); const [sent,setSent]=useState<string[]>([]);
  const rows=[jobs[0],jobs[1],jobs[2]];
  return <div className="space-y-3"><div className="flex items-end justify-between"><div><Pill>智能投递中心</Pill><h1 className="mt-2 text-[27px] font-bold">材料自动准备，关键动作由你确认</h1><p className="text-xs text-[#7e859e]">管理不同岗位版本、投递进度与面试提醒。</p></div><Button onClick={()=>setModal(true)}><Send size={14}/>批量确认投递</Button></div><div className="grid grid-cols-5 gap-3">{[["待确认","4",FileSearch],["已投递","12",Send],["有进展","5",Activity],["面试中","3",MessageCircle],["Offer","1",Trophy]].map(([x,n,I])=>{const Icon=I as typeof Send; return <Card onClick={()=>setStage(x as string)} key={x as string} className={cx(stage===x&&"border-[#8177ff] bg-[#faf9ff]")}><Icon size={18} className="text-[#6257ed]"/><b className="mt-3 block text-2xl">{n as string}</b><small className="text-[9px] text-[#8a91aa]">{x as string}</small></Card>})}</div><div className="grid grid-cols-[1fr_300px] gap-3"><Card><Title action={<span className="text-[10px] text-[#8a91aa]">{stage} · 需确认材料与岗位信息</span>}>{stage}列表</Title>{rows.map(j=><div key={j.title} className="mb-3 grid grid-cols-[1.3fr_.8fr_.8fr_1fr_auto] items-center gap-3 rounded-xl border border-[#e9eaf3] p-3"><div className="flex items-center gap-3"><div className="relative size-12 overflow-hidden rounded-xl"><Image src={`/assets/${j.image}`} alt={j.title} fill className="object-cover"/></div><div><b className="block text-[11px]">{j.title}</b><small className="text-[9px] text-[#8b91aa]">{j.company} · {j.city}</small></div></div><div><small className="text-[9px] text-[#8b91aa]">岗位匹配</small><b className="block text-sm text-emerald-500">{j.match}%</b></div><div><small className="text-[9px] text-[#8b91aa]">材料状态</small><Pill green>已准备</Pill></div><div><small className="text-[9px] text-[#8b91aa]">使用版本</small><b className="block text-[10px]">AI 产品经理 · V3</b></div>{sent.includes(j.title)?<Pill green>已确认投递</Pill>:<Button onClick={()=>{setSent(v=>[...v,j.title]);toast(`已确认投递：${j.company}`)}}>确认投递</Button>}</div>)}</Card><aside className="space-y-3"><Card><Title>投递漏斗</Title>{[["已准备",20,100],["已确认投递",12,60],["获得沟通",5,25],["进入面试",3,15],["获得 Offer",1,5]].map(x=><div className="mb-3" key={x[0] as string}><div className="mb-1 flex justify-between text-[9px]"><span>{x[0]}</span><b>{x[1]}</b></div><Progress value={x[2] as number} green={x[0]==="获得 Offer"}/></div>)}</Card><Card><Title>下一步提醒</Title>{["今天 18:00 前确认 4 份材料","明天 10:30 星河智能一面","本周复盘岗位反馈并更新偏好"].map(x=><p className="mb-2 rounded-xl bg-[#fafaff] p-3 text-[9px]" key={x}><Clock3 className="mr-2 inline text-[#6257ed]" size={12}/>{x}</p>)}</Card></aside></div><AnimatePresence>{modal&&<Modal close={()=>setModal(false)} title="批量确认投递"><p className="text-xs leading-6 text-[#69728e]">系统已为 4 个高匹配岗位准备对应简历与求职说明。确认后将记录为待投递任务，并在每一步提醒你。</p><div className="mt-4 space-y-2">{jobs.map(j=><div className="flex items-center justify-between rounded-xl bg-[#fafaff] p-3" key={j.title}><span className="text-[10px]"><b className="block">{j.title}</b>{j.company} · {j.match}% 匹配</span><Check size={15} className="text-emerald-500"/></div>)}</div><Button className="mt-4 w-full" onClick={()=>{setModal(false);setSent(jobs.map(j=>j.title));toast("已确认 4 份投递任务")}}>确认并创建投递任务</Button></Modal>}</AnimatePresence></div>;
}

function MissionPageLegacy({ go, toast }:{go:(p:PageId)=>void;toast:(s:string)=>void}) {
  const [done,setDone]=useState([true,true,false]); return <div className="space-y-3"><Card className="relative min-h-[230px] overflow-hidden bg-[radial-gradient(circle_at_78%_45%,#e8e5ff,transparent_34%)]"><Pill>由星河智能 AI 产品经理 JD 定制</Pill><h1 className="mt-4 text-[27px] font-bold">设计 AI 求职助手增长方案</h1><p className="mt-2 max-w-[620px] text-xs leading-6 text-[#737b96]">证明你具备 AI 产品理解、用户洞察、方案设计与数据驱动能力。完成后将自动提取为岗位版简历证据。</p><div className="mt-6 flex gap-2"><Pill>AI 应用</Pill><Pill>增长实验</Pill><Pill>数据分析</Pill></div><div className="absolute bottom-[-40px] right-8 h-[270px] w-[280px]"><Image src="/assets/avatar-student-tablet.png" alt="数字分身" fill className="object-contain"/></div></Card><div className="grid grid-cols-[260px_1fr_300px] gap-3"><Card><Title>任务清单</Title>{["用户痛点与场景洞察","AI 求职助手 MVP 设计","增长指标与实验方案"].map((x,i)=><button key={x} onClick={()=>setDone(v=>v.map((a,j)=>j===i?!a:a))} className={cx("mb-2 flex w-full gap-2 rounded-xl p-3 text-left text-[10px]",done[i]?"bg-emerald-50":"bg-[#fafaff]")}><span className={cx("grid size-5 place-items-center rounded-full",done[i]?"bg-emerald-500 text-white":"border border-[#dfe1ec]")}>{done[i]&&<Check size={11}/>}</span>{x}</button>)}<div className="mt-4"><Progress value={done.filter(Boolean).length/3*100}/></div></Card><Card><Title>当前任务：增长指标与实验方案</Title><textarea className="min-h-[280px] w-full resize-none rounded-xl border border-[#e3e5ef] bg-[#fcfcff] p-4 text-xs leading-6 outline-none focus:border-[#8177ff]" defaultValue="核心目标：提升首次使用后的简历生成完成率。&#10;&#10;实验假设：在首次进入时展示与目标岗位强相关的简历示例，可以降低用户理解成本并提升完成率。"/><div className="mt-3 flex justify-between"><Button ghost onClick={()=>toast("已保存草稿")}>保存草稿</Button><Button onClick={()=>toast("AI 已完成评估，综合评分 94")}>提交 AI 评估</Button></div></Card><aside className="space-y-3"><Card><Title>岗位能力评分</Title><div className="text-center"><b className="text-5xl text-emerald-500">94</b><p className="text-[10px] text-[#8a91aa]">高度符合目标岗位要求</p></div><RadarGraph/><Button ghost className="w-full" onClick={()=>go("customResume")}>提取到定制简历</Button></Card><Card><Title>完成后获得</Title>{["岗位版项目经历 1 条","可验证作品卡 1 张","AI 产品能力 +16","面试故事素材 2 条"].map(x=><p className="mb-2 text-[9px]" key={x}>✓ {x}</p>)}</Card></aside></div></div>;
}

function MissionPage({ profile, avatar, mission, evaluation, setMission, setEvaluation, go, toast, onTrace }:{profile:UserProfileInput;avatar:AvatarProfile|null;mission:MissionPlan|null;evaluation:MissionEvaluation|null;setMission:(x:MissionPlan|null)=>void;setEvaluation:(x:MissionEvaluation|null)=>void;go:(p:PageId)=>void;toast:(s:string)=>void;onTrace:(r:AIResponse<unknown>,action:string)=>void}) {
  const [answer,setAnswer]=useState("我会先访谈目标用户并梳理求职流程中的高频痛点，再用优先级矩阵确定 MVP 范围。方案上线后以任务完成率、次日回访率和用户反馈作为验证指标，并根据数据迭代。");
  const [loading,setLoading]=useState<"generate"|"evaluate"|null>(null);
  const generate=async()=>{setLoading("generate");try{const r=await callAI<MissionPlan>("/api/ai/mission/generate",{profile,avatar,targetRole:profile.targetRole,jd:""});setMission(r.data);setEvaluation(null);onTrace(r,"根据职业分身能力缺口生成定制副本");toast(r.mode==="live"?"AI 定制副本已生成":"已使用降级副本数据");}catch(e){toast(e instanceof Error?e.message:"副本生成失败");}finally{setLoading(null)}};
  const evaluate=async()=>{if(!mission)return toast("请先生成副本");setLoading("evaluate");try{const r=await callAI<MissionEvaluation>("/api/ai/mission/evaluate",{mission,answer});setEvaluation(r.data);onTrace(r,"依据开放回答和评分标准进行 AI 评估");toast(r.mode==="live"?"AI 评估完成，结果已更新":"已使用降级规则完成评估");}catch(e){toast(e instanceof Error?e.message:"评估失败");}finally{setLoading(null)}};
  return <div className="space-y-3"><Card className="relative min-h-[220px] overflow-hidden bg-[radial-gradient(circle_at_78%_45%,#e8e5ff,transparent_34%)]"><Pill>DeepSeek Pro · 动态生成</Pill><h1 className="mt-4 text-[27px] font-bold">{mission?.title ?? `${profile.targetRole} AI 定制副本`}</h1><p className="mt-2 max-w-[680px] text-xs leading-6 text-[#737b96]">{mission?.background ?? "根据你的职业分身和能力缺口，生成一套可验证岗位能力的真实任务。"}</p><Button className="mt-5" onClick={generate} disabled={loading!==null}>{loading==="generate"?<><LoaderCircle className="animate-spin" size={14}/>生成中</>:<><Sparkles size={14}/>{mission?"重新生成副本":"生成定制副本"}</>}</Button><div className="absolute bottom-[-40px] right-8 h-[260px] w-[270px]"><Image src="/assets/avatar-student-tablet.png" alt="数字分身" fill className="object-contain"/></div></Card>{mission?<div className="grid grid-cols-[280px_1fr_320px] gap-3"><Card><Title>动态任务清单</Title>{mission.tasks.map((t,i)=><div className="mb-3 rounded-xl bg-[#fafaff] p-3" key={t.title}><Pill>0{i+1}</Pill><b className="mt-2 block text-[10px]">{t.title}</b><p className="mt-1 text-[9px] text-[#8a91aa]">交付物：{t.deliverable}</p>{t.rubric.map(x=><p className="mt-1 text-[9px]" key={x}>✓ {x}</p>)}</div>)}</Card><Card><Title>开放回答与复盘</Title><textarea value={answer} onChange={e=>setAnswer(e.target.value)} className="min-h-[330px] w-full resize-none rounded-xl border border-[#e3e5ef] bg-[#fcfcff] p-4 text-xs leading-6 outline-none focus:border-[#8177ff]"/><div className="mt-3 flex justify-between"><span className="text-[9px] text-[#8a91aa]">AI 会引用你的具体回答作为评分证据</span><Button onClick={evaluate} disabled={loading!==null}>{loading==="evaluate"?<><LoaderCircle className="animate-spin" size={14}/>评估中</>:<><Bot size={14}/>提交 AI 评估</>}</Button></div></Card><aside className="space-y-3"><Card><Title>AI 项目评估</Title><div className="text-center"><b className="text-5xl text-emerald-500">{evaluation?.score ?? "--"}</b><p className="text-[10px] text-[#8a91aa]">{evaluation?"已根据回答动态评分":"等待提交回答"}</p></div>{evaluation?.dimensions.map(x=><div className="mt-3" key={x.name}><div className="flex justify-between text-[9px]"><b>{x.name}</b><b>{x.score}</b></div><Progress value={x.score}/><p className="mt-1 text-[8px] text-[#8a91aa]">证据：{x.evidence}</p></div>)}{evaluation&&<Button ghost className="mt-4 w-full" onClick={()=>go("review")}>查看成长复盘</Button>}</Card><Card><Title>成功标准</Title>{mission.successCriteria.map(x=><p className="mb-2 text-[9px]" key={x}>✓ {x}</p>)}</Card></aside></div>:<Card className="grid min-h-[300px] place-items-center text-center"><div><Sparkles className="mx-auto text-[#6257ed]" size={44}/><h3 className="mt-3 font-bold">等待生成你的专属岗位副本</h3></div></Card>}</div>;
}

function ResumePage({ toast }:{toast:(s:string)=>void}) {
  const [optimized,setOptimized]=useState(false); return <div className="space-y-3"><div className="flex items-end justify-between"><div><Pill>岗位版简历</Pill><h1 className="mt-2 text-[27px] font-bold">AI 产品经理 · 星河智能</h1><p className="text-xs text-[#7e859e]">此版本仅围绕当前 JD 重组经历、关键词和成果表达。</p></div><Button onClick={()=>{setOptimized(true);toast("已根据 JD 完成一轮优化")}}><WandSparkles size={14}/>一键优化</Button></div><div className="grid grid-cols-[1fr_390px] gap-3"><div className="space-y-3"><Card><Title>JD 匹配策略</Title><div className="grid grid-cols-4 gap-2">{[["匹配度",optimized?"94%":"89%"],["关键词覆盖",optimized?"16 / 16":"12 / 16"],["经历证据","4 条"],["待优化项",optimized?"0 项":"3 项"]].map(x=><div className="rounded-xl bg-[#fafaff] p-3" key={x[0]}><small className="text-[9px] text-[#8a91aa]">{x[0]}</small><b className="block text-xl">{x[1]}</b></div>)}</div></Card><Card><Title>岗位版内容编辑</Title>{[["求职摘要","具备 AI 产品方案设计与用户增长实践，能够从洞察到验证推进产品落地。","已匹配"],["项目经历 · AI 求职助手","完成 20+ 用户访谈，设计 MVP 与增长实验，核心流程完成率提升 18%。","核心证据"],["项目经历 · 校园交易平台","通过用户研究与数据分析优化发布流程，发布转化提升 24%。","辅助证据"],["技能关键词","用户研究 · PRD · 数据分析 · AI 应用 · A/B 测试","已覆盖"]].map(x=><div className="mb-2 rounded-xl border border-[#e9eaf3] p-3" key={x[0]}><div className="flex justify-between"><b className="text-[10px]">{x[0]}</b><Pill green>{x[2]}</Pill></div><p className="mt-2 text-[9px] leading-5 text-[#68718c]">{x[1]}</p><button onClick={()=>toast(`已打开编辑：${x[0]}`)} className="mt-2 text-[9px] font-semibold text-[#6257ed]">编辑表达</button></div>)}</Card></div><aside className="space-y-3"><Card><Title>岗位版简历预览</Title><div className="min-h-[510px] rounded-xl border border-[#e3e5ef] p-6 text-[8px] leading-5"><h2 className="text-lg font-bold">林同学</h2><b>AI 产品经理</b><p>上海 · 138****8888 · lintongxue@email.com</p><hr className="my-3"/><b>职业摘要</b><p>具备 AI 产品方案设计与用户增长实践，能够从用户洞察、方案设计到数据验证推动产品落地。</p><b className="mt-3 block">核心项目：AI 求职助手增长方案</b><p>完成 20+ 用户访谈并识别关键流失节点，设计 MVP 与增长实验，核心流程完成率提升 18%。</p><b className="mt-3 block">项目：校园二手交易平台</b><p>通过用户研究和漏斗分析优化发布流程，发布转化提升 24%。</p><b className="mt-3 block">核心技能</b><p>用户研究 / PRD / 数据分析 / AI 应用 / A/B 测试 / 项目推进</p></div></Card><div className="grid grid-cols-2 gap-2"><Button ghost onClick={()=>toast("已生成 PDF")}>导出 PDF</Button><Button onClick={()=>toast("已保存为投递版本")}>用于投递</Button></div></aside></div></div>;
}

function TrialValidationIntro({ go, toast }:{go:(p:PageId)=>void;toast:(s:string)=>void}) {
  return <div className="space-y-3"><Card className="relative min-h-[190px] overflow-hidden bg-[radial-gradient(circle_at_78%_45%,#e8e5ff,transparent_34%)]"><Pill>亲自验证 · AI 产品经理试岗</Pill><h1 className="mt-4 text-[27px] font-bold">现在，由你亲自验证分身的判断</h1><p className="mt-2 max-w-[680px] text-xs leading-6 text-[#737b96]">分身预测你会喜欢方案设计、在需求变化和跨团队沟通时感到压力，并从成果落地中获得成就感。请完成真实任务，看看它是否了解你。</p><div className="mt-5 flex gap-2"><Button onClick={()=>go("customMission")}><Sparkles size={14}/>开始关键任务验证</Button><Button ghost onClick={()=>go("review")}>查看试岗报告示例</Button></div><div className="absolute bottom-[-55px] right-8 h-[250px] w-[270px]"><Image src="/assets/avatar-student-tablet.png" alt="数字分身" fill className="object-contain"/></div></Card><div className="grid grid-cols-3 gap-3">{[["上午 · 核心工作","理解用户需求，制定产品方案","预计兴趣高"],["中午 · 压力场景","面对需求变化，协调不同意见","预计压力中高"],["下午 · 成果复盘","汇报方案，分析结果指标","预计成就感高"]].map(x=><Card key={x[0]}><Pill>{x[0]}</Pill><b className="mt-3 block text-xs">{x[1]}</b><p className="mt-2 text-[10px] text-[#6257ed]">{x[2]}</p></Card>)}</div><Card><Title>完成任务后，记录真实体验</Title><div className="grid grid-cols-4 gap-3">{[["我喜欢类似工作","很喜欢"],["我感受到的压力","中等"],["我获得的成就感","很高"],["我愿意继续探索","愿意"]].map(x=><button onClick={()=>toast(`已记录：${x[0]} · ${x[1]}`)} className="rounded-xl bg-[#fafaff] p-4 text-left" key={x[0]}><small className="text-[9px] text-[#8b91aa]">{x[0]}</small><b className="mt-2 block text-sm text-[#6257ed]">{x[1]}</b></button>)}</div></Card></div>;
}

function TrialReportPage({ go }:{go:(p:PageId)=>void}) {
  return <div className="space-y-3"><Card className="bg-gradient-to-r from-[#6257ed] to-[#4d42e8] text-white"><div className="grid grid-cols-[1.3fr_1fr_1fr] gap-5"><div><Pill green>试岗报告 · AI 产品经理</Pill><h1 className="mt-4 text-[28px] font-bold">喜欢，但暂未完全适配</h1><p className="mt-2 text-xs leading-6 text-white/75">这是一个值得投入成长的目标岗位。你的兴趣和成就感很高，当前短板主要集中在数据分析与复杂项目推进。</p></div><div className="rounded-xl bg-white/10 p-4"><b className="text-xs">数字分身主观判断</b>{[["喜欢程度","92"],["压力程度","68"],["成就感","90"],["继续意愿","88"]].map(x=><div className="mt-3" key={x[0]}><div className="mb-1 flex justify-between text-[9px]"><span>{x[0]}</span><b>{x[1]}</b></div><div className="h-1 rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{width:`${x[1]}%`}}/></div></div>)}</div><div className="rounded-xl bg-white/10 p-4"><b className="text-xs">系统客观评价</b>{[["岗位适配度","82"],["用户洞察","88"],["方案设计","86"],["数据分析","68"]].map(x=><div className="mt-3" key={x[0]}><div className="mb-1 flex justify-between text-[9px]"><span>{x[0]}</span><b>{x[1]}</b></div><div className="h-1 rounded-full bg-white/20"><div className="h-full rounded-full bg-emerald-300" style={{width:`${x[1]}%`}}/></div></div>)}</div></div></Card><div className="grid grid-cols-2 gap-3"><Card><Title>分身预判 vs 真实体验</Title>{[["方案设计会带来高成就感","已验证","bg-emerald-50 text-emerald-600"],["需求变化会造成明显压力","已验证","bg-emerald-50 text-emerald-600"],["跨团队沟通会降低兴趣","预测偏差","bg-orange-50 text-orange-600"]].map(x=><div className="mb-2 flex items-center justify-between rounded-xl bg-[#fafaff] p-3 text-[10px]" key={x[0]}><span>{x[0]}</span><span className={`rounded-lg px-2 py-1 ${x[2]}`}>{x[1]}</span></div>)}</Card><Card><Title>推荐切入路径</Title>{["先从 AI 产品实习生或产品运营切入","用 4 周路线补齐数据分析与项目推进","继续完成真实副本，沉淀作品与面试证据"].map(x=><p className="mb-2 rounded-xl bg-[#fafaff] p-3 text-[10px]" key={x}>→ {x}</p>)}</Card></div><Card className="flex items-center justify-between"><div><b className="text-sm">把 AI 产品经理设为目标岗位？</b><p className="mt-1 text-[10px] text-[#8a91aa]">确认后，系统会将试岗短板转化为能力树、经验值任务和成长证据。</p></div><div className="flex gap-2"><Button ghost onClick={()=>go("recommend")}>尝试其他岗位</Button><Button ghost onClick={()=>go("skill")}>将它设为目标岗位</Button><Button onClick={()=>go("skill")}>进入成长路线</Button></div></Card></div>;
}

function Modal({children,close,title}:{children:ReactNode;close:()=>void;title:string}) { return <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 grid place-items-center bg-[#171a2d]/40 p-6 backdrop-blur-sm" onClick={close}><motion.div initial={{scale:.96,y:15}} animate={{scale:1,y:0}} onClick={e=>e.stopPropagation()} className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-4 flex justify-between"><h2 className="font-bold">{title}</h2><button onClick={close}><X size={18}/></button></div>{children}</motion.div></motion.div> }

function IntegratedApp({ initialPage, aiEnabled }: { initialPage: PageId; aiEnabled: boolean }) {
  const [page,setPage]=useState<PageId>(initialPage); const [message,setMessage]=useState(""); const [,setGrowth]=useState(120);
  const [profile,setProfile]=useState<UserProfileInput>(defaultProfile);
  const [avatar,setAvatar]=useState<AvatarProfile|null>(null);
  const [mission,setMission]=useState<MissionPlan|null>(null);
  const [evaluation,setEvaluation]=useState<MissionEvaluation|null>(null);
  const [flow,setFlow]=useState<V4FlowState>(defaultFlowState);
  const [trace,setTrace]=useState<AITrace|null>(null);
  const [traceOpen,setTraceOpen]=useState(false);
  const [onboarding,setOnboarding]=useState(false);
  const [aiLoading,setAiLoading]=useState(false);
  const [hydrated,setHydrated]=useState(false);
  useEffect(()=>{if(!aiEnabled)return;try{const saved=localStorage.getItem("career-copy-ai-v4");if(saved){const state=JSON.parse(saved);setProfile(state.profile??defaultProfile);setAvatar(state.avatar??null);setMission(state.mission??null);setEvaluation(state.evaluation??null);setFlow(mergeFlowState(state.flow));}setOnboarding(!localStorage.getItem("career-copy-ai-v4-onboarded"));}finally{setHydrated(true)}},[aiEnabled]);
  useEffect(()=>{if(aiEnabled&&hydrated)localStorage.setItem("career-copy-ai-v4",JSON.stringify({profile,avatar,mission,evaluation,flow}))},[aiEnabled,hydrated,profile,avatar,mission,evaluation,flow]);
  const toast=(s:string)=>{setMessage(s);window.setTimeout(()=>setMessage(""),2200)};
  const captureTrace=(r:AIResponse<unknown>,action:string)=>{setTrace({...r,action});setTraceOpen(true)};
  const generateAvatar=async(nextProfile:UserProfileInput=profile)=>{setProfile(nextProfile);setAiLoading(true);try{const r=await callAI<AvatarProfile>("/api/ai/avatar/profile",nextProfile);setAvatar(r.data);captureTrace(r,"根据引导资料生成职业数字分身");localStorage.setItem("career-copy-ai-v4-onboarded","1");setOnboarding(false);toast(r.mode==="live"?"真实 AI 职业分身已生成":"未配置或调用失败，已使用降级画像");}catch(e){toast(e instanceof Error?e.message:"职业分身生成失败");}finally{setAiLoading(false)}};
  const patchFlow=(patch:Partial<V4FlowState>)=>setFlow(current=>({...current,...patch}));
  const clearAI=()=>{localStorage.removeItem("career-copy-ai-v4");localStorage.removeItem("career-copy-ai-v4-onboarded");setProfile(defaultProfile);setAvatar(null);setMission(null);setEvaluation(null);setFlow(defaultFlowState);setTrace(null);toast("本地 AI 数据已清除")};
  const customizeJob=(job:JobResult)=>{
    setFlow(current=>({
      ...current,
      trialSource:"searched_job",
      selectedSearchJob:job,
      selectedJob:jobToTrial(job),
      prediction:jobPrediction(job),
      mission:null,
      submission:{text:"",attachments:[],submittedAt:""},
      evaluation:null,
      report:null,
      calibrationProposal:[],
      calibratedAt:"",
      learningPlan:null,
    }));
    setPage("jd");
  };
  const goV2=(p:V2PageId)=>setPage(p);
  const legacy=(node:ReactNode)=><div className="v2-scope">{node}</div>;
  const content:Record<PageId,ReactNode>={
    home:<HomePage go={setPage}/>, jd:aiEnabled?<V4JDWorkspace flow={flow} patch={patchFlow} profile={profile} avatar={avatar} go={p=>setPage(p)} toast={toast} onTrace={captureTrace}/>:<JDWorkspace go={setPage} toast={toast}/>,
    radar:aiEnabled?<PersistentJobRadarPage profile={profile} avatar={avatar} go={setPage} toast={toast} onTrace={captureTrace} onCustomize={customizeJob}/>:<JobRadarPageLegacy go={setPage} toast={toast}/>, applications:<Applications toast={toast}/>,
    customMission:aiEnabled?<V4TrialTask flow={flow} patch={patchFlow} profile={profile} avatar={avatar} go={p=>setPage(p)} toast={toast} onTrace={captureTrace}/>:<MissionPageLegacy go={setPage} toast={toast}/>, customResume:aiEnabled?<V4ResumeCenter toast={toast} profile={profile} flow={flow} onTrace={captureTrace}/>:<ResumePage toast={toast}/>,
    dashboard:aiEnabled?<V4Dashboard go={setPage}/>:legacy(<V2Dashboard go={goV2}/>), avatar:aiEnabled?<V4AvatarPage profile={profile} avatar={avatar} loading={aiLoading} edit={()=>setOnboarding(true)} openTrace={()=>setTraceOpen(true)} go={setPage}/>:legacy(<V2AvatarPage go={goV2}/>),
    recommend:aiEnabled?<V4TrialPlaza flow={flow} patch={patchFlow} go={p=>setPage(p)}/>:legacy(<V2Recommend go={goV2}/>), skill:legacy(<V2SkillPage go={goV2} toast={toast}/>),
    mission:aiEnabled?<V4TrialTask flow={flow} patch={patchFlow} profile={profile} avatar={avatar} go={p=>setPage(p)} toast={toast} onTrace={captureTrace}/>:legacy(<V2Mission go={goV2} grow={()=>setGrowth(x=>x+120)} toast={toast}/>),
    review:aiEnabled?<V4TrialReportPage flow={flow} patch={patchFlow} profile={profile} avatar={avatar} updateProfile={setProfile} updateAvatar={setAvatar} go={p=>setPage(p)} toast={toast} onTrace={captureTrace}/>:legacy(<V2Review go={goV2}/>), portfolio:legacy(<V2Portfolio toast={toast}/>),
    learning:aiEnabled?<V4LearningPage flow={flow} patch={patchFlow} go={p=>setPage(p)}/>:legacy(<V2Learning toast={toast}/>), resume:legacy(<V2Resume toast={toast}/>),
    interview:legacy(<V2Interview toast={toast}/>), settings:<div className="space-y-3">{legacy(<V2SettingsPage toast={toast}/>)}{aiEnabled&&<Card><Title>V4 AI 数据与引导</Title><div className="flex gap-3"><Button ghost onClick={()=>setOnboarding(true)}><Bot size={14}/>重新开始 AI 引导</Button><Button ghost onClick={clearAI}><X size={14}/>清除本地 AI 数据</Button></div><p className="mt-3 text-[9px] text-[#8a91aa]">API Key 仅保存在服务端 .env.local；职业分身、副本和评估结果保存在当前浏览器。</p></Card>}</div>,
  };
  return <div className="min-h-screen bg-[#f7f8fc] text-[#171a2d]"><Sidebar page={page} go={setPage} grouped={aiEnabled}/><Topbar go={setPage}/><motion.main key={page} initial={{opacity:0,y:7}} animate={{opacity:1,y:0}} className="ml-[240px] min-h-screen pt-[66px]"><div className="mx-auto max-w-[1680px] p-4">{content[page]}</div></motion.main>{aiEnabled&&<button onClick={()=>setTraceOpen(true)} className="fixed bottom-6 left-[260px] z-40 flex items-center gap-2 rounded-xl bg-[#171a2d] px-4 py-3 text-xs font-semibold text-white shadow-xl"><Bot size={15}/>{trace?.mode==="live"?"真实 AI 运行记录":trace?"降级 AI 运行记录":"AI 过程面板"}</button>}<AnimatePresence>{traceOpen&&aiEnabled&&<AIProcessPanel trace={trace} close={()=>setTraceOpen(false)}/>}</AnimatePresence><AnimatePresence>{onboarding&&aiEnabled&&<V4Onboarding profile={profile} finish={generateAvatar} close={()=>setOnboarding(false)} loading={aiLoading}/>}</AnimatePresence><AnimatePresence>{message&&<motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#171a2d] px-4 py-3 text-xs text-white shadow-2xl"><Check size={14} className="text-emerald-400"/>{message}</motion.div>}</AnimatePresence></div>;
}

export function V3App() {
  return <IntegratedApp initialPage="home" aiEnabled={false} />;
}

export function V4App() {
  return <IntegratedApp initialPage="dashboard" aiEnabled />;
}
