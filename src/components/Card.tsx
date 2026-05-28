import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export default function Card({ children, className = "" }: CardProps) {
  return <div className={`glass-card rounded-3xl ${className}`}>{children}</div>;
}
