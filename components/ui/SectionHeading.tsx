import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center" | "right";
  size?: "default" | "large" | "compact";
  theme?: "dark" | "light" | "ivory";
  action?: React.ReactNode;
}

const alignClasses = {
  left: "text-left items-start",
  center: "text-center items-center mx-auto",
  right: "text-right items-end ml-auto",
};

const titleSizeClasses = {
  compact: "text-2xl sm:text-3xl lg:text-4xl",
  default: "text-3xl sm:text-4xl lg:text-5xl",
  large: "text-4xl sm:text-5xl lg:text-6xl",
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  size = "default",
  theme = "dark",
  action,
  className,
  ...props
}: SectionHeadingProps) {
  const isLight = theme === "light" || theme === "ivory";

  return (
    <div
      className={cn(
        "flex flex-col space-y-4 max-w-3xl",
        alignClasses[align],
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-overline font-semibold uppercase tracking-widest",
            isLight ? "text-gold-muted font-bold" : "text-gold-400"
          )}
        >
          {eyebrow}
        </span>
      )}

      <h2
        className={cn(
          "font-display font-light tracking-tight text-balance",
          titleSizeClasses[size],
          isLight ? "text-charcoal-deep" : "text-ivory-100"
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "font-sans text-sm sm:text-base font-light leading-relaxed text-balance",
            isLight ? "text-taupe-700" : "text-sand-400"
          )}
        >
          {description}
        </p>
      )}

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
