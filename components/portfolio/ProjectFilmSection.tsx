"use client";

import React, { useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import { Play, X, Film, Sparkles, Volume2 } from "lucide-react";
import type { PublicProject } from "@/lib/supabase/queries";

interface ProjectFilmSectionProps {
  project: PublicProject;
  filmUrl?: string | null;
  className?: string;
}

export default function ProjectFilmSection({
  project,
  filmUrl,
  className = "",
}: ProjectFilmSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Fallback demo reel if no dedicated project film URL
  const videoSrc =
    filmUrl ||
    "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"; // fallback or ambient embed

  const coverImage = project.cover_image_url;

  return (
    <section
      aria-label="Cinematic Film Monograph"
      className={`relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-bronze-border/40 ${className}`}
    >
      <Container size="wide">
        <SectionReveal yOffset={25}>
          <div className="text-center space-y-3 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-charcoal-900/80 px-3.5 py-1 text-[10px] sm:text-xs uppercase tracking-widest text-gold-400">
              <Film size={11} className="text-gold-400" />
              <span>Motion Monograph</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-light text-ivory-100 tracking-tight">
              Cinematic Wedding Film
            </h2>
            <p className="max-w-md mx-auto text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
              4K Ultra-HD anamorphic cinematography capturing emotional cadences, orchestral score, and living memory.
            </p>
          </div>

          {/* Anamorphic Cinema Container (2.39:1 / 21:9 Ratio) */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full max-w-6xl mx-auto rounded-3xl overflow-hidden border border-bronze-border/80 bg-charcoal-950 shadow-2xl group">
            {/* Ambient Gold Halo */}
            <div
              className="pointer-events-none absolute -inset-4 bg-gold-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
              aria-hidden="true"
            />

            {!isPlaying ? (
              <>
                <Image
                  src={coverImage}
                  alt={`${project.title} — Film Cover`}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-charcoal-950/30" />

                {/* Center Luxury Play Trigger */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="relative group/btn flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-charcoal-950/80 backdrop-blur-md border border-gold-500/60 shadow-[0_0_40px_rgba(212,175,55,0.25)] transition-all duration-500 hover:scale-110 hover:border-gold-400 hover:shadow-[0_0_60px_rgba(212,175,55,0.4)]"
                    aria-label="Play Cinematic Wedding Film"
                  >
                    <span className="absolute inset-0 rounded-full border border-gold-500/30 animate-ping opacity-40" />
                    <Play
                      size={28}
                      className="text-gold-400 fill-gold-400 ml-1 transition-transform group-hover/btn:scale-110"
                    />
                  </button>
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-sand-300 font-medium">
                    Experience The Cinema
                  </span>
                </div>

                {/* Bottom Meta Ribbon */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-sand-400/90 z-20 backdrop-blur-md bg-charcoal-950/70 rounded-full px-5 py-2.5 border border-bronze-border/60">
                  <span className="flex items-center gap-1.5 text-gold-400 font-semibold">
                    <Sparkles size={11} />
                    <span>4K Anamorphic • 10-Bit Log</span>
                  </span>
                  <span className="hidden sm:inline-block">•</span>
                  <span className="flex items-center gap-1.5">
                    <Volume2 size={11} className="text-gold-400" />
                    <span>Original Orchestral Composition</span>
                  </span>
                  <span className="hidden sm:inline-block">•</span>
                  <span className="text-sand-300 font-semibold">03:45 Curation</span>
                </div>
              </>
            ) : (
              <div className="relative w-full h-full bg-black">
                {/* Embed Video or Iframe */}
                <iframe
                  src={
                    videoSrc.includes("?")
                      ? `${videoSrc}&autoplay=1`
                      : `${videoSrc}?autoplay=1`
                  }
                  title={`${project.title} Cinematic Film`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-charcoal-950/85 text-ivory-100 hover:text-gold-400 border border-bronze-border transition-colors"
                  aria-label="Close Film Player"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
