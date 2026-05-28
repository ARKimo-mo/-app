import { BookOpen, Bot, CheckCircle2, ClipboardList, FileText, Lightbulb, Send, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import Tag from "../components/Tag";
import { getJobById } from "../data/jobs";
import { evaluateTask, generateJobTask } from "../services/aiService";

const steps = ["职业画像", "副本推荐", "岗位任务", "成长报告"].map((label) => ({ label }));

export default function TaskPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = getJobById(jobId);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(job.task);

  useEffect(() => {
    generateJobTask(job).then(setTask);
  }, [job]);

  const submit = async () => {
    setLoading(true);
    await evaluateTask(answer, job);
    navigate("/report");
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid items-center gap-7 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex items-center gap-5">
            <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 to-blue-300 text-white shadow-lg shadow-blue-200">
              <div className="h-11 w-11 rounded-xl border-4 border-white" />
            </div>
            <div>
              <Tag>当前副本</Tag>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">{job.jobName}副本</h1>
              <p className="mt-3 text-slate-600">通过一个典型任务，体验这个岗位的思考方式</p>
            </div>
          </div>
          <Stepper steps={steps} current={2} />
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_420px]">
          <Card className="p-7">
            <h2 className="flex items-center gap-2 text-2xl font-black text-ink">
              <ClipboardList className="text-primary" /> 今日任务
            </h2>

            <div className="mt-6 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
              <p className="flex items-center gap-2 text-sm font-black text-primary">
                <Target size={18} /> 任务场景
              </p>
              <h3 className="mt-3 text-2xl font-black text-ink">{task?.scenario}</h3>
            </div>

            <section className="mt-6">
              <p className="text-sm leading-7 text-slate-600">请围绕以下要求，输出你的产品方案：</p>
              <div className="mt-4 space-y-3">
                {[
                  ["目标用户", "明确你的目标用户是谁？他们的核心特征是什么？"],
                  ["用户痛点", "他们在求职过程中遇到了哪些主要问题？"],
                  ["核心功能", "你的产品需要提供哪些核心功能来解决这些问题？"],
                  ["使用流程", "用户如何使用这些功能？请描述关键路径。"],
                  ["效果指标", "如何衡量这个产品的成功？请给出可量化指标。"]
                ].map(([title, text], index) => (
                  <p key={title} className="flex gap-3 text-sm leading-7 text-slate-700">
                    <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-black text-white">{index + 1}</span>
                    <span>
                      <span className="font-black text-ink">{title}：</span>
                      {text}
                    </span>
                  </p>
                ))}
              </div>
            </section>

            <div className="mt-7 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="flex items-center gap-2 font-black text-ink">
                    <FileText className="text-emerald-500" /> 粘贴目标 JD（可选）
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">粘贴你感兴趣岗位的 JD，AI 可生成更贴合的任务。</p>
                </div>
                <Button variant="secondary">粘贴 JD</Button>
              </div>
            </div>

            <label className="mt-7 block">
              <span className="flex items-center gap-2 text-lg font-black text-ink">
                <Lightbulb className="text-primary" /> 我的方案
              </span>
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.ctrlKey && event.key === "Enter") submit();
                }}
                maxLength={3000}
                placeholder="在此输入你的产品方案，可分点展开，建议结构清晰、重点突出……"
                className="mt-4 h-44 w-full resize-none rounded-3xl border border-blue-100 bg-white p-5 text-sm leading-7 outline-none focus:border-primary"
              />
              <span className="mt-2 block text-right text-xs font-semibold text-slate-400">{answer.length}/3000</span>
            </label>
            <p className="mt-2 text-sm text-slate-500">可使用 Ctrl + Enter 快速提交</p>

            <div className="mt-7 flex justify-center">
              <Button size="lg" disabled={loading} onClick={submit}>
                <Send size={20} /> {loading ? "AI 正在评分..." : "提交 AI 评分"}
              </Button>
            </div>
          </Card>

          <aside className="space-y-5">
            <SideCard icon={<CheckCircle2 />} title="岗位能力" gradient="from-violet-50 to-white">
              <div className="flex flex-wrap gap-2">
                {["需求分析", "用户洞察", "AI 理解", "数据意识"].map((item) => (
                  <Tag key={item} color="purple">
                    {item}
                  </Tag>
                ))}
              </div>
            </SideCard>
            <SideCard icon={<Lightbulb />} title="完成提示" gradient="from-emerald-50 to-white">
              {["聚焦目标用户，围绕真实场景思考", "从问题出发，提出有价值的功能方案", "流程清晰，体现产品思维和用户体验", "指标要可衡量，体现产品价值"].map((item) => (
                <p key={item} className="flex gap-2 text-sm leading-7 text-slate-600">
                  <CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={16} /> {item}
                </p>
              ))}
            </SideCard>
            <SideCard icon={<BookOpen />} title="参考资料" gradient="from-blue-50 to-white">
              {["AI 产品经理岗位职责与能力模型", "优秀产品案例：AI 面试助手分析", "产品方案模板"].map((item) => (
                <p key={item} className="border-b border-blue-50 py-2 text-sm font-semibold text-slate-600 last:border-b-0">
                  {item}
                </p>
              ))}
            </SideCard>
            <SideCard icon={<Bot />} title="副本说明" gradient="from-slate-50 to-white">
              <p className="text-sm leading-7 text-slate-600">AI 将基于你的方案进行多维度评分，并给出详细反馈与优化建议。</p>
            </SideCard>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SideCard({ icon, title, gradient, children }: { icon: React.ReactNode; title: string; gradient: string; children: React.ReactNode }) {
  return (
    <Card className={`bg-gradient-to-br ${gradient} p-6`}>
      <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-ink">
        <span className="text-primary">{icon}</span>
        {title}
      </h3>
      {children}
    </Card>
  );
}
