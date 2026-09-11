import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Container from "@/components/ui/Container";
import RKImage from "@/components/ui/RKImage";
import SectionReveal from "@/components/motion/SectionReveal";
import ImageReveal from "@/components/motion/ImageReveal";
import TextReveal from "@/components/motion/TextReveal";
import MagneticButton from "@/components/motion/MagneticButton";
import { ArrowRight, Compass, Heart, Award, Sparkles } from "lucide-react";

import {
  JsonLd,
  getBreadcrumbSchema,
  getPhotographyBusinessSchema,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "About The Studio & Philosophy | RK Visual Photography",
  description:
    "Discover the artistic philosophy, cultural reverence for South Indian wedding rituals, and fine-art editorial vision behind RK Visual Photography in Tamil Nadu, India.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About The Studio & Philosophy | RK Visual Photography",
    description:
      "Discover the artistic philosophy, cultural reverence, and fine-art editorial vision behind RK Visual Photography.",
    url: "/about",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About The Studio & Philosophy | RK Visual Photography",
    description:
      "Discover the artistic philosophy, cultural reverence, and fine-art editorial vision behind RK Visual Photography.",
  },
};

export default function AboutPage() {
  const businessSchema = getPhotographyBusinessSchema();
  const pillars = [
    {
      num: "01",
      title: "Light as Emotion",
      description:
        "We treat light not merely as exposure, but as emotional resonance. Drawing inspiration from classical chiaroscuro oil paintings, we seek delicate side-light, quiet shadows, and the luminous radiance of temple oil lamps.",
    },
    {
      num: "02",
      title: "Reverence for Sacred Heritage",
      description:
        "Every Tamil and South Indian wedding is anchored in sacred ancestral rhythm. We anticipate the precise emotional crescendo of the Thaali ritual, the quiet tear during Kanyadaanam, and the joy of the Oonjal swings without intrusion.",
    },
    {
      num: "03",
      title: "Archival Permanence",
      description:
        "Trends come and go; true elegance remains steadfast. Our color science is developed to ensure your heirloom photographs feel as evocative, regal, and tender fifty years from now as they do today.",
    },
    {
      num: "04",
      title: "Unobtrusive Composure",
      description:
        "Our presence during your celebration is gentle, attentive, and respectful. We cultivate an environment of calm ease, enabling couples and their elders to be wholly present in their sacred union.",
    },
  ];

  return (
    <div className="space-y-24 pb-32">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About The Studio", url: "/about" },
        ])}
      />
      <JsonLd data={businessSchema} />
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 text-center pt-8">
        <Container size="narrow">
          <SectionReveal yOffset={25}>
            <div className="space-y-4">
              <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                Studio Biography
              </span>
              <h1 className="font-display text-4xl sm:text-6xl font-light text-ivory-100 tracking-tightest">
                The Poetry of Unhurried Moments
              </h1>
              <p className="max-w-xl mx-auto text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                Founded on the belief that wedding documentation should transcend mere reportage to become an enduring visual legacy of grace, heritage, and tenderness.
              </p>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Editorial Spread / Lead Artist Profile */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          <SectionReveal yOffset={30}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* Portrait Image */}
              <div className="lg:col-span-5">
                <ImageReveal delay={0.15}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-bronze-border/80 shadow-2xl bg-charcoal-900">
                    <RKImage
                      src="/assets/images/image6.png"
                      alt="Creative Director & Principal Artist — RK Visual Photography"
                      preset="editorial"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
                        Creative Director & Principal Artist
                      </span>
                      <p className="font-display text-lg text-ivory-100 font-light">
                        RK Visual Photography Studio
                      </p>
                      <p className="text-[11px] text-sand-400 font-light">
                        Tamil Nadu, India
                      </p>
                    </div>
                  </div>
                </ImageReveal>
              </div>

              {/* Biography Text */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                    Artistic Vision
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-100 tracking-tight leading-snug">
                    Documenting love with the dignity of fine art and the intimacy of a whisper.
                  </h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-sand-300 font-light leading-relaxed">
                  <p>
                    Rooted in Tamil Nadu, our studio was born out of deep reverence for Indian cultural heritage and a passion for high-fashion editorial aesthetics. Over the past decade, we have traveled from the ancestral palatial courtyards of Chettinad to cliffside temples in Mahabalipuram and tranquil estate verandas in the Nilgiris.
                  </p>
                  <p>
                    We believe that the most powerful photographs are not meticulously orchestrated, but observed with profound patience. The glance exchanged between father and daughter before the mandapam, the gentle drift of jasmine blossoms in fragrant hair, the golden embers of sacrificial havana flames—these are the fleeting heirlooms we preserve forever.
                  </p>
                  <p>
                    By limiting our annual commissions to a hand-picked calendar, we give each couple our wholehearted devotion, artisanal craft, and uncompromising post-production rigor.
                  </p>
                </div>

                {/* Notable Quote */}
                <div className="border-l-2 border-gold-500/50 pl-6 py-2 my-6">
                  <blockquote className="font-display text-lg sm:text-xl font-light text-gold-200/90 italic leading-relaxed">
                    &ldquo;A wedding photograph should not just show what your celebration looked like, but evoke the exact weight and warmth of how it felt to be there.&rdquo;
                  </blockquote>
                </div>

                <div className="pt-2">
                  <MagneticButton strength={0.2}>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-gold-subtle"
                    >
                      <span>Connect With Our Artist</span>
                      <ArrowRight size={13} />
                    </Link>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Creative Pillars */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          <SectionReveal yOffset={30}>
            <div className="rounded-3xl border border-bronze-border/60 bg-charcoal-900/40 p-8 sm:p-14">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                  Foundational Tenets
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-100">
                  Our Four Creative Pillars
                </h2>
                <p className="text-xs sm:text-sm text-sand-400 font-light">
                  Every frame captured under the RK Visual signature is guided by these unwavering principles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {pillars.map((pillar) => (
                  <div
                    key={pillar.num}
                    className="space-y-3 rounded-2xl border border-bronze-border/50 bg-charcoal-950/40 p-6 sm:p-8 hover:border-gold-500/40 transition-colors"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                      {pillar.num}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl text-ivory-100 font-normal">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Heritage & Tamil Nadu Roots */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          <SectionReveal yOffset={30}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                  Geographic Heritage
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-100 tracking-tight">
                  An Homage to South Indian Landscapes & Architecture
                </h2>
                <p className="text-xs sm:text-sm text-sand-300 font-light leading-relaxed">
                  Tamil Nadu’s architectural heritage possesses an incomparable visual soul. From the 1,000-pillar granite corridors of Madurai to the carved Athangudi tiles of Chettinad and the salt mist enveloping Mahabalipuram’s 8th-century shore monuments, our work celebrates the sacred geometry and atmospheric romance of this land.
                </p>
                <p className="text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                  Whether your wedding takes place in an ancestral family home or a modern seaside pavilion, we harmonize ambient architectural magnificence with spontaneous emotional intimacy.
                </p>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <ImageReveal delay={0.1}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-bronze-border/60 bg-charcoal-900">
                      <RKImage
                        src="/assets/images/image4.png"
                        alt="Heirloom gold temple jewellery & heritage South Indian ritual"
                        preset="card"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </ImageReveal>
                  <ImageReveal delay={0.2}>
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-bronze-border/60 bg-charcoal-900">
                      <RKImage
                        src="/assets/images/image8.png"
                        alt="Grand chandelier stage reverence & proposal"
                        preset="card"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </ImageReveal>
                </div>

                <div className="space-y-4 pt-8">
                  <ImageReveal delay={0.15}>
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-bronze-border/60 bg-charcoal-900">
                      <RKImage
                        src="/assets/images/image10.png"
                        alt="Serene traditional lake boat ride & heritage couple"
                        preset="card"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </ImageReveal>
                  <ImageReveal delay={0.25}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-bronze-border/60 bg-charcoal-900">
                      <RKImage
                        src="/assets/images/image7.png"
                        alt="Sunset highway journey on Royal Enfield bullet"
                        preset="card"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </ImageReveal>
                </div>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Inquiry Banner */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6">
        <Container size="narrow">
          <SectionReveal yOffset={25}>
            <div className="text-center space-y-6 border-t border-bronze-border/40 pt-16">
              <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                Join Our Calendar
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-light text-ivory-100 tracking-tightest">
                Let Us Preserve Your Sacred Celebration
              </h2>
              <p className="text-xs sm:text-sm text-sand-400 font-light max-w-md mx-auto leading-relaxed">
                We would be honored to learn about your upcoming celebration and discuss how our studio can document your heirloom legacy.
              </p>
              <div className="pt-2 flex justify-center">
                <MagneticButton strength={0.25}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-gold-subtle"
                  >
                    <span>Inquire With The Studio</span>
                    <ArrowRight size={13} />
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </div>
  );
}
