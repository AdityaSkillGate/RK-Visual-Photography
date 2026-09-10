"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ImageReveal({
  children,
  className = "",
  delay = 0.1,
}: ImageRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
      className={`overflow-hidden will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
