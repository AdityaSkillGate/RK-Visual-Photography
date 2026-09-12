"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, ArrowUpRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key and prevent background scroll
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

  const whatsappMessage = encodeURIComponent(
    "Vanakkam RK Visual Studio, I would like to inquire about wedding photography and date availability."
  );

  return (
    <div className="md:hidden">
      {/* Trigger Button (Min 44x44px touch target) */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-bronze-border bg-charcoal-900 text-ivory-200 transition-colors",
          "hover:border-gold-500/40 hover:text-gold-300 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
        )}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label="Open navigation menu"
      >
        <Menu size={19} aria-hidden="true" />
      </button>

      {/* Backdrop & Drawer Overlay */}
      {isOpen && mounted && createPortal(
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          className="fixed inset-0 z-[100] flex flex-col bg-charcoal-950/98 backdrop-blur-2xl transition-all duration-300"
        >
          {/* Top Bar with Safe-Area Inset */}
          <div className="flex items-center justify-between px-5 sm:px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-4 border-b border-bronze-border/40">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5"
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
              <span className="font-display text-base sm:text-lg tracking-widest text-ivory-100 uppercase">
                RK Visual
              </span>
            </Link>

            <button
              ref={closeButtonRef}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-bronze-border bg-charcoal-900 text-ivory-200 transition-colors",
                "hover:border-gold-500/40 hover:text-gold-300 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
              )}
              aria-label="Close navigation menu"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </div>

          {/* Navigation Links with 48px+ Tap Targets */}
          <nav className="flex flex-1 flex-col justify-center px-6 sm:px-8 space-y-2 overflow-y-auto py-6">
            <span className="text-[10px] font-mono text-gold-400 tracking-widest uppercase block mb-1">
              Studio Directory
            </span>
            {links.map((link, index) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center justify-between border-b border-bronze-border/25 py-3 sm:py-3.5 transition-colors ${
                    isActive ? "text-gold-300 font-semibold" : "text-ivory-100 hover:text-gold-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-400 shadow-gold-subtle" />
                    )}
                    <span className="font-display text-2xl sm:text-3xl font-light tracking-wide">
                      {link.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-sand-500 group-hover:text-gold-400">
                    0{index + 1}
                  </span>
                </Link>
              );
            })}

            {/* Quick Inquire Button */}
            <div className="pt-4">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gold-500/60 bg-gold-500/15 py-3.5 text-xs font-semibold tracking-widest uppercase text-gold-300 shadow-gold-subtle transition-all active:scale-98 hover:bg-gold-500/25 min-h-[48px]"
              >
                <span>Reserve Your Celebration Date</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </nav>

          {/* Bottom Instant Direct Contact Conversion Row */}
          <div className="border-t border-bronze-border/40 p-4 sm:p-5 pb-[max(1.2rem,env(safe-area-inset-bottom))] bg-charcoal-900/60">
            <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
              <a
                href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-950/30 py-2.5 px-1 text-center transition-all active:scale-95 text-emerald-300"
              >
                <WhatsAppIcon size={16} className="text-emerald-400" />
                <span className="text-[9.5px] font-semibold uppercase tracking-editorial">WhatsApp</span>
              </a>

              <a
                href="tel:+919876543210"
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-gold-500/30 bg-charcoal-850 py-2.5 px-1 text-center transition-all active:scale-95 text-gold-300"
              >
                <Phone size={15} className="text-gold-400" />
                <span className="text-[9.5px] font-semibold uppercase tracking-editorial">Call</span>
              </a>

              <a
                href="mailto:contact@rkvisual.com"
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-bronze-border/60 bg-charcoal-850 py-2.5 px-1 text-center transition-all active:scale-95 text-sand-300"
              >
                <Mail size={15} className="text-sand-400" />
                <span className="text-[9.5px] font-semibold uppercase tracking-editorial">Email</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
