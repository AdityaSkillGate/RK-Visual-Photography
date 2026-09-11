"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollScaleImageProps {
  children: React.ReactNode;
  className?: string;
  initialScale?: number;
  targetScale?: number;
}

export default function ScrollScaleImage({
  children,
  className = "",
  initialScale = 1.08, // Subtly zoomed in on entrance
  targetScale = 1.0,  // Settles into 1.0 as it passes the viewport center
}: ScrollScaleImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;

    // On mobile or reduced motion, skip scroll scrubbing to preserve 60fps
    if (prefersReducedMotion || isMobile) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (innerRef.current && containerRef.current) {
        gsap.fromTo(
          innerRef.current,
          { scale: initialScale },
          {
            scale: targetScale,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [initialScale, targetScale]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative will-change-transform ${className}`}
    >
      <div ref={innerRef} className="w-full h-full transform-gpu">
        {children}
      </div>
    </div>
  );
}
