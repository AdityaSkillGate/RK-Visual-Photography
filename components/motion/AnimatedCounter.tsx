"use client";

import React, { useState, useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: string | number;
  label?: string;
  className?: string;
  numberClassName?: string;
  suffixClassName?: string;
  duration?: number; // ms, default 2000
}

/**
 * Parses strings like "10+", "500+", "1200+", "15", ">25" into:
 * { prefix, targetNum, suffix, hasComma }
 */
function parseValueString(val: string | number) {
  const str = String(val).trim();
  const match = str.match(/^([^0-9]*)([0-9,]+(?:\.[0-9]+)?)(.*)$/);

  if (!match) {
    return { prefix: "", targetNum: 0, suffix: str, hasComma: false };
  }

  const prefix = match[1] || "";
  const rawNumStr = match[2] || "0";
  const suffix = match[3] || "";
  const hasComma = rawNumStr.includes(",");
  const targetNum = parseFloat(rawNumStr.replace(/,/g, ""));

  return {
    prefix,
    targetNum: isNaN(targetNum) ? 0 : targetNum,
    suffix,
    hasComma,
  };
}

export default function AnimatedCounter({
  value,
  label = "",
  className = "",
  numberClassName = "",
  suffixClassName = "",
  duration = 2000,
}: AnimatedCounterProps) {
  const [currentNum, setCurrentNum] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLSpanElement | null>(null);

  const parsed = parseValueString(value);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      setIsReducedMotion(prefersReduced);
      if (prefersReduced) {
        setCurrentNum(parsed.targetNum);
        setHasAnimated(true);
      }
    }
  }, [parsed.targetNum]);

  // Viewport observer to trigger animation
  useEffect(() => {
    if (isReducedMotion || hasAnimated) return;

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setCurrentNum(parsed.targetNum);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();

          const startTime = performance.now();
          const target = parsed.targetNum;

          // easeOutExpo function for luxury deceleration
          const easeOutExpo = (t: number) =>
            t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.floor(easedProgress * target);

            setCurrentNum(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCurrentNum(target);
            }
          };

          requestAnimationFrame(step);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, isReducedMotion, parsed.targetNum, duration]);

  // Format displayed number
  const displayedDigits = parsed.hasComma
    ? currentNum.toLocaleString("en-US")
    : currentNum.toString();

  return (
    <span
      ref={containerRef}
      className={`inline-flex items-baseline ${className}`}
    >
      {/* Screen-reader accessible complete readout */}
      <span className="sr-only">
        {value} {label}
      </span>

      {/* Visual animated representation */}
      <span aria-hidden="true" className="inline-flex items-baseline select-none">
        {parsed.prefix && (
          <span className="mr-0.5 opacity-80">{parsed.prefix}</span>
        )}
        <span className={numberClassName}>{displayedDigits}</span>
        {parsed.suffix && (
          <span className={suffixClassName || "text-gold-400 font-serif ml-0.5"}>
            {parsed.suffix}
          </span>
        )}
      </span>
    </span>
  );
}
