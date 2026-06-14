"use client";

import Image from "next/image";
import {
  BarChart3,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  FileText,
  Flame,
  MessageCircle,
  Sparkles,
  Target,
} from "lucide-react";
import { useSyncExternalStore, type ReactNode } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar as RadarShape,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export type V4DashboardPage =
  | "dashboard"
  | "avatar"
  | "recommend"
  | "mission"
  | "customMission"
  | "review"
  | "skill"
  | "portfolio"
  | "learning"
  | "resume"
  | "interview"
  | "radar"
  | "jd";

const cx = (...values: Array<string | false | undefined>) =>
  values.filter(Boolean).join(" ");

const abilityData = [
  { name: "专业能力", mine: 72, target: 88 },
  { name: "沟通协作", mine: 68, target: 82 },
  { name: "问题解决", mine: 75, target: 86 },
  { name: "学习力", mine: 82, target: 88 },
  { name: "执行力", mine: 83, target: 90 },
];

function useMounted() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "rounded-2xl border border-[#e8e9f4] bg-white p-4 shadow-[0_8px_28px_rgba(70,63,132,.055)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

function Title({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="border-l-[3px] border-[#6257ed] pl-2 text-[13px] font-bold">
        {children}
      </h2>
      {action}
    </div>
  );
}

function Progress({ value, green = false }: { value: number; green?: boolean }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[#ebecef]">
      <div
        className={cx(
          "h-full rounded-full",
          green ? "bg-emerald-500" : "bg-[#6257ed]",
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function ScoreRing({
  value,
  label,
  compact = false,
}: {
  value: number;
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cx(
        "relative grid shrink-0 place-items-center rounded-full",
        compact ? "size-[86px]" : "size-[156px]",
      )}
      style={{
        background: `conic-gradient(#6257ed ${value * 3.6}deg,#ecebfa 0deg)`,
      }}
    >
      <div
        className={cx(
          "grid place-items-center rounded-full bg-white text-center",
          compact ? "size-[68px]" : "size-[122px]",
        )}
      >
        <b className={compact ? "text-2xl" : "text-[42px] leading-none"}>
          {value}
        </b>
        <span className="mt-1 text-[9px] font-semibold text-[#6257ed]">
          {label}
        </span>
      </div>
    </div>
  );
}

function AbilityRadar() {
  const mounted = useMounted();
  return (
    <div className="h-[205px] min-w-0">
      {mounted && (
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <RadarChart data={abilityData}>
            <PolarGrid stroke="#e6e7f1" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: "#69718a" }}
            />
            <RadarShape
              dataKey="target"
              stroke="#c8cad8"
              fill="#c8cad8"
              fillOpacity={0.1}
            />
            <RadarShape
              dataKey="mine"
              stroke="#6257ed"
              strokeWidth={2}
              fill="#6257ed"
              fillOpacity={0.28}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function V4Dashboard({
  go,
}: {
  go: (page: V4DashboardPage) => void;
}) {
  const stages: Array<[string, V4DashboardPage]> = [
    ["训练分身", "avatar"],
    ["预演岗位", "recommend"],
    ["亲自验证", "mission"],
    ["试岗报告", "review"],
    ["成长路线", "skill"],
  ];
  const quick: Array<
    [string, V4DashboardPage, typeof BriefcaseBusiness, string]
  > = [
    ["试岗广场", "recommend", BriefcaseBusiness, "bg-blue-50 text-blue-500"],
    ["副本挑战", "mission", Sparkles, "bg-violet-50 text-violet-500"],
    ["能力评估", "skill", BarChart3, "bg-amber-50 text-amber-500"],
    ["简历优化", "resume", FileText, "bg-indigo-50 text-indigo-500"],
    ["面试训练", "interview", MessageCircle, "bg-rose-50 text-rose-500"],
    ["学习中心", "learning", BookOpen, "bg-emerald-50 text-emerald-500"],
  ];
  const recent: Array<
    [string, string, "进行中" | "已完成", number, V4DashboardPage]
  > = [
    ["AI 求职助手产品方案", "AI 产品经理试岗", "进行中", 68, "customMission"],
    ["用户需求分析与 PRD 输出", "能力验证", "已完成", 100, "portfolio"],
    ["产品分析与策略制定", "分身校准", "已完成", 100, "review"],
  ];

  return (
    <div className="space-y-3 pb-6">
      <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-3">
        <Card className="relative min-h-[262px] overflow-hidden bg-[linear-gradient(115deg,#fff_0%,#fcfcff_57%,#f2f0ff_100%)] p-6">
          <div className="relative z-10 max-w-[620px]">
            <p className="text-sm font-semibold text-[#5147d9]">下午好，林同学</p>
            <h1 className="mt-3 max-w-[590px] text-[29px] font-bold leading-[1.25] text-[#15182b]">
              让职业数字分身先替你试岗，再决定未来方向
            </h1>
            <p className="mt-3 max-w-[570px] text-[11px] leading-6 text-[#77809a]">
              通过岗位情境预演与真实任务验证，判断自己是否喜欢、压力来自哪里，以及当前能力是否适配。
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => go("recommend")}
                className="flex min-w-[188px] items-center gap-3 rounded-xl bg-[#6257ed] px-4 py-3 text-left text-white shadow-[0_8px_22px_rgba(98,87,237,.22)] transition hover:-translate-y-0.5 active:scale-[.98]"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-white/15 text-white">
                  <Sparkles size={18} />
                </span>
                <span>
                  <b className="block text-xs">开始一次分身试岗</b>
                  <small className="text-[9px] text-white/70">
                    精品岗位，快速完成闭环
                  </small>
                </span>
              </button>
              <button
                onClick={() => go("radar")}
                className="flex min-w-[176px] items-center gap-3 rounded-xl border border-[#ebeafa] bg-white px-4 py-3 text-left shadow-[0_8px_22px_rgba(91,80,190,.07)] transition hover:-translate-y-0.5 active:scale-[.98]"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-rose-50 text-rose-500">
                  <Flame size={18} />
                </span>
                <span>
                  <b className="block text-xs">搜索并定制真实岗位</b>
                  <small className="text-[9px] text-[#9298ac]">
                    AI 搜索岗位，确认 JD 后试岗
                  </small>
                </span>
              </button>
            </div>
          </div>
          <div className="absolute bottom-[-24px] right-[40px] h-[270px] w-[270px]">
            <Image
              src="/assets/avatar-student-tablet.png"
              alt="职业数字分身"
              fill
              priority
              className="object-contain"
            />
          </div>
          <div className="absolute right-[22px] top-[26px]">
            <ScoreRing value={76} label="分身理解度" compact />
          </div>
        </Card>

        <Card className="flex min-h-[262px] flex-col items-center justify-between p-5">
          <div className="w-full">
            <Title>今日成长评分</Title>
          </div>
          <ScoreRing value={92} label="优秀" />
          <p className="text-center text-[10px] leading-5 text-[#7c849e]">
            超过了 <b className="text-[#6257ed]">86%</b> 的同龄人
            <br />
            今天的试岗反馈已更新分身判断
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,.95fr)_280px] gap-3">
        <div className="space-y-3">
          <Card>
            <Title
              action={
                <button
                  onClick={() => go("skill")}
                  className="text-[10px] font-semibold text-[#6257ed]"
                >
                  查看成长路线
                </button>
              }
            >
              成长路径概览
            </Title>
            <div className="relative grid grid-cols-5 gap-2 pt-2">
              <div className="absolute left-[9%] right-[9%] top-[22px] h-px bg-[#dcddec]" />
              {stages.map(([stage, target], index) => (
                <button
                  key={stage}
                  onClick={() => go(target)}
                  className="relative z-10 text-center"
                >
                  <span
                    className={cx(
                      "mx-auto grid size-6 place-items-center rounded-full text-[9px] font-bold",
                      index < 3
                        ? "bg-[#6257ed] text-white"
                        : "bg-[#e4e6ef] text-[#9298ac]",
                    )}
                  >
                    {index < 2 ? <Check size={12} /> : index + 1}
                  </span>
                  <b
                    className={cx(
                      "mt-2 block text-[9px]",
                      index === 2 ? "text-[#6257ed]" : "text-[#5f6881]",
                    )}
                  >
                    {stage}
                  </b>
                </button>
              ))}
            </div>
            <button
              onClick={() => go("mission")}
              className="mt-5 w-full rounded-xl border border-[#ebeaf5] bg-[#fbfbfe] p-4 text-left transition hover:border-[#cbc7f7]"
            >
              <div className="flex items-center justify-between">
                <span>
                  <b className="text-[10px] text-[#6257ed]">
                    当前阶段：亲自验证
                  </b>
                  <small className="mt-1 block text-[9px] text-[#8a91aa]">
                    通过真实任务校准分身预判并积累能力证据
                  </small>
                </span>
                <span className="rounded-lg border border-[#dcd9fa] bg-white px-3 py-2 text-[9px] font-semibold text-[#6257ed]">
                  继续试岗
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-[9px]">
                <span>阶段进度 68%</span>
                <div className="flex-1">
                  <Progress value={68} />
                </div>
              </div>
            </button>
          </Card>

          <Card>
            <Title
              action={
                <button
                  onClick={() => go("portfolio")}
                  className="text-[10px] text-[#7d849d]"
                >
                  查看全部
                </button>
              }
            >
              最近挑战的副本
            </Title>
            <div className="space-y-2">
              {recent.map(([title, tag, status, value, target], index) => (
                <button
                  onClick={() => go(target)}
                  key={title}
                  className="grid w-full grid-cols-[48px_1fr_66px] items-center gap-3 rounded-xl border border-transparent bg-[#fbfbfe] p-2.5 text-left transition hover:border-[#dedbf8]"
                >
                  <span
                    className={cx(
                      "grid size-11 place-items-center rounded-xl",
                      index === 0
                        ? "bg-amber-50 text-amber-500"
                        : index === 1
                          ? "bg-emerald-50 text-emerald-500"
                          : "bg-violet-50 text-violet-500",
                    )}
                  >
                    {index === 0 ? (
                      <BriefcaseBusiness size={19} />
                    ) : index === 1 ? (
                      <FileText size={19} />
                    ) : (
                      <Target size={19} />
                    )}
                  </span>
                  <span>
                    <b className="block text-[10px]">{title}</b>
                    <small className="text-[8px] text-[#9298ac]">{tag}</small>
                    <span className="mt-2 grid grid-cols-[1fr_34px] items-center gap-2">
                      <Progress value={value} />
                      <small className="text-[8px]">{value}%</small>
                    </span>
                  </span>
                  <span
                    className={cx(
                      "rounded-lg px-2 py-1 text-center text-[8px] font-semibold",
                      status === "进行中"
                        ? "bg-violet-50 text-[#6257ed]"
                        : "bg-emerald-50 text-emerald-600",
                    )}
                  >
                    {status}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <Card>
            <Title>当前目标岗位</Title>
            <button
              onClick={() => go("recommend")}
              className="flex w-full items-center gap-4 rounded-xl bg-[#fbfbfe] p-4 text-left transition hover:bg-[#f6f5ff]"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-violet-100 text-[#6257ed]">
                <BriefcaseBusiness size={22} />
              </span>
              <span className="flex-1">
                <b className="block text-sm">AI 产品经理</b>
                <small className="mt-1 block text-[9px] text-[#8b92a8]">
                  目标行业：互联网 / AI 应用
                  <br />
                  目标城市：上海
                </small>
              </span>
              <ChevronRight size={16} className="text-[#a2a7ba]" />
            </button>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["岗位适配度", "82%"],
                ["能力达成度", "72%"],
                ["体验兴趣度", "92%"],
              ].map(([label, value]) => (
                <button
                  onClick={() => go("review")}
                  key={label}
                  className="rounded-xl border border-[#ececf5] py-3"
                >
                  <small className="block text-[8px] text-[#9298ac]">
                    {label}
                  </small>
                  <b className="mt-1 block text-base">{value}</b>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <Title>进度概览</Title>
            <div className="grid grid-cols-[110px_1fr] items-center gap-4">
              <ScoreRing value={68} label="整体进度" compact />
              <div className="space-y-3">
                {[
                  ["已完成副本", "18", "bg-emerald-500"],
                  ["进行中", "3", "bg-[#6257ed]"],
                  ["待开始", "7", "bg-[#cfd2df]"],
                ].map(([label, value, color]) => (
                  <div key={label} className="flex items-center gap-2 text-[9px]">
                    <span className={cx("size-2 rounded-full", color)} />
                    <span className="flex-1 text-[#6e7690]">{label}</span>
                    <b>{value}</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-[#ececf5] p-3">
              <b className="text-[10px]">本周目标</b>
              {[
                ["完成 2 个试岗章节", 50, "1/2"],
                ["成长值达到 800", 95, "760/800"],
                ["完成 1 次面试训练", 100, "1/1"],
              ].map(([label, value, amount]) => (
                <div
                  key={label as string}
                  className="mt-3 grid grid-cols-[130px_1fr_48px] items-center gap-2 text-[8px]"
                >
                  <span>{label}</span>
                  <Progress value={value as number} green={value === 100} />
                  <b className="text-right">{amount}</b>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <Card>
            <Title>快捷入口</Title>
            <div className="grid grid-cols-3 gap-x-2 gap-y-4">
              {quick.map(([label, target, Icon, tone]) => (
                <button
                  onClick={() => go(target)}
                  key={label}
                  className="group text-center"
                >
                  <span
                    className={cx(
                      "mx-auto grid size-11 place-items-center rounded-xl transition group-hover:-translate-y-0.5",
                      tone,
                    )}
                  >
                    <Icon size={19} />
                  </span>
                  <b className="mt-2 block text-[9px]">{label}</b>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <Title
              action={
                <button
                  onClick={() => go("skill")}
                  className="text-[9px] text-[#6257ed]"
                >
                  查看详情
                </button>
              }
            >
              能力成长概览
            </Title>
            <AbilityRadar />
            <div className="mt-1 flex justify-center gap-4 text-[8px] text-[#8a91aa]">
              <span>
                <i className="mr-1 inline-block size-2 rounded-sm bg-[#6257ed]" />
                当前能力
              </span>
              <span>
                <i className="mr-1 inline-block size-2 rounded-sm bg-[#c4c6d8]" />
                岗位目标
              </span>
            </div>
          </Card>
        </div>
      </div>

      <Card className="flex items-center justify-between bg-[linear-gradient(90deg,#fff,#f5f3ff)] py-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-violet-100 text-[#6257ed]">
            <Bot size={20} />
          </span>
          <span>
            <b className="text-xs">专属成长建议</b>
            <p className="mt-1 text-[9px] text-[#7d849d]">
              优先提升数据分析能力，再完成一次高压协作章节，分身判断会更准确。
            </p>
          </span>
        </div>
        <button
          onClick={() => go("customMission")}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#6257ed] px-4 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(98,87,237,.2)] active:scale-[.98]"
        >
          查看建议副本
          <ChevronRight size={13} />
        </button>
      </Card>
    </div>
  );
}
