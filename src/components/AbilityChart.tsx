import type { Evaluation } from "../types";
import ProgressBar from "./ProgressBar";

type AbilityChartProps = {
  dimensions: Evaluation["dimensions"];
};

export default function AbilityChart({ dimensions }: AbilityChartProps) {
  return (
    <div className="space-y-4">
      {dimensions.map((dimension) => (
        <div key={dimension.name}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-bold text-slate-700">{dimension.name}</span>
            <span className="font-black text-primary">{dimension.score}</span>
          </div>
          <ProgressBar value={dimension.score} color={dimension.score >= 84 ? "blue" : dimension.score >= 80 ? "mint" : "purple"} />
        </div>
      ))}
    </div>
  );
}
