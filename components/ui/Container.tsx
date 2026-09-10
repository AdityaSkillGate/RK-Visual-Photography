import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: "default" | "narrow" | "wide" | "full";
  noPadding?: boolean;
}

const sizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-screen-2xl",
  full: "max-w-full",
};

export default function Container({
  as: Component = "div",
  size = "default",
  noPadding = false,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        !noPadding && "px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
