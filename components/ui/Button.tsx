import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark" | "ivory";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles = {
  primary:
    "bg-gold-500 text-charcoal-950 hover:bg-gold-400 active:bg-gold-600 shadow-gold-subtle hover:shadow-gold-glow border border-gold-400/60",
  secondary:
    "border border-gold-500/40 bg-charcoal-900/80 text-gold-300 hover:border-gold-400 hover:bg-charcoal-850 hover:text-ivory-100",
  outline:
    "border border-bronze-border bg-transparent text-ivory-200 hover:border-gold-500/50 hover:bg-charcoal-900/50 hover:text-ivory-100",
  ghost:
    "bg-transparent text-sand-400 hover:bg-charcoal-900/60 hover:text-gold-300",
  dark:
    "bg-charcoal-deep text-ivory-warm hover:bg-charcoal-soft active:bg-black border border-charcoal-800 shadow-md",
  ivory:
    "bg-ivory-warm text-charcoal-deep hover:bg-white active:bg-ivory-card border border-ivory-border shadow-sm hover:shadow-md",
};

const sizeStyles = {
  sm: "px-3.5 py-1.5 text-xs tracking-editorial",
  md: "px-5 py-2.5 text-xs font-medium tracking-editorial",
  lg: "px-7 py-3 text-sm font-medium tracking-editorial",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 rounded-full uppercase transition-all duration-300 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            role="status"
            aria-label="Loading"
          />
        )}
        {!isLoading && leftIcon && (
          <span className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">
            {leftIcon}
          </span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
