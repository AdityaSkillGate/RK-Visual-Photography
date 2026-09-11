"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TextClipRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "blockquote";
}

export default function TextClipReveal({
  children,
  className = "",
  delay = 0.1,
  duration = 0.8,
  as: Component = "div",
}: TextClipRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect accessibility reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (textRef.current) {
        gsap.set(textRef.current, { yPercent: 0, opacity: 1 });
      }
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (textRef.current && containerRef.current) {
        gsap.fromTo(
          textRef.current,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 95%",
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [delay, duration]);

  return (
    <Component ref={containerRef as any} className={`overflow-hidden block ${className}`}>
      <span ref={textRef} className="block will-change-transform transform-gpu">
        {children}
      </span>
    </Component>
  );
}
