"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import RKImage from "@/components/ui/RKImage";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import MagneticButton from "@/components/motion/MagneticButton";
import type { ServiceRow } from "@/lib/supabase/queries";

interface InteractiveServicesSectionProps {
  services: ServiceRow[];
  className?: string;
}

export default function InteractiveServicesSection({
  services,
  className = "",
}: InteractiveServicesSectionProps) {
  // Only display where those services are actually offered (is_active === true)
  const activeServices = (services || [])
    .filter((svc) => svc.is_active)
    .sort((a, b) => a.order_index - b.order_index);

  const [activeIndex, setActiveIndex] = useState(0);

  if (activeServices.length === 0) {
    return null;
  }

  const currentService = activeServices[activeIndex] || activeServices[0];

  return (
    <section id="services" className={`relative px-4 sm:px-6 lg:px-8 ${className}`}>
      <Container size="wide">
        {/* Section Header */}
        <SectionReveal yOffset={25}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-bronze-border/60 pb-8 mb-12">
            <div className="space-y-3">
              <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                Studio Offerings
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-light text-ivory-100 tracking-tight">
                Services &amp; Bespoke Commissions
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                Documenting sacred family rituals, destination romances, and generational milestones with unhurried reverence and museum-grade color craft.
              </p>
            </div>
            <Link
              href="/services"
              className="text-xs font-semibold uppercase tracking-editorial text-gold-400 hover:text-gold-300 inline-flex items-center gap-1.5 shrink-0 self-start md:self-end border-b border-gold-500/30 pb-1 transition-colors"
            >
              <span>Full Service Catalog</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </SectionReveal>

        {/* Desktop Interactive Presentation (Hidden on Mobile) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Interactive Service Selector */}
          <div className="lg:col-span-6 space-y-4" role="tablist" aria-label="Services offered">
            {activeServices.map((svc, idx) => {
              const isSelected = idx === activeIndex;
              const formattedNumber = `0${idx + 1}`;
              const features = Array.isArray(svc.features)
                ? (svc.features as string[]).slice(0, 2)
                : [];

              return (
                <div
                  key={svc.id}
                  role="tab"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => setActiveIndex(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveIndex(idx);
                    }
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`group relative cursor-pointer rounded-2xl border transition-all duration-300 p-6 ${
                    isSelected
                      ? "border-gold-500/50 bg-charcoal-900/90 shadow-card-luxury"
                      : "border-bronze-border/50 bg-charcoal-900/30 hover:border-bronze-border hover:bg-charcoal-900/50"
                  }`}
                >
                  {/* Left glowing active accent line */}
                  <div
                    className={`absolute left-0 top-6 bottom-6 w-1 rounded-r transition-all duration-300 ${
                      isSelected ? "bg-gold-400 shadow-[0_0_12px_rgba(212,175,55,0.6)]" : "bg-transparent"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                          isSelected ? "text-gold-400 font-semibold" : "text-sand-500 group-hover:text-sand-400"
                        }`}
                      >
                        {formattedNumber}
                      </span>
                      <h3
                        className={`font-display text-xl sm:text-2xl font-light transition-colors ${
                          isSelected ? "text-ivory-100 font-normal" : "text-ivory-200 group-hover:text-ivory-100"
                        }`}
                      >
                        {svc.title}
                      </h3>
                    </div>

                    <ArrowRight
                      size={16}
                      className={`shrink-0 transition-transform duration-300 ${
                        isSelected
                          ? "text-gold-400 translate-x-1"
                          : "text-sand-600 group-hover:text-sand-400 group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>

                  {/* Expanded Content for Active Service */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-bronze-border/40 space-y-4 animate-fadeIn">
                      <p className="text-xs sm:text-sm text-sand-300 font-light leading-relaxed">
                        {svc.summary}
                      </p>

                      {features.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {features.map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="inline-flex items-center gap-1.5 rounded-full border border-bronze-border/60 bg-charcoal-950/60 px-3 py-1 text-[11px] text-sand-300 font-light"
                            >
                              <Check size={11} className="text-gold-400" />
                              <span>{feat}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Direct CTAs */}
                      <div className="flex items-center gap-4 pt-2">
                        <MagneticButton strength={0.15}>
                          <Link
                            href={`/services/${svc.slug || svc.id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-gold-subtle"
                          >
                            <span>Explore Offering</span>
                            <ArrowUpRight size={13} />
                          </Link>
                        </MagneticButton>

                        <Link
                          href={`/contact?service=${encodeURIComponent(svc.title)}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-editorial text-sand-400 hover:text-gold-300 transition-colors"
                        >
                          <span>Inquire for Dates</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Cinematic Visual Stage */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="relative aspect-[16/11] rounded-3xl overflow-hidden border border-bronze-border/70 bg-charcoal-950 shadow-2xl group">
              {/* Dynamic Image with Cross-fade key */}
              <div key={currentService.id} className="relative h-full w-full animate-fadeIn">
                <RKImage
                  src={currentService.cover_image_url || "/assets/images/image5.png"}
                  alt={currentService.title}
                  preset="editorial"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Radial gradient darkening vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent pointer-events-none" />

              {/* Top Floating Badge */}
              <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
                <span className="rounded-full bg-charcoal-950/80 backdrop-blur-md border border-bronze-border/70 px-4 py-1 text-xs font-mono uppercase tracking-widest text-gold-400 shadow-lg">
                  Offering 0{activeIndex + 1} / 0{activeServices.length}
                </span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-10 space-y-2 pointer-events-none">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-gold-400">
                  <Sparkles size={12} />
                  <span>Fine-Art Curation</span>
                </div>
                <h4 className="font-display text-xl sm:text-2xl font-light text-ivory-100">
                  {currentService.title}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Presentation (< 1024px): Touch-Friendly Vertical Card Stack */}
        <div className="lg:hidden space-y-6">
          {activeServices.map((svc, idx) => {
            const formattedNumber = `0${idx + 1}`;
            const features = Array.isArray(svc.features)
              ? (svc.features as string[]).slice(0, 2)
              : [];

            return (
              <article
                key={svc.id}
                className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 overflow-hidden shadow-card"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-bronze-border/60">
                  <RKImage
                    src={svc.cover_image_url || "/assets/images/image5.png"}
                    alt={svc.title}
                    preset="editorial"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="rounded-full bg-charcoal-950/85 backdrop-blur-md border border-bronze-border/70 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-gold-400">
                      {formattedNumber}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-medium text-ivory-100">
                      {svc.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-sand-300 font-light leading-relaxed">
                      {svc.summary}
                    </p>
                  </div>

                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {features.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="inline-flex items-center gap-1 rounded-full border border-bronze-border/50 bg-charcoal-950/50 px-2.5 py-1 text-[10px] text-sand-400"
                        >
                          <Check size={10} className="text-gold-400" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <Link
                      href={`/services/${svc.slug || svc.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowUpRight size={13} />
                    </Link>

                    <Link
                      href={`/contact?service=${encodeURIComponent(svc.title)}`}
                      className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-editorial text-sand-400 hover:text-gold-300 transition-colors"
                    >
                      <span>Inquire</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
