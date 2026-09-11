"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, MapPin, Clock, Camera } from "lucide-react";
import SectionReveal from "@/components/motion/SectionReveal";
import TextClipReveal from "@/components/motion/TextClipReveal";
import type { PublicProject } from "@/lib/supabase/queries";

interface ScrollChapter {
  step: string;
  act: string;
  title: string;
  subtitle: string;
  narrative: string;
  image: string;
  alt: string;
  timestamp?: string;
}

interface ProjectScrollStoryProps {
  project: PublicProject;
  className?: string;
}

export default function ProjectScrollStory({
  project,
  className = "",
}: ProjectScrollStoryProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  const images = project.project_images || [];
  const img1 = images[0]?.image_url || project.cover_image_url;
  const img2 = images[1]?.image_url || images[0]?.image_url || project.cover_image_url;
  const img3 = images[2]?.image_url || images[1]?.image_url || project.cover_image_url;

  const chapters: ScrollChapter[] = [
    {
      step: "01",
      act: "Act I — The Dawn Rituals",
      title: "Sacred Silence & Morning Light",
      subtitle: "The quiet anticipation before the mandapam gathers.",
      narrative:
        "Long before the classical nadaswaram echoes through the courtyard, we document the unhurried morning sanctity: the tying of fragrant jasmine strands, blessings bestowed by elders, and the delicate draping of pure handloom silks.",
      image: img1,
      alt: `${project.title} — Dawn Preparations`,
      timestamp: "06:30 AM • Auspicious Dawn",
    },
    {
      step: "02",
      act: "Act II — The Muhurtham",
      title: "Promises Spoken in Gold & Flame",
      subtitle: "Sacred Agni Kalyanam, heirloom thali, and generational union.",
      narrative:
        "Under the antique carved teak mandapam, the rituals unfold with ceremonial gravity. In the holy presence of the sacred fire, glances of reverence pass between couple and kin, immortalized with our distinct museum-grade color rendering.",
      image: img2,
      alt: `${project.title} — The Sacred Muhurtham`,
      timestamp: "09:45 AM • Sacred Muhurtham",
    },
    {
      step: "03",
      act: "Act III — Twilight Reverence",
      title: "Where Modern Cinema Meets Legacy",
      subtitle: "Unrehearsed laughter, sea breezes, and twilight celebrations.",
      narrative:
        "As the evening sun melts into the Tamil Nadu horizon, formal traditions give way to intimate euphoria. Away from the crowd, we craft timeless fine-art couple portraits that transcend fleeting trends.",
      image: img3,
      alt: `${project.title} — Twilight Celebrations`,
      timestamp: "05:15 PM • Golden Hour Glow",
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const observers: IntersectionObserver[] = [];

    chapterRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveChapter(index);
            }
          });
        },
        {
          rootMargin: "-20% 0px -40% 0px",
          threshold: 0.2,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section
      aria-label="Scroll Storytelling Experience"
      className={`relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-y border-bronze-border/40 ${className}`}
    >
      {/* Background ambient glow in isolated container to preserve sticky positioning */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gold-500/[0.04] blur-[140px] rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <SectionReveal yOffset={25}>
          <div className="text-center space-y-3 mb-16 sm:mb-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-charcoal-900/80 px-3.5 py-1 text-[10px] sm:text-xs uppercase tracking-widest text-gold-400">
              <Sparkles size={11} className="text-gold-400" />
              <span>Scroll Monograph</span>
            </div>
            <TextClipReveal
              as="h2"
              className="font-display text-3xl sm:text-5xl font-light text-ivory-100 tracking-tight"
            >
              The Choreography of the Day
            </TextClipReveal>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
              Every celebration is a three-act emotional journey — documented with unhurried reverence and cinematic scale.
            </p>
          </div>
        </SectionReveal>

        {/* 2-Column Composition: Sticky Left Visuals + Scrolling Right Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Pinned Visual Frame (Sticky on Desktop, hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-6 lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] w-full max-w-lg max-h-[72vh] mx-auto overflow-hidden rounded-3xl border border-bronze-border/80 bg-charcoal-900 shadow-2xl">
              {chapters.map((chap, idx) => {
                const isActive = activeChapter === idx;

                return (
                  <div
                    key={`scroll-img-${idx}`}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={chap.image}
                      alt={chap.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className={`object-cover object-center transition-transform duration-[12s] ease-out ${
                        isActive ? "scale-105" : "scale-100"
                      }`}
                      priority={idx === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-transparent to-charcoal-950/25" />

                    {/* Metadata Pill */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-sand-300 backdrop-blur-md bg-charcoal-950/75 rounded-full px-4 py-2 border border-bronze-border/60">
                      <span className="flex items-center gap-1.5 text-gold-400 truncate">
                        <Clock size={11} />
                        <span>{chap.timestamp}</span>
                      </span>
                      <span className="text-gold-400 font-semibold shrink-0">
                        {chap.step} / 03
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Progress indicator pills */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                {chapters.map((_, i) => (
                  <button
                    key={`scroll-pill-${i}`}
                    type="button"
                    onClick={() => {
                      setActiveChapter(i);
                      chapterRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      activeChapter === i
                        ? "w-8 bg-gold-400 shadow-gold-subtle"
                        : "w-2 bg-ivory-100/30 hover:bg-ivory-100/60"
                    }`}
                    aria-label={`Jump to ${chapters[i].act}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Scrolling Narrative Chapters */}
          <div className="lg:col-span-6 space-y-16 lg:space-y-32 py-4 lg:py-8 pb-20 lg:pb-36">
            {chapters.map((chap, index) => {
              const isActive = activeChapter === index;

              return (
                <div
                  key={`chapter-card-${index}`}
                  ref={(el) => {
                    chapterRefs.current[index] = el;
                  }}
                  className={`space-y-5 rounded-3xl p-6 sm:p-8 border transition-all duration-500 ${
                    isActive
                      ? "border-gold-500/40 bg-charcoal-900/60 shadow-card-luxury"
                      : "border-bronze-border/30 bg-charcoal-900/20 opacity-85 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                      Chapter {chap.step}
                    </span>
                    <span className="rounded-full border border-bronze-border/60 bg-charcoal-950/70 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-sand-400">
                      {chap.act}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-light text-ivory-100 leading-snug">
                    {chap.title}
                  </h3>

                  <p className="font-display text-sm italic text-gold-300/90 font-normal">
                    &ldquo;{chap.subtitle}&rdquo;
                  </p>

                  <p className="text-xs sm:text-sm text-sand-300 font-light leading-relaxed">
                    {chap.narrative}
                  </p>

                  {/* Mobile inline preview image */}
                  <div className="block lg:hidden relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-bronze-border/60 my-4 shadow-lg">
                    <Image
                      src={chap.image}
                      alt={chap.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-[10px] font-mono uppercase tracking-wider text-gold-400 bg-charcoal-950/80 px-2.5 py-1 rounded-full border border-bronze-border/50">
                      {chap.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
