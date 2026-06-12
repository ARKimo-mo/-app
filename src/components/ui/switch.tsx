"use client";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return <SwitchPrimitive.Root checked={checked} onCheckedChange={onCheckedChange} className="h-6 w-11 rounded-full bg-slate-200 data-[state=checked]:bg-violet-600"><SwitchPrimitive.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-5" /></SwitchPrimitive.Root>;
}
