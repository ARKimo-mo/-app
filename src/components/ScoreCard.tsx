import type { Evaluation } from "../types";
import ProgressBar from "./ProgressBar";

type ScoreCardProps = {
  dimension: Evaluation["dimensions"][number];
};

export default function ScoreCard({ dimension }: ScoreCardProps) {
  return (
    <div className="glass-card rounded-3xl p-5">
      <p className="text-sm font-black text-ink">{dimension.name}</p>
      <div className="mt-4 flex items-end gap-1">
        <span className="text-3xl font-black text-primary">{dimension.score}</span>
        <span className="pb-1 text-sm font-semibold text-slate-400">/100</span>
      </div>
      <div className="mt-4">
        <ProgressBar value={dimension.score} color={dimension.score >= 84 ? "blue" : dimension.score >= 80 ? "mint" : "purple"} />
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-500">{dimension.note}</p>
    </div>
  );
}
