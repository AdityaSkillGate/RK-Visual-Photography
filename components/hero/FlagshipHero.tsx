"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight, ChevronDown, Play, Sparkles } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";
import { PublicProject } from "@/lib/supabase/queries";
import { SECTION_ASSETS } from "@/lib/assets/studio-imagery";

interface FlagshipHeroProps {
  featuredProjects?: PublicProject[];
  settings?: Record<string, any>;
}

export default function FlagshipHero({
  featuredProjects = [],
  settings,
}: FlagshipHeroProps) {
  const [introActive, setIntroActive] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Intro Sequence DOM Refs
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const introMonogramRef = useRef<HTMLDivElement>(null);
  const introPhotoInsideRef = useRef<HTMLDivElement>(null);
  const introGoldOutlineRef = useRef<HTMLDivElement>(null);
  const introShimmerRef = useRef<HTMLDivElement>(null);
  const introBrandTextRef = useRef<HTMLDivElement>(null);

  // Hero Section Elements Refs
  const heroContainerRef = useRef<HTMLElement>(null);
  const heroBackdropRef = useRef<HTMLDivElement>(null);
  const heroCenterMaskRef = useRef<HTMLDivElement>(null);
  const heroMaskPhotoRef = useRef<HTMLDivElement>(null);
  const heroMaskGoldRef = useRef<HTMLDivElement>(null);
  const heroPanelLeftRef = useRef<HTMLDivElement>(null);
  const heroPanelRightRef = useRef<HTMLDivElement>(null);
  const heroEyebrowRef = useRef<HTMLDivElement>(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const heroSublineRef = useRef<HTMLParagraphElement>(null);
  const heroCtasRef = useRef<HTMLDivElement>(null);
  const heroScrollIndicatorRef = useRef<HTMLDivElement>(null);

  // GSAP Animation and Tween trackers
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const ambientTweensRef = useRef<gsap.core.Tween[]>([]);

  // Stable ref so finishIntro can call the carousel without a forward-reference
  const startCinematicPanelCarouselRef = useRef<(() => void) | null>(null);

  // Cinematic Panel Carousel refs
  // "Flying clone" – the div that physically animates from right panel → mask → left panel
  const flyingCloneRef = useRef<HTMLDivElement>(null);
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isCarouselRunningRef = useRef(false);

  // Image state for dynamic panel swaps
  const [rightPanelSrc, setRightPanelSrc] = useState("");
  const [leftPanelSrc, setLeftPanelSrc] = useState("");
  const [maskPhotoSrc, setMaskPhotoSrc] = useState("");

  // Label state for the panel badges
  const [rightPanelLabel, setRightPanelLabel] = useState("Bridal • 01");
  const [leftPanelLabel, setLeftPanelLabel] = useState("Pre-Wedding • 02");

  // Studio imagery selections (real photographs from public/assets/images)
  const backdropImage = "/assets/images/image.png"; // Sunset silhouette

  // Full image pool — project covers + fallback statics
  const imagePoolRef = useRef<{ src: string; label: string }[]>([]);

  // Populate image pool once on first render
  useEffect(() => {
    const projectImages = (featuredProjects || []).slice(0, 8).map((p, i) => ({
      src: p.cover_image_url || `/assets/images/image${i + 1}.png`,
      label: p.title ? p.title.slice(0, 18) : `Story • 0${i + 1}`,
    }));
    const staticImages = [
      { src: "/assets/images/image8.png", label: "Chandelier • 01" },
      { src: "/assets/images/image9.png", label: "Coastal • 02" },
      { src: "/assets/images/image6.png", label: "Bridal • 03" },
      { src: "/assets/images/image1.png", label: "Heritage • 04" },
      { src: "/assets/images/image2.png", label: "Golden • 05" },
      { src: "/assets/images/image3.png", label: "Portrait • 06" },
      { src: "/assets/images/image4.png", label: "Ceremony • 07" },
      { src: "/assets/images/image5.png", label: "Twilight • 08" },
      { src: "/assets/images/image7.png", label: "Gardens • 09" },
      { src: "/assets/images/image10.png", label: "Palace • 10" },
    ];
    // Merge: project images first, then fill with statics not already used
    const usedSrcs = new Set(projectImages.map((p) => p.src));
    const pool = [
      ...projectImages,
      ...staticImages.filter((s) => !usedSrcs.has(s.src)),
    ];
    imagePoolRef.current = pool.length >= 3 ? pool : [...staticImages];

    // Set initial display values
    const pool0 = imagePoolRef.current;
    setMaskPhotoSrc(pool0[0]?.src || "/assets/images/image8.png");
    setRightPanelSrc(pool0[1]?.src || "/assets/images/image6.png");
    setLeftPanelSrc(pool0[2]?.src || "/assets/images/image9.png");
    setRightPanelLabel(pool0[1]?.label || "Bridal • 01");
    setLeftPanelLabel(pool0[2]?.label || "Pre-Wedding • 02");
  }, [featuredProjects]);

  // Ambient Ken Burns slow floating drift on hero layers
  const startAmbientMotion = useCallback(() => {
    // Clear any existing tweens
    ambientTweensRef.current.forEach((t) => t.kill());
    ambientTweensRef.current = [];

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // 1. Backdrop breathing pulse (scale 1.00 -> 1.05 over 20s)
    if (heroBackdropRef.current) {
      const t1 = gsap.to(heroBackdropRef.current, {
        scale: 1.05,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      ambientTweensRef.current.push(t1);
    }

    // 2. Photo inside RK mask: continuous subtle horizontal movement (-3% -> +3% over 10s)
    if (heroMaskPhotoRef.current) {
      const t2 = gsap.to(heroMaskPhotoRef.current, {
        xPercent: 4,
        scale: 1.1,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      ambientTweensRef.current.push(t2);
    }

    // 3. Central Monogram card: slow vertical drift
    if (heroCenterMaskRef.current) {
      const t3 = gsap.to(heroCenterMaskRef.current, {
        y: -12,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      ambientTweensRef.current.push(t3);
    }

    // 4. Left foreground panel: counter-directional drift & subtle tilt
    if (heroPanelLeftRef.current) {
      const t4 = gsap.to(heroPanelLeftRef.current, {
        y: 14,
        x: -6,
        rotate: 1.2,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
      ambientTweensRef.current.push(t4);
    }

    // 5. Right foreground panel: subtle float
    if (heroPanelRightRef.current) {
      const t5 = gsap.to(heroPanelRightRef.current, {
        y: -10,
        x: 6,
        rotate: -1.0,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      ambientTweensRef.current.push(t5);
    }
  }, []);

  // Complete intro and trigger permanent hero reveal
  const finishIntro = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rk_flagship_intro_seen_v2", "true");
      sessionStorage.setItem("rk_intro_seen_v2", "true");
      window.dispatchEvent(new CustomEvent("rk-reveal-navbar"));
    }
    document.body.style.overflow = "";
    setIntroActive(false);

    if (introOverlayRef.current) {
      gsap.to(introOverlayRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          if (introOverlayRef.current) {
            introOverlayRef.current.style.display = "none";
          }
        },
      });
    }

    // Reveal hero elements seamlessly if not already shown
    const heroElements = [
      heroEyebrowRef.current,
      heroHeadlineRef.current,
      heroSublineRef.current,
      heroCtasRef.current,
      heroCenterMaskRef.current,
      heroPanelLeftRef.current,
      heroPanelRightRef.current,
      heroBackdropRef.current,
      heroScrollIndicatorRef.current,
    ].filter(Boolean);

    gsap.to(heroElements, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: "power2.out",
      onComplete: () => {
        startAmbientMotion();
        startCinematicPanelCarouselRef.current?.();
      },
    });
  }, [startAmbientMotion]);

  // Instant skip on Escape key or click
  const skipIntro = useCallback(() => {
    if (masterTimelineRef.current) {
      masterTimelineRef.current.kill();
    }
    finishIntro();
  }, [finishIntro]);

  // Execute 10-Step Cinematic GSAP Sequence
  const playCinematicSequence = useCallback(
    (forceReplay = false) => {
      // Accessibility check: bypass long animation if reduced motion preferred (unless user explicitly hit Replay)
      if (
        !forceReplay &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        finishIntro();
        return;
      }

      setIntroActive(true);
      document.body.style.overflow = "hidden";

      if (forceReplay && typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }

      if (introOverlayRef.current) {
        introOverlayRef.current.style.display = "flex";
        introOverlayRef.current.style.opacity = "1";
      }

      // Kill previous timeline if active
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill();
      }

      const tl = gsap.timeline({
        onComplete: finishIntro,
      });
      masterTimelineRef.current = tl;

      // 1. Dark charcoal canvas setup & reset all elements
      tl.set(introOverlayRef.current, { opacity: 1 })
        .set(introMonogramRef.current, { opacity: 0, scale: 0.82, filter: "blur(8px)" })
        .set(introPhotoInsideRef.current, { opacity: 0, scale: 1.25, xPercent: -6 })
        .set(introGoldOutlineRef.current, { opacity: 0 })
        .set(introShimmerRef.current, { xPercent: -120 })
        .set(introBrandTextRef.current, { opacity: 0, y: 15 });

      // 2. RK Monogram appears (0.45s)
      tl.to(introMonogramRef.current, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
      })
        // 3. Gold outline and tactile texture reveal (0.35s)
        .to(
          introGoldOutlineRef.current,
          {
            opacity: 0.85,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.2"
        )
        // 4. Photography appears inside RK mask (0.5s)
        .to(
          introPhotoInsideRef.current,
          {
            opacity: 1,
            scale: 1.05,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.25"
        )
        // 5. Image moves horizontally & gold shimmer sweeps across letters (0.6s)
        .to(
          introPhotoInsideRef.current,
          {
            xPercent: 3,
            duration: 0.9,
            ease: "sine.inOut",
          },
          "-=0.3"
        )
        .to(
          introShimmerRef.current,
          {
            xPercent: 120,
            duration: 0.7,
            ease: "power2.inOut",
          },
          "-=0.8"
        )
        // 6. Brand overture typography enters
        .to(
          introBrandTextRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // 7. RK expands gently as intro completes into the hero
        .to(introMonogramRef.current, {
          scale: 1.08,
          opacity: 0.95,
          duration: 0.45,
          ease: "power2.inOut",
        })
        .to(introOverlayRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
    },
    [finishIntro]
  );

  const hasCheckedSessionRef = useRef(false);

  // Initialize and handle session logic (runs once on mount)
  useEffect(() => {
    setIsClient(true);
    if (hasCheckedSessionRef.current) return;
    hasCheckedSessionRef.current = true;

    const hasSeenIntro =
      sessionStorage.getItem("rk_flagship_intro_seen_v2") === "true" ||
      sessionStorage.getItem("rk_intro_seen_v2") === "true";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!hasSeenIntro && !prefersReducedMotion) {
      playCinematicSequence(false);
    } else {
      finishIntro();
    }
  }, [playCinematicSequence, finishIntro]);

  // Handle Escape key to skip overture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && introActive) {
        skipIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [introActive, skipIntro]);

  // =========================================================================
  // CINEMATIC PANEL ORBIT CAROUSEL
  // Right panel ──► scales up & flies to RK Mask center
  //             ──► mask photo crossfades to new image
  //             ──► panel shrinks down into left panel position
  //             ──► old left panel disappears
  //             ──► new image appears in right panel ──► repeat
  // =========================================================================
  const startCinematicPanelCarousel = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    if (isCarouselRunningRef.current) return;
    isCarouselRunningRef.current = true;

    // Indices tracking which pool slot fills each position
    let maskIdx = 0;
    let rightIdx = 1;
    let leftIdx = 2;

    const runCycle = () => {
      const pool = imagePoolRef.current;
      if (!pool || pool.length < 3) return;
      if (!heroPanelRightRef.current || !heroPanelLeftRef.current) return;
      if (!heroCenterMaskRef.current || !heroMaskPhotoRef.current) return;
      if (!flyingCloneRef.current) return;

      const rightPanel = heroPanelRightRef.current;
      const leftPanel = heroPanelLeftRef.current;
      const centerMask = heroCenterMaskRef.current;
      const maskPhotoEl = heroMaskPhotoRef.current;
      const clone = flyingCloneRef.current;

      // Live bounding rects
      const rightRect = rightPanel.getBoundingClientRect();
      const leftRect = leftPanel.getBoundingClientRect();
      const maskRect = centerMask.getBoundingClientRect();

      const rightCx = rightRect.left + rightRect.width / 2;
      const rightCy = rightRect.top + rightRect.height / 2;
      const maskCx = maskRect.left + maskRect.width / 2;
      const maskCy = maskRect.top + maskRect.height / 2;
      const leftCx = leftRect.left + leftRect.width / 2;
      const leftCy = leftRect.top + leftRect.height / 2;

      const cloneW = rightRect.width;
      const cloneH = rightRect.height;
      const scaleToMask = Math.max(maskRect.width / cloneW, maskRect.height / cloneH) * 1.08;
      const scaleToLeft = leftRect.width / cloneW;

      // Next image slot
      const nextRightIdx = (leftIdx + 1) % pool.length;

      const tl = gsap.timeline({
        onComplete: () => {
          // Advance pool cursors
          maskIdx = rightIdx;
          leftIdx = maskIdx;
          rightIdx = nextRightIdx;
          // Wait 2s before next orbit
          carouselTimerRef.current = setTimeout(runCycle, 2000);
        },
      });

      // ── PHASE 1: Set clone at right panel position ───────────────────────
      gsap.set(clone, {
        display: "block",
        position: "fixed",
        opacity: 1,
        width: cloneW,
        height: cloneH,
        left: rightCx - cloneW / 2,
        top: rightCy - cloneH / 2,
        scale: 1,
        borderRadius: "16px",
        zIndex: 9995,
        backgroundImage: `url(${pool[rightIdx].src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.85), 0 0 0 1.5px rgba(197,168,128,0.4)",
      });

      // Hide actual right panel during flight
      tl.set(rightPanel, { opacity: 0 });

      // ── PHASE 2: Right panel → Center mask (scale up, fly to RK mask) ────
      tl.to(clone, {
        left: maskCx - cloneW / 2,
        top: maskCy - cloneH / 2,
        scale: scaleToMask,
        borderRadius: "28px",
        boxShadow: "0 40px 120px rgba(0,0,0,0.9), 0 0 0 2px rgba(212,175,55,0.6)",
        duration: 0.9,
        ease: "power3.inOut",
      });

      // Brief hold at center (100ms pause)
      tl.to({}, { duration: 0.1 });

      // ── PHASE 3: Crossfade the RK mask photo ─────────────────────────────
      tl.to(maskPhotoEl, {
        opacity: 0,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          const newSrc = pool[rightIdx].src;
          if (heroMaskPhotoRef.current) {
            heroMaskPhotoRef.current.style.backgroundImage = `url(${newSrc})`;
          }
          setMaskPhotoSrc(newSrc);
        },
      }, "-=0.15");

      tl.to(maskPhotoEl, {
        opacity: 1,
        duration: 0.38,
        ease: "power2.out",
      });

      // ── PHASE 4: Center → Left panel (shrink, fly to left position) ──────
      tl.to(clone, {
        left: leftCx - cloneW / 2,
        top: leftCy - cloneH / 2,
        scale: scaleToLeft,
        borderRadius: "14px",
        boxShadow: "0 16px 48px rgba(0,0,0,0.8), 0 0 0 1.5px rgba(197,168,128,0.3)",
        duration: 0.8,
        ease: "power3.inOut",
        delay: 0.12,
      });

      // Fade out old left panel while clone moves in
      tl.to(leftPanel, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      }, "-=0.55");

      // ── PHASE 5: Swap panel React state and reveal ────────────────────────
      tl.add(() => {
        setLeftPanelSrc(pool[rightIdx].src);
        setLeftPanelLabel(pool[rightIdx].label);
        setRightPanelSrc(pool[nextRightIdx].src);
        setRightPanelLabel(pool[nextRightIdx].label);
      });

      tl.to(leftPanel, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });

      tl.to(rightPanel, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      }, "-=0.25");

      // ── PHASE 6: Hide the flying clone ────────────────────────────────────
      tl.to(clone, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      }, "-=0.3");

      tl.set(clone, { display: "none" });
    };

    // First orbit starts 2.2s after ambient motion
    carouselTimerRef.current = setTimeout(runCycle, 2200);
  }, []);

  // Keep the carousel launcher ref up to date so finishIntro can safely call it
  useEffect(() => {
    startCinematicPanelCarouselRef.current = startCinematicPanelCarousel;
  }, [startCinematicPanelCarousel]);

  // Clean up tweens on unmount
  useEffect(() => {
    return () => {
      ambientTweensRef.current.forEach((t) => t.kill());
      if (masterTimelineRef.current) masterTimelineRef.current.kill();
      if (carouselTimerRef.current) clearTimeout(carouselTimerRef.current);
      isCarouselRunningRef.current = false;
    };
  }, []);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. CINEMATIC OVERTURE INTRO OVERLAY (10-Step GSAP Timeline) */}
      {/* ========================================================================= */}
      <div
        ref={introOverlayRef}
        role="dialog"
        aria-label="Welcome to RK Visual Photography"
        aria-modal="true"
        onClick={skipIntro}
        style={{ display: introActive ? "flex" : "none" }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal-950 text-ivory-100 cursor-pointer select-none"
      >
        {/* Deep Charcoal Radial Ambient Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,27,30,0.95)_0%,#090A0C_100%)] pointer-events-none" />

        {/* Skip button for user agency & accessibility */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            skipIntro();
          }}
          className="absolute top-6 right-6 z-20 rounded-full border border-gold-500/30 bg-charcoal-900/80 px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-sand-300 hover:text-gold-300 hover:border-gold-400 backdrop-blur-md transition-colors"
          aria-label="Skip introductory animation"
        >
          Skip [Esc]
        </button>

        {/* RK Monogram Core Mask Animation */}
        <div className="relative flex flex-col items-center justify-center pointer-events-none">
          <div
            ref={introMonogramRef}
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
            className="relative w-52 sm:w-72 md:w-88 lg:w-96 aspect-[447/404] overflow-hidden drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]"
          >
            {/* Step 4 & 5: Real photography glides horizontally inside RK letters */}
            <div
              ref={introPhotoInsideRef}
              style={{
                backgroundImage: maskPhotoSrc ? `url(${maskPhotoSrc})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center 42%",
              }}
              className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)]"
            />

            {/* Step 3: Tactile Gold Texture & Outline */}
            <div
              ref={introGoldOutlineRef}
              style={{
                backgroundImage: "url(/assets/logo/rk-monogram-gold-crop.png)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                mixBlendMode: "screen",
              }}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Step 5: Light Shimmer Sweep */}
            <div
              ref={introShimmerRef}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-gold-200/50 to-transparent pointer-events-none -skew-x-12"
            />
          </div>

          {/* Overture Studio Brand Signature */}
          <div
            ref={introBrandTextRef}
            className="mt-6 text-center space-y-1.5 pointer-events-none"
          >
            <div className="font-display text-base sm:text-lg tracking-[0.35em] text-ivory-100 uppercase">
              RK Visual Photography
            </div>
            <div className="text-[10px] font-mono tracking-[0.3em] text-gold-400 uppercase">
              Fine-Art Wedding Cinema • Tamil Nadu
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FLAGSHIP HERO 2.0 (Layered Cinematic Editorial Composition) */}
      {/* ========================================================================= */}
      <section
        ref={heroContainerRef}
        id="flagship-hero"
        aria-label="Flagship Hero Presentation"
        className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-charcoal-deep text-ivory-100 px-4 sm:px-6 lg:px-8 pt-24 pb-8"
      >
        {/* Layer 1: Atmospheric Real Photography Backdrop with Subtle Breathing Movement */}
        <div
          ref={heroBackdropRef}
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-20 mix-blend-luminosity will-change-transform"
        >
          <Image
            src={backdropImage}
            alt="Atmospheric South Indian sunset horizon"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center scale-105"
          />
          {/* Subtle Dark Charcoal Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/90 via-charcoal-deep/40 to-charcoal-deep" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#141414_85%)]" />
        </div>

        {/* Ambient Warm Gold Radiance Spot */}
        <div
          className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-gold-500/[0.07] blur-[150px] rounded-full -z-10"
          aria-hidden="true"
        />

        {/* ======================================================================= */}
        {/* MAIN COMPOSITION: Editorial Headline, Monogram Mask & Layered Panels */}
        {/* ======================================================================= */}
        <div className="mx-auto max-w-7xl w-full my-auto py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Bold Editorial Headline & Conversion CTAs */}
            <div className="lg:col-span-6 space-y-5 z-10">
              {/* Studio Presence Pill & Replay Control */}
              <div
                ref={heroEyebrowRef}
                className="flex flex-wrap items-center gap-2 sm:gap-3"
              >
                <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/35 bg-charcoal-900/80 px-3.5 py-1 text-[9.5px] sm:text-xs uppercase tracking-widest text-gold-400 backdrop-blur-md shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse shrink-0" />
                  <span className="font-mono truncate">
                    Tamil Nadu, India • Available Worldwide
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => playCinematicSequence(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-bronze-border/70 bg-charcoal-900/60 px-3 py-1 text-[9.5px] sm:text-[10px] uppercase font-mono tracking-widest text-sand-300 hover:text-gold-300 hover:border-gold-400/50 transition-colors"
                  title="Replay Signature Cinematic Sequence"
                >
                  <Play size={8} className="text-gold-400" />
                  <span>Replay Overture</span>
                </button>
              </div>

              {/* Editorial Overline */}
              <div>
                <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gold-400/90 font-semibold block">
                  Fine-Art Weddings &amp; Cinematography
                </span>
              </div>

              {/* Short, Confident Brand Statement */}
              <h1
                ref={heroHeadlineRef}
                className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-light leading-[1.08] text-ivory-100 tracking-tightest"
              >
                CAPTURING STORIES <br />
                THAT LIVE <br />
                <span className="italic font-normal text-gold-300">
                  BEYOND THE FRAME.
                </span>
              </h1>

              {/* Supporting Business Discipline Line */}
              <p
                ref={heroSublineRef}
                className="text-xs sm:text-sm md:text-base text-sand-300 font-light max-w-lg leading-relaxed pt-1"
              >
                Weddings • Pre-Weddings • Portraits • Events • Films
              </p>

              {/* High-Conversion Dual CTAs */}
              <div
                ref={heroCtasRef}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3"
              >
                {/* Primary CTA: EXPLORE OUR WORK */}
                <MagneticButton strength={0.25}>
                  <Link
                    href="/work"
                    className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-gold-500 px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 transition-all duration-300 hover:bg-gold-bright shadow-gold-subtle hover:scale-[1.02] min-h-[48px]"
                  >
                    <span>EXPLORE OUR WORK</span>
                    <ArrowRight size={14} />
                  </Link>
                </MagneticButton>

                {/* Secondary CTA: START AN INQUIRY */}
                <MagneticButton strength={0.2}>
                  <Link
                    href="/contact"
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-gold-500/35 bg-charcoal-900/80 px-7 py-3.5 text-xs font-medium uppercase tracking-editorial text-ivory-100 hover:border-gold-400 hover:text-gold-300 transition-all min-h-[48px]"
                  >
                    <span>START AN INQUIRY</span>
                  </Link>
                </MagneticButton>
              </div>
            </div>

            {/* Right Column: Layered Composition (Center RK Mask + Floating Editorial Frames) */}
            <div className="lg:col-span-6 relative flex justify-center items-center py-4 lg:py-0">
              {/* Layer 2: Central SVG-Based Large RK Monogram Mask */}
              <div
                ref={heroCenterMaskRef}
                className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-[440px] aspect-[447/404] rounded-3xl border border-bronze-border/70 bg-charcoal-950/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl group overflow-hidden"
              >
                {/* Embedded SVG Mask Definition */}
                <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
                  <defs>
                    <mask
                      id="flagship-rk-mask"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="447"
                      height="404"
                    >
                      <image
                        href="/assets/logo/rk-monogram-mask-crop.png"
                        x="0"
                        y="0"
                        width="447"
                        height="404"
                      />
                    </mask>
                  </defs>
                </svg>

                {/* Mask Container */}
                <div
                  style={{
                    WebkitMaskImage: "url(/assets/logo/rk-monogram-mask-crop.png)",
                    maskImage: "url(/assets/logo/rk-monogram-mask-crop.png)",
                    mask: "url(#flagship-rk-mask)",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }}
                  className="relative w-full h-full overflow-hidden"
                >
                   {/* Moving photography inside RK letters */}
                  <div
                    ref={heroMaskPhotoRef}
                    style={{
                      backgroundImage: maskPhotoSrc ? `url(${maskPhotoSrc})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center 42%",
                    }}
                    className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] transition-transform duration-1000 ease-out group-hover:scale-110"
                  />

                  {/* Gold Monogram Overlay Texture */}
                  <div
                    ref={heroMaskGoldRef}
                    style={{
                      backgroundImage: "url(/assets/logo/rk-monogram-gold-crop.png)",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      mixBlendMode: "screen",
                      opacity: 0.65,
                    }}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />
                </div>

                {/* Monogram Meta Badge */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-gold-400/90 pt-2 border-t border-bronze-border/40">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={11} className="text-gold-400" />
                    <span>RK Signature Mask</span>
                  </span>
                  <span className="text-sand-400">Tamil Nadu</span>
                </div>
              </div>

              {/* Layer 3A: Floating Left Editorial Panel — image cycles via carousel */}
              <div
                ref={heroPanelLeftRef}
                className="hidden sm:block absolute -bottom-6 -left-6 lg:-bottom-8 lg:-left-8 z-20 w-36 sm:w-44 lg:w-48 aspect-[3/4] overflow-hidden rounded-2xl border border-gold-500/30 bg-charcoal-950/95 p-1.5 shadow-2xl backdrop-blur-md"
              >
                <div className="relative w-full h-full overflow-hidden rounded-xl">
                  {leftPanelSrc && (
                    <Image
                      src={leftPanelSrc}
                      alt="Editorial fine-art panel — cycling story"
                      fill
                      sizes="(max-width: 768px) 150px, 200px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-[8.5px] font-mono uppercase tracking-widest text-gold-300">
                    {leftPanelLabel}
                  </div>
                </div>
              </div>

              {/* Layer 3B: Floating Right Editorial Panel — image cycles via carousel */}
              <div
                ref={heroPanelRightRef}
                className="hidden lg:block absolute -top-4 -right-4 z-20 w-36 lg:w-40 aspect-[3/4] overflow-hidden rounded-2xl border border-gold-500/30 bg-charcoal-950/95 p-1.5 shadow-2xl backdrop-blur-md"
              >
                <div className="relative w-full h-full overflow-hidden rounded-xl">
                  {rightPanelSrc && (
                    <Image
                      src={rightPanelSrc}
                      alt="Editorial fine-art panel — cycling story"
                      fill
                      sizes="180px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-[8.5px] font-mono uppercase tracking-widest text-gold-300">
                    {rightPanelLabel}
                  </div>
                </div>
              </div>

              {/* Flying Clone — the GSAP-animated panel that orbits right → center → left */}
              <div
                ref={flyingCloneRef}
                aria-hidden="true"
                style={{
                  display: "none",
                  position: "fixed",
                  pointerEvents: "none",
                  willChange: "transform, opacity, left, top",
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section Progress & Scroll Indicator */}
        <div
          ref={heroScrollIndicatorRef}
          className="mx-auto flex flex-col items-center gap-1 text-sand-400/80 hover:text-gold-300 transition-colors pointer-events-auto cursor-pointer pt-2"
        >
          <a
            href="#manifesto"
            className="flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 rounded-md p-1"
            aria-label="Scroll to studio philosophy"
          >
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-sand-400">
              DISCOVER THE ARTISTRY
            </span>
            <ChevronDown size={14} className="animate-bounce text-gold-400" />
          </a>
        </div>
      </section>
    </>
  );
}
