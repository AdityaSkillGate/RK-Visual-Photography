"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface RKIntroAnimationProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export default function RKIntroAnimation({
  onComplete,
  forcePlay = false,
}: RKIntroAnimationProps) {
  const [isActive, setIsActive] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const photoLayerRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const goldTextureRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const finishAnimation = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rk_intro_seen", "true");
    }
    document.body.style.overflow = "";
    setIsActive(false);
    onCompleteRef.current?.();
  }, []);

  const skipIntro = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    const container = containerRef.current;
    if (container) {
      gsap.to(container, {
        opacity: 0,
        duration: 0.2,
        onComplete: finishAnimation,
      });
    } else {
      finishAnimation();
    }
  }, [finishAnimation]);

  useEffect(() => {
    // 1. Accessibility: Check for prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !forcePlay
    ) {
      finishAnimation();
      return;
    }

    // 2. Session check: Only play once per session unless forced
    if (typeof window !== "undefined" && !forcePlay) {
      const alreadySeen = sessionStorage.getItem("rk_intro_seen");
      if (alreadySeen === "true") {
        finishAnimation();
        return;
      }
    }

    // 3. Prevent background scrolling while intro is running
    document.body.style.overflow = "hidden";

    const isMobile = window.innerWidth < 768;
    const tl = gsap.timeline({
      onComplete: () => {
        finishAnimation();
      },
    });
    timelineRef.current = tl;

    // Elements
    const container = containerRef.current;
    const monogram = monogramRef.current;
    const photoLayer = photoLayerRef.current;
    const shimmer = shimmerRef.current;
    const goldTexture = goldTextureRef.current;
    const typography = typographyRef.current;

    if (!container || !monogram || !photoLayer || !shimmer) {
      finishAnimation();
      return;
    }

    // Initial setup states
    gsap.set(container, { opacity: 1 });
    gsap.set(monogram, { opacity: 0, scale: 0.94, y: 0, x: 0 });
    gsap.set(photoLayer, { scale: 1.05, x: -10, y: 0 });
    gsap.set(shimmer, { xPercent: -130, opacity: 0 });
    if (goldTexture) gsap.set(goldTexture, { opacity: 0.45 });
    if (typography) gsap.set(typography, { opacity: 0, y: 10 });

    // Choreographed GSAP Sequence (Target duration ~1.8s - 2.2s)
    // 0.1s: Monogram and typography emerge from deep charcoal
    tl.to(
      monogram,
      {
        opacity: 1,
        scale: 1,
        duration: isMobile ? 0.45 : 0.6,
        ease: "power2.out",
      },
      0.15
    )
      .to(
        typography,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        0.3
      )
      // Slow cinematic pan & zoom of the photo inside the RK letters
      .to(
        photoLayer,
        {
          scale: 1.18,
          x: 10,
          duration: isMobile ? 1.2 : 1.6,
          ease: "power1.out",
        },
        0.25
      )
      // Subtle gold light sweep across the letters
      .to(
        shimmer,
        {
          opacity: 1,
          xPercent: 140,
          duration: isMobile ? 0.8 : 1.0,
          ease: "power2.inOut",
        },
        0.45
      )
      // Tactile gold foil texture enrichment
      .to(
        goldTexture,
        {
          opacity: 0.75,
          duration: 0.5,
          ease: "sine.inOut",
        },
        0.6
      )
      // Slight breath / scale before transition
      .to(
        monogram,
        {
          scale: 1.04,
          duration: 0.35,
          ease: "power2.inOut",
        },
        isMobile ? 1.0 : 1.2
      )
      .to(
        typography,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
        },
        isMobile ? 1.0 : 1.2
      );

    // Dynamic morph toward Navbar Logo position
    tl.add(() => {
      const navLogoEl = document.getElementById("navbar-brand-logo");

      if (navLogoEl && monogram) {
        const navRect = navLogoEl.getBoundingClientRect();
        const monoRect = monogram.getBoundingClientRect();

        // Target center vs current center
        const deltaX =
          navRect.left + navRect.width / 2 - (monoRect.left + monoRect.width / 2);
        const deltaY =
          navRect.top +
          navRect.height / 2 -
          (monoRect.top + monoRect.height / 2);

        // Scale factor down to navbar logo size
        const targetScale = Math.max(
          0.12,
          navRect.width / (monoRect.width || 1)
        );

        gsap.to(monogram, {
          x: deltaX,
          y: deltaY,
          scale: targetScale,
          opacity: 0.1,
          duration: 0.6,
          ease: "power3.inOut",
        });
      } else {
        // Fallback if navbar logo is not found
        gsap.to(monogram, {
          scale: 1.15,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        });
      }

      // Simultaneously dissolve the background overlay to reveal the website
      gsap.to(container, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          finishAnimation();
        },
      });
    }, isMobile ? 1.25 : 1.5);

    // Keyboard shortcut to skip: [Escape]
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        skipIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Absolute failsafe timeout (2.8s max) to ensure site is never blocked
    const failsafe = setTimeout(() => {
      finishAnimation();
    }, 2800);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(failsafe);
      document.body.style.overflow = "";
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [forcePlay, finishAnimation, skipIntro]);

  if (!isActive) return null;

  return (
    <aside
      ref={containerRef}
      role="dialog"
      aria-label="Welcome to RK Visual Photography"
      aria-modal="true"
      onClick={skipIntro}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal-950 text-ivory-100 cursor-pointer select-none"
    >
      {/* Background ambient lighting vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(27,31,35,0.95)_0%,#0B0C0E_100%)] pointer-events-none" />

      {/* Skip button for user control & accessibility */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          skipIntro();
        }}
        className="absolute top-6 right-6 z-20 rounded-full border border-bronze-border/60 bg-charcoal-900/60 px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-sand-400 hover:text-gold-300 hover:border-gold-500/50 backdrop-blur-sm transition-colors"
        aria-label="Skip introductory animation"
      >
        Skip [Esc]
      </button>

      {/* Main RK Mask Monogram Showcase */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Monogram Frame */}
        <div
          ref={monogramRef}
          style={{
            WebkitMaskImage: "url(/assets/logo/rk-monogram-mask-crop.png)",
            maskImage: "url(/assets/logo/rk-monogram-mask-crop.png)",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
          className="relative w-48 sm:w-64 md:w-80 lg:w-96 aspect-[447/404] overflow-hidden drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
        >
          {/* Layer 1: Panning & Scaling Editorial Photography */}
          <div
            ref={photoLayerRef}
            style={{
              backgroundImage: "url(/assets/images/image8.png)",
              backgroundSize: "cover",
              backgroundPosition: "center 40%",
            }}
            className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)]"
          />

          {/* Layer 2: Subtle Antique Gold Foil Grain (Original Texture) */}
          <div
            ref={goldTextureRef}
            style={{
              backgroundImage: "url(/assets/logo/rk-monogram-gold-crop.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              mixBlendMode: "screen",
            }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Layer 3: Warm Gold Light Shimmer Sweep */}
          <div
            ref={shimmerRef}
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-gold-200/45 to-transparent pointer-events-none transform -skew-x-12"
          />
        </div>

        {/* Studio Typography Overture */}
        <div
          ref={typographyRef}
          className="mt-6 text-center space-y-1.5 pointer-events-none"
        >
          <div className="font-display text-sm sm:text-base tracking-[0.35em] text-ivory-100 uppercase">
            RK Visual
          </div>
          <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] text-gold-400 uppercase">
            Tamil Nadu • Editorial Photography
          </div>
        </div>
      </div>
    </aside>
  );
}
