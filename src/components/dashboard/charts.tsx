"use client";
import {
  Area, AreaChart, CartesianGrid, Legend, Line, LineChart, PolarAngleAxis, PolarGrid,
  Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { growthTrend, radarData } from "@/lib/mock-data";
import { Card, CardHeader } from "@/components/ui/card";

export function RadarChartCard({ title = "能力成长雷达图", compact = false }: { title?: string; compact?: boolean }) {
  return <Card className={compact ? "p-3" : ""}><CardHeader title={title}/><div className={compact ? "h-48 min-w-0" : "h-64 min-w-0"}><ResponsiveContainer width="100%" height="100%" minWidth={0}><RadarChart data={radarData}><PolarGrid stroke="#e5e7f3"/><PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }}/><Radar name="当前能力" dataKey="current" stroke="#6257ee" fill="#6257ee" fillOpacity={.35}/><Radar name="上次评估" dataKey="previous" stroke="#94a3b8" fill="#94a3b8" fillOpacity={.12}/><Legend wrapperStyle={{ fontSize: 10 }}/></RadarChart></ResponsiveContainer></div></Card>;
}

export function GrowthTrendChart() {
  return <Card><CardHeader title="能力提升趋势"/><div className="h-56 min-w-0"><ResponsiveContainer width="100%" height="100%" minWidth={0}><AreaChart data={growthTrend}><defs><linearGradient id="score" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6257ee" stopOpacity={.35}/><stop offset="95%" stopColor="#6257ee" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#eef0f6"/><XAxis dataKey="date" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip/><Area type="monotone" dataKey="score" stroke="#6257ee" strokeWidth={2} fill="url(#score)"/></AreaChart></ResponsiveContainer></div></Card>;
}

export function MiniLineChart() {
  return <div className="h-32 min-w-0"><ResponsiveContainer width="100%" height="100%" minWidth={0}><LineChart data={growthTrend}><Line type="monotone" dataKey="score" stroke="#6257ee" strokeWidth={2} dot={false}/><XAxis dataKey="date" hide/><YAxis hide/><Tooltip/></LineChart></ResponsiveContainer></div>;
}
