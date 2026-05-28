import { Check } from "lucide-react";

type Step = {
  label: string;
};

type StepperProps = {
  steps: Step[];
  current: number;
  className?: string;
};

export default function Stepper({ steps, current, className = "" }: StepperProps) {
  return (
    <div className={`glass-card rounded-3xl px-5 py-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-3 md:flex-nowrap">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <div key={step.label} className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    done
                      ? "border border-blue-200 bg-white text-primary"
                      : active
                        ? "bg-primary text-white shadow-lg shadow-blue-200"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? <Check size={17} /> : index + 1}
                </span>
                <span className={`truncate text-sm font-bold ${active ? "text-primary" : done ? "text-slate-600" : "text-slate-400"}`}>
                  {step.label}
                </span>
              </div>
              {index !== steps.length - 1 && <div className="hidden h-px flex-1 bg-blue-100 md:block" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
