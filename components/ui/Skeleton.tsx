import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular" | "image";
}

export default function Skeleton({
  variant = "rectangular",
  className,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: "h-4 w-full rounded",
    rectangular: "rounded-xl",
    circular: "rounded-full shrink-0",
    image: "aspect-gallery w-full rounded-xl",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-charcoal-850/80 border border-bronze-border/40 animate-pulse",
        variantStyles[variant],
        className
      )}
      role="status"
      aria-label="Loading content..."
      {...props}
    >
      {/* Luxury gold shimmer highlight */}
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-500/5 to-transparent animate-shimmer-luxury"
        aria-hidden="true"
      />
    </div>
  );
}
