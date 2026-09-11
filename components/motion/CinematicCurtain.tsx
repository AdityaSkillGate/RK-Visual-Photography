"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";

export default function CinematicCurtain() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const isFirstRender = useRef(true);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const playCurtainReveal = useCallback(() => {
    const curtain = curtainRef.current;
    const hairline = hairlineRef.current;
    const logo = logoRef.current;

    if (!curtain) return;

    // Check reduced motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        if (curtain) {
          gsap.set(curtain, { display: "none" });
        }
      },
    });

    // Make visible immediately
    curtain.style.display = "flex";

    // 2-Phase Luxury Curtain Timeline (~420ms total)
    // Phase 1: Rapid elegant entrance (180ms)
    tl.set(curtain, { transformOrigin: "bottom center", scaleY: 0, opacity: 1 })
      .set(hairline, { opacity: 1, scaleX: 0 })
      .set(logo, { opacity: 0, scale: 0.9 })
      .to(curtain, {
        scaleY: 1,
        duration: 0.18,
        ease: "power3.in",
      })
      .to(
        hairline,
        {
          scaleX: 1,
          duration: 0.15,
          ease: "power2.out",
        },
        "-=0.08"
      )
      .to(
        logo,
        {
          opacity: 0.85,
          scale: 1,
          duration: 0.12,
          ease: "power2.out",
        },
        "-=0.1"
      )
      // Phase 2: Smooth upward exit revealing new page (240ms)
      .to(logo, {
        opacity: 0,
        y: -10,
        duration: 0.12,
        ease: "power2.in",
      })
      .set(curtain, { transformOrigin: "top center" })
      .to(curtain, {
        scaleY: 0,
        duration: 0.24,
        ease: "power3.out",
      });
  }, []);

  // Trigger on route change (after initial mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      playCurtainReveal();
    }
  }, [pathname, playCurtainReveal]);

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      style={{ display: "none" }}
      className={`fixed inset-0 z-[9990] flex flex-col items-center justify-center bg-charcoal-950 will-change-transform ${
        isTransitioning ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Subtle Hairline Accent at Curtain Edge */}
      <div
        ref={hairlineRef}
        className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-400 to-transparent transform-gpu"
      />

      {/* Centered Monogram Watermark during transition */}
      <div
        ref={logoRef}
        className="relative flex flex-col items-center justify-center gap-2 transform-gpu"
      >
        <div className="relative h-12 w-12 overflow-hidden opacity-90">
          <Image
            src="/assets/logo/logo.png"
            alt="RK Visual"
            fill
            sizes="48px"
            className="object-contain filter brightness-110"
          />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-gold-400/80">
          RK Visual
        </span>
      </div>
    </div>
  );
}
