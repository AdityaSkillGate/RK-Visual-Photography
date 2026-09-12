"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function CinematicCurtain() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const brandTextRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const isFirstRender = useRef(true);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionActiveRef = useRef(false);
  const transitionStartRef = useRef(0);
  const failsafeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smoothly reveal new page
  const endTransition = useCallback(() => {
    const curtain = curtainRef.current;
    const monogram = monogramRef.current;
    if (!curtain || !monogram) {
      setIsTransitioning(false);
      transitionActiveRef.current = false;
      return;
    }

    if (failsafeTimerRef.current) {
      clearTimeout(failsafeTimerRef.current);
    }

    // Minimum display time (420ms) so user perceives the Aperture animation smoothly
    const elapsed = Date.now() - transitionStartRef.current;
    const minHold = 420;
    const delay = Math.max(0, minHold - elapsed);

    setTimeout(() => {
      gsap.killTweensOf([curtain, monogram, brandTextRef.current]);

      const tl = gsap.timeline({
        onComplete: () => {
          if (curtain) {
            curtain.style.display = "none";
          }
          setIsTransitioning(false);
          transitionActiveRef.current = false;
        },
      });

      tl.to(monogram, {
        scale: 1.06,
        opacity: 0,
        filter: "blur(4px)",
        duration: 0.24,
        ease: "power2.in",
      })
        .to(
          brandTextRef.current,
          {
            opacity: 0,
            y: -8,
            duration: 0.18,
            ease: "power2.in",
          },
          "-=0.18"
        )
        .to(
          curtain,
          {
            opacity: 0,
            duration: 0.28,
            ease: "power2.inOut",
          },
          "-=0.1"
        );
    }, delay);
  }, []);

  // Bring in the Aperture transition curtain on link click
  const startTransition = useCallback(() => {
    const curtain = curtainRef.current;
    const monogram = monogramRef.current;
    if (!curtain || !monogram) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    transitionActiveRef.current = true;
    transitionStartRef.current = Date.now();
    setIsTransitioning(true);

    if (failsafeTimerRef.current) {
      clearTimeout(failsafeTimerRef.current);
    }
    failsafeTimerRef.current = setTimeout(() => {
      endTransition();
    }, 2500);

    curtain.style.display = "flex";
    gsap.killTweensOf([curtain, monogram, brandTextRef.current, hairlineRef.current]);

    gsap.set(curtain, { opacity: 0 });
    gsap.set(monogram, { opacity: 0, scale: 0.88, filter: "blur(6px)" });
    if (brandTextRef.current) gsap.set(brandTextRef.current, { opacity: 0, y: 12 });
    if (hairlineRef.current) gsap.set(hairlineRef.current, { scaleX: 0, opacity: 1 });

    const tl = gsap.timeline();
    tl.to(curtain, {
      opacity: 1,
      duration: 0.2,
      ease: "power2.out",
    })
      .to(
        hairlineRef.current,
        {
          scaleX: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.12"
      )
      .to(
        monogram,
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.28,
          ease: "power3.out",
        },
        "-=0.18"
      )
      .to(
        brandTextRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: "power2.out",
        },
        "-=0.14"
      );
  }, [endTransition]);

  // Full route transition for programmatic or back/forward navigation
  const playFullRouteTransition = useCallback(() => {
    const curtain = curtainRef.current;
    const monogram = monogramRef.current;
    if (!curtain || !monogram) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    transitionActiveRef.current = true;
    setIsTransitioning(true);

    curtain.style.display = "flex";
    gsap.killTweensOf([curtain, monogram, brandTextRef.current, hairlineRef.current]);

    gsap.set(curtain, { opacity: 0 });
    gsap.set(monogram, { opacity: 0, scale: 0.88, filter: "blur(6px)" });
    if (brandTextRef.current) gsap.set(brandTextRef.current, { opacity: 0, y: 12 });
    if (hairlineRef.current) gsap.set(hairlineRef.current, { scaleX: 0, opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        if (curtain) curtain.style.display = "none";
        setIsTransitioning(false);
        transitionActiveRef.current = false;
      },
    });

    tl.to(curtain, { opacity: 1, duration: 0.2, ease: "power2.out" })
      .to(
        hairlineRef.current,
        { scaleX: 1, duration: 0.28, ease: "power2.out" },
        "-=0.12"
      )
      .to(
        monogram,
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.25,
          ease: "power3.out",
        },
        "-=0.16"
      )
      .to(
        brandTextRef.current,
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
        "-=0.14"
      )
      .to({}, { duration: 0.35 })
      .to(monogram, {
        scale: 1.06,
        opacity: 0,
        filter: "blur(4px)",
        duration: 0.22,
        ease: "power2.in",
      })
      .to(
        brandTextRef.current,
        { opacity: 0, y: -8, duration: 0.16, ease: "power2.in" },
        "-=0.16"
      )
      .to(
        curtain,
        { opacity: 0, duration: 0.25, ease: "power2.inOut" },
        "-=0.08"
      );
  }, []);

  // Intercept internal page link clicks immediately
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Ignore clicks with modifier keys
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      // Only process primary mouse click
      if (e.button !== 0 && e.button !== undefined) {
        return;
      }

      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      if (
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:") ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.getAttribute("download") !== null
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        if (targetUrl.origin === window.location.origin) {
          const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
          const nextPath = targetUrl.pathname.replace(/\/$/, "") || "/";
          if (nextPath !== currentPath) {
            startTransition();
          }
        }
      } catch {
        // Safe fallback
      }
    };

    const handlePopState = () => {
      startTransition();
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      if (failsafeTimerRef.current) clearTimeout(failsafeTimerRef.current);
    };
  }, [startTransition]);

  // Handle route change completion via pathname
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;

      if (transitionActiveRef.current) {
        endTransition();
      } else {
        playFullRouteTransition();
      }
    }
  }, [pathname, endTransition, playFullRouteTransition]);

  return (
    <div
      ref={curtainRef}
      role="status"
      aria-live="polite"
      aria-label="Loading RK Visual page"
      style={{ display: "none" }}
      className={`fixed inset-0 z-[9990] flex flex-col items-center justify-center bg-charcoal-950 select-none overflow-hidden ${
        isTransitioning ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Deep Charcoal Opening Ambient Radial Vignette */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(28,30,34,0.98)_0%,#08090B_100%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Hairline Accent at Top Edge */}
      <div
        ref={hairlineRef}
        className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-400/80 to-transparent transform-gpu origin-center pointer-events-none"
      />

      {/* Main RK Aperture Monogram Composition */}
      <div
        ref={monogramRef}
        className="relative flex flex-col items-center justify-center pointer-events-none"
      >
        {/* Monogram Shape with SVG/PNG Mask */}
        <div
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
          className="relative w-44 sm:w-60 md:w-72 lg:w-80 aspect-[447/404] overflow-hidden drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
        >
          {/* Real studio photograph gliding horizontally inside the RK letters */}
          <div
            style={{
              backgroundImage: "url(/assets/images/image8.png)",
              backgroundSize: "cover",
              backgroundPosition: "center 42%",
            }}
            className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] animate-aperture-drift"
          />

          {/* Gold Foil Grain Texture Overlay */}
          <div
            style={{
              backgroundImage: "url(/assets/logo/rk-monogram-gold-crop.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              mixBlendMode: "screen",
            }}
            className="absolute inset-0 w-full h-full pointer-events-none animate-aperture-pulse"
          />

          {/* Radiant Gold Shimmer Sweep */}
          <div
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-gold-200/60 to-transparent pointer-events-none animate-aperture-shimmer"
            aria-hidden="true"
          />
        </div>

        {/* Overture Brand Signature Typography */}
        <div
          ref={brandTextRef}
          className="mt-6 text-center space-y-1.5 pointer-events-none"
        >
          <div className="font-display text-xs sm:text-sm tracking-[0.35em] text-ivory-100 uppercase">
            RK Visual
          </div>
          <div className="text-[8.5px] sm:text-[9.5px] font-mono tracking-[0.3em] text-gold-400 uppercase">
            Fine-Art Wedding Cinema
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-gold-400 animate-ping" />
            <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-sand-500">
              Loading
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
