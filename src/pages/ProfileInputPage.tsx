import { BarChart3, BriefcaseBusiness, Heart, Lock, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import Tag from "../components/Tag";
import type { UserInput } from "../services/aiService";
import { generateCareerProfile } from "../services/aiService";

const steps = ["画像输入", "副本推荐", "岗位任务", "AI 评分", "成长报告"].map((label) => ({ label }));
const interests = ["与人沟通", "分析数据", "创意设计", "解决问题", "组织协调", "写作表达", "逻辑思考", "学习研究"];
const dislikes = ["重复机械", "高压加班", "频繁出差", "单调枯燥", "大量电话沟通", "强销售性质", "处理琐碎事务"];
const styles = ["团队协作", "独立负责", "创造型", "数据驱动", "快节奏", "稳定节奏", "灵活自由", "有明确流程"];
const skills = ["沟通表达", "逻辑分析", "数据分析", "文案写作", "设计审美", "编程能力", "项目管理", "学习能力"];
const tools = ["Excel", "PPT", "Word", "Figma", "Python", "SQL", "Notion", "PS"];

const emptyInput: UserInput = {
  major: "",
  grade: "",
  city: "",
  interests: ["与人沟通", "创意设计"],
  dislikes: [],
  workStyles: ["团队协作"],
  experience: "",
  skills: ["沟通表达", "学习能力"],
  tools: ["PPT", "Excel"]
};

export default function ProfileInputPage() {
  const [input, setInput] = useState<UserInput>(emptyInput);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggle = (key: keyof UserInput, value: string) => {
    setInput((current) => {
      const list = current[key] as string[];
      return { ...current, [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value] };
    });
  };

  const submit = async () => {
    setLoading(true);
    await generateCareerProfile(input);
    navigate("/recommendations");
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-ink">先认识你自己</h1>
            <p className="mt-3 max-w-3xl text-slate-600">回答以下问题，AI 将为你构建专属职业画像，为后续推荐更合适的副本与岗位。</p>
          </div>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-bold text-primary">
            大学生专属 · 职业探索与成长平台
          </span>
        </div>

        <Stepper steps={steps} current={0} className="mt-7" />

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_430px]">
          <Card className="p-7">
            <section>
              <h2 className="flex items-center gap-2 text-xl font-black text-ink">
                <UserRound className="text-primary" /> 基础信息
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[
                  { key: "major", label: "专业", placeholder: "请选择专业", options: ["市场营销", "计算机科学", "新闻传播", "工商管理", "视觉传达"] },
                  { key: "grade", label: "年级", placeholder: "请选择年级", options: ["大一", "大二", "大三", "大四", "研一"] },
                  { key: "city", label: "目标城市", placeholder: "请选择目标城市", options: ["北京", "上海", "广州", "深圳", "杭州", "成都"] }
                ].map((field) => (
                  <label key={field.key} className="block">
                    <span className="text-sm font-bold text-slate-700">{field.label} *</span>
                    <select
                      value={input[field.key as "major" | "grade" | "city"]}
                      onChange={(event) => setInput({ ...input, [field.key]: event.target.value })}
                      className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 text-sm text-slate-600 outline-none focus:border-primary"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </section>

            <section className="mt-9 border-t border-blue-50 pt-8">
              <h2 className="flex items-center gap-2 text-xl font-black text-ink">
                <Heart className="text-primary" /> 兴趣偏好
              </h2>
              <ChipGroup title="喜欢做的事 *" values={interests} selected={input.interests} onToggle={(value) => toggle("interests", value)} />
              <ChipGroup title="不喜欢的工作内容（可多选）" values={dislikes} selected={input.dislikes} onToggle={(value) => toggle("dislikes", value)} color="gray" />
              <ChipGroup title="希望的工作风格 *" values={styles} selected={input.workStyles} onToggle={(value) => toggle("workStyles", value)} color="mint" />
            </section>

            <section className="mt-9 border-t border-blue-50 pt-8">
              <h2 className="flex items-center gap-2 text-xl font-black text-ink">
                <BriefcaseBusiness className="text-primary" /> 经历与技能
              </h2>
              <label className="mt-5 block">
                <span className="text-sm font-bold text-slate-700">做过的项目 / 社团 / 比赛 *</span>
                <textarea
                  value={input.experience}
                  onChange={(event) => setInput({ ...input, experience: event.target.value })}
                  maxLength={300}
                  placeholder="请简要描述你的角色、内容与成果（0/300）"
                  className="mt-2 h-32 w-full resize-none rounded-2xl border border-blue-100 bg-white p-4 text-sm outline-none focus:border-primary"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <ChipGroup title="擅长能力（可多选）*" values={skills} selected={input.skills} onToggle={(value) => toggle("skills", value)} />
                <ChipGroup title="会用的工具（可多选）" values={tools} selected={input.tools} onToggle={(value) => toggle("tools", value)} color="purple" />
              </div>
            </section>

            <Button size="lg" className="mt-8 w-full" disabled={loading} onClick={submit}>
              <Sparkles size={20} /> {loading ? "正在生成画像..." : "生成我的职业画像"}
            </Button>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Lock size={15} /> 你的信息仅用于生成画像，严格保密
            </p>
          </Card>

          <aside className="space-y-5">
            <Card className="p-7">
              <h2 className="flex items-center gap-2 text-xl font-black text-ink">
                <BarChart3 className="text-primary" /> 画像预览
              </h2>
              <p className="mt-3 text-sm text-slate-500">完成填写后，AI 将生成你的专属职业画像</p>
              <div className="relative mt-8 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-violet-50 p-6">
                {["表达力", "创意", "逻辑分析", "用户洞察", "学习能力"].map((item, index) => (
                  <div
                    key={item}
                    className={`mb-3 rounded-2xl border border-white bg-white/85 px-4 py-3 text-sm font-black shadow-card ${
                      index % 2 ? "ml-12 text-violet-600" : "mr-12 text-primary"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-white p-6">
              <p className="font-black text-amber-600">填写越完整，推荐越准确</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">花 3-5 分钟认真填写，系统会给出更贴近你的职业建议。</p>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

type ChipGroupProps = {
  title: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
  color?: "blue" | "mint" | "purple" | "gray";
};

function ChipGroup({ title, values, selected, onToggle, color = "blue" }: ChipGroupProps) {
  return (
    <div className="mt-5">
      <p className="mb-3 text-sm font-bold text-slate-700">{title}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <Tag key={value} color={color} active={selected.includes(value)} onClick={() => onToggle(value)}>
            {value}
          </Tag>
        ))}
      </div>
    </div>
  );
}
