import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TextLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  showArrow?: boolean;
  variant?: "gold" | "ivory" | "muted";
}

const variantClasses = {
  gold: "text-gold-400 hover:text-gold-300",
  ivory: "text-ivory-200 hover:text-gold-400",
  muted: "text-sand-400 hover:text-ivory-100",
};

export default function TextLink({
  href,
  external = false,
  showArrow = false,
  variant = "ivory",
  className,
  children,
  ...props
}: TextLinkProps) {
  const isExternal = external || href.startsWith("http");

  const content = (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
        {children}
      </span>
      {showArrow && (
        <ArrowUpRight
          size={14}
          className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </span>
  );

  const sharedClasses = cn(
    "group inline-flex items-center text-xs font-medium tracking-editorial uppercase transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 rounded-sm",
    variantClasses[variant],
    className
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClasses}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={sharedClasses} {...props}>
      {content}
    </Link>
  );
}
