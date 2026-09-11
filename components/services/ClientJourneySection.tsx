"use client";

import React, { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import { Sparkles, MessageSquare, Calendar, Camera, Palette, Box } from "lucide-react";

interface JourneyStep {
  number: string;
  title: string;
  phase: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    number: "01",
    title: "Discover",
    phase: "Inquiry & Alignment",
    description: "Explore our monograph archive and share your celebration dates, venue vision, and aesthetic preferences.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Consult",
    phase: "Creative Dialogue",
    description: "A focused conversation to understand your family rituals, ceremony timeline, and the moments you cherish most.",
    icon: MessageSquare,
  },
  {
    number: "03",
    title: "Plan",
    phase: "Lighting & Logistics",
    description: "We map out natural lighting schedules, ceremony nuances, and unhurried portrait windows together.",
    icon: Calendar,
  },
  {
    number: "04",
    title: "Capture",
    phase: "The Celebration",
    description: "Discreet, observant coverage on your day—blending quiet candid moments with gentle fine-art guidance.",
    icon: Camera,
  },
  {
    number: "05",
    title: "Craft",
    phase: "Master Studio Grading",
    description: "Careful curation and bespoke color grading in our studio, honoring natural skin tones and rich textile hues.",
    icon: Palette,
  },
  {
    number: "06",
    title: "Deliver",
    phase: "Heirloom Archive",
    description: "Receive your private high-resolution digital master gallery and handcrafted bespoke heirloom album.",
    icon: Box,
  },
];

interface ClientJourneySectionProps {
  className?: string;
}

export default function ClientJourneySection({ className = "" }: ClientJourneySectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setScrollProgress(100);
      setActiveStep(JOURNEY_STEPS.length - 1);
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start when container enters middle of screen, finish when it leaves
      const startY = rect.top - windowHeight * 0.7;
      const totalHeight = rect.height - windowHeight * 0.4;

      if (startY > 0) {
        setScrollProgress(0);
        setActiveStep(0);
      } else {
        const progress = Math.min(100, Math.max(0, (-startY / totalHeight) * 100));
        setScrollProgress(progress);

        const currentStepIndex = Math.min(
          JOURNEY_STEPS.length - 1,
          Math.floor((progress / 100) * JOURNEY_STEPS.length)
        );
        setActiveStep(currentStepIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="journey"
      ref={containerRef}
      className={`relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 ${className}`}
    >
      <Container size="default">
        {/* Section Header */}
        <SectionReveal yOffset={25}>
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
              Client Journey
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-light text-ivory-100 tracking-tight">
              Your Story With RK
            </h2>
            <p className="text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
              A calm, collaborative experience crafted around your family&apos;s celebrations—from your first inquiry to the arrival of your generational heirloom album.
            </p>
          </div>
        </SectionReveal>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Vertical Progress Spine (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] bg-bronze-border/40">
            <div
              className="w-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-400 shadow-[0_0_12px_rgba(212,175,55,0.7)] transition-all duration-300 ease-out"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>

          {/* Left Vertical Progress Spine (Mobile) */}
          <div className="md:hidden absolute left-5 top-0 bottom-0 w-[2px] bg-bronze-border/40">
            <div
              className="w-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-400 shadow-[0_0_12px_rgba(212,175,55,0.7)] transition-all duration-300 ease-out"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>

          {/* Steps List */}
          <div className="space-y-12 md:space-y-20">
            {JOURNEY_STEPS.map((step, index) => {
              const isEven = index % 2 === 1;
              const isPassed = index <= activeStep;
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className={`relative flex items-center md:justify-between ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step Content Card */}
                  <div
                    className={`w-full pl-14 md:pl-0 md:w-[45%] transition-all duration-500 ${
                      isPassed ? "opacity-100 translate-y-0" : "opacity-60 translate-y-2"
                    }`}
                  >
                    <div
                      className={`group rounded-2xl border p-6 sm:p-8 backdrop-blur-sm transition-all duration-500 ${
                        isPassed
                          ? "border-gold-500/50 bg-charcoal-900/90 shadow-card-luxury"
                          : "border-bronze-border/50 bg-charcoal-900/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="font-mono text-xs uppercase tracking-widest text-gold-400 font-semibold">
                          Step {step.number}
                        </span>
                        <span className="text-[11px] font-mono text-sand-500 uppercase tracking-widest">
                          {step.phase}
                        </span>
                      </div>

                      <h3
                        className={`font-display text-2xl sm:text-3xl font-light mb-2 transition-colors ${
                          isPassed ? "text-ivory-100 font-normal" : "text-ivory-200"
                        }`}
                      >
                        {step.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-sand-300 font-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Indicator (Desktop) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-10">
                    <div
                      className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-500 ${
                        isPassed
                          ? "border-gold-400 bg-charcoal-950 text-gold-400 shadow-[0_0_16px_rgba(212,175,55,0.6)] scale-110"
                          : "border-bronze-border/70 bg-charcoal-900 text-sand-500 scale-95"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                  </div>

                  {/* Left Node Indicator (Mobile) */}
                  <div className="md:hidden absolute left-2.5 top-6 z-10">
                    <div
                      className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-500 ${
                        isPassed
                          ? "border-gold-400 bg-charcoal-950 shadow-[0_0_10px_rgba(212,175,55,0.7)]"
                          : "border-bronze-border bg-charcoal-900"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          isPassed ? "bg-gold-400" : "bg-transparent"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Empty Spacer on opposite side for desktop symmetry */}
                  <div className="hidden md:block md:w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
