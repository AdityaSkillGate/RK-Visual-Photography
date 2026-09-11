"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export default function SectionReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
  yOffset = 24, // Restrained luxury vertical offset
}: SectionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // luxury easeOutExpo
      }}
      className={`will-change-transform transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
}
