"use client";

import React, { useState, useEffect } from "react";

interface EditorialMarqueeProps {
  items?: string[];
  text?: string;
  separator?: string;
  direction?: "ltr" | "rtl";
  speed?: number; // seconds per cycle
  pauseOnHover?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "subtle";
}

export default function EditorialMarquee({
  items,
  text,
  separator = "✦",
  direction = "rtl",
  speed = 32,
  pauseOnHover = true,
  className = "",
  variant = "primary",
}: EditorialMarqueeProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }
  }, []);

  // Format array of content
  const contentItems = items || (text ? text.split(" ") : []);

  // Variant styles
  const variantStyles = {
    primary:
      "border-y border-bronze-border/50 bg-charcoal-950/80 py-4 text-ivory-100 font-display text-lg sm:text-xl md:text-2xl tracking-[0.2em]",
    secondary:
      "border-y border-gold-500/20 bg-charcoal-900/60 py-3 text-gold-400 font-mono text-xs sm:text-sm tracking-[0.3em]",
    subtle:
      "border-y border-bronze-border/30 bg-transparent py-3 text-sand-400 font-body text-xs sm:text-sm tracking-widest",
  };

  // Render a single sequence of words + separators
  const renderSequence = (keyPrefix: string) => (
    <div className="flex shrink-0 items-center gap-6 sm:gap-8 px-3 sm:px-4 select-none">
      {contentItems.map((item, idx) => (
        <React.Fragment key={`${keyPrefix}-${idx}`}>
          <span className="uppercase whitespace-nowrap font-light transition-colors hover:text-gold-300">
            {item}
          </span>
          <span
            aria-hidden="true"
            className="text-gold-400/70 text-[0.7em] shrink-0 font-normal"
          >
            {separator}
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  // If reduced motion is requested, display a clean static centered banner
  if (isReducedMotion) {
    return (
      <div
        className={`w-full overflow-hidden ${variantStyles[variant]} ${className}`}
      >
        <div className="mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4 text-center">
          {contentItems.map((item, idx) => (
            <React.Fragment key={`static-${idx}`}>
              <span className="uppercase tracking-widest font-light">{item}</span>
              {idx < contentItems.length - 1 && (
                <span className="text-gold-400 text-xs">{separator}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  const animationDuration = `${speed}s`;
  const animationDirection = direction === "rtl" ? "marquee-rtl" : "marquee-ltr";

  return (
    <div
      className={`group relative w-full overflow-hidden ${variantStyles[variant]} ${className}`}
      aria-label="Editorial Brand Highlights"
    >
      {/* Side gradient feathering for smooth infinite entrance/exit */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-charcoal-950 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-charcoal-950 to-transparent z-10" />

      {/* Seamless Dual-Loop Track (0% to -50% translation = zero jump glitch) */}
      <div
        className={`flex w-max will-change-transform transform-gpu ${
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
        }`}
        style={{
          animation: `${animationDirection} ${animationDuration} linear infinite`,
        }}
      >
        {/* Render 4 repeated sequences so wide ultra-high-res screens always have seamless continuity */}
        {renderSequence("seq-1")}
        {renderSequence("seq-2")}
        {renderSequence("seq-3")}
        {renderSequence("seq-4")}
      </div>

      {/* Inline styles for the seamless keyframes to ensure zero dependency on external css */}
      <style jsx>{`
        @keyframes marquee-rtl {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes marquee-ltr {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
