import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getServiceBySlug, getPublishedProjects } from "@/lib/supabase/queries";
import RKImage from "@/components/ui/RKImage";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import ImageReveal from "@/components/motion/ImageReveal";
import MagneticButton from "@/components/motion/MagneticButton";
import {
  JsonLd,
  getBreadcrumbSchema,
  getPhotographyServiceSchema,
} from "@/lib/seo/structured-data";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  ShieldCheck,
  Clock,
  Camera,
  Film,
  Award,
} from "lucide-react";

export const revalidate = 60;

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | RK Visual Photography",
    };
  }

  const title = `${service.title} | Luxury Photography Commissions | RK Visual`;
  const description =
    service.description ||
    `Bespoke ${service.title} by RK Visual Photography in Tamil Nadu, India. Museum-grade color grading, cinematic storytelling, and timeless heirloom preservation.`;
  const canonicalUrl = `/services/${service.slug || service.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: service.cover_image_url
        ? [
            {
              url: service.cover_image_url,
              width: 1200,
              height: 800,
              alt: `${service.title} — RK Visual Photography`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: service.cover_image_url ? [service.cover_image_url] : [],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const features = Array.isArray(service.features)
    ? (service.features as string[])
    : [];

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: service.title, url: `/services/${service.slug || service.id}` },
  ];

  // Fetch 2 recent projects for contextual portfolio inspiration
  const relatedProjects = await getPublishedProjects().then((projs) =>
    projs.slice(0, 2)
  );

  return (
    <article className="pb-32">
      {/* Schema.org Structured Data */}
      <JsonLd data={getBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={getPhotographyServiceSchema(service)} />

      {/* Breadcrumb Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <Container size="wide">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs uppercase tracking-editorial text-sand-400"
          >
            <Link href="/" className="hover:text-gold-400 transition-colors">
              Home
            </Link>
            <span className="text-sand-600">/</span>
            <Link
              href="/services"
              className="hover:text-gold-400 transition-colors"
            >
              Services
            </Link>
            <span className="text-sand-600">/</span>
            <span className="text-ivory-100 font-medium truncate max-w-xs sm:max-w-md">
              {service.title}
            </span>
          </nav>
        </Container>
      </div>

      {/* Hero Header */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <SectionReveal yOffset={25}>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold">
                      Bespoke Commission
                    </span>
                    {service.summary && (
                      <span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-0.5 text-[11px] font-medium tracking-wider text-gold-300">
                        {service.summary}
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-4xl sm:text-6xl font-light text-ivory-100 tracking-tightest leading-[1.1]">
                    {service.title}
                  </h1>
                  <p className="text-sm sm:text-base text-sand-300 font-light leading-relaxed max-w-2xl">
                    {service.description}
                  </p>
                </div>
              </SectionReveal>

              {/* Inclusions Highlights */}
              <SectionReveal delay={0.15} yOffset={20}>
                <div className="space-y-3 pt-2">
                  <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                    Key Commission Deliverables
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-sand-300 font-light"
                      >
                        <Check
                          size={15}
                          className="text-gold-400 shrink-0 mt-0.5"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionReveal>

              {/* CTAs */}
              <SectionReveal delay={0.25} yOffset={20}>
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <MagneticButton strength={0.2}>
                    <Link
                      href={`/contact?service=${encodeURIComponent(
                        service.title
                      )}`}
                      className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 transition-all hover:bg-gold-400 shadow-gold-subtle"
                    >
                      <span>Inquire For Your Celebration</span>
                      <ArrowRight size={14} />
                    </Link>
                  </MagneticButton>

                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `Vanakkam RK Visual Studio, I am interested in your "${service.title}" commission. Could you share availability and detailed investment options?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-bronze-border px-6 py-3.5 text-xs font-medium uppercase tracking-editorial text-sand-300 hover:text-ivory-100 hover:border-gold-500/50 transition-colors"
                  >
                    <span>Connect on WhatsApp</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </SectionReveal>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5">
              <ImageReveal delay={0.2}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-bronze-border/80 shadow-2xl bg-charcoal-900">
                  <RKImage
                    src={service.cover_image_url || "/assets/logo/logo.png"}
                    alt={service.title}
                    preset="editorial"
                    priority
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent pointer-events-none" />
                </div>
              </ImageReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Creative Standards & Methodology */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-y border-bronze-border/40 bg-charcoal-900/30">
        <Container size="wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gold-400">
                <Camera size={18} />
                <span className="text-xs uppercase tracking-widest font-semibold">
                  Artistic Vision
                </span>
              </div>
              <h3 className="font-display text-xl text-ivory-100 font-light">
                Quiet Photojournalism
              </h3>
              <p className="text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                We document sacred moments as they naturally unfold. No staged
                interruptions during the Thaali, no artificial studio glare —
                just tender, authentic observation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gold-400">
                <Film size={18} />
                <span className="text-xs uppercase tracking-widest font-semibold">
                  Cinema Science
                </span>
              </div>
              <h3 className="font-display text-xl text-ivory-100 font-light">
                Heritage Color Science
              </h3>
              <p className="text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                Every frame undergoes rigorous tone reproduction in our suite.
                Pure gold jewelry, Kanchipuram silk dyes, and deep temple
                vilakku glows are preserved with lifelong fidelity.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gold-400">
                <Award size={18} />
                <span className="text-xs uppercase tracking-widest font-semibold">
                  Archival Heirlooms
                </span>
              </div>
              <h3 className="font-display text-xl text-ivory-100 font-light">
                Italian Museum Albums
              </h3>
              <p className="text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                Finished imagery is bound in handcrafted Italian leather
                heirloom albums with flush-mount photographic paper guaranteed to
                resist fading for generations.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Visual Inspiration from Portfolio */}
      {relatedProjects.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <Container size="wide">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                  Visual Evidence
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-100">
                  Recent Commission Archives
                </h2>
              </div>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-editorial text-gold-400 hover:text-gold-300 transition-colors"
              >
                <span>View Full Portfolio</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProjects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`/work/${proj.slug}`}
                  className="group block space-y-4"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-bronze-border/70 bg-charcoal-900 transition-all duration-500 group-hover:border-gold-500/50">
                    <RKImage
                      src={proj.cover_image_url || "/assets/logo/logo.png"}
                      alt={proj.title}
                      preset="card"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-gold-400/80">
                      {proj.location || "Tamil Nadu"}
                    </span>
                    <h3 className="font-display text-xl text-ivory-100 group-hover:text-gold-300 transition-colors">
                      {proj.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Bottom Reservation Callout */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8">
        <Container size="narrow">
          <div className="rounded-3xl border border-gold-500/30 bg-gradient-to-b from-charcoal-900 to-charcoal-950 p-8 sm:p-12 text-center space-y-6">
            <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
              Calendar Exclusivity
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-100">
              Reserve Your Celebration
            </h2>
            <p className="text-xs sm:text-sm text-sand-400 font-light leading-relaxed max-w-lg mx-auto">
              Due to our meticulous hand-crafted post-production process, we
              accept a strictly capped number of weddings each season. Connect
              with us early to secure date exclusivity.
            </p>
            <div className="pt-2 flex flex-wrap justify-center items-center gap-4">
              <MagneticButton strength={0.2}>
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-colors shadow-gold-subtle"
                >
                  <span>Request Date Availability</span>
                  <ArrowRight size={14} />
                </Link>
              </MagneticButton>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-editorial text-sand-400 hover:text-ivory-100 transition-colors"
              >
                <ArrowLeft size={13} />
                <span>All Offerings</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
}
