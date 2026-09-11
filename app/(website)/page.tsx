import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getFeaturedProjects,
  getActiveCategories,
  getActiveServices,
  getPublishedTestimonials,
  getChatbotQuestions,
  getSiteSettings,
  getActiveSocialLinks,
  getFeaturedSocialPosts,
} from "@/lib/supabase/queries";
import FollowTheJourney from "@/components/social/FollowTheJourney";
import RKImage from "@/components/ui/RKImage";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { SECTION_ASSETS } from "@/lib/assets/studio-imagery";
import HeroExperience2 from "@/components/hero/HeroExperience2";
import SectionReveal from "@/components/motion/SectionReveal";
import TextReveal from "@/components/motion/TextReveal";
import ImageReveal from "@/components/motion/ImageReveal";
import MagneticButton from "@/components/motion/MagneticButton";
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  ChevronDown,
  Quote,
  HelpCircle,
} from "lucide-react";

function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export const revalidate = 60; // Incremental Static Regeneration

import { JsonLd, getWebSiteSchema } from "@/lib/seo/structured-data";

export const metadata = {
  title: "RK Visual Photography | Luxury Fine-Art Wedding & Editorial Studio",
  description:
    "Award-winning luxury South Indian wedding, portrait, and cinematic photography studio based in Tamil Nadu, India. Capturing heirloom stories with timeless fine-art elegance.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RK Visual Photography | Luxury Fine-Art Wedding & Editorial Studio",
    description:
      "Award-winning luxury South Indian wedding, portrait, and cinematic photography studio based in Tamil Nadu, India. Capturing heirloom stories with timeless fine-art elegance.",
    url: "/",
    siteName: "RK Visual Photography",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "RK Visual Photography | Luxury Fine-Art Wedding & Editorial Studio",
    description:
      "Award-winning luxury South Indian wedding, portrait, and cinematic photography studio based in Tamil Nadu, India.",
    site: "@rk_visual_photography",
  },
};

export default async function HomePage() {
  const [
    featuredProjects,
    categories,
    services,
    testimonials,
    faqQuestions,
    settings,
    socialPosts,
    socialLinks,
  ] = await Promise.all([
    getFeaturedProjects(),
    getActiveCategories(),
    getActiveServices(),
    getPublishedTestimonials(),
    getChatbotQuestions(),
    getSiteSettings(),
    getFeaturedSocialPosts(),
    getActiveSocialLinks(),
  ]);

  return (
    <>
      <JsonLd data={getWebSiteSchema()} />
      {/* ========================================================================= */}
      {/* 1. HERO EXPERIENCE 2.0 — Integrated 10-Step Intro & Asynchronous Multi-Layer Hero */}
      {/* ========================================================================= */}
      <HeroExperience2
        featuredProjects={featuredProjects}
        settings={settings}
      />

      <div className="space-y-24 sm:space-y-32 lg:space-y-40 pb-24 mt-8 sm:mt-12 lg:mt-16">
        {/* ========================================================================= */}
        {/* 3. BRAND STATEMENT — Fine-Art Manifesto */}
        {/* ========================================================================= */}
        <section id="manifesto" className="relative px-6 text-center">
        <Container size="narrow">
          <SectionReveal yOffset={25}>
            <div className="space-y-6">
              <span className="text-[11px] uppercase tracking-widest text-gold-400/90 font-semibold block">
                Studio Philosophy
              </span>

              <TextReveal delay={0.1}>
                <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-light text-ivory-100 leading-[1.3] tracking-wide">
                  &ldquo;We do not manufacture moments; we witness them. In the sacred stillness of dawn muhurthams, the ancient granite shadows of shore temples, and the quiet rustle of heirloom kanjivaram silk, we immortalize stories that endure across generations.&rdquo;
                </blockquote>
              </TextReveal>

              <div className="flex items-center justify-center gap-3 pt-4">
                <div className="h-[1px] w-12 bg-gold-500/40" />
                <span className="font-mono text-xs uppercase tracking-widest text-sand-400">
                  RK Visual Studio
                </span>
                <div className="h-[1px] w-12 bg-gold-500/40" />
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED PROJECTS — Asymmetric Editorial Showcase */}
      {/* ========================================================================= */}
      <section id="featured" className="relative px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          <SectionReveal yOffset={25}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-bronze-border/60 pb-8 mb-16">
              <div className="space-y-2">
                <span className="text-overline uppercase tracking-widest text-gold-400">
                  Curated Collections
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-light text-ivory-100">
                  Featured Stories
                </h2>
              </div>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-editorial text-gold-400 hover:text-gold-300 transition-colors"
              >
                <span>View All Projects</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </SectionReveal>

          {/* Asymmetric Project Spread */}
          <div className="space-y-24 sm:space-y-32">
            {featuredProjects.map((proj, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <article
                  key={proj.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Image Showcase */}
                  <div
                    className={`relative overflow-hidden rounded-2xl border border-bronze-border/70 bg-charcoal-900 group ${
                      isEven ? "lg:col-span-7" : "lg:col-span-7 lg:order-2"
                    }`}
                  >
                    <ImageReveal delay={0.15}>
                      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                        <RKImage
                          src={proj.cover_image_url}
                          alt={proj.title}
                          preset="editorial"
                          aspectRatio="cinematic"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </ImageReveal>
                  </div>

                  {/* Project Meta Info */}
                  <div
                    className={`space-y-5 ${
                      isEven ? "lg:col-span-5" : "lg:col-span-5 lg:order-1"
                    }`}
                  >
                    <SectionReveal delay={0.2} yOffset={20}>
                      <div className="space-y-5">
                        <div className="flex items-center gap-3">
                          {proj.categories && (
                            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400">
                              {proj.categories.name}
                            </span>
                          )}
                          {proj.location && (
                            <>
                              <span className="text-sand-600">•</span>
                              <span className="text-xs text-sand-400 font-light flex items-center gap-1">
                                <MapPin size={11} className="text-gold-400" />
                                {proj.location}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-light text-ivory-100 leading-snug">
                          <Link
                            href={`/work/${proj.slug}`}
                            className="hover:text-gold-300 transition-colors"
                          >
                            {proj.title}
                          </Link>
                        </h3>

                        <p className="text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="pt-2">
                          <Link
                            href={`/work/${proj.slug}`}
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-editorial text-ivory-100 hover:text-gold-400 transition-colors border-b border-gold-500/40 pb-1"
                          >
                            <span>Explore Wedding Album</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </SectionReveal>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. PORTFOLIO CATEGORIES — Taxonomy Exploration */}
      {/* ========================================================================= */}
      <section id="categories" className="relative px-4 sm:px-6 lg:px-8">
        <Container size="default">
          <SectionReveal yOffset={25}>
            <div className="text-center space-y-3 mb-12">
              <span className="text-overline uppercase tracking-widest text-gold-400">
                Taxonomy
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-100">
                Explore by Discipline
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15} yOffset={20}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/work?category=${cat.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-bronze-border/70 bg-charcoal-900/50 p-5 sm:p-6 transition-all duration-300 hover:border-gold-500/50 hover:bg-charcoal-900 hover:shadow-card-luxury text-center sm:text-left"
                >
                  <div>
                    <span className="text-[10px] font-mono text-sand-500 block mb-1">
                      0{cat.order_index}
                    </span>
                    <h3 className="font-display text-lg font-medium text-ivory-100 group-hover:text-gold-300 transition-colors">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-[11px] text-sand-400">
                    <span>Explore</span>
                    <ArrowRight size={12} className="text-gold-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 6. SERVICES PREVIEW — Bespoke Offerings */}
      {/* ========================================================================= */}
      <section id="services" className="relative px-4 sm:px-6 lg:px-8">
        <Container size="default">
          <SectionReveal yOffset={25}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-bronze-border/60 pb-8 mb-12">
              <div className="space-y-2">
                <span className="text-overline uppercase tracking-widest text-gold-400">
                  Studio Offerings
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-light text-ivory-100">
                  Services &amp; Packages
                </h2>
              </div>
              <Link
                href="/services"
                className="text-xs font-semibold uppercase tracking-editorial text-gold-400 hover:text-gold-300 inline-flex items-center gap-1.5"
              >
                <span>View Full Details</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15} yOffset={20}>
            <div className="divide-y divide-bronze-border/50">
              {services.map((svc, index) => (
                <div
                  key={svc.id}
                  className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center group transition-colors hover:bg-charcoal-900/30 px-4 rounded-xl"
                >
                  <div className="lg:col-span-1 font-mono text-sm text-sand-500">
                    0{index + 1}
                  </div>

                  <div className="lg:col-span-5 space-y-1">
                    <h3 className="font-display text-2xl font-normal text-ivory-100 group-hover:text-gold-300 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-sand-400 font-light leading-relaxed">
                      {svc.summary}
                    </p>
                  </div>

                  <div className="lg:col-span-4 text-xs text-sand-400 font-light">
                    {/* Feature preview */}
                    <span className="text-ivory-200">Includes: </span>
                    {Array.isArray(svc.features) && svc.features.length > 0
                      ? String(svc.features[0])
                      : "Comprehensive fine-art coverage"}
                  </div>

                  <div className="lg:col-span-2 text-right">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-editorial text-gold-400 hover:underline"
                    >
                      <span>Inquire</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 7. ABOUT STUDIO SNIPPET — Biography & Vision */}
      {/* ========================================================================= */}
      <section id="about" className="relative px-4 sm:px-6 lg:px-8">
        <Container size="default">
          <SectionReveal yOffset={30}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center rounded-3xl border border-bronze-border/70 bg-charcoal-900/40 p-8 sm:p-12 lg:p-16">
              <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden border border-bronze-border shadow-xl">
                <ImageReveal delay={0.15} className="h-full w-full">
                  <RKImage
                    src={SECTION_ASSETS.about.leadArtist.src}
                    alt={SECTION_ASSETS.about.leadArtist.alt}
                    fill
                    className="object-cover"
                  />
                </ImageReveal>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <span className="text-overline uppercase tracking-widest text-gold-400">
                  Behind the Lens
                </span>

                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory-100 leading-tight">
                  Rooted in Heritage. <br />
                  Crafted for Eternity.
                </h2>

                <p className="text-xs sm:text-sm text-sand-300 font-light leading-relaxed">
                  Founded with a conviction that South Indian weddings are among the world&apos;s most culturally rich rituals, RK Visual Photography combines European fine-art editorial discipline with genuine emotional reverence.
                </p>

                <p className="text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                  Based between Chennai and Madurai, our team travels across the globe, bringing an unhurried, documentary approach that respects sacred family traditions while delivering modern, gallery-worthy compositions.
                </p>

                <div className="pt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 rounded-full border border-bronze-border bg-charcoal-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-editorial text-ivory-100 hover:border-gold-500/40 hover:text-gold-300 transition-colors"
                  >
                    <span>Read Full Studio Story</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 8. TESTIMONIALS — Editorial Client Quotes */}
      {/* ========================================================================= */}
      <section id="testimonials" className="relative px-4 sm:px-6 lg:px-8">
        <Container size="default">
          <SectionReveal yOffset={25}>
            <div className="text-center space-y-2 mb-16">
              <span className="text-overline uppercase tracking-widest text-gold-400">
                Words of Trust
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-100">
                Kind Words from Our Couples
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15} yOffset={20}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-bronze-border/60 bg-charcoal-900/40 p-8 flex flex-col justify-between space-y-6 transition-all duration-300 hover:border-gold-500/30"
                >
                  <div className="space-y-4">
                    <Quote size={24} className="text-gold-400/60" />
                    <p className="text-xs sm:text-sm text-sand-300 font-light italic leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="border-t border-bronze-border/40 pt-4">
                    <span className="font-display text-base font-normal text-ivory-100 block">
                      {t.client_name} {t.partner_name ? `& ${t.partner_name}` : ""}
                    </span>
                    <span className="text-[11px] text-sand-500 font-light">
                      {t.event_type} • {t.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 9. SOCIAL SECTION — Follow the Journey (Reels & Cinema Embeds) */}
      {/* ========================================================================= */}
      <FollowTheJourney posts={socialPosts} links={socialLinks} />

      {/* ========================================================================= */}
      {/* 10. FAQ / CHATBOT PLACEHOLDER — Knowledge & Reservation Inquiries */}
      {/* ========================================================================= */}
      <section id="faq" className="relative px-4 sm:px-6 lg:px-8">
        <Container size="narrow">
          <SectionReveal yOffset={25}>
            <div className="text-center space-y-2 mb-12">
              <span className="text-overline uppercase tracking-widest text-gold-400">
                Guidance
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-100">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-sand-400 font-light">
                Important details regarding booking timelines, deliverables, and travel.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15} yOffset={20}>
            <div className="space-y-4">
              {faqQuestions.map((q) => (
                <details
                  key={q.id}
                  className="group rounded-2xl border border-bronze-border/70 bg-charcoal-900/40 p-6 transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="font-display text-lg font-normal text-ivory-100 group-hover:text-gold-300 transition-colors">
                      {q.question}
                    </h3>
                    <ChevronDown
                      size={16}
                      className="text-sand-400 transition-transform group-open:rotate-180 shrink-0 ml-4"
                    />
                  </summary>
                  <p className="mt-4 text-xs sm:text-sm text-sand-400 font-light leading-relaxed border-t border-bronze-border/40 pt-4">
                    {q.answer}
                  </p>
                </details>
              ))}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 10. INQUIRY CTA — Dramatic Booking Invitation */}
      {/* ========================================================================= */}
      <section id="inquire" className="relative px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          <SectionReveal yOffset={30}>
            <div className="relative overflow-hidden rounded-3xl border border-bronze-border/80 bg-gradient-to-b from-charcoal-900/95 to-charcoal-950 p-10 sm:p-16 lg:p-20 text-center shadow-2xl">
              {/* Atmospheric Background Studio Photograph */}
              <div className="pointer-events-none absolute inset-0 opacity-15 mix-blend-luminosity">
                <RKImage
                  src={SECTION_ASSETS.cta.background.src}
                  alt={SECTION_ASSETS.cta.background.alt}
                  fill
                  className="object-cover object-center"
                />
              </div>

              {/* Subtle Antique Gold Ambient Glow */}
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25"
                aria-hidden="true"
              >
                <div className="h-72 w-72 rounded-full bg-gold-500/15 blur-[90px]" />
              </div>

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400/90 font-semibold block">
                  Reserve Your Date
                </span>

                <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-light text-ivory-100 leading-tight">
                  Let Us Craft Something <br />
                  <span className="italic text-gold-300 font-normal">Timeless</span> Together.
                </h2>

                <p className="text-xs sm:text-sm text-sand-300 font-light leading-relaxed max-w-xl mx-auto">
                  We accept a strictly limited number of commissions each season to ensure uncompromising artistic dedication. Reach out to discuss your dates and vision.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <MagneticButton strength={0.25}>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 transition-all hover:bg-gold-400 shadow-gold-subtle"
                    >
                      <span>Begin Consultation</span>
                      <ArrowRight size={14} />
                    </Link>
                  </MagneticButton>

                  <MagneticButton strength={0.2}>
                    <a
                      href={`https://wa.me/${(settings.whatsapp || "+919876543210").replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-bronze-border bg-charcoal-900/90 px-7 py-3.5 text-xs font-medium uppercase tracking-editorial text-sand-300 hover:border-gold-500/40 hover:text-ivory-100 transition-colors"
                    >
                      <span>WhatsApp Concierge</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* 12. Footer is rendered via app/(website)/layout.tsx */}
      </div>
    </>
  );
}
