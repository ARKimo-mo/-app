"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, BadgeCheck, BarChart3, Bell, BookOpen, BriefcaseBusiness, Check, ChevronRight,
  CircleUserRound, ClipboardCheck, Clock3, FileSearch, FileText, FolderKanban, Home,
  MessageCircle, Radar, Search, Send, Settings, Sparkles,
  Star, Target, Trophy, UploadCloud, WandSparkles, X, Zap,
} from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
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

type PageId = "home" | "jd" | "radar" | "applications" | "customMission" | "customResume" | V2PageId;
type Job = { title: string; company: string; match: number; city: string; salary: string; tags: string[]; image: string; fresh: string };
const cx = (...v: Array<string | false | undefined>) => v.filter(Boolean).join(" ");

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

function Sidebar({ page, go }: { page: PageId; go: (p: PageId) => void }) {
  return <aside className="fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col border-r border-[#e9eaf4] bg-white px-4 py-5">
    <button onClick={() => go("dashboard")} className="mb-5 flex items-center gap-3 px-1 text-left"><span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#7a70ff] to-[#4d42e8] text-white shadow-lg shadow-violet-200"><Sparkles size={19} /></span><span><b className="block text-[17px]">职前副本 AI</b><small className="text-[9px] text-[#8a91aa]">先试岗，再成长，拿证据证明自己</small></span></button>
    <nav className="flex-1 space-y-1 overflow-y-auto pr-1">{nav.map(([id, label, Icon]) => <button key={id} onClick={() => go(id)} className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[11px] transition", page === id ? "bg-gradient-to-r from-[#efedff] to-[#faf9ff] font-semibold text-[#594ee8]" : "text-[#56617c] hover:bg-[#f7f7fc]")}><Icon size={15} />{label}{id === "radar" && <span className="ml-auto rounded-full bg-[#655af3] px-1.5 py-0.5 text-[8px] text-white">12</span>}</button>)}</nav>
    <div className="mt-auto space-y-3"><Card className="p-3"><div className="flex items-center gap-2"><div className="relative size-10 overflow-hidden rounded-full bg-[#ebe9ff]"><Image src="/assets/avatar-student-profile.png" alt="林同学" fill className="object-cover" /></div><div><b className="block text-xs">林同学</b><small className="text-[9px] text-[#8a91aa]">Lv.4 成长探索者</small></div></div><div className="mt-3 flex justify-between text-[9px] text-[#8a91aa]"><span>经验值 1280 / 2000</span><span>64%</span></div><div className="mt-1"><Progress value={64} /></div></Card><Card className="p-3"><div className="flex justify-around text-amber-500"><Trophy size={22} /><BadgeCheck size={22} /><Star size={22} /></div><p className="mt-2 text-[10px] text-[#737b98]">已解锁 7 枚成长徽章</p></Card></div>
  </aside>;
}
function Topbar({ go }: { go: (p: PageId) => void }) {
  return <header className="fixed left-[240px] right-0 top-0 z-20 flex h-[66px] items-center justify-between border-b border-[#e9eaf4] bg-white/95 px-6 backdrop-blur"><span className="text-xs text-[#69718d]">今天是 2024年5月20日，星期一</span><div className="flex items-center gap-5"><span className="text-[10px] text-[#7d849c]">今日成长值<strong className="block text-sm text-[#171a2d]">120</strong></span><span className="text-[10px] text-[#7d849c]">成长记录<strong className="block text-sm text-[#171a2d]">8</strong></span><Button ghost onClick={() => go("jd")}><FileSearch size={14} />JD 定制</Button><Button onClick={() => go("radar")}><Radar size={14} />岗位雷达</Button><button className="grid size-9 place-items-center rounded-xl border border-[#e3e5f1] text-[#6257ed]"><Bell size={16} /></button></div></header>;
}

function HomePage({ go }: { go: (p: PageId) => void }) {
  return <div className="space-y-3">
    <div className="grid grid-cols-[1fr_300px] gap-3"><Card className="relative min-h-[250px] overflow-hidden bg-[radial-gradient(circle_at_80%_40%,#e7e4ff,transparent_35%)]"><Pill>求职主线已升级</Pill><h1 className="mt-4 max-w-[650px] text-[28px] font-bold tracking-tight">不只练能力，更要精准走向每一个真实岗位</h1><p className="mt-2 max-w-[610px] text-xs leading-6 text-[#737b96]">导入目标岗位 JD，自动生成定制副本、岗位版简历与投递材料。由你确认后，再进入智能投递与进度跟踪。</p><div className="mt-6 flex gap-3"><Button onClick={() => go("jd")}><FileSearch size={14} />分析一个新 JD</Button><Button ghost onClick={() => go("radar")}><Radar size={14} />查看今日岗位</Button></div><div className="absolute bottom-[-35px] right-6 h-[260px] w-[280px]"><Image src="/assets/avatar-student-tablet.png" alt="职业数字分身" fill className="object-contain" /></div></Card><Card><Title>本周求职进展</Title><div className="grid grid-cols-2 gap-2">{[["高匹配岗位","28"],["定制简历","6"],["确认投递","12"],["进入面试","3"]].map(x => <div className="rounded-xl bg-[#fafaff] p-3" key={x[0]}><small className="text-[9px] text-[#8b91aa]">{x[0]}</small><b className="mt-1 block text-2xl">{x[1]}</b></div>)}</div><TrendGraph /></Card></div>
    <div className="grid grid-cols-[1.25fr_1fr_1fr] gap-3"><Card><Title action={<button onClick={() => go("jd")} className="text-[10px] text-[#6257ed]">继续分析</button>}>最近导入的 JD</Title>{jobs.slice(0,3).map(j=><button onClick={() => go("jd")} key={j.title} className="mb-2 flex w-full items-center gap-3 rounded-xl bg-[#fafaff] p-3 text-left"><span className="grid size-9 place-items-center rounded-lg bg-[#efedff] text-[#6257ed]"><BriefcaseBusiness size={16}/></span><span className="flex-1"><b className="block text-[11px]">{j.title}</b><small className="text-[9px] text-[#8b91aa]">{j.company} · 已生成定制方案</small></span><b className="text-lg text-emerald-500">{j.match}%</b><ChevronRight size={14}/></button>)}</Card><Card><Title>当前定制副本</Title><div className="rounded-xl bg-gradient-to-br from-[#f3f1ff] to-[#fbfaff] p-4"><Pill>星河智能 · AI 产品经理</Pill><b className="mt-3 block text-sm">AI 求职助手增长方案</b><p className="mt-1 text-[9px] leading-5 text-[#7c849e]">针对 JD 中的 AI 应用、增长实验与数据分析能力生成。</p><div className="my-3"><Progress value={62}/></div><Button className="w-full" onClick={()=>go("customMission")}>继续完成副本</Button></div></Card><Card><Title>岗位版简历表现</Title><div className="text-center"><b className="text-5xl text-[#6257ed]">89</b><span className="text-xs text-emerald-500"> 匹配度</span></div><RadarGraph/><Button ghost className="w-full" onClick={()=>go("customResume")}>查看定制简历</Button></Card></div>
    <Card><Title action={<button onClick={()=>go("radar")} className="text-[10px] text-[#6257ed]">查看全部岗位</button>}>今日最值得投递</Title><div className="grid grid-cols-4 gap-3">{jobs.map(j=><JobMini key={j.title} job={j} onClick={()=>go("radar")}/>)}</div></Card>
  </div>;
}

function JobMini({ job, onClick }: { job: Job; onClick?: () => void }) {
  return <motion.button whileHover={{ y: -2 }} onClick={onClick} className="overflow-hidden rounded-xl border border-[#e8e9f3] bg-white text-left"><div className="relative h-20"><Image src={`/assets/${job.image}`} alt={job.title} fill className="object-cover"/><Pill green><span className="absolute left-2 top-2">{job.match}% 匹配</span></Pill></div><div className="p-3"><b className="block text-[11px]">{job.title}</b><small className="text-[9px] text-[#8b91aa]">{job.company} · {job.city} · {job.salary}</small><div className="mt-2 flex gap-1">{job.tags.slice(0,2).map(t=><Pill key={t}>{t}</Pill>)}</div></div></motion.button>;
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

function JobRadarPage({ go, toast }: { go:(p:PageId)=>void; toast:(s:string)=>void }) {
  const [query,setQuery]=useState(""); const [saved,setSaved]=useState<string[]>([]); const [selected,setSelected]=useState<Job|null>(null);
  const shown=useMemo(()=>jobs.filter(j=>j.title.includes(query)||j.company.includes(query)),[query]);
  return <div className="grid grid-cols-[1fr_320px] gap-3"><div className="space-y-3"><div><Pill>岗位雷达</Pill><h1 className="mt-2 text-[27px] font-bold">发现真正值得你投入时间的岗位</h1><p className="text-xs text-[#7e859e]">根据目标、能力与投递反馈持续刷新推荐，不做无意义海投。</p></div><Card className="flex items-center gap-2"><div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e3e5f0] px-3"><Search size={14} className="text-[#8b91aa]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索岗位或公司" className="h-10 flex-1 bg-transparent text-xs outline-none"/></div>{["上海","产品经理","校招","15K+"].map(x=><button key={x} className="rounded-xl border border-[#e3e5f0] px-4 py-2.5 text-[10px] hover:border-[#8177ff]">{x}</button>)}<Button ghost>更多筛选</Button></Card><div className="grid grid-cols-2 gap-3">{shown.map(j=><Card key={j.title} onClick={()=>setSelected(j)} className={cx("overflow-hidden p-0",selected?.title===j.title&&"border-[#8177ff] ring-2 ring-[#eeecff]")}><div className="relative h-28"><Image src={`/assets/${j.image}`} alt={j.title} fill className="object-cover"/><span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold text-emerald-600">{j.match}% 匹配</span><span className="absolute right-3 top-3 rounded-lg bg-[#171a2d]/60 px-2 py-1 text-[9px] text-white">{j.fresh}</span></div><div className="p-4"><div className="flex justify-between"><div><b className="text-sm">{j.title}</b><p className="mt-1 text-[9px] text-[#8b91aa]">{j.company} · {j.city} · {j.salary}</p></div><button onClick={e=>{e.stopPropagation();setSaved(v=>v.includes(j.title)?v.filter(x=>x!==j.title):[...v,j.title])}}><Star size={17} className={saved.includes(j.title)?"fill-amber-400 text-amber-400":"text-[#a5abc0]"}/></button></div><div className="my-3 flex gap-1">{j.tags.map(t=><Pill key={t}>{t}</Pill>)}</div><div className="flex gap-2"><Button ghost className="flex-1" onClick={()=>go("jd")}>生成求职方案</Button><Button className="flex-1" onClick={()=>{toast("已加入待确认投递");go("applications")}}>准备投递</Button></div></div></Card>)}</div></div><aside className="space-y-3"><Card><Title>今日雷达概览</Title><div className="grid grid-cols-2 gap-2">{[["新增岗位","36"],["高匹配","12"],["已收藏",`${saved.length}`],["待确认","4"]].map(x=><div className="rounded-xl bg-[#fafaff] p-3" key={x[0]}><small className="text-[9px] text-[#8a91aa]">{x[0]}</small><b className="block text-2xl">{x[1]}</b></div>)}</div></Card><Card><Title>推荐偏好</Title>{["上海 / 杭州","产品经理 / 产品策划","15K - 25K","互联网 / AI 应用","校招 / 应届生"].map(x=><p key={x} className="mb-2 rounded-xl bg-[#fafaff] p-3 text-[10px]">✓ {x}</p>)}<Button ghost className="w-full" onClick={()=>toast("推荐偏好已打开")}>调整推荐偏好</Button></Card><Card><Title>自动化边界</Title><p className="text-[10px] leading-6 text-[#737b96]">系统自动发现岗位、准备对应材料并提醒你确认；只有得到你的确认，才会进入投递流程。</p></Card></aside></div>;
}

function Applications({ toast }: { toast:(s:string)=>void }) {
  const [stage,setStage]=useState("待确认"); const [modal,setModal]=useState(false); const [sent,setSent]=useState<string[]>([]);
  const rows=[jobs[0],jobs[1],jobs[2]];
  return <div className="space-y-3"><div className="flex items-end justify-between"><div><Pill>智能投递中心</Pill><h1 className="mt-2 text-[27px] font-bold">材料自动准备，关键动作由你确认</h1><p className="text-xs text-[#7e859e]">管理不同岗位版本、投递进度与面试提醒。</p></div><Button onClick={()=>setModal(true)}><Send size={14}/>批量确认投递</Button></div><div className="grid grid-cols-5 gap-3">{[["待确认","4",FileSearch],["已投递","12",Send],["有进展","5",Activity],["面试中","3",MessageCircle],["Offer","1",Trophy]].map(([x,n,I])=>{const Icon=I as typeof Send; return <Card onClick={()=>setStage(x as string)} key={x as string} className={cx(stage===x&&"border-[#8177ff] bg-[#faf9ff]")}><Icon size={18} className="text-[#6257ed]"/><b className="mt-3 block text-2xl">{n as string}</b><small className="text-[9px] text-[#8a91aa]">{x as string}</small></Card>})}</div><div className="grid grid-cols-[1fr_300px] gap-3"><Card><Title action={<span className="text-[10px] text-[#8a91aa]">{stage} · 需确认材料与岗位信息</span>}>{stage}列表</Title>{rows.map(j=><div key={j.title} className="mb-3 grid grid-cols-[1.3fr_.8fr_.8fr_1fr_auto] items-center gap-3 rounded-xl border border-[#e9eaf3] p-3"><div className="flex items-center gap-3"><div className="relative size-12 overflow-hidden rounded-xl"><Image src={`/assets/${j.image}`} alt={j.title} fill className="object-cover"/></div><div><b className="block text-[11px]">{j.title}</b><small className="text-[9px] text-[#8b91aa]">{j.company} · {j.city}</small></div></div><div><small className="text-[9px] text-[#8b91aa]">岗位匹配</small><b className="block text-sm text-emerald-500">{j.match}%</b></div><div><small className="text-[9px] text-[#8b91aa]">材料状态</small><Pill green>已准备</Pill></div><div><small className="text-[9px] text-[#8b91aa]">使用版本</small><b className="block text-[10px]">AI 产品经理 · V3</b></div>{sent.includes(j.title)?<Pill green>已确认投递</Pill>:<Button onClick={()=>{setSent(v=>[...v,j.title]);toast(`已确认投递：${j.company}`)}}>确认投递</Button>}</div>)}</Card><aside className="space-y-3"><Card><Title>投递漏斗</Title>{[["已准备",20,100],["已确认投递",12,60],["获得沟通",5,25],["进入面试",3,15],["获得 Offer",1,5]].map(x=><div className="mb-3" key={x[0] as string}><div className="mb-1 flex justify-between text-[9px]"><span>{x[0]}</span><b>{x[1]}</b></div><Progress value={x[2] as number} green={x[0]==="获得 Offer"}/></div>)}</Card><Card><Title>下一步提醒</Title>{["今天 18:00 前确认 4 份材料","明天 10:30 星河智能一面","本周复盘岗位反馈并更新偏好"].map(x=><p className="mb-2 rounded-xl bg-[#fafaff] p-3 text-[9px]" key={x}><Clock3 className="mr-2 inline text-[#6257ed]" size={12}/>{x}</p>)}</Card></aside></div><AnimatePresence>{modal&&<Modal close={()=>setModal(false)} title="批量确认投递"><p className="text-xs leading-6 text-[#69728e]">系统已为 4 个高匹配岗位准备对应简历与求职说明。确认后将记录为待投递任务，并在每一步提醒你。</p><div className="mt-4 space-y-2">{jobs.map(j=><div className="flex items-center justify-between rounded-xl bg-[#fafaff] p-3" key={j.title}><span className="text-[10px]"><b className="block">{j.title}</b>{j.company} · {j.match}% 匹配</span><Check size={15} className="text-emerald-500"/></div>)}</div><Button className="mt-4 w-full" onClick={()=>{setModal(false);setSent(jobs.map(j=>j.title));toast("已确认 4 份投递任务")}}>确认并创建投递任务</Button></Modal>}</AnimatePresence></div>;
}

function MissionPage({ go, toast }:{go:(p:PageId)=>void;toast:(s:string)=>void}) {
  const [done,setDone]=useState([true,true,false]); return <div className="space-y-3"><Card className="relative min-h-[230px] overflow-hidden bg-[radial-gradient(circle_at_78%_45%,#e8e5ff,transparent_34%)]"><Pill>由星河智能 AI 产品经理 JD 定制</Pill><h1 className="mt-4 text-[27px] font-bold">设计 AI 求职助手增长方案</h1><p className="mt-2 max-w-[620px] text-xs leading-6 text-[#737b96]">证明你具备 AI 产品理解、用户洞察、方案设计与数据驱动能力。完成后将自动提取为岗位版简历证据。</p><div className="mt-6 flex gap-2"><Pill>AI 应用</Pill><Pill>增长实验</Pill><Pill>数据分析</Pill></div><div className="absolute bottom-[-40px] right-8 h-[270px] w-[280px]"><Image src="/assets/avatar-student-tablet.png" alt="数字分身" fill className="object-contain"/></div></Card><div className="grid grid-cols-[260px_1fr_300px] gap-3"><Card><Title>任务清单</Title>{["用户痛点与场景洞察","AI 求职助手 MVP 设计","增长指标与实验方案"].map((x,i)=><button key={x} onClick={()=>setDone(v=>v.map((a,j)=>j===i?!a:a))} className={cx("mb-2 flex w-full gap-2 rounded-xl p-3 text-left text-[10px]",done[i]?"bg-emerald-50":"bg-[#fafaff]")}><span className={cx("grid size-5 place-items-center rounded-full",done[i]?"bg-emerald-500 text-white":"border border-[#dfe1ec]")}>{done[i]&&<Check size={11}/>}</span>{x}</button>)}<div className="mt-4"><Progress value={done.filter(Boolean).length/3*100}/></div></Card><Card><Title>当前任务：增长指标与实验方案</Title><textarea className="min-h-[280px] w-full resize-none rounded-xl border border-[#e3e5ef] bg-[#fcfcff] p-4 text-xs leading-6 outline-none focus:border-[#8177ff]" defaultValue="核心目标：提升首次使用后的简历生成完成率。&#10;&#10;实验假设：在首次进入时展示与目标岗位强相关的简历示例，可以降低用户理解成本并提升完成率。"/><div className="mt-3 flex justify-between"><Button ghost onClick={()=>toast("已保存草稿")}>保存草稿</Button><Button onClick={()=>toast("AI 已完成评估，综合评分 94")}>提交 AI 评估</Button></div></Card><aside className="space-y-3"><Card><Title>岗位能力评分</Title><div className="text-center"><b className="text-5xl text-emerald-500">94</b><p className="text-[10px] text-[#8a91aa]">高度符合目标岗位要求</p></div><RadarGraph/><Button ghost className="w-full" onClick={()=>go("customResume")}>提取到定制简历</Button></Card><Card><Title>完成后获得</Title>{["岗位版项目经历 1 条","可验证作品卡 1 张","AI 产品能力 +16","面试故事素材 2 条"].map(x=><p className="mb-2 text-[9px]" key={x}>✓ {x}</p>)}</Card></aside></div></div>;
}

function ResumePage({ toast }:{toast:(s:string)=>void}) {
  const [optimized,setOptimized]=useState(false); return <div className="space-y-3"><div className="flex items-end justify-between"><div><Pill>岗位版简历</Pill><h1 className="mt-2 text-[27px] font-bold">AI 产品经理 · 星河智能</h1><p className="text-xs text-[#7e859e]">此版本仅围绕当前 JD 重组经历、关键词和成果表达。</p></div><Button onClick={()=>{setOptimized(true);toast("已根据 JD 完成一轮优化")}}><WandSparkles size={14}/>一键优化</Button></div><div className="grid grid-cols-[1fr_390px] gap-3"><div className="space-y-3"><Card><Title>JD 匹配策略</Title><div className="grid grid-cols-4 gap-2">{[["匹配度",optimized?"94%":"89%"],["关键词覆盖",optimized?"16 / 16":"12 / 16"],["经历证据","4 条"],["待优化项",optimized?"0 项":"3 项"]].map(x=><div className="rounded-xl bg-[#fafaff] p-3" key={x[0]}><small className="text-[9px] text-[#8a91aa]">{x[0]}</small><b className="block text-xl">{x[1]}</b></div>)}</div></Card><Card><Title>岗位版内容编辑</Title>{[["求职摘要","具备 AI 产品方案设计与用户增长实践，能够从洞察到验证推进产品落地。","已匹配"],["项目经历 · AI 求职助手","完成 20+ 用户访谈，设计 MVP 与增长实验，核心流程完成率提升 18%。","核心证据"],["项目经历 · 校园交易平台","通过用户研究与数据分析优化发布流程，发布转化提升 24%。","辅助证据"],["技能关键词","用户研究 · PRD · 数据分析 · AI 应用 · A/B 测试","已覆盖"]].map(x=><div className="mb-2 rounded-xl border border-[#e9eaf3] p-3" key={x[0]}><div className="flex justify-between"><b className="text-[10px]">{x[0]}</b><Pill green>{x[2]}</Pill></div><p className="mt-2 text-[9px] leading-5 text-[#68718c]">{x[1]}</p><button onClick={()=>toast(`已打开编辑：${x[0]}`)} className="mt-2 text-[9px] font-semibold text-[#6257ed]">编辑表达</button></div>)}</Card></div><aside className="space-y-3"><Card><Title>岗位版简历预览</Title><div className="min-h-[510px] rounded-xl border border-[#e3e5ef] p-6 text-[8px] leading-5"><h2 className="text-lg font-bold">林同学</h2><b>AI 产品经理</b><p>上海 · 138****8888 · lintongxue@email.com</p><hr className="my-3"/><b>职业摘要</b><p>具备 AI 产品方案设计与用户增长实践，能够从用户洞察、方案设计到数据验证推动产品落地。</p><b className="mt-3 block">核心项目：AI 求职助手增长方案</b><p>完成 20+ 用户访谈并识别关键流失节点，设计 MVP 与增长实验，核心流程完成率提升 18%。</p><b className="mt-3 block">项目：校园二手交易平台</b><p>通过用户研究和漏斗分析优化发布流程，发布转化提升 24%。</p><b className="mt-3 block">核心技能</b><p>用户研究 / PRD / 数据分析 / AI 应用 / A/B 测试 / 项目推进</p></div></Card><div className="grid grid-cols-2 gap-2"><Button ghost onClick={()=>toast("已生成 PDF")}>导出 PDF</Button><Button onClick={()=>toast("已保存为投递版本")}>用于投递</Button></div></aside></div></div>;
}

function Modal({children,close,title}:{children:ReactNode;close:()=>void;title:string}) { return <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 grid place-items-center bg-[#171a2d]/40 p-6 backdrop-blur-sm" onClick={close}><motion.div initial={{scale:.96,y:15}} animate={{scale:1,y:0}} onClick={e=>e.stopPropagation()} className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-4 flex justify-between"><h2 className="font-bold">{title}</h2><button onClick={close}><X size={18}/></button></div>{children}</motion.div></motion.div> }

function IntegratedApp({ initialPage }: { initialPage: PageId }) {
  const [page,setPage]=useState<PageId>(initialPage); const [message,setMessage]=useState(""); const [,setGrowth]=useState(120);
  const toast=(s:string)=>{setMessage(s);window.setTimeout(()=>setMessage(""),2200)};
  const goV2=(p:V2PageId)=>setPage(p);
  const legacy=(node:ReactNode)=><div className="v2-scope">{node}</div>;
  const content:Record<PageId,ReactNode>={
    home:<HomePage go={setPage}/>, jd:<JDWorkspace go={setPage} toast={toast}/>,
    radar:<JobRadarPage go={setPage} toast={toast}/>, applications:<Applications toast={toast}/>,
    customMission:<MissionPage go={setPage} toast={toast}/>, customResume:<ResumePage toast={toast}/>,
    dashboard:legacy(<V2Dashboard go={goV2}/>), avatar:legacy(<V2AvatarPage go={goV2}/>),
    recommend:legacy(<V2Recommend go={goV2}/>), skill:legacy(<V2SkillPage go={goV2} toast={toast}/>),
    mission:legacy(<V2Mission go={goV2} grow={()=>setGrowth(x=>x+120)} toast={toast}/>),
    review:legacy(<V2Review go={goV2}/>), portfolio:legacy(<V2Portfolio toast={toast}/>),
    learning:legacy(<V2Learning toast={toast}/>), resume:legacy(<V2Resume toast={toast}/>),
    interview:legacy(<V2Interview toast={toast}/>), settings:legacy(<V2SettingsPage toast={toast}/>),
  };
  return <div className="min-h-screen bg-[#f7f8fc] text-[#171a2d]"><Sidebar page={page} go={setPage}/><Topbar go={setPage}/><motion.main key={page} initial={{opacity:0,y:7}} animate={{opacity:1,y:0}} className="ml-[240px] min-h-screen pt-[66px]"><div className="mx-auto max-w-[1680px] p-4">{content[page]}</div></motion.main><AnimatePresence>{message&&<motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#171a2d] px-4 py-3 text-xs text-white shadow-2xl"><Check size={14} className="text-emerald-400"/>{message}</motion.div>}</AnimatePresence></div>;
}

export function V3App() {
  return <IntegratedApp initialPage="home" />;
}

export function V4App() {
  return <IntegratedApp initialPage="dashboard" />;
}
