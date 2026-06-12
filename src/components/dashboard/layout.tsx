"use client";
import {
  Award, BookOpen, BriefcaseBusiness, CalendarDays, CircleUserRound, ClipboardCheck,
  FileText, FolderKanban, Home, Map, MessageCircle, Settings, Sparkles, Star,
  TrendingUp, Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { PageId } from "./types";

const nav: Array<{ id: PageId; label: string; icon: typeof Home }> = [
  { id: "dashboard", label: "首页", icon: Home }, { id: "avatar", label: "我的分身", icon: CircleUserRound },
  { id: "recommend", label: "推荐试岗", icon: BriefcaseBusiness }, { id: "skill", label: "能力成长", icon: TrendingUp },
  { id: "mission", label: "副本挑战", icon: Star }, { id: "review", label: "成长复盘", icon: ClipboardCheck },
  { id: "portfolio", label: "作品集", icon: FolderKanban }, { id: "learning", label: "学习中心", icon: BookOpen },
  { id: "resume", label: "简历中心", icon: FileText }, { id: "interview", label: "面试训练", icon: MessageCircle },
  { id: "settings", label: "设置", icon: Settings },
];

const titles: Record<PageId, [string, string]> = {
  dashboard: ["首页", "把今天的行动，变成明天的职业竞争力"], avatar: ["我的分身", "你的 AI 职业数字分身"],
  recommend: ["推荐试岗", "先体验真实工作，再决定投入方向"], skill: ["能力成长", "围绕目标岗位构建能力体系"],
  mission: ["副本挑战", "在真实场景中完成职业任务"], review: ["成长复盘", "把经验沉淀为下一步行动"],
  portfolio: ["作品集", "展示你的实战项目成果"], learning: ["学习中心", "个性化学习路径与练习"],
  resume: ["简历中心", "把能力证据写进目标岗位简历"], interview: ["面试训练", "与 AI 面试官模拟真实场景"],
  settings: ["设置", "管理账号、目标与 AI 个性化偏好"],
};

function AvatarPlaceholder({ small = false, variant = "student" }: { small?: boolean; variant?: "student" | "interviewer" }) {
  const src = small
    ? "/assets/avatar-student-profile.png"
    : variant === "interviewer"
      ? "/assets/avatar-interviewer-suit.png"
      : "/assets/avatar-student-tablet.png";
  return <div className={cn("relative shrink-0 overflow-hidden", small ? "size-10 rounded-full ring-2 ring-white shadow-md" : "h-56 w-72")}>
    <Image src={src} alt={variant === "interviewer" ? "AI 面试官" : "林同学的职业数字分身"} fill sizes={small ? "40px" : "288px"} className="object-contain" priority={!small}/>
  </div>;
}

export function Sidebar({ page, onNavigate }: { page: PageId; onNavigate: (page: PageId) => void }) {
  return <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-slate-200/80 bg-white/95 p-4 backdrop-blur-xl">
    <div className="mb-5 flex items-center gap-3 px-2"><div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-400 text-white shadow-lg shadow-violet-200"><Sparkles size={20}/></div><div><strong className="block text-lg">职前副本 AI</strong><span className="text-[10px] text-slate-400">先试岗，再成长，拿证据证明自己</span></div></div>
    <nav className="space-y-1 overflow-auto">{nav.map(item => <button key={item.id} onClick={() => onNavigate(item.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-500 transition hover:translate-x-1 hover:bg-violet-50 hover:text-violet-600", page === item.id && "bg-violet-50 font-semibold text-violet-600")}><item.icon size={17}/>{item.label}</button>)}</nav>
    <div className="mt-auto space-y-3"><div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex items-center gap-2"><AvatarPlaceholder small/><div><strong className="block text-sm">林同学</strong><span className="text-[10px] text-slate-400">Lv.4 成长探索者</span></div></div><div className="mt-3 flex justify-between text-[10px] text-slate-400"><span>经验值 1280 / 2000</span><span>64%</span></div><Progress value={64} className="mt-1.5"/></div>
    <div className="rounded-2xl border border-slate-200 bg-white p-3"><div className="flex justify-around text-amber-500"><Trophy/><Award/><Star/></div><p className="mt-2 text-[10px] text-slate-400">已获得 3 枚核心徽章</p></div></div>
  </aside>;
}

export function Topbar({ page, growth, onMap }: { page: PageId; growth: number; onMap: () => void }) {
  const [title, sub] = titles[page];
  return <header className="fixed left-60 right-0 top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/70 bg-white/80 px-7 backdrop-blur-xl"><div><h1 className="text-xl font-bold">{title}</h1><p className="mt-1 text-xs text-slate-400">{sub}</p></div><div className="flex items-center gap-4"><div className="text-xs"><span className="block text-slate-400">今日成长值</span><b>{growth}</b></div><div className="text-xs"><span className="block text-slate-400">成长记录</span><b>8</b></div><Button onClick={onMap}><Map size={16}/>查看成长地图</Button><button className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-violet-600"><CalendarDays size={17}/></button></div></header>;
}

export function Layout({ page, growth, onNavigate, onMap, children }: { page: PageId; growth: number; onNavigate: (p: PageId) => void; onMap: () => void; children: ReactNode }) {
  return <div className="min-h-screen bg-[radial-gradient(circle_at_55%_0%,#eef0ff_0%,transparent_35%)] bg-slate-50"><Sidebar page={page} onNavigate={onNavigate}/><Topbar page={page} growth={growth} onMap={onMap}/><motion.main key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="ml-60 min-h-screen pt-20"><div className="mx-auto max-w-[1680px] space-y-4 p-5">{children}</div></motion.main></div>;
}

export { AvatarPlaceholder };
