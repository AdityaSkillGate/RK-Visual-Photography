import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center" | "right";
  size?: "default" | "large" | "compact";
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
  action,
  className,
  ...props
}: SectionHeadingProps) {
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
        <span className="text-overline font-semibold text-gold-400 uppercase tracking-widest">
          {eyebrow}
        </span>
      )}

      <h2
        className={cn(
          "font-display font-light text-ivory-100 tracking-tight text-balance",
          titleSizeClasses[size]
        )}
      >
        {title}
      </h2>

      {description && (
        <p className="font-sans text-sm sm:text-base font-light text-sand-400 leading-relaxed text-balance">
          {description}
        </p>
      )}

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
