"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight, ChevronDown, Play, Sparkles, MapPin } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";
import RKHeroMask from "@/components/hero/RKHeroMask";
import { SECTION_ASSETS } from "@/lib/assets/studio-imagery";
import { PublicProject } from "@/lib/supabase/queries";

interface HeroExperience2Props {
  featuredProjects: PublicProject[];
  settings?: Record<string, any>;
}

export default function HeroExperience2({
  featuredProjects,
  settings,
}: HeroExperience2Props) {
  const [isClient, setIsClient] = useState(false);
  const [introActive, setIntroActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Intro overlay refs
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const introMonogramRef = useRef<HTMLDivElement>(null);
  const introPhoto1Ref = useRef<HTMLDivElement>(null);
  const introPhoto2Ref = useRef<HTMLDivElement>(null);
  const introGoldRef = useRef<HTMLDivElement>(null);
  const introShimmerRef = useRef<HTMLDivElement>(null);
  const introTypographyRef = useRef<HTMLDivElement>(null);

  // Hero section elements refs
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroEyebrowRef = useRef<HTMLDivElement>(null);
  const heroOverlineRef = useRef<HTMLDivElement>(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroCtasRef = useRef<HTMLDivElement>(null);
  const heroMaskCardRef = useRef<HTMLDivElement>(null);
  const heroSecondaryCardRef = useRef<HTMLDivElement>(null);
  const heroBackdropRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // GSAP Timeline & animation refs
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const ambientTweensRef = useRef<gsap.core.Tween[]>([]);

  // Studio imagery assets
  const leadImage =
    featuredProjects[0]?.cover_image_url || SECTION_ASSETS.rkMask.monogramPhoto.src;
  const secondaryImage =
    featuredProjects[1]?.cover_image_url || "/assets/images/image9.png";
  const backdropImage = "/assets/images/image.png";

  // Asynchronous Ken-Burns movement on permanent hero layers
  const startAmbientPhotographyDrift = useCallback(() => {
    // Clear previous tweens
    ambientTweensRef.current.forEach((t) => t.kill());
    ambientTweensRef.current = [];

    // Check reduced motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Layer 1: Main RK Mask card — slow subtle floating drift (9s sine wave)
    if (heroMaskCardRef.current) {
      const tween1 = gsap.to(heroMaskCardRef.current, {
        y: -10,
        x: 6,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      ambientTweensRef.current.push(tween1);
    }

    // Layer 2: Floating Secondary card — counter-directional drift (13s power1)
    if (heroSecondaryCardRef.current) {
      const tween2 = gsap.to(heroSecondaryCardRef.current, {
        y: 12,
        x: -8,
        rotate: 1.5,
        duration: 13,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
      ambientTweensRef.current.push(tween2);
    }

    // Layer 3: Atmospheric backdrop — slow breathing pulse (18s sine)
    if (heroBackdropRef.current) {
      const tween3 = gsap.to(heroBackdropRef.current, {
        scale: 1.05,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      ambientTweensRef.current.push(tween3);
    }
  }, []);

  // Mark intro completed and notify navbar
  const finishIntro = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rk_intro_seen_v2", "true");
      window.dispatchEvent(new CustomEvent("rk-reveal-navbar"));
    }
    document.body.style.overflow = "";
    setIntroActive(false);

    // Fade out overlay if still present
    if (introOverlayRef.current) {
      gsap.to(introOverlayRef.current, {
        opacity: 0,
        duration: 0.35,
        onComplete: () => {
          if (introOverlayRef.current) {
            introOverlayRef.current.style.display = "none";
          }
        },
      });
    }

    // Start permanent asynchronous photography drift
    startAmbientPhotographyDrift();
  }, [startAmbientPhotographyDrift]);

  // Instant skip on Escape or click
  const skipIntro = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    // Instantly reveal hero copy
    const elements = [
      heroEyebrowRef.current,
      heroOverlineRef.current,
      heroHeadlineRef.current,
      heroSubtitleRef.current,
      heroCtasRef.current,
      heroMaskCardRef.current,
      heroSecondaryCardRef.current,
      scrollIndicatorRef.current,
    ].filter(Boolean);

    gsap.set(elements, { opacity: 1, y: 0, scale: 1 });
    finishIntro();
  }, [finishIntro]);

  // 10-Step GSAP Timeline sequence
  const playCinematicSequence = useCallback(
    (force = false) => {
      if (typeof window === "undefined") return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const alreadySeen = sessionStorage.getItem("rk_intro_seen_v2") === "true";

      // If reduced motion or already seen (and not forced replay), skip directly
      if ((prefersReducedMotion || alreadySeen) && !force) {
        finishIntro();
        return;
      }

      setIntroActive(true);
      document.body.style.overflow = "hidden";

      const overlay = introOverlayRef.current;
      const monogram = introMonogramRef.current;
      const photo1 = introPhoto1Ref.current;
      const photo2 = introPhoto2Ref.current;
      const gold = introGoldRef.current;
      const shimmer = introShimmerRef.current;
      const typography = introTypographyRef.current;

      if (!overlay || !monogram || !photo1 || !photo2) {
        finishIntro();
        return;
      }

      // Ensure overlay is visible
      overlay.style.display = "flex";
      gsap.set(overlay, { opacity: 1 });

      // Initial GSAP setup states
      gsap.set(monogram, { opacity: 0, scale: 0.92, y: 0, x: 0 });
      gsap.set(photo1, { opacity: 0, x: -22, scale: 1.05 });
      gsap.set(photo2, { opacity: 0, scale: 1.02 });
      if (gold) gsap.set(gold, { opacity: 0.3 });
      if (shimmer) gsap.set(shimmer, { xPercent: -130, opacity: 0 });
      if (typography) gsap.set(typography, { opacity: 0, y: 12 });

      // Prepare hero copy initial hidden states
      const heroCopyElements = [
        heroEyebrowRef.current,
        heroOverlineRef.current,
        heroHeadlineRef.current,
        heroSubtitleRef.current,
        heroCtasRef.current,
      ].filter(Boolean);

      gsap.set(heroCopyElements, { opacity: 0, y: 22 });
      if (heroMaskCardRef.current) gsap.set(heroMaskCardRef.current, { opacity: 0, scale: 0.96 });
      if (heroSecondaryCardRef.current) gsap.set(heroSecondaryCardRef.current, { opacity: 0, y: 30 });
      if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 10 });

      const mobile = window.innerWidth < 768;
      const tl = gsap.timeline({
        onComplete: () => {
          finishIntro();
        },
      });
      timelineRef.current = tl;

      // STEP 1: RK appears from deep charcoal
      tl.to(
        monogram,
        {
          opacity: 1,
          scale: 1,
          duration: mobile ? 0.35 : 0.45,
          ease: "power2.out",
        },
        0.1
      );

      // STEP 2: Photography fades into the mask + gold texture illuminates
      tl.to(
        photo1,
        {
          opacity: 1,
          duration: 0.35,
          ease: "power2.inOut",
        },
        0.3
      )
        .to(
          gold,
          {
            opacity: 0.65,
            duration: 0.4,
            ease: "sine.inOut",
          },
          0.35
        )
        .to(
          typography,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          0.35
        );

      // STEP 3: Image slowly moves horizontally
      tl.to(
        photo1,
        {
          x: 18,
          duration: mobile ? 0.8 : 1.1,
          ease: "power1.out",
        },
        0.45
      );

      // STEP 4: Second image subtly scales and cross-fades into view
      tl.to(
        photo2,
        {
          opacity: 0.95,
          scale: 1.12,
          duration: mobile ? 0.6 : 0.8,
          ease: "power2.out",
        },
        0.8
      );

      // STEP 5: RK gently expands + light shimmer sweep
      tl.to(
        monogram,
        {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.inOut",
        },
        1.1
      )
        .to(
          shimmer,
          {
            opacity: 1,
            xPercent: 140,
            duration: 0.7,
            ease: "power2.inOut",
          },
          1.0
        )
        .to(
          typography,
          {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
          },
          1.2
        );

      // STEP 6: Hero begins revealing (dissolving the intro overlay)
      tl.to(
        overlay,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        1.4
      );

      // STEP 7: RK transitions toward the navbar brand position
      tl.add(() => {
        const navLogo = document.getElementById("navbar-brand-logo");
        if (navLogo && monogram) {
          const navRect = navLogo.getBoundingClientRect();
          const monoRect = monogram.getBoundingClientRect();

          const deltaX =
            navRect.left + navRect.width / 2 - (monoRect.left + monoRect.width / 2);
          const deltaY =
            navRect.top + navRect.height / 2 - (monoRect.top + monoRect.height / 2);
          const targetScale = Math.max(0.12, navRect.width / (monoRect.width || 1));

          gsap.to(monogram, {
            x: deltaX,
            y: deltaY,
            scale: targetScale,
            opacity: 0,
            duration: 0.55,
            ease: "power3.inOut",
          });
        }
      }, 1.45);

      // STEP 8: Navbar becomes visible
      tl.add(() => {
        window.dispatchEvent(new CustomEvent("rk-reveal-navbar"));
      }, 1.6);

      // STEP 9: Hero copy enters with staggered editorial entrance
      tl.to(
        heroCopyElements,
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.65,
          ease: "power3.out",
        },
        1.65
      );

      // Permanent Hero Photography Cards reveal
      if (heroMaskCardRef.current) {
        tl.to(
          heroMaskCardRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: "power2.out",
          },
          1.7
        );
      }

      if (heroSecondaryCardRef.current) {
        tl.to(
          heroSecondaryCardRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          1.8
        );
      }

      // STEP 10: Scroll indicator appears
      if (scrollIndicatorRef.current) {
        tl.to(
          scrollIndicatorRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          2.0
        );
      }

      // Failsafe timeout to ensure site is never trapped
      const failsafe = setTimeout(() => {
        finishIntro();
      }, 2900);

      return () => clearTimeout(failsafe);
    },
    [finishIntro]
  );

  // Mount logic
  useEffect(() => {
    setIsClient(true);
    setIsMobile(window.innerWidth < 768);

    // Check keyboard Escape to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        skipIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Reframe as secondary section: start ambient drift without duplicate blocking overlay
    finishIntro();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (timelineRef.current) timelineRef.current.kill();
      ambientTweensRef.current.forEach((t) => t.kill());
    };
  }, [finishIntro, playCinematicSequence, skipIntro]);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. CINEMATIC OPENING INTRO OVERLAY (10-Step GSAP Timeline) */}
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
        {/* Deep Charcoal Opening Ambient Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(27,31,35,0.96)_0%,#08090B_100%)] pointer-events-none" />

        {/* Skip button for user control & accessibility */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            skipIntro();
          }}
          className="absolute top-6 right-6 z-20 rounded-full border border-bronze-border/70 bg-charcoal-900/70 px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-sand-400 hover:text-gold-300 hover:border-gold-500/50 backdrop-blur-sm transition-colors"
          aria-label="Skip introductory animation"
        >
          Skip [Esc]
        </button>

        {/* Main RK Mask Monogram Choreography */}
        <div className="relative flex flex-col items-center justify-center">
          {/* RK Monogram Shape with SVG / CSS Mask */}
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
            className="relative w-48 sm:w-64 md:w-80 lg:w-96 aspect-[447/404] overflow-hidden drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)]"
          >
            {/* Step 2 & 3: Photo 1 (Chandelier proposal) moving horizontally */}
            <div
              ref={introPhoto1Ref}
              style={{
                backgroundImage: `url(${leadImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center 40%",
              }}
              className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)]"
            />

            {/* Step 4: Photo 2 (Coastal twilight gown) subtly scaling */}
            <div
              ref={introPhoto2Ref}
              style={{
                backgroundImage: `url(${secondaryImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center 50%",
              }}
              className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)]"
            />

            {/* Subtle Gold Foil Grain Texture */}
            <div
              ref={introGoldRef}
              style={{
                backgroundImage: "url(/assets/logo/rk-monogram-gold-crop.png)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                mixBlendMode: "screen",
              }}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Step 5: Gold Light Shimmer Sweep */}
            <div
              ref={introShimmerRef}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-gold-200/50 to-transparent pointer-events-none transform -skew-x-12"
            />
          </div>

          {/* Overture Typography */}
          <div
            ref={introTypographyRef}
            className="mt-6 text-center space-y-1 pointer-events-none"
          >
            <div className="font-display text-sm sm:text-base tracking-[0.35em] text-ivory-100 uppercase">
              RK Visual
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] text-gold-400 uppercase">
              Fine-Art Wedding Cinema
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PERMANENT HERO 2.0 (Multi-Layer Asynchronous Photography Composition) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 2. SIGNATURE APERTURE CHAPTER (Interactive RK Monogram Storytelling) */}
      {/* ========================================================================= */}
      <section
        ref={heroSectionRef}
        id="aperture"
        aria-label="The RK Signature Aperture"
        className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-charcoal-deep text-ivory-100 overflow-hidden"
      >
        {/* Layer 3: Atmospheric Golden Hour Ambient Backdrop */}
        <div
          ref={heroBackdropRef}
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-10 mix-blend-luminosity"
        >
          <Image
            src={backdropImage}
            alt="Atmospheric wedding horizon"
            fill
            sizes="100vw"
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/90 via-charcoal-950/40 to-charcoal-950" />
        </div>

        {/* Ambient Top Glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gold-500/5 blur-[120px] rounded-full -z-10"
          aria-hidden="true"
        />

        {/* Main Section Grid Composition */}
        <div className="mx-auto max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Confident Editorial Typography & Dual CTAs */}
            <div className="lg:col-span-6 space-y-4 lg:space-y-5 z-10">
              {/* Studio Presence Eyebrow & Replay Control */}
              <div
                ref={heroEyebrowRef}
                className="flex flex-wrap items-center gap-2 sm:gap-3"
              >
                <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-gold-500/30 bg-charcoal-900/80 px-3 sm:px-3.5 py-1 text-[9px] sm:text-xs uppercase tracking-widest text-gold-400 backdrop-blur-sm shadow-sm max-w-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse shrink-0" />
                  <span className="truncate">CHAPTER 02 — THE RK SIGNATURE</span>
                </div>

                <button
                  type="button"
                  onClick={() => playCinematicSequence(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-charcoal-900/60 px-2.5 sm:px-3 py-1 text-[9.5px] sm:text-[10px] uppercase font-mono tracking-widest text-sand-400 hover:text-gold-300 hover:border-gold-500/50 transition-colors shrink-0"
                  title="Replay Signature Monogram Aperture Sequence"
                >
                  <Play size={8} className="text-gold-400" />
                  <span>Replay Aperture</span>
                </button>
              </div>

              {/* Editorial Overline */}
              <div ref={heroOverlineRef}>
                <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gold-400/90 font-semibold block">
                  The Geometry of Memory
                </span>
              </div>

              {/* Short, Confident Headline */}
              <h2
                ref={heroHeadlineRef}
                className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[3.8rem] font-light leading-[1.12] text-ivory-100 tracking-tightest"
              >
                The Art of the <br />
                <span className="italic font-normal text-gold-300">Aperture.</span>
              </h2>

              {/* Editorial Subtitle */}
              <p
                ref={heroSubtitleRef}
                className="max-w-lg text-xs sm:text-sm md:text-base text-sand-300 font-light leading-relaxed pt-0.5"
              >
                Experience our bespoke interactive monogram aperture. An homage to golden hour light, architectural balance, and the unscripted cadence of South Indian weddings.
              </p>

              {/* Interactive Dual CTAs */}
              <div
                ref={heroCtasRef}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
              >
                {/* Primary CTA: EXPLORE GALLERY */}
                <MagneticButton strength={0.25}>
                  <Link
                    href="/work"
                    className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-gold-500 px-7 py-3.5 sm:py-3 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 transition-all duration-300 hover:bg-gold-400 shadow-gold-subtle hover:scale-[1.02] min-h-[48px]"
                  >
                    <span>EXPLORE ALL ARCHIVES</span>
                    <ArrowRight size={14} />
                  </Link>
                </MagneticButton>

                {/* Secondary CTA: START AN INQUIRY */}
                <MagneticButton strength={0.2}>
                  <Link
                    href="/contact"
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-bronze-border bg-charcoal-900/90 px-6 py-3.5 sm:py-3 text-xs font-medium uppercase tracking-editorial text-sand-300 hover:border-gold-500/50 hover:text-ivory-100 transition-colors min-h-[48px]"
                  >
                    <span>COMMISSION THE STUDIO</span>
                  </Link>
                </MagneticButton>
              </div>
            </div>

            {/* Right Column: Multi-Layer Asynchronous Photography Layers */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              {/* Layer 1: Central Signature RK Mask Aperture Card (9s slow sine drift) */}
              <div
                ref={heroMaskCardRef}
                className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-[430px]"
              >
                <RKHeroMask
                  imageUrl={leadImage}
                  title={featuredProjects[0]?.title || "Vikram & Deepa — Royal Chettinad"}
                  location={featuredProjects[0]?.location || "Karaikudi, Tamil Nadu"}
                  altText="Signature RK Mask & fine-art South Indian wedding ceremony"
                />
              </div>

              {/* Layer 2: Floating Secondary Editorial Frame (13s counter-drift) — Hidden on tiny mobile screens for performance */}
              <div
                ref={heroSecondaryCardRef}
                className="hidden sm:block absolute -bottom-6 -left-6 lg:-bottom-6 lg:-left-8 z-20 w-40 sm:w-44 lg:w-48 aspect-[3/4] overflow-hidden rounded-2xl border border-bronze-border/80 bg-charcoal-950/90 p-2 shadow-2xl backdrop-blur-md transition-transform"
              >
                <div className="relative w-full h-full overflow-hidden rounded-xl">
                  <Image
                    src={secondaryImage}
                    alt="Coastal twilight pre-wedding session"
                    fill
                    sizes="(max-width: 768px) 150px, 220px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-gold-400">
                    <span className="truncate">Pre-Wedding</span>
                    <span>02 / Film</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
