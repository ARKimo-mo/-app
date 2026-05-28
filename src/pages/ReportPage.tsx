import { ArrowLeft, Download, Home, RefreshCw, Sparkles, ThumbsUp, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AbilityChart from "../components/AbilityChart";
import Button from "../components/Button";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import ScoreCard from "../components/ScoreCard";
import Stepper from "../components/Stepper";
import Tag from "../components/Tag";
import Timeline from "../components/Timeline";
import { mockEvaluation, resumeProject } from "../data/mockReport";

const steps = ["职业画像", "副本推荐", "岗位任务", "任务完成", "成长报告"].map((label) => ({ label }));

export default function ReportPage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Stepper steps={steps} current={4} className="flex-1" />
          <Button variant="secondary">
            <Download size={18} /> 下载报告
          </Button>
        </div>

        <div className="mt-9">
          <h1 className="text-4xl font-black tracking-tight text-ink">
            你的成长报告 <span className="text-gradient">✦</span>
          </h1>
          <p className="mt-3 text-slate-600">基于本次副本表现，AI 为你生成了能力评估与下一步建议。</p>
        </div>

        <section className="mt-7 grid gap-4 lg:grid-cols-[1.25fr_repeat(5,1fr)]">
          <Card className="overflow-hidden bg-primary p-7 text-white">
            <div className="flex items-center gap-6">
              <div className="grid h-36 w-36 shrink-0 place-items-center rounded-full border-[10px] border-cyan-200 text-5xl font-black">
                {mockEvaluation.totalScore}
              </div>
              <div>
                <p className="text-xl font-black">表现优秀，继续保持！</p>
                <p className="mt-4 max-w-md text-sm leading-7 text-blue-50">{mockEvaluation.summary}</p>
              </div>
            </div>
          </Card>
          {mockEvaluation.dimensions.map((dimension) => (
            <ScoreCard key={dimension.name} dimension={dimension} />
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <Card className="p-7">
            <h2 className="text-xl font-black text-ink">能力分析</h2>
            <div className="mt-6">
              <AbilityChart dimensions={mockEvaluation.dimensions} />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-white p-7">
            <h2 className="flex items-center gap-2 text-xl font-black text-ink">
              <ThumbsUp className="text-emerald-500" /> 你的优势
            </h2>
            <div className="mt-6 space-y-4">
              {mockEvaluation.strengths.map((item) => (
                <p key={item} className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-slate-700 shadow-card">
                  {item}
                </p>
              ))}
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-violet-50 to-white p-7">
            <h2 className="flex items-center gap-2 text-xl font-black text-ink">
              <TrendingUp className="text-violet-500" /> 待提升
            </h2>
            <div className="mt-6 space-y-4">
              {mockEvaluation.improvements.map((item) => (
                <p key={item} className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-slate-700 shadow-card">
                  {item}
                </p>
              ))}
            </div>
          </Card>
        </section>

        <Card className="mt-6 p-7">
          <h2 className="flex items-center gap-2 text-xl font-black text-ink">
            4 周学习路径 <Sparkles className="text-primary" size={20} />
          </h2>
          <div className="mt-6">
            <Timeline />
          </div>
        </Card>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-7">
            <h2 className="flex items-center gap-2 text-xl font-black text-ink">
              可写入简历的项目表达 <Sparkles className="text-primary" size={20} />
            </h2>
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-white p-6">
              <p className="text-lg font-black text-ink">项目名称：{resumeProject.title}</p>
              <p className="mt-4 text-sm leading-8 text-slate-600">{resumeProject.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {resumeProject.tags.map((tag) => (
                  <Tag key={tag} color="mint">
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </Card>
          <Card className="p-7">
            <h2 className="flex items-center gap-2 text-xl font-black text-ink">
              推荐投递关键词 <Sparkles className="text-primary" size={20} />
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {resumeProject.keywords.map((keyword) => (
                <Tag key={keyword} color={keyword.includes("AI") || keyword.includes("数据") ? "purple" : "blue"} className="px-4 py-2 text-sm">
                  {keyword}
                </Tag>
              ))}
            </div>
            <div className="mt-8 grid gap-3">
              <Button onClick={() => navigate("/")}>
                <Home size={18} /> 返回首页
              </Button>
              <Button variant="secondary" onClick={() => navigate("/task/ai_pm")}>
                <RefreshCw size={18} /> 重新体验副本
              </Button>
              <Button variant="ghost" onClick={() => navigate("/recommendations")}>
                <ArrowLeft size={18} /> 查看其它副本
              </Button>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
