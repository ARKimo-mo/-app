import { BarChart3, BrainCircuit, CheckCircle2, Sparkles, Target, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import Tag from "../components/Tag";
import { jobs } from "../data/jobs";
import { mockCareerProfile } from "../data/mockUser";
import { recommendJobs } from "../services/aiService";
import type { Job } from "../types";

const steps = ["职业画像", "副本推荐", "岗位任务", "成长报告"].map((label) => ({ label }));

export default function RecommendationPage() {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>(jobs);

  useEffect(() => {
    recommendJobs(mockCareerProfile).then(setRecommendedJobs);
  }, []);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <Stepper steps={steps} current={1} className="mx-auto max-w-3xl" />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-ink">
              你的职业画像<span className="text-gradient">已生成</span>
            </h1>
            <p className="mt-3 text-slate-600">基于你的兴趣、经历与偏好，AI 为你推荐更适合探索的职业副本。</p>
          </div>
          <Button variant="secondary">重新测评</Button>
        </div>

        <Card className="mt-7 p-7">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr_1fr_1.1fr]">
            <section className="border-blue-100 lg:border-r lg:pr-6">
              <div className="flex items-center gap-5">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 text-4xl">你</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-ink">{mockCareerProfile.name}</h2>
                    <Tag>大学生</Tag>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    专业：{mockCareerProfile.major}
                    <br />
                    年级：{mockCareerProfile.grade}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {mockCareerProfile.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </section>

            <ProfileList icon={<BrainCircuit />} title="职业关键词" items={mockCareerProfile.keywords} color="blue" />
            <ProfileList icon={<CheckCircle2 />} title="优势能力" items={mockCareerProfile.strengths} color="mint" />
            <ProfileList icon={<Target />} title="待提升 / 适合环境" items={[...mockCareerProfile.improvements, ...mockCareerProfile.environment]} color="purple" />
          </div>
        </Card>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
          <section>
            <h2 className="text-2xl font-black text-ink">为你推荐的职业副本</h2>
            <p className="mt-2 text-sm text-slate-500">匹配度越高，越值得优先体验</p>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {recommendedJobs.map((job, index) => (
                <JobCard key={job.jobId} job={job} index={index} />
              ))}
            </div>
          </section>

          <aside>
            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-black text-ink">
                <Sparkles className="text-primary" /> 为什么推荐你
              </h3>
              <div className="mt-5 space-y-4">
                {[
                  { icon: Target, title: "兴趣与特长匹配", text: "基于你的兴趣、特长与职业偏好，选择最契合的方向。" },
                  { icon: UsersRound, title: "能力与岗位契合", text: "结合你的能力优势与岗位需求，匹配度更高。" },
                  { icon: BarChart3, title: "发展潜力可期", text: "综合成长潜力与行业趋势，助你探索更具前景的路径。" }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-3xl border border-blue-100 bg-white p-4">
                      <Icon className="text-primary" size={24} />
                      <p className="mt-3 font-black text-ink">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ProfileList({ icon, title, items, color }: { icon: React.ReactNode; title: string; items: string[]; color: "blue" | "mint" | "purple" }) {
  return (
    <section className="border-blue-100 lg:border-r lg:px-4 last:border-r-0">
      <h3 className="flex items-center gap-2 text-lg font-black text-ink">
        <span className={color === "mint" ? "text-emerald-500" : color === "purple" ? "text-violet-500" : "text-primary"}>{icon}</span>
        {title}
      </h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <p key={item} className="flex gap-2 text-sm leading-6 text-slate-600">
            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${color === "mint" ? "bg-mint" : color === "purple" ? "bg-lavender" : "bg-primary"}`} />
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
