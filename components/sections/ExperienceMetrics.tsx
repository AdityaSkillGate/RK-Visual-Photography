import React from "react";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import AnimatedCounter from "@/components/motion/AnimatedCounter";
import { type ExperienceMetricItem, FALLBACK_EXPERIENCE_METRICS } from "@/lib/supabase/fallback-data";

interface ExperienceMetricsProps {
  metrics?: ExperienceMetricItem[];
  className?: string;
}

export default function ExperienceMetrics({
  metrics = FALLBACK_EXPERIENCE_METRICS,
  className = "",
}: ExperienceMetricsProps) {
  // Ensure we have at least the 4 standard metrics
  const displayMetrics = metrics && metrics.length > 0 ? metrics : FALLBACK_EXPERIENCE_METRICS;

  return (
    <section
      id="metrics"
      aria-label="Studio Experience & Milestones"
      className={`relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 overflow-hidden ${className}`}
    >
      {/* Soft Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-gold-500/[0.03] blur-[140px] rounded-full -z-10"
        aria-hidden="true"
      />

      <Container size="wide">
        <SectionReveal yOffset={20}>
          {/* Subtle Editorial Header Accent */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-10 sm:pb-12 border-b border-bronze-border/40">
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-400 font-medium">
                Proven Track Record
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-ivory-100 tracking-tight">
                A Decade of Enduring Artistry
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-sand-400 font-light max-w-sm leading-relaxed sm:text-right">
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
                      ? "lg:border-r lg:border-bronze-border/40 lg:pr-8"
                      : ""
                  } ${index !== 0 ? "lg:pl-8" : ""}`}
                >
                  {/* Metric Numeric Count-Up */}
                  <div>
                    <AnimatedCounter
                      value={item.value}
                      label={item.label}
                      numberClassName="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-ivory-100 tracking-tight leading-none"
                      suffixClassName="font-serif text-3xl sm:text-4xl lg:text-5xl text-gold-400 ml-1 font-light select-none"
                      duration={2200}
                    />

                    {/* Metric Label */}
                    <div className="mt-3">
                      <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-sand-300 font-semibold block">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  {/* Optional Supporting Sentence */}
                  {item.description && (
                    <p className="text-xs text-sand-400 font-light leading-relaxed max-w-xs pt-1 border-t border-bronze-border/20 lg:border-none">
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
