"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => void;
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export const useLenis = () => useContext(LenisContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisState, setLenisState] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Respect accessibility reduced-motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Luxury restrained scroll configuration
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.0, // Restrained for tactile touch control
    });

    lenisRef.current = lenis;
    setLenisState(lenis);

    // Synchronize Lenis scroll updates with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Bridge Lenis RAF into GSAP's central master ticker
    const rafTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(rafTicker);
      lenis.destroy();
      lenisRef.current = null;
      setLenisState(null);

      // Clean up all ScrollTriggers on teardown to prevent memory leaks
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Handle route changes: reset scroll to top immediately & refresh ScrollTriggers
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    // Give DOM time to mount before recalculating ScrollTrigger positions
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  const scrollTo = useCallback(
    (
      target: number | string | HTMLElement,
      options?: { offset?: number; immediate?: boolean; duration?: number }
    ) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
      } else if (typeof window !== "undefined") {
        if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: options?.immediate ? "instant" : "smooth" });
        } else if (typeof target === "string") {
          const el = document.querySelector(target);
          el?.scrollIntoView({ behavior: options?.immediate ? "instant" : "smooth" });
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: options?.immediate ? "instant" : "smooth" });
        }
      }
    },
    []
  );

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  return (
    <LenisContext.Provider
      value={{
        lenis: lenisState,
        scrollTo,
        stop,
        start,
      }}
    >
      {children}
    </LenisContext.Provider>
  );
}
