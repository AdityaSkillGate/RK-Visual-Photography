import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getProjectBySlug,
  getPublishedProjects,
  getNextProject,
} from "@/lib/supabase/queries";
import Container from "@/components/ui/Container";
import ProjectGalleryGrid from "@/components/gallery/ProjectGalleryGrid";
import ProjectScrollStory from "@/components/portfolio/ProjectScrollStory";
import ProjectFilmSection from "@/components/portfolio/ProjectFilmSection";
import NextProjectNavigation from "@/components/portfolio/NextProjectNavigation";
import MagneticButton from "@/components/motion/MagneticButton";
import SectionReveal from "@/components/motion/SectionReveal";
import TextClipReveal from "@/components/motion/TextClipReveal";
import {
  MapPin,
  Calendar,
  Camera,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Layers,
  Palette,
} from "lucide-react";
import {
  JsonLd,
  getBreadcrumbSchema,
  getProjectGallerySchema,
} from "@/lib/seo/structured-data";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | RK Visual Photography",
    };
  }

  const title = `${project.seo_title || project.title} | RK Visual Photography`;
  const description =
    project.seo_description ||
    project.description ||
    `Luxury visual heirloom from ${project.title} documented by RK Visual Photography in ${
      project.location || "Tamil Nadu, India"
    }.`;
  const canonicalUrl = `/work/${project.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: project.title,
      description,
      url: canonicalUrl,
      type: "article",
      images: project.cover_image_url
        ? [
            {
              url: project.cover_image_url,
              width: 1200,
              height: 800,
              alt: `${project.title} — Fine-art photography by RK Visual`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: project.cover_image_url ? [project.cover_image_url] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, nextProject] = await Promise.all([
    getProjectBySlug(slug),
    getNextProject(slug),
  ]);

  if (!project) {
    notFound();
  }

  const images = project.project_images || [];
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Selected Work", url: "/work" },
    { name: project.title, url: `/work/${project.slug}` },
  ];

  return (
    <article className="pb-24">
      {/* Structured Data: Breadcrumbs & Gallery Artwork */}
      <JsonLd data={getBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={getProjectGallerySchema(project)} />

      {/* Semantic Breadcrumbs */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-4">
        <Container size="wide">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sand-400"
          >
            <Link href="/" className="hover:text-gold-400 transition-colors">
              Home
            </Link>
            <span className="text-sand-600">/</span>
            <Link href="/work" className="hover:text-gold-400 transition-colors">
              Selected Work
            </Link>
            {project.categories && (
              <>
                <span className="text-sand-600">/</span>
                <Link
                  href={`/work?category=${project.categories.slug}`}
                  className="hover:text-gold-400 transition-colors"
                >
                  {project.categories.name}
                </Link>
              </>
            )}
            <span className="text-sand-600">/</span>
            <span className="text-ivory-100 font-medium truncate max-w-xs sm:max-w-md">
              {project.title}
            </span>
          </nav>
        </Container>
      </div>

      {/* ========================================================================= */}
      {/* 1. LARGE IMMERSIVE HERO */}
      {/* ========================================================================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <Container size="wide">
          <div className="relative min-h-[60vh] sm:min-h-[75vh] lg:min-h-[82vh] w-full rounded-3xl overflow-hidden border border-bronze-border/80 shadow-2xl bg-charcoal-900 flex flex-col justify-end p-6 sm:p-12 lg:p-16">
            {/* Background Cover Image with subtle vignette */}
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/50 to-charcoal-950/20" />

            {/* Content Overlay */}
            <div className="relative z-10 max-w-4xl space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                {project.categories && (
                  <span className="rounded-full bg-charcoal-950/85 backdrop-blur-md border border-gold-500/40 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-gold-400 font-semibold shadow-gold-subtle">
                    {project.categories.name}
                  </span>
                )}
                <span className="rounded-full bg-charcoal-950/70 backdrop-blur-md border border-bronze-border/60 px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-widest text-sand-300 flex items-center gap-1.5">
                  <Camera size={11} className="text-gold-400" />
                  <span>RK Visual Fine-Art Monograph</span>
                </span>
              </div>

              <TextClipReveal
                as="h1"
                className="font-display text-4xl sm:text-6xl lg:text-7xl font-light text-ivory-100 tracking-tightest leading-tight"
              >
                {project.title}
              </TextClipReveal>

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-bronze-border/40 text-xs sm:text-sm font-light text-sand-300">
                {project.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gold-400" />
                    <span>{project.location}</span>
                  </div>
                )}
                {project.event_date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gold-400" />
                    <span>{project.event_date}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-gold-400" />
                  <span>{images.length} Curated Photographs</span>
                </div>
              </div>
            </div>

            {/* Scroll Indicator Chevron */}
            <div className="hidden sm:flex absolute bottom-8 right-8 z-10 items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-sand-400 animate-bounce">
              <span>Scroll Monograph</span>
              <ChevronDown size={14} className="text-gold-400" />
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. 2-COLUMN EDITORIAL STORY INTRODUCTION */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <Container size="wide">
          <SectionReveal yOffset={25}>
            {/* Editorial Lead Quote */}
            {project.description && (
              <div className="max-w-3xl mb-12 sm:mb-16">
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-3">
                  The Story Monograph
                </span>
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-light text-ivory-100 leading-snug italic border-l-2 border-gold-500/60 pl-6 sm:pl-8">
                  &ldquo;{project.description}&rdquo;
                </p>
              </div>
            )}

            {/* 2-Column Spread: Narrative on Left + Curation Specs on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Detailed Narrative Text */}
              <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-sand-300 font-light leading-relaxed">
                <p>
                  {project.story ||
                    "Every sacred celebration is a generational confluence. Our documentation approaches these ceremonies not merely as scheduled rituals, but as living museum collections of familial warmth, handloom textile artistry, and emotional presence."}
                </p>
                <p className="text-xs sm:text-sm text-sand-400 leading-relaxed">
                  Bathed in natural daylight and gentle ambient temple lamps, every portrait was framed with unhurried reverence. We center the weight of heirloom jewels, the intimacy of quiet parental embraces, and fleeting glances that define lifelong devotion.
                </p>
              </div>

              {/* Right Column: Curation & Technical Specs Panel */}
              <div className="lg:col-span-5 rounded-2xl border border-bronze-border/70 bg-charcoal-900/50 p-6 sm:p-8 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-bronze-border/40 pb-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-gold-400 font-semibold">
                    Curation Specifications
                  </span>
                  <Layers size={14} className="text-gold-400" />
                </div>

                <dl className="space-y-4 text-xs">
                  <div>
                    <dt className="text-[11px] font-mono uppercase tracking-widest text-sand-500">
                      Destination & Venue
                    </dt>
                    <dd className="text-ivory-100 font-medium mt-0.5">
                      {project.location || "Tamil Nadu, India"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-mono uppercase tracking-widest text-sand-500">
                      Collection Discipline
                    </dt>
                    <dd className="text-ivory-100 font-medium mt-0.5">
                      {project.categories?.name || "Luxury Wedding"} Documentation
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-mono uppercase tracking-widest text-sand-500">
                      Grading & Color Palette
                    </dt>
                    <dd className="text-sand-300 font-light mt-0.5 flex items-center gap-1.5">
                      <Palette size={12} className="text-gold-400" />
                      <span>Warm Golden Hour • Kodak Portra 400 Tone</span>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-mono uppercase tracking-widest text-sand-500">
                      Optics & Cinematography
                    </dt>
                    <dd className="text-sand-300 font-light mt-0.5">
                      Fine-Art Prime Lenses • High-Resolution 10-Bit RAW
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. SCROLL STORYTELLING MONOGRAPH (Interactive Chapters) */}
      {/* ========================================================================= */}
      <ProjectScrollStory project={project} />

      {/* ========================================================================= */}
      {/* 4. OPTIONAL CINEMATIC WEDDING FILM SECTION */}
      {/* ========================================================================= */}
      <ProjectFilmSection project={project} />

      {/* ========================================================================= */}
      {/* 5. FULL-RESOLUTION PHOTO SERIES GALLERY (Asymmetrical Magazine Grid) */}
      {/* ========================================================================= */}
      {images.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Container size="wide">
            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-bronze-border/50 pb-6">
                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                    Complete Series
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-100 tracking-tight">
                    Fine-Art Gallery Monograph
                  </h2>
                </div>
                <span className="text-xs font-mono text-sand-400">
                  {images.length} Photographs • Tap to Enlarge
                </span>
              </div>

              {/* Dynamic Asymmetrical Gallery Grid with Lightbox */}
              <ProjectGalleryGrid images={images} projectTitle={project.title} />
            </div>
          </Container>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. NEXT PROJECT NAVIGATION */}
      {/* ========================================================================= */}
      <NextProjectNavigation nextProject={nextProject} />

      {/* ========================================================================= */}
      {/* 7. INQUIRY CTA BLOCK */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 border-t border-bronze-border/50">
        <Container size="narrow">
          <SectionReveal>
            <div className="text-center space-y-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
                Reserve Your Date
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-light text-ivory-100 tracking-tightest">
                Ready to Immortalize Your Story?
              </h2>
              <p className="text-xs sm:text-sm text-sand-400 font-light max-w-md mx-auto leading-relaxed">
                We accept a limited number of commissions each season to ensure undivided artistic focus and museum-grade color rendering.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticButton strength={0.3}>
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto rounded-full bg-gold-500 px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 transition-all hover:bg-gold-400 shadow-gold-subtle"
                  >
                    Inquire For Your Celebration
                  </Link>
                </MagneticButton>
                <Link
                  href="/work"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-bronze-border bg-charcoal-900/80 px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-ivory-200 hover:border-gold-500/50 hover:text-gold-300 transition-all"
                >
                  <span>Explore All Selected Work</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </article>
  );
}
