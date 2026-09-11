"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ParallaxWrapperProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  offset?: number;
}

export default function ParallaxWrapper({
  children,
  className = "",
  speed = 0.08, // Restrained luxury parallax (subtle depth without dizziness)
  offset = 25,
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile, { passive: true });
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [-offset * speed, offset * speed]
  );

  // If mobile or reduced motion, render static to preserve mobile battery & 60fps performance
  if (shouldReduceMotion || isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`will-change-transform transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
}
