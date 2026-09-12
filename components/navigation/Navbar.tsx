"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MobileMenu from "@/components/navigation/MobileMenu";
import MagneticButton from "@/components/motion/MagneticButton";

export const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/stories", label: "Stories" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    // Only homepage coordinates with the intro sequence on first session visit
    const isHomepage = pathname === "/";
    if (isHomepage && typeof window !== "undefined") {
      const alreadySeen = sessionStorage.getItem("rk_intro_seen_v2") === "true";
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!alreadySeen && !prefersReducedMotion) {
        setIsVisible(false);
      }
    } else {
      setIsVisible(true);
    }

    const handleReveal = () => {
      setIsVisible(true);
    };

    window.addEventListener("rk-reveal-navbar", handleReveal);

    // Failsafe to ensure navbar is always revealed
    const failsafe = setTimeout(() => {
      setIsVisible(true);
    }, 2600);

    // Directional smart scroll handler
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      // Smart hide on fast downward scroll, reveal on upward scroll
      if (currentScrollY > 160) {
        if (currentScrollY > lastScrollY.current + 8) {
          // Scrolling down -> hide navbar to expand photography viewport
          setIsHeaderHidden(true);
        } else if (currentScrollY < lastScrollY.current - 6) {
          // Scrolling up -> instantly reveal navbar for intuitive navigation
          setIsHeaderHidden(false);
        }
      } else {
        // Near top -> always visible
        setIsHeaderHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("rk-reveal-navbar", handleReveal);
      clearTimeout(failsafe);
    };
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out will-change-transform ${
        !isVisible
          ? "opacity-0 -translate-y-6 pointer-events-none"
          : isHeaderHidden
          ? "opacity-0 -translate-y-full pointer-events-none"
          : "opacity-100 translate-y-0"
      } ${isScrolled ? "py-2 sm:py-2.5" : "py-3.5 sm:py-4"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between rounded-full border transition-all duration-500 ease-out ${
            isScrolled
              ? "border-gold-500/35 bg-charcoal-950/92 px-4 sm:px-5 py-2 sm:py-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
              : "border-bronze-border/50 bg-charcoal-900/80 px-4 sm:px-6 py-2.5 sm:py-3 shadow-2xl backdrop-blur-md"
          }`}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-full"
            aria-label="RK Visual Photography Home"
          >
            <div
              id="navbar-brand-logo"
              className={`relative overflow-hidden rounded-full border border-gold-500/40 p-0.5 transition-all duration-500 group-hover:scale-105 shrink-0 ${
                isScrolled ? "h-7 w-7 sm:h-8 sm:w-8" : "h-8 w-8 sm:h-9 sm:w-9"
              }`}
            >
              <Image
                src="/assets/logo/logo.png"
                alt="RK Logo"
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-display tracking-widest text-ivory-100 uppercase transition-all duration-500 ${
                  isScrolled
                    ? "text-xs sm:text-base leading-tight"
                    : "text-sm sm:text-lg leading-snug"
                }`}
              >
                RK Visual
              </span>
              <span className="text-[7.5px] sm:text-[9px] tracking-[0.22em] text-gold-400/90 uppercase">
                Photography
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative text-xs font-medium tracking-editorial uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm py-1 ${
                    isActive
                      ? "text-gold-300 font-semibold"
                      : "text-ivory-200/80 hover:text-gold-400"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-gold-400 shadow-gold-subtle" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions with Magnetic Pull */}
          <div className="flex items-center gap-2 sm:gap-3">
            <MagneticButton strength={0.25}>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-gold-500/50 bg-gold-500/10 px-2.5 sm:px-4 py-1.5 text-[10px] sm:text-xs font-medium tracking-editorial text-gold-300 transition-all duration-300 hover:border-gold-400 hover:bg-gold-500/20 hover:text-ivory-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 min-h-[36px]"
              >
                Inquire
              </Link>
            </MagneticButton>

            {/* Mobile Navigation Trigger */}
            <MobileMenu links={NAV_LINKS} />
          </div>
        </div>
      </div>
    </header>
  );
}
