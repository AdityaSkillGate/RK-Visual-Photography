"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PortfolioHoverCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function PortfolioHoverCard({
  children,
  className = "",
}: PortfolioHoverCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch(
        window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
      );
    }
  }, []);

  if (shouldReduceMotion || isTouch) {
    return <div className={`group ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1], // luxury easeOutExpo
      }}
      className={`group will-change-transform transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
}
