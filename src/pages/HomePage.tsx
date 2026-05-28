import { ArrowRight, Compass, Sparkles, Target, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import Tag from "../components/Tag";
import { jobs } from "../data/jobs";

const flow = [
  { title: "职业画像", text: "通过兴趣、能力与价值观测评，生成你的专属职业画像", icon: Users, color: "blue" },
  { title: "副本推荐", text: "AI 为你推荐高匹配度职业副本，选择想体验的岗位方向", icon: Sparkles, color: "mint" },
  { title: "岗位任务", text: "沉浸式完成真实任务，感受岗位日常与工作挑战", icon: Target, color: "purple" },
  { title: "成长报告", text: "获得能力评估、学习路径与简历优化建议，持续成长", icon: Compass, color: "blue" }
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-12">
        <section className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-bold text-primary">
              大学生专属 · 职业探索与成长平台
            </span>
            <h1 className="mt-8 max-w-3xl text-5xl font-black leading-tight tracking-tight text-ink md:text-6xl">
              投递前，
              <br />
              先试玩你的<span className="text-gradient">未来工作</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-600">
              通过 AI 帮你发现适合的职业方向，体验典型岗位任务，最终获得学习路径与简历建议。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate("/profile")}>
                <Compass size={20} /> 我还很迷茫
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate("/profile")}>
                <Target size={20} /> 我已有目标岗位
              </Button>
            </div>
            <p className="mt-8 text-sm font-semibold text-slate-500">
              <span className="font-black text-primary">10,234+</span> 名同学已在职前副本 AI 中探索未来
            </p>
          </div>

          <Card className="relative overflow-hidden p-7">
            <div className="soft-grid absolute inset-0 opacity-70" />
            <div className="relative grid min-h-[430px] place-items-center">
              <div className="grid h-64 w-64 place-items-center rounded-full bg-gradient-to-br from-blue-100 via-white to-emerald-100 shadow-soft">
                <div className="grid h-44 w-44 place-items-center rounded-full bg-white shadow-card">
                  <div className="text-center">
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-primary text-white shadow-lg shadow-blue-200">
                      <Sparkles size={36} />
                    </div>
                    <p className="mt-4 text-lg font-black text-ink">AI 职业副本</p>
                    <p className="mt-1 text-sm text-slate-500">先体验，再投递</p>
                  </div>
                </div>
              </div>
              <div className="absolute left-3 top-8 w-52 rounded-3xl border border-blue-100 bg-white p-4 shadow-card">
                <p className="font-black text-ink">AI 产品经理</p>
                <p className="mt-2 text-sm text-slate-500">匹配度 92%</p>
                <ProgressBar value={92} />
              </div>
              <div className="absolute right-0 top-24 w-52 rounded-3xl border border-emerald-100 bg-white p-4 shadow-card">
                <p className="font-black text-ink">新媒体运营</p>
                <p className="mt-2 text-sm text-slate-500">匹配度 88%</p>
                <ProgressBar value={88} color="mint" />
              </div>
              <div className="absolute bottom-9 left-10 w-52 rounded-3xl border border-violet-100 bg-white p-4 shadow-card">
                <p className="font-black text-ink">数据分析师</p>
                <p className="mt-2 text-sm text-slate-500">匹配度 86%</p>
                <ProgressBar value={86} color="purple" />
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-12 rounded-3xl border border-blue-100 bg-white p-8 shadow-card">
          <h2 className="text-2xl font-black text-ink">四步开启你的职业探索之旅</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-4">
            {flow.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/60 p-5">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-blue-50 px-3 py-2 text-sm font-black text-primary">0{index + 1}</span>
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-blue-100 bg-white p-8 shadow-card">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-ink">热门职业副本推荐</h2>
              <p className="mt-2 text-sm text-slate-500">真实岗位任务体验，提前了解你的未来选择</p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/recommendations")}>
              查看全部副本 <ArrowRight size={16} />
            </Button>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {jobs.map((job, index) => (
              <div key={job.jobId} onClick={() => navigate(`/task/${job.jobId}`)} className="cursor-pointer">
                <JobCard job={job} index={index} compact />
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Tag key={tag} color={job.color}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
