"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Calendar, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { trackChatbotEventAction } from "@/app/admin/(dashboard)/chatbot/actions";

export default function MobileStickyCTA() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Automatically hide on the contact page (user is already on the inquiry form)
  const isContactPage = pathname === "/contact";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Smart behavior: keep visible by default, but gently minimize during rapid scroll down
      if (currentScrollY > 200) {
        if (currentScrollY > lastScrollY.current + 25) {
          // Scrolling down rapidly -> slide down slightly
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current - 15) {
          // Scrolling up -> instantly restore
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isContactPage) {
    return null;
  }

  const handleCTAClick = (action: string, target: string) => {
    trackChatbotEventAction("mobile_sticky_cta_clicked", { action, target, page: pathname }, pathname);
  };

  const whatsappMessage = encodeURIComponent(
    "Vanakkam RK Visual Studio, I would like to inquire about wedding photography and date availability."
  );

  return (
    <aside
      aria-label="Quick booking actions"
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ease-out will-change-transform ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Frosted Luxury Glass Container */}
      <div className="border-t border-gold-500/25 bg-charcoal-950/92 backdrop-blur-2xl px-3 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.85)]">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2">
          {/* 1. WhatsApp Action */}
          <a
            href={`https://wa.me/919876543210?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleCTAClick("whatsapp", "https://wa.me/919876543210")}
            className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/30 py-2 px-1 text-center transition-all active:scale-95 active:bg-emerald-900/40"
            aria-label="Chat on WhatsApp"
          >
            <div className="relative flex items-center justify-center">
              <WhatsAppIcon size={17} className="text-emerald-400" />
              <span className="absolute -top-0.5 -right-1 flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
            </div>
            <span className="mt-1 text-[10px] font-semibold tracking-editorial uppercase text-emerald-300">
              WhatsApp
            </span>
          </a>

          {/* 2. Primary Enquire Action (Center Spotlight) */}
          <Link
            href="/contact"
            onClick={() => handleCTAClick("enquire", "/contact")}
            className="flex flex-[1.6] items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 py-2.5 px-3 text-center shadow-gold-subtle transition-all active:scale-95 text-charcoal-950 font-bold"
            aria-label="Enquire and reserve dates"
          >
            <Calendar size={15} className="text-charcoal-950 shrink-0" />
            <span className="text-[11px] font-bold tracking-editorial uppercase">
              Enquire
            </span>
            <ArrowRight size={13} className="text-charcoal-950 shrink-0 opacity-80" />
          </Link>

          {/* 3. Call Action */}
          <a
            href="tel:+919876543210"
            onClick={() => handleCTAClick("call", "tel:+919876543210")}
            className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-gold-500/30 bg-charcoal-900/90 py-2 px-1 text-center transition-all active:scale-95 active:bg-charcoal-850"
            aria-label="Call studio phone"
          >
            <Phone size={16} className="text-gold-400" />
            <span className="mt-1 text-[10px] font-medium tracking-editorial uppercase text-gold-300">
              Call
            </span>
          </a>
        </div>
      </div>
    </aside>
  );
}
