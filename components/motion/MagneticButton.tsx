"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  enableShimmer?: boolean;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.28,
  onClick,
  enableShimmer = true,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch(
        window.matchMedia("(pointer: coarse)").matches ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }

    const buttonEl = buttonRef.current;
    const shimmerEl = shimmerRef.current;

    return () => {
      if (buttonEl) {
        gsap.killTweensOf(buttonEl);
      }
      if (shimmerEl) {
        gsap.killTweensOf(shimmerEl);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(buttonRef.current, {
      x: deltaX,
      y: deltaY,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleMouseEnter = () => {
    if (isTouch || !shimmerRef.current || !enableShimmer) return;

    // Specular gold shimmer sweep across the CTA
    gsap.fromTo(
      shimmerRef.current,
      { xPercent: -130, opacity: 0 },
      {
        xPercent: 140,
        opacity: 0.45,
        duration: 0.65,
        ease: "power2.out",
      }
    );
  };

  const handleMouseLeave = () => {
    if (isTouch || !buttonRef.current) return;

    setIsPressed(false);
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.65,
      ease: "elastic.out(1, 0.4)",
    });
  };

  const handleMouseDown = () => {
    if (isTouch || !buttonRef.current) return;
    setIsPressed(true);
    gsap.to(buttonRef.current, {
      scale: 0.96,
      duration: 0.15,
      ease: "power2.out",
    });
  };

  const handleMouseUp = () => {
    if (isTouch || !buttonRef.current) return;
    setIsPressed(false);
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      className={`relative inline-block will-change-transform transform-gpu overflow-hidden rounded-full ${className}`}
    >
      {/* Optional Specular Gold Shimmer Highlight */}
      {enableShimmer && (
        <div
          ref={shimmerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-gold-200/40 to-transparent transform -skew-x-12 opacity-0 z-20"
        />
      )}
      {children}
    </div>
  );
}
