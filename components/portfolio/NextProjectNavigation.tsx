import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import type { PublicProject } from "@/lib/supabase/queries";

interface NextProjectNavigationProps {
  nextProject: PublicProject | null;
  className?: string;
}

export default function NextProjectNavigation({
  nextProject,
  className = "",
}: NextProjectNavigationProps) {
  if (!nextProject) return null;

  return (
    <section
      aria-label="Next Project Navigation"
      className={`relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-bronze-border/50 ${className}`}
    >
      <Container size="wide">
        <SectionReveal yOffset={20}>
          <div className="text-center sm:text-left mb-6 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-2">
              <Sparkles size={12} className="text-gold-400" />
              <span>Continue Exploring The Monograph</span>
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-sand-500 uppercase tracking-widest">
              Next Story
            </span>
          </div>

          <Link
            href={`/work/${nextProject.slug}`}
            className="group relative block aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-bronze-border/70 bg-charcoal-900 shadow-2xl transition-all duration-700 hover:border-gold-500/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          >
            {/* Background Cover Image */}
            <Image
              src={nextProject.cover_image_url}
              alt={nextProject.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/40" />

            {/* Floating Editorial Card Content */}
            <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-between z-10">
              <div className="flex items-center justify-between">
                {nextProject.categories && (
                  <span className="rounded-full bg-charcoal-950/80 backdrop-blur-md border border-bronze-border/60 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-gold-400">
                    {nextProject.categories.name}
                  </span>
                )}
                <div className="flex items-center gap-2 rounded-full bg-gold-500 text-charcoal-950 px-4 py-1.5 text-xs font-semibold uppercase tracking-editorial transition-transform duration-300 group-hover:translate-x-1 shadow-gold-subtle">
                  <span>View Project</span>
                  <ArrowRight size={13} />
                </div>
              </div>

              <div className="space-y-3 max-w-2xl">
                <span className="font-mono text-xs uppercase tracking-widest text-sand-400 block">
                  Next Chapter
                </span>
                <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl font-light text-ivory-100 tracking-tight leading-tight group-hover:text-gold-300 transition-colors">
                  {nextProject.title}
                </h3>
                {nextProject.location && (
                  <div className="flex items-center gap-2 text-xs text-sand-300 font-light pt-1">
                    <MapPin size={12} className="text-gold-400" />
                    <span>{nextProject.location}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </SectionReveal>
      </Container>
    </section>
  );
}
