type ProgressBarProps = {
  value: number;
  color?: "blue" | "mint" | "purple";
};

const colorMap = {
  blue: "bg-primary",
  mint: "bg-mint",
  purple: "bg-lavender"
};

export default function ProgressBar({ value, color = "blue" }: ProgressBarProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${colorMap[color]}`} style={{ width: `${value}%` }} />
    </div>
  );
}
