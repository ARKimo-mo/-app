import type { PropsWithChildren } from "react";

type TagProps = PropsWithChildren<{
  color?: "blue" | "mint" | "purple" | "gray";
  active?: boolean;
  onClick?: () => void;
  className?: string;
}>;

const colors = {
  blue: "bg-blue-50 text-primary border-blue-100",
  mint: "bg-emerald-50 text-emerald-600 border-emerald-100",
  purple: "bg-violet-50 text-violet-600 border-violet-100",
  gray: "bg-slate-50 text-slate-600 border-slate-100"
};

export default function Tag({ children, color = "blue", active = false, onClick, className = "" }: TagProps) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
        colors[color]
      } ${active ? "ring-2 ring-primary/20 bg-blue-100 text-primary" : ""} ${className}`}
    >
      {children}
    </Component>
  );
}
