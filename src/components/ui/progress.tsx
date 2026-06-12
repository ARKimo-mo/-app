"use client";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function Progress({ value, className, indicatorClassName }: { value: number; className?: string; indicatorClassName?: string }) {
  return <ProgressPrimitive.Root value={value} className={cn("relative h-1.5 overflow-hidden rounded-full bg-slate-100", className)}>
    <ProgressPrimitive.Indicator className={cn("h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-400 transition-all duration-700", indicatorClassName)} style={{ transform: `translateX(-${100 - value}%)` }} />
  </ProgressPrimitive.Root>;
}
