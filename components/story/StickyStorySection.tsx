"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import SectionReveal from "@/components/motion/SectionReveal";
import TextClipReveal from "@/components/motion/TextClipReveal";

interface StoryChapter {
  id: string;
  step: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  image: string;
  alt: string;
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "chapter-1",
    step: "01",
    category: "The Sacred Muhurtham",
    title: "The Stillness Before the Vows",
    subtitle: "Sacred fire, jasmine garlands, and generational blessings.",
    description:
      "In the quiet sanctum of dawn, before the conch shells echo across the mandapam, we capture the unhurried moments: the gentle clasp of maternal hands, the sacred agni kalyanam rituals, and glances charged with reverence.",
    location: "Chettinad Palace • Sunrise Muhurtham",
    image: "/assets/images/image8.png",
    alt: "South Indian traditional wedding ceremony under chandelier",
  },
  {
    id: "chapter-2",
    step: "02",
    category: "Silk & Heirloom Traditions",
    title: "A Symphony of Crimson & Gold",
    subtitle: "Pure Kanjivaram weaves and heirloom temple jewelry.",
    description:
      "Every thread of heirloom silk tells a century-old story. We honor the weight of legacy with an editorial eye, framing the tactile richness of temple architecture, antique gold heirlooms, and familial quietude.",
    location: "Heritage Courtyard • Classical Documentation",
    image: "/assets/images/image10.png",
    alt: "Traditional couple portrait with heirloom silk and temple jewelry",
  },
  {
    id: "chapter-3",
    step: "03",
    category: "Twilight Reverence",
    title: "Where Ocean Meets Eternity",
    subtitle: "Seaside golden hour and intimate destination romance.",
    description:
      "As the sun dips below the Bay of Bengal, gentle sea breezes carry promises spoken in quiet confidence. Away from the crowd, we document authentic warmth with cinematic scale and European editorial stillness.",
    location: "Mahabalipuram Shore • Golden Hour Cinema",
    image: "/assets/images/image9.png",
    alt: "Couple embracing in sweeping red gown on coastal shore at sunset",
  },
];

export default function StickyStorySection() {
  const [activeChapter, setActiveChapter] = useState(0);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only set up scroll observer for desktop sticky layout
    if (window.innerWidth < 1024) return;

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
          rootMargin: "-25% 0px -40% 0px",
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
      id="storytelling"
      className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
    >
      {/* Background Ambient Glow clipped in isolated container to preserve sticky positioning */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-gold-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <SectionReveal yOffset={25}>
          <div className="text-center space-y-3 mb-16 sm:mb-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-charcoal-900/80 px-3.5 py-1 text-[10px] sm:text-xs uppercase tracking-widest text-gold-400">
              <Sparkles size={11} className="text-gold-400" />
              <span>Narrative Visual Chapters</span>
            </div>
            <TextClipReveal
              as="h2"
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-light text-ivory-100 tracking-tightest"
            >
              The Architecture of a Story
            </TextClipReveal>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
              We approach every wedding as an enduring editorial monograph — documented in three distinct acts of devotion.
            </p>
          </div>
        </SectionReveal>

        {/* Main 2-Column Composition: Sticky Left Visuals (Desktop) + Scrolling Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Pinned Visual Monolith (Sticky on Desktop, hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-6 lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] w-full max-w-lg max-h-[72vh] mx-auto overflow-hidden rounded-3xl border border-bronze-border/80 bg-charcoal-900 shadow-2xl">
              {/* Image Stack Cross-Fading with Active Chapter */}
              {STORY_CHAPTERS.map((chap, idx) => {
                const isActive = activeChapter === idx;
                return (
                  <div
                    key={chap.id}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-transparent to-charcoal-950/30" />

                    {/* Image Meta Bar */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-sand-300 backdrop-blur-md bg-charcoal-950/70 rounded-full px-4 py-2 border border-bronze-border/60">
                      <span className="flex items-center gap-1.5 text-gold-400">
                        <MapPin size={11} />
                        <span className="truncate">{chap.location}</span>
                      </span>
                      <span className="text-gold-400 font-semibold shrink-0">
                        {chap.step} / 03
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Step indicator progress pills */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                {STORY_CHAPTERS.map((_, i) => (
                  <button
                    key={`pill-${i}`}
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
                    aria-label={`Jump to Story Chapter ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Scrolling Narrative Chapters */}
          <div className="lg:col-span-6 space-y-16 lg:space-y-32 py-4 lg:py-8 pb-20 lg:pb-36">
            {STORY_CHAPTERS.map((chapter, index) => {
              const isActive = activeChapter === index;

              return (
                <div
                  key={chapter.id}
                  ref={(el) => {
                    chapterRefs.current[index] = el;
                  }}
                  className={`space-y-5 rounded-3xl p-6 sm:p-8 border transition-all duration-500 ${
                    isActive
                      ? "border-gold-500/40 bg-charcoal-900/60 shadow-card-luxury"
                      : "border-bronze-border/30 bg-charcoal-900/20 opacity-85 hover:opacity-100"
                  }`}
                >
                  {/* Chapter Step & Category */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                      Chapter {chapter.step}
                    </span>
                    <span className="rounded-full border border-bronze-border/60 bg-charcoal-950/70 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-sand-400">
                      {chapter.category}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-light text-ivory-100 leading-snug">
                    {chapter.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="font-display text-sm sm:text-base italic text-gold-300/90 font-normal">
                    &ldquo;{chapter.subtitle}&rdquo;
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-sand-300 font-light leading-relaxed">
                    {chapter.description}
                  </p>

                  {/* Mobile inline image preview (only visible on mobile screens) */}
                  <div className="block lg:hidden relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-bronze-border/60 my-4 shadow-lg">
                    <Image
                      src={chapter.image}
                      alt={chapter.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <Link
                      href="/work"
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-editorial text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      <span>Explore Chapter Photography</span>
                      <ArrowRight size={13} />
                    </Link>
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
