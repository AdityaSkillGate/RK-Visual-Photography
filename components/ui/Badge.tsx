import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "charcoal" | "outline" | "subtle";
  size?: "sm" | "md";
  dot?: boolean;
}

const variantStyles = {
  gold: "border-gold-500/40 bg-gold-500/10 text-gold-300 shadow-sm",
  charcoal: "border-bronze-border/80 bg-charcoal-900 text-ivory-200",
  outline: "border-bronze-border/60 bg-transparent text-sand-400",
  subtle: "border-transparent bg-charcoal-850 text-sand-300",
};

const dotColors = {
  gold: "bg-gold-400",
  charcoal: "bg-ivory-300",
  outline: "bg-sand-400",
  subtle: "bg-gold-400",
};

const sizeStyles = {
  sm: "px-2.5 py-0.5 text-[10px] tracking-widest",
  md: "px-3 py-1 text-xs tracking-editorial",
};

export default function Badge({
  variant = "gold",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-sans font-medium uppercase select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
