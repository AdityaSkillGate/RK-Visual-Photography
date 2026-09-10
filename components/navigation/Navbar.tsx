"use client";

import React, { useState, useEffect } from "react";
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
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled ? "py-2 sm:py-2.5" : "py-4 sm:py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between rounded-full border transition-all duration-500 ease-out ${
            isScrolled
              ? "border-gold-500/30 bg-charcoal-950/90 px-4 sm:px-6 py-2 sm:py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl"
              : "border-bronze-border/50 bg-charcoal-900/80 px-4 sm:px-6 py-2.5 sm:py-3 shadow-2xl backdrop-blur-md"
          }`}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-full"
            aria-label="RK Visual Photography Home"
          >
            <div
              id="navbar-brand-logo"
              className={`relative overflow-hidden rounded-full border border-gold-500/40 p-0.5 transition-all duration-500 group-hover:scale-105 ${
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
                    ? "text-sm sm:text-base leading-tight"
                    : "text-base sm:text-lg leading-snug"
                }`}
              >
                RK Visual
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.25em] text-gold-400/90 uppercase">
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
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-gold-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions with Magnetic Pull */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <MagneticButton strength={0.25}>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-gold-500/50 bg-gold-500/10 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-medium tracking-editorial text-gold-300 transition-all duration-300 hover:border-gold-400 hover:bg-gold-500/20 hover:text-ivory-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
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
