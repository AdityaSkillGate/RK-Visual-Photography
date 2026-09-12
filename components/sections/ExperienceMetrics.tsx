import React from "react";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import AnimatedCounter from "@/components/motion/AnimatedCounter";
import { type ExperienceMetricItem, FALLBACK_EXPERIENCE_METRICS } from "@/lib/supabase/fallback-data";

interface ExperienceMetricsProps {
  metrics?: ExperienceMetricItem[];
  className?: string;
  variant?: "dark" | "light";
}

export default function ExperienceMetrics({
  metrics = FALLBACK_EXPERIENCE_METRICS,
  className = "",
  variant = "light",
}: ExperienceMetricsProps) {
  // Ensure we have at least the 4 standard metrics
  const displayMetrics = metrics && metrics.length > 0 ? metrics : FALLBACK_EXPERIENCE_METRICS;
  const isLight = variant === "light";

  return (
    <section
      id="metrics"
      aria-label="Studio Experience & Milestones"
      className={`relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 overflow-hidden transition-colors ${
        isLight ? "bg-ivory-warm text-charcoal-soft" : "bg-charcoal-deep text-ivory-100"
      } ${className}`}
    >
      {/* Soft Ambient Radial Glow */}
      <div
        className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] blur-[140px] rounded-full -z-10 ${
          isLight ? "bg-gold-500/[0.04]" : "bg-gold-500/[0.03]"
        }`}
        aria-hidden="true"
      />

      <Container size="wide">
        <SectionReveal yOffset={20}>
          {/* Subtle Editorial Header Accent */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-10 sm:pb-12 border-b ${
              isLight ? "border-sand-300/60" : "border-bronze-border/40"
            }`}
          >
            <div className="space-y-1.5">
              <span
                className={`font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold ${
                  isLight ? "text-gold-600" : "text-gold-400"
                }`}
              >
                Proven Track Record
              </span>
              <h2
                className={`font-display text-2xl sm:text-3xl font-light tracking-tight ${
                  isLight ? "text-charcoal-soft" : "text-ivory-100"
                }`}
              >
                A Decade of Enduring Artistry
              </h2>
            </div>
            <p
              className={`text-xs sm:text-sm font-light max-w-sm leading-relaxed sm:text-right ${
                isLight ? "text-sand-600" : "text-sand-400"
              }`}
            >
              Every number represents sacred promises honored, familial legacies preserved, and unhurried editorial craftsmanship.
            </p>
          </div>

          {/* Minimal Editorial Typography Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-0 pt-10 sm:pt-14">
            {displayMetrics.map((item, index) => {
              const isLast = index === displayMetrics.length - 1;

              return (
                <div
                  key={item.id || `metric-${index}`}
                  className={`flex flex-col justify-between space-y-4 ${
                    !isLast
                      ? isLight
                        ? "lg:border-r lg:border-sand-300/60 lg:pr-8"
                        : "lg:border-r lg:border-bronze-border/40 lg:pr-8"
                      : ""
                  } ${index !== 0 ? "lg:pl-8" : ""}`}
                >
                  {/* Metric Numeric Count-Up */}
                  <div>
                    <AnimatedCounter
                      value={item.value}
                      label={item.label}
                      numberClassName={`font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none ${
                        isLight ? "text-charcoal-soft" : "text-ivory-100"
                      }`}
                      suffixClassName={`font-serif text-3xl sm:text-4xl lg:text-5xl ml-1 font-light select-none ${
                        isLight ? "text-gold-500" : "text-gold-400"
                      }`}
                      duration={2200}
                    />

                    {/* Metric Label */}
                    <div className="mt-3">
                      <span
                        className={`font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold block ${
                          isLight ? "text-charcoal-900" : "text-sand-300"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  </div>

                  {/* Optional Supporting Sentence */}
                  {item.description && (
                    <p
                      className={`text-xs font-light leading-relaxed max-w-xs pt-1 border-t lg:border-none ${
                        isLight
                          ? "text-sand-600 border-sand-300/40"
                          : "text-sand-400 border-bronze-border/20"
                      }`}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
