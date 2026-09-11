import React from "react";
import Link from "next/link";
import { getPublishedProjects, getActiveCategories } from "@/lib/supabase/queries";
import RKImage from "@/components/ui/RKImage";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import PortfolioHoverCard from "@/components/motion/PortfolioHoverCard";
import ScrollScaleImage from "@/components/motion/ScrollScaleImage";
import TextClipReveal from "@/components/motion/TextClipReveal";
import { MapPin, Calendar, ArrowUpRight, Images, Sparkles } from "lucide-react";
import { JsonLd, getBreadcrumbSchema } from "@/lib/seo/structured-data";

export const revalidate = 60;

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

interface WorkPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeCategorySlug = resolvedSearchParams?.category || "all";

  const [allProjects, categories] = await Promise.all([
    getPublishedProjects(),
    getActiveCategories(),
  ]);

  // Filter projects by active category
  const projects =
    activeCategorySlug && activeCategorySlug !== "all"
      ? allProjects.filter((p) => p.categories?.slug === activeCategorySlug)
      : allProjects;

  return (
    <div className="space-y-16 sm:space-y-20 pb-32">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Selected Work", url: "/work" },
        ])}
      />

      {/* Editorial Header */}
      <section className="px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-12">
        <Container size="narrow">
          <SectionReveal yOffset={25}>
            <div className="space-y-4">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
                The Monograph Archive
              </span>
              <TextClipReveal
                as="h1"
                className="font-display text-4xl sm:text-6xl lg:text-7xl font-light text-ivory-100 tracking-tightest"
              >
                Selected Work
              </TextClipReveal>
              <p className="max-w-lg mx-auto text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                Curated royal wedding heirlooms, seaside destination ceremonies, and fine-art monographs documented across Tamil Nadu and global destinations.
              </p>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Category Filter Navigation */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          <SectionReveal delay={0.1} yOffset={15}>
            <div className="flex items-center justify-center gap-2.5 overflow-x-auto py-2 no-scrollbar border-b border-bronze-border/50 pb-6">
              <Link
                href="/work"
                className={`rounded-full px-5 py-2 text-xs font-mono uppercase tracking-widest transition-all shrink-0 ${
                  activeCategorySlug === "all"
                    ? "bg-gold-500 text-charcoal-950 font-bold shadow-gold-subtle"
                    : "border border-bronze-border bg-charcoal-900/60 text-sand-400 hover:text-ivory-100 hover:border-gold-500/40"
                }`}
              >
                All Projects ({allProjects.length})
              </Link>

              {categories.map((cat) => {
                const isActive = activeCategorySlug === cat.slug;
                const count = allProjects.filter(
                  (p) => p.categories?.slug === cat.slug
                ).length;

                return (
                  <Link
                    key={cat.id}
                    href={`/work?category=${cat.slug}`}
                    className={`rounded-full px-5 py-2 text-xs font-mono uppercase tracking-widest transition-all shrink-0 ${
                      isActive
                        ? "bg-gold-500 text-charcoal-950 font-bold shadow-gold-subtle"
                        : "border border-bronze-border bg-charcoal-900/60 text-sand-400 hover:text-ivory-100 hover:border-gold-500/40"
                    }`}
                  >
                    {cat.name} {count > 0 && `(${count})`}
                  </Link>
                );
              })}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Editorial Magazine Spreads */}
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
                className="mt-5 rounded-full border border-gold-500/40 px-6 py-2 text-xs text-gold-400 hover:bg-gold-500/10 uppercase tracking-widest font-mono"
              >
                View All Projects
              </Link>
            </div>
          ) : (
            <div className="space-y-16 sm:space-y-24 lg:space-y-32">
              {/* Render in Asymmetrical Editorial Groups */}
              {projects.map((proj, index) => {
                // Layout pattern based on index:
                // index % 3 === 0: Full-Width Lead Flagship Monograph
                // index % 3 === 1: 7-col Wide Landscape Frame
                // index % 3 === 2: 5-col Vertical Heirloom Portrait Frame with stagger
                const isFlagship = index % 3 === 0;

                if (isFlagship) {
                  return (
                    <SectionReveal key={proj.id} yOffset={25}>
                      <PortfolioHoverCard>
                        <article className="group">
                          <Link
                            href={`/work/${proj.slug}`}
                            className="block space-y-6"
                          >
                            {/* Grand Full-Width / 21:9 Hero Card */}
                            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-bronze-border/70 bg-charcoal-900 shadow-2xl transition-all duration-700 group-hover:border-gold-500/50 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
                              <ScrollScaleImage initialScale={1.05} targetScale={1.0}>
                                <div className="relative w-full h-full">
                                  <RKImage
                                    src={proj.cover_image_url}
                                    alt={proj.title}
                                    preset="fullscreen"
                                    priority={index === 0}
                                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                  />
                                </div>
                              </ScrollScaleImage>
                              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />

                              {/* Top Ribbon */}
                              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                                {proj.categories && (
                                  <span className="rounded-full bg-charcoal-950/80 backdrop-blur-md border border-bronze-border/60 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-gold-400">
                                    {proj.categories.name}
                                  </span>
                                )}
                                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-charcoal-950/80 backdrop-blur-md border border-bronze-border/60 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-sand-300">
                                  <Sparkles size={11} className="text-gold-400" />
                                  <span>Featured Monograph</span>
                                </span>
                              </div>

                              {/* Desktop Floating Overlay Snippet (Bottom Left) */}
                              <div className="hidden sm:block absolute bottom-8 left-8 right-8 z-10 max-w-2xl space-y-2">
                                <h2 className="font-display text-2xl sm:text-4xl font-light text-ivory-100 group-hover:text-gold-300 transition-colors">
                                  {proj.title}
                                </h2>
                                {proj.description && (
                                  <p className="text-xs text-sand-300/90 font-light line-clamp-2 leading-relaxed">
                                    {proj.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Mobile Info Strip (Always visible, zero hover required) */}
                            <div className="sm:hidden space-y-2 pt-1">
                              <h2 className="font-display text-2xl font-light text-ivory-100">
                                {proj.title}
                              </h2>
                              {proj.description && (
                                <p className="text-xs text-sand-400 font-light line-clamp-2 leading-relaxed">
                                  {proj.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between pt-2 border-t border-bronze-border/40 text-[11px] text-sand-400 font-mono">
                                <span>{proj.location || "Tamil Nadu, India"}</span>
                                <span className="text-gold-400 font-semibold flex items-center gap-1">
                                  <span>View Story</span>
                                  <ArrowUpRight size={12} />
                                </span>
                              </div>
                            </div>

                            {/* Desktop Bottom Meta Bar */}
                            <div className="hidden sm:flex items-center justify-between text-xs text-sand-400 font-light border-b border-bronze-border/30 pb-4">
                              <div className="flex items-center gap-4">
                                {proj.location && (
                                  <span className="flex items-center gap-1.5">
                                    <MapPin size={13} className="text-gold-400" />
                                    <span>{proj.location}</span>
                                  </span>
                                )}
                                {proj.event_date && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                      <Calendar size={13} className="text-gold-400" />
                                      <span>{proj.event_date}</span>
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-gold-400 group-hover:text-gold-300 transition-colors">
                                <span>Explore Full Story</span>
                                <ArrowUpRight
                                  size={13}
                                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                />
                              </div>
                            </div>
                          </Link>
                        </article>
                      </PortfolioHoverCard>
                    </SectionReveal>
                  );
                }

                // Paired Asymmetrical Diptychs (Alternating 7-col vs 5-col)
                const isEven = (index % 3) === 1;

                return (
                  <SectionReveal key={proj.id} yOffset={25}>
                    <PortfolioHoverCard>
                      <article className="group">
                        <Link
                          href={`/work/${proj.slug}`}
                          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center"
                        >
                          {/* Image Column */}
                          <div
                            className={`${
                              isEven
                                ? "lg:col-span-7"
                                : "lg:col-span-5 lg:order-2"
                            }`}
                          >
                            <div
                              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-bronze-border/70 bg-charcoal-900 shadow-xl transition-all duration-700 group-hover:border-gold-500/50 group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.85)] ${
                                isEven
                                  ? "aspect-[16/10] sm:aspect-[3/2]"
                                  : "aspect-[4/5]"
                              }`}
                            >
                              <ScrollScaleImage initialScale={1.05} targetScale={1.0}>
                                <div className="relative w-full h-full">
                                  <RKImage
                                    src={proj.cover_image_url}
                                    alt={proj.title}
                                    preset="editorial"
                                    priority={false}
                                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                  />
                                </div>
                              </ScrollScaleImage>
                              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent opacity-40 group-hover:opacity-75 transition-opacity duration-500" />

                              {/* Category Badge */}
                              {proj.categories && (
                                <div className="absolute top-4 left-4 z-10">
                                  <span className="rounded-full bg-charcoal-950/80 backdrop-blur-md border border-bronze-border/60 px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest text-gold-400">
                                    {proj.categories.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Narrative & Details Column */}
                          <div
                            className={`space-y-4 ${
                              isEven
                                ? "lg:col-span-5 lg:pl-4"
                                : "lg:col-span-7 lg:order-1 lg:pr-4"
                            }`}
                          >
                            <div className="space-y-2">
                              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-sand-500 block">
                                Curated Photo Series
                              </span>
                              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-light text-ivory-100 group-hover:text-gold-300 transition-colors leading-snug">
                                {proj.title}
                              </h2>
                            </div>

                            {proj.description && (
                              <p className="text-xs sm:text-sm text-sand-400 font-light leading-relaxed line-clamp-3">
                                {proj.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs text-sand-400 font-light pt-2">
                              {proj.location && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin size={12} className="text-gold-400" />
                                  <span>{proj.location}</span>
                                </span>
                              )}
                              {proj.event_date && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1.5">
                                    <Calendar size={12} className="text-gold-400" />
                                    <span>{proj.event_date}</span>
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="pt-2">
                              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold-400 group-hover:text-gold-300 transition-colors">
                                <span>View Photograph Collection</span>
                                <ArrowUpRight
                                  size={13}
                                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                />
                              </span>
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
