import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "mint" | "purple";
    size?: "md" | "lg";
  }
>;

const variants = {
  primary: "bg-primary text-white shadow-lg shadow-blue-200 hover:bg-blue-600",
  secondary: "border border-blue-200 bg-white text-primary hover:bg-blue-50",
  ghost: "text-slate-600 hover:bg-blue-50",
  mint: "bg-mint text-white shadow-lg shadow-emerald-100 hover:bg-emerald-500",
  purple: "bg-lavender text-white shadow-lg shadow-violet-100 hover:bg-violet-500"
};

export default function Button({ children, variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const sizeClass = size === "lg" ? "h-14 px-8 text-base" : "h-11 px-5 text-sm";

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
