import type { ComponentProps, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<typeof motion.div>) {
  return <motion.div whileHover={{ y: -2 }} transition={{ duration: .18 }} className={cn("rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm shadow-indigo-100/50", className)} {...props} />;
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between"><h3 className="border-l-4 border-violet-500 pl-2 text-sm font-semibold text-slate-900">{title}</h3>{action}</div>;
}
