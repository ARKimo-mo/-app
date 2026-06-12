"use client";
import { Check, Map, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Layout } from "@/components/dashboard/layout";
import type { PageId } from "@/components/dashboard/types";
import {
  AvatarPage, DashboardPage, InterviewPage, LearningPage, MissionPage, PortfolioPage,
  RecommendPage, ResumePage, ReviewPage, SettingsPage, SkillGrowthPage,
} from "@/components/dashboard/pages";

export default function Home() {
  const [page, setPage] = useState<PageId>("dashboard");
  const [growth, setGrowth] = useState(120);
  const [toast, setToast] = useState("");
  const [mapOpen, setMapOpen] = useState(false);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };
  const actions = {
    navigate: setPage,
    notify,
    addGrowth: (value: number) => setGrowth(current => current + value),
  };

  const pages: Record<PageId, React.ReactNode> = {
    dashboard: <DashboardPage {...actions}/>, avatar: <AvatarPage {...actions}/>,
    recommend: <RecommendPage {...actions}/>, skill: <SkillGrowthPage {...actions}/>,
    mission: <MissionPage {...actions}/>, review: <ReviewPage {...actions}/>,
    portfolio: <PortfolioPage {...actions}/>, learning: <LearningPage {...actions}/>,
    resume: <ResumePage {...actions}/>, interview: <InterviewPage {...actions}/>,
    settings: <SettingsPage {...actions}/>,
  };

  return <><Layout page={page} growth={growth} onNavigate={setPage} onMap={()=>setMapOpen(true)}>{pages[page]}</Layout>
    <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs text-white shadow-2xl"><Check size={15} className="text-emerald-400"/>{toast}</motion.div>}</AnimatePresence>
    <Dialog open={mapOpen} onOpenChange={setMapOpen} title="我的成长地图"><div className="mb-5 flex items-center gap-3 rounded-2xl bg-violet-50 p-4"><div className="rounded-xl bg-violet-600 p-3 text-white"><Map/></div><div><b>当前位于：项目实践阶段</b><p className="text-xs text-slate-400">继续完成副本与学习任务，解锁求职冲刺阶段。</p></div></div><div className="grid grid-cols-5 gap-3">{["自我探索","能力筑基","项目实践","求职冲刺","职场进阶"].map((x,i)=><button key={x} onClick={()=>notify(`已查看：${x}`)} className={`rounded-2xl border p-4 text-center ${i===2?"border-violet-300 bg-violet-50":"border-slate-100"}`}><span className={`mx-auto grid size-8 place-items-center rounded-full ${i<3?"bg-violet-600 text-white":"bg-slate-100 text-slate-400"}`}>{i<2?<Check size={14}/>:i+1}</span><b className="mt-3 block text-xs">{x}</b><small className="text-[9px] text-slate-400">{i<2?"已完成":i===2?"进行中":"待解锁"}</small></button>)}</div><div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500"><Sparkles size={15} className="text-violet-600"/>完成当前阶段全部能力目标，可解锁高阶职业挑战。</div></Dialog>
  </>;
}
