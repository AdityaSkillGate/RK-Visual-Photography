import React from "react";
import Link from "next/link";
import { getPublishedProjects, getActiveCategories } from "@/lib/supabase/queries";
import RKImage from "@/components/ui/RKImage";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import SectionReveal from "@/components/motion/SectionReveal";
import ImageReveal from "@/components/motion/ImageReveal";
import PortfolioHoverCard from "@/components/motion/PortfolioHoverCard";
import ScrollScaleImage from "@/components/motion/ScrollScaleImage";
import TextClipReveal from "@/components/motion/TextClipReveal";
import { MapPin, Calendar, ArrowUpRight, Images } from "lucide-react";

export const revalidate = 60;

import { JsonLd, getBreadcrumbSchema } from "@/lib/seo/structured-data";

export const metadata = {
  title: "Selected Work | Fine-Art Wedding & Editorial Portfolio | RK Visual",
  description:
    "Explore our portfolio of luxury South Indian weddings, intimate seaside muhurthams, destination celebrations, and fine-art couple portraits documented across Tamil Nadu and worldwide.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Selected Work | Fine-Art Wedding Portfolio | RK Visual Photography",
    description:
      "Explore our portfolio of luxury South Indian weddings, intimate ceremonies, and fine-art couple portraits.",
    url: "/work",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Selected Work | Fine-Art Wedding Portfolio | RK Visual Photography",
    description:
      "Explore our portfolio of luxury South Indian weddings, intimate ceremonies, and fine-art couple portraits.",
  },
};

export default async function WorkPage() {
  const activeCategorySlug = "all";

  const [projects, categories] = await Promise.all([
    getPublishedProjects(),
    getActiveCategories(),
  ]);

  return (
    <div className="space-y-16 pb-28">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Selected Work", url: "/work" },
        ])}
      />
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 text-center pt-8">
        <Container size="narrow">
          <SectionReveal yOffset={25}>
            <div className="space-y-4">
              <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                Portfolio
              </span>
              <TextClipReveal as="h1" className="font-display text-4xl sm:text-6xl font-light text-ivory-100 tracking-tightest">
                Selected Work
              </TextClipReveal>
              <p className="max-w-lg mx-auto text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                Curated photoshoot collections, royal wedding heirlooms, and fine-art romance stories documented across Tamil Nadu and destination locales.
              </p>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Category Filter Navigation */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          <SectionReveal delay={0.1} yOffset={15}>
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 no-scrollbar border-b border-bronze-border/50 pb-6">
              <Link
                href="/work"
                className={`rounded-full px-5 py-2 text-xs font-medium uppercase tracking-editorial transition-all shrink-0 ${
                  !activeCategorySlug || activeCategorySlug === "all"
                    ? "bg-gold-500 text-charcoal-950 font-semibold shadow-gold-subtle"
                    : "border border-bronze-border bg-charcoal-900/60 text-sand-400 hover:text-ivory-100 hover:border-gold-500/40"
                }`}
              >
                All Projects
              </Link>

              {categories.map((cat) => {
                const isActive = activeCategorySlug === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/work?category=${cat.slug}`}
                    className={`rounded-full px-5 py-2 text-xs font-medium uppercase tracking-editorial transition-all shrink-0 ${
                      isActive
                        ? "bg-gold-500 text-charcoal-950 font-semibold shadow-gold-subtle"
                        : "border border-bronze-border bg-charcoal-900/60 text-sand-400 hover:text-ivory-100 hover:border-gold-500/40"
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Projects Gallery */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-bronze-border/70 py-24 text-center">
              <Images size={36} className="text-gold-400/60 mb-3" />
              <h3 className="font-display text-xl font-normal text-ivory-100">
                No Projects Found
              </h3>
              <p className="mt-1 text-xs text-sand-400 font-light">
                There are currently no published projects under this category.
              </p>
              <Link
                href="/work"
                className="mt-5 rounded-full border border-gold-500/40 px-5 py-2 text-xs text-gold-400 hover:bg-gold-500/10 uppercase tracking-editorial"
              >
                View All Categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {projects.map((proj, index) => {
                const isWide = index % 3 === 0;

                return (
                  <SectionReveal
                    key={proj.id}
                    delay={(index % 4) * 0.08}
                    yOffset={25}
                    className={isWide ? "md:col-span-2" : ""}
                  >
                    <PortfolioHoverCard>
                      <article className="group">
                        <Link href={`/work/${proj.slug}`} className="block space-y-4">
                          {/* Image Frame with ScrollScaleImage and Hover Zoom */}
                          <div
                            className={`relative overflow-hidden rounded-2xl border border-bronze-border/70 bg-charcoal-900 shadow-xl transition-all duration-500 group-hover:border-gold-500/50 group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.85)] ${
                              isWide
                                ? "aspect-[16/9] sm:aspect-[21/9]"
                                : "aspect-[4/3] sm:aspect-[16/10]"
                            }`}
                          >
                            <ScrollScaleImage initialScale={1.06} targetScale={1.0}>
                              <div className="relative w-full h-full">
                                <RKImage
                                  src={proj.cover_image_url}
                                  alt={proj.title}
                                  preset={isWide ? "fullscreen" : "editorial"}
                                  aspectRatio="cinematic"
                                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                              </div>
                            </ScrollScaleImage>
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-500" />

                            {proj.categories && (
                              <div className="absolute top-4 left-4 z-10 transition-transform duration-500 group-hover:-translate-y-1">
                                <span className="rounded-full bg-charcoal-950/85 backdrop-blur-md border border-bronze-border/60 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-gold-400 group-hover:border-gold-500/50 transition-colors">
                                  {proj.categories.name}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
                            <div className="space-y-1">
                              <h2 className="font-display text-xl sm:text-2xl font-light text-ivory-100 group-hover:text-gold-300 transition-colors">
                                {proj.title}
                              </h2>
                              <div className="flex items-center gap-2 text-[11px] text-sand-500 font-light">
                                {proj.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin size={11} className="text-gold-400" />
                                    {proj.location}
                                  </span>
                                )}
                                {proj.event_date && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Calendar size={11} />
                                      {proj.event_date}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-editorial text-gold-400 group-hover:text-gold-300 transition-colors shrink-0">
                              <span>View Story</span>
                              <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>
                          </div>
                        </Link>
                      </article>
                    </PortfolioHoverCard>
                  </SectionReveal>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
