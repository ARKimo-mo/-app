import { ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Job } from "../types";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import Tag from "./Tag";

type JobCardProps = {
  job: Job;
  index?: number;
  compact?: boolean;
};

const iconGradient = {
  blue: "from-blue-500 to-blue-300",
  mint: "from-emerald-500 to-teal-300",
  purple: "from-violet-500 to-purple-300"
};

export default function JobCard({ job, index = 0, compact = false }: JobCardProps) {
  const navigate = useNavigate();

  return (
    <article className={`glass-card rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-soft ${compact ? "" : "min-h-[360px]"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="rounded-xl bg-blue-50 px-3 py-1 text-xs font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-4 text-xl font-black text-ink">{job.jobName}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{job.description}</p>
        </div>
        <div className={`grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br ${iconGradient[job.color]} shadow-lg`}>
          <div className="h-10 w-10 rounded-xl border-4 border-white/80" />
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-end gap-2">
          <span className="text-xs font-bold text-slate-500">匹配度</span>
          <span className="text-3xl font-black text-primary">{job.match}%</span>
        </div>
        <ProgressBar value={job.match} color={job.color} />
      </div>

      {!compact && (
        <>
          <div className="mt-5 space-y-2">
            <p className="text-sm font-black text-ink">推荐理由</p>
            {job.reasons.map((reason) => (
              <p key={reason} className="flex gap-2 text-sm leading-6 text-slate-600">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-mint" />
                {reason}
              </p>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-blue-50/70 p-3 text-sm leading-6 text-slate-600">
            <span className="inline-flex items-center gap-1 font-black text-primary">
              <ShieldCheck size={16} />
              风险提示
            </span>
            <span className="ml-2">{job.risk}</span>
          </div>
        </>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {job.coreSkills.map((skill) => (
          <Tag key={skill} color={job.color}>
            {skill}
          </Tag>
        ))}
      </div>

      {!compact && (
        <Button
          variant={job.color === "mint" ? "mint" : job.color === "purple" ? "purple" : "primary"}
          className="mt-6 w-full"
          onClick={() => navigate(`/task/${job.jobId}`)}
        >
          进入副本 <ArrowRight size={17} />
        </Button>
      )}
    </article>
  );
}
