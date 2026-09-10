"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinkItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  links: NavLinkItem[];
}

export default function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-bronze-border bg-charcoal-900 text-ivory-200 transition-colors",
          "hover:border-gold-500/40 hover:text-gold-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
        )}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label="Open navigation menu"
      >
        <Menu size={18} aria-hidden="true" />
      </button>

      {/* Backdrop & Drawer Overlay */}
      {isOpen && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          className="fixed inset-0 z-[100] flex flex-col bg-charcoal-950/95 backdrop-blur-xl transition-all duration-300"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-bronze-border/40">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gold-500/40 p-0.5">
                <Image
                  src="/assets/logo/logo.png"
                  alt="RK Visual Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="font-display text-lg tracking-widest text-ivory-100 uppercase">
                RK Visual
              </span>
            </Link>

            <button
              ref={closeButtonRef}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-bronze-border bg-charcoal-900 text-ivory-200 transition-colors",
                "hover:border-gold-500/40 hover:text-gold-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
              )}
              aria-label="Close navigation menu"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-1 flex-col justify-center px-8 space-y-6">
            <span className="text-overline text-gold-400 tracking-widest uppercase">
              Directory
            </span>
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between border-b border-bronze-border/30 pb-4"
              >
                <span className="font-display text-3xl font-light text-ivory-100 tracking-wide transition-colors group-hover:text-gold-300">
                  {link.label}
                </span>
                <span className="text-xs font-mono text-sand-500 group-hover:text-gold-400">
                  0{index + 1}
                </span>
              </Link>
            ))}

            <div className="pt-4">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-full border border-gold-500/60 bg-gold-500/15 py-3 text-xs font-medium tracking-widest uppercase text-gold-300 shadow-gold-subtle transition-all hover:bg-gold-500/25 hover:text-ivory-50"
              >
                Inquire With Studio
              </Link>
            </div>
          </nav>

          {/* Bottom Studio Info */}
          <div className="border-t border-bronze-border/40 p-6 text-center space-y-1">
            <p className="text-xs font-light text-sand-400">
              Tamil Nadu, India • Fine Art & Weddings
            </p>
            <p className="text-[11px] text-sand-500 tracking-editorial uppercase">
              contact@rkvisual.com
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
