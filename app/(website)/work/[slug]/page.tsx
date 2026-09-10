import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectBySlug } from "@/lib/supabase/queries";
import RKImage from "@/components/ui/RKImage";
import Container from "@/components/ui/Container";
import ProjectGalleryGrid from "@/components/gallery/ProjectGalleryGrid";
import MagneticButton from "@/components/motion/MagneticButton";
import SectionReveal from "@/components/motion/SectionReveal";
import TextReveal from "@/components/motion/TextReveal";
import { MapPin, Calendar, ArrowLeft, ArrowRight, Camera } from "lucide-react";

export const revalidate = 60;

import {
  JsonLd,
  getBreadcrumbSchema,
  getProjectGallerySchema,
} from "@/lib/seo/structured-data";

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
    `Luxury visual heirloom from ${project.title} documented by RK Visual Photography in ${project.location || "Tamil Nadu, India"}.`;
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
  const project = await getProjectBySlug(slug);

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
    <article className="pb-32">
      {/* Structured Data: Breadcrumbs & Gallery Artwork */}
      <JsonLd data={getBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={getProjectGallerySchema(project)} />

      {/* Top Accessible Semantic Breadcrumb Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-editorial text-sand-400">
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

      {/* Editorial Header */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <Container size="wide">
          <div className="space-y-6 max-w-4xl">
            {project.categories && (
              <span className="inline-block rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-gold-400">
                {project.categories.name}
              </span>
            )}

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light text-ivory-100 tracking-tightest leading-tight">
              {project.title}
            </h1>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-light text-sand-400 border-t border-bronze-border/40">
              {project.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-gold-400" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.event_date && (
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-gold-400" />
                  <span>{project.event_date}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Camera size={13} className="text-gold-400" />
                <span>RK Visual Studio Collection</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Hero Cover Image */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <Container size="wide">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-bronze-border/80 shadow-2xl bg-charcoal-900">
            <RKImage
              src={project.cover_image_url}
              alt={project.title}
              preset="fullscreen"
              priority
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
          </div>
        </Container>
      </section>

      {/* Story Narrative Block */}
      {project.description && (
        <section className="px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
          <Container size="narrow">
            <div className="space-y-6">
              <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                The Narrative
              </span>
              <p className="font-display text-xl sm:text-2xl font-light text-ivory-200/90 leading-relaxed italic border-l-2 border-gold-500/60 pl-6 sm:pl-8">
                &ldquo;{project.description}&rdquo;
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* Fine-Art Gallery Spreads */}
      {images.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 mb-24 sm:mb-32">
          <Container size="wide">
            <div className="space-y-12">
              <div className="flex items-center justify-between border-b border-bronze-border/50 pb-4">
                <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold">
                  Photo Series ({images.length})
                </span>
                <span className="text-xs text-sand-500 font-mono">
                  Full Heirloom Curation
                </span>
              </div>

              {/* Dynamic Editorial Grid with Fine-Art Zoom Lightbox */}
              <ProjectGalleryGrid images={images} projectTitle={project.title} />
            </div>
          </Container>
        </section>
      )}

      {/* Inquiry & Next Project CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pt-12 border-t border-bronze-border/50">
        <Container size="narrow">
          <SectionReveal>
            <div className="text-center space-y-6">
              <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                Inquire With Our Studio
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-light text-ivory-100 tracking-tightest">
                Ready to Document Your Celebration?
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
                    Inquire For Your Date
                  </Link>
                </MagneticButton>
                <Link
                  href="/work"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-bronze-border bg-charcoal-900/80 px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-ivory-200 hover:border-gold-500/50 hover:text-gold-300 transition-all"
                >
                  <span>Browse All Work</span>
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
