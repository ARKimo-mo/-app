import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = cva("inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-200 hover:shadow-violet-300",
      outline: "border border-violet-200 bg-white text-violet-600 hover:bg-violet-50",
      ghost: "text-slate-600 hover:bg-violet-50 hover:text-violet-600",
      success: "bg-emerald-500 text-white hover:bg-emerald-600",
    },
    size: { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-sm" },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export function Button({ className, variant, size, ...props }: ComponentProps<typeof motion.button> & VariantProps<typeof variants>) {
  return <motion.button whileTap={{ scale: .97 }} whileHover={{ y: -1 }} className={cn(variants({ variant, size }), className)} {...props} />;
}
