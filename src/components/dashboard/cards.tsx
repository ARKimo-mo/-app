"use client";
import { Calendar, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, note, icon }: { label: string; value: string; note?: string; icon?: ReactNode }) {
  return <Card className="min-h-24"><div className="flex items-start justify-between"><div><span className="text-xs text-slate-400">{label}</span><strong className="mt-2 block text-2xl font-bold text-slate-900">{value}</strong>{note && <small className="text-[10px] text-slate-400">{note}</small>}</div>{icon && <div className="rounded-xl bg-violet-50 p-2 text-violet-600">{icon}</div>}</div></Card>;
}

export function ProgressCard({ title, note, value }: { title: string; note: string; value: number }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="flex justify-between"><div><strong className="block text-xs">{title}</strong><span className="text-[10px] text-slate-400">{note}</span></div><b className="text-xs text-violet-600">{value}%</b></div><Progress value={value} className="mt-2"/></div>;
}

export function JobCard({ job, onEnter }: { job: { title: string; match: number; interest: number; pressure: number; difficulty: number; tags: string[] }; onEnter: () => void }) {
  const covers: Record<string, string> = {
    "产品经理助理": "/assets/job-product-manager.png",
    "前端开发工程师": "/assets/job-frontend-engineer.png",
    "数据分析师": "/assets/job-data-analyst.png",
    "内容运营专员": "/assets/job-content-operations.png",
    "UI 设计师助理": "/assets/job-ui-designer.png",
    "市场专员": "/assets/job-market-specialist.png",
  };
  return <Card className="overflow-hidden p-0 transition duration-200 hover:-translate-y-1 hover:shadow-lg"><div className="relative h-32 overflow-hidden bg-violet-100"><Image src={covers[job.title]} alt={`${job.title}试岗场景`} fill sizes="320px" className="object-cover"/><span className="absolute left-3 top-3 rounded-full bg-violet-600/90 px-2 py-1 text-[10px] text-white shadow">{job.match >= 90 ? "高匹配" : job.match >= 80 ? "较高匹配" : "潜力匹配"}</span></div><div className="space-y-3 p-4"><div className="flex items-start justify-between"><div><h3 className="font-semibold">{job.title}</h3><span className="text-[10px] text-slate-400">互联网 · 职业试岗</span></div><b className="text-xl text-emerald-500">{job.match}%</b></div><div className="grid grid-cols-3 gap-2 text-center text-[10px]"><div className="rounded-lg bg-slate-50 p-2"><span className="block text-slate-400">兴趣值</span><b>{job.interest}</b></div><div className="rounded-lg bg-slate-50 p-2"><span className="block text-slate-400">压力值</span><b>{job.pressure}</b></div><div className="rounded-lg bg-slate-50 p-2"><span className="block text-slate-400">副本难度</span><b>{"★".repeat(job.difficulty)}</b></div></div><div className="flex flex-wrap gap-1">{job.tags.map(tag => <span key={tag} className="rounded-md bg-violet-50 px-2 py-1 text-[9px] text-violet-600">{tag}</span>)}</div><Button className="w-full" onClick={onEnter}>进入副本<ChevronRight size={14}/></Button></div></Card>;
}

export function MissionCard({ index, title, status, done, onToggle }: { index: number; title: string; status: string; done: boolean; onToggle: () => void }) {
  return <button onClick={onToggle} className={cn("flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left transition hover:bg-violet-50", done && "opacity-65")}><span className={cn("grid size-7 place-items-center rounded-lg bg-violet-100 text-xs font-bold text-violet-600", done && "bg-emerald-100 text-emerald-600")}>{done ? "✓" : `0${index}`}</span><div className="flex-1"><strong className={cn("block text-xs", done && "line-through")}>{title}</strong><small className="text-[10px] text-slate-400">{status}</small></div><ChevronRight size={14} className="text-slate-300"/></button>;
}

export function ReviewCard({ icon, title, body, tone = "violet" }: { icon: ReactNode; title: string; body: string; tone?: "violet" | "green" | "orange" }) {
  return <div className={cn("rounded-2xl p-4", tone === "violet" && "bg-violet-50", tone === "green" && "bg-emerald-50", tone === "orange" && "bg-orange-50")}><div className="mb-2 flex items-center gap-2 text-violet-600">{icon}<strong className="text-xs text-slate-900">{title}</strong></div><p className="text-[11px] leading-5 text-slate-500">{body}</p></div>;
}

export function PortfolioCard({ project, onPreview }: { project: readonly [string, number, string, string]; onPreview: () => void }) {
  const covers: Record<string, string> = {
    "校园二手交易平台产品设计": "/assets/portfolio-campus-market.png",
    "电商用户行为分析报告": "/assets/portfolio-ecommerce-analysis.png",
    "新功能上线运营推广方案": "/assets/portfolio-feature-launch.png",
    "大学生品牌传播策略方案": "/assets/portfolio-brand-strategy.png",
    "在线学习平台竞品分析": "/assets/portfolio-learning-competitor.png",
    "用户留存与活跃度分析": "/assets/portfolio-retention-analysis.png",
    "社群活动策划执行复盘": "/assets/portfolio-community-review.png",
    "新品上市整合营销方案": "/assets/portfolio-integrated-marketing.png",
  };
  return <Card className="grid grid-cols-[150px_1fr] gap-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"><button onClick={onPreview} className="relative h-24 overflow-hidden rounded-xl bg-violet-100"><Image src={covers[project[0]]} alt={project[0]} fill sizes="150px" className="object-cover"/></button><div><div className="flex justify-between"><div><h3 className="text-sm font-semibold">{project[0]}</h3><span className="text-[10px] text-slate-400">{project[2]} · 项目实践</span></div><b className="text-xl text-emerald-500">{project[1]}</b></div><div className="my-2 flex gap-1">{["需求分析", "用户研究", "数据复盘"].map(x => <span key={x} className="rounded bg-slate-50 px-2 py-1 text-[9px] text-slate-500">{x}</span>)}</div><div className="flex items-center justify-between"><span className="flex items-center gap-1 text-[9px] text-slate-400"><Calendar size={11}/>{project[3]}</span><Button variant="outline" size="sm" onClick={onPreview}>快速预览</Button></div></div></Card>;
}

export function ResumeSection({ icon, title, note, status, onEdit }: { icon: ReactNode; title: string; note: string; status: "已完善" | "建议优化"; onEdit: () => void }) {
  return <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><div className="rounded-lg bg-violet-50 p-2 text-violet-600">{icon}</div><div className="flex-1"><strong className="block text-xs">{title}</strong><span className="text-[10px] text-slate-400">{note}</span></div><span className={cn("rounded-full px-2 py-1 text-[9px]", status === "已完善" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-500")}>{status}</span><Button size="sm" variant="outline" onClick={onEdit}>编辑</Button></div>;
}

export function InterviewPanel({ question, recording, onRecord, onNext }: { question: string; recording: boolean; onRecord: () => void; onNext: () => void }) {
  return <Card className="min-h-[430px] text-center"><span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] text-violet-600">当前问题</span><h2 className="my-7 text-2xl font-bold">{question}</h2><div className="flex h-16 items-center justify-center gap-1">{Array.from({ length: 52 }).map((_, i) => <i key={i} className={cn("w-1 rounded-full bg-violet-300 transition-all", recording && "animate-pulse bg-violet-600")} style={{ height: `${12 + (i * 17) % 38}px`, animationDelay: `${(i % 5) * 100}ms` }}/>)}</div><p className="my-4 text-xs text-slate-400">{recording ? "AI 面试官正在聆听…" : "点击开始回答"}</p><button onClick={onRecord} className="mx-auto grid size-20 place-items-center rounded-full bg-[radial-gradient(circle,#6d62ef_0_34%,#c4c0ff_35%_56%,#eceaff_57%)] shadow-xl shadow-violet-200"><span className="size-4 rounded bg-white"/></button><div className="mt-8 flex justify-end"><Button onClick={onNext}>继续下一题<ChevronRight size={14}/></Button></div></Card>;
}
