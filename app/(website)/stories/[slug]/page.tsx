import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/lib/supabase/queries";
import RKImage from "@/components/ui/RKImage";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import ImageReveal from "@/components/motion/ImageReveal";
import MagneticButton from "@/components/motion/MagneticButton";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

import {
  JsonLd,
  getBreadcrumbSchema,
  getArticleSchema,
} from "@/lib/seo/structured-data";

interface StoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: StoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Story Not Found | RK Visual Photography",
    };
  }

  const title = `${post.title} | RK Visual Journal`;
  const description =
    post.excerpt ||
    "An editorial essay on fine-art photography and cultural heritage by RK Visual.";
  const canonicalUrl = `/stories/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      images: post.cover_image_url
        ? [
            {
              url: post.cover_image_url,
              width: 1200,
              height: 800,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content ? post.content.split("\n\n") : [];
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Journal", url: "/stories" },
    { name: post.title, url: `/stories/${post.slug}` },
  ];

  return (
    <article className="pb-32">
      {/* Schema.org Structured Data */}
      <JsonLd data={getBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={getArticleSchema(post)} />

      {/* Top Accessible Breadcrumb Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <Container size="narrow">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs uppercase tracking-editorial text-sand-400"
          >
            <Link href="/" className="hover:text-gold-400 transition-colors">
              Home
            </Link>
            <span className="text-sand-600">/</span>
            <Link
              href="/stories"
              className="hover:text-gold-400 transition-colors"
            >
              Journal
            </Link>
            <span className="text-sand-600">/</span>
            <span className="text-ivory-100 font-medium truncate max-w-xs sm:max-w-md">
              {post.title}
            </span>
          </nav>
        </Container>
      </div>

      {/* Story Header */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <Container size="narrow">
          <SectionReveal yOffset={25}>
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-xs font-light text-sand-400">
                {post.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-gold-400" />
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-gold-400" />
                  {readTimeMinutes} min read
                </span>
                <span>•</span>
                <span className="font-mono text-gold-400/90 uppercase tracking-widest text-[11px]">
                  RK Editorial
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-light text-ivory-100 tracking-tightest leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="font-display text-lg sm:text-xl font-light text-gold-200/80 italic leading-relaxed pt-2 border-l-2 border-gold-500/50 pl-6">
                  {post.excerpt}
                </p>
              )}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Cover Image */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <Container size="wide">
          <ImageReveal delay={0.15}>
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-bronze-border/80 shadow-2xl bg-charcoal-900">
              <RKImage
                src={post.cover_image_url || "/assets/logo/logo.png"}
                alt={post.title}
                preset="fullscreen"
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </ImageReveal>
        </Container>
      </section>

      {/* Article Body */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <Container size="narrow">
          <SectionReveal delay={0.1} yOffset={20}>
            <div className="space-y-6 font-light text-sand-200 text-sm sm:text-base leading-relaxed sm:leading-loose">
              {paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? "first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:text-gold-400 first-letter:leading-none"
                      : ""
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Tags */}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-bronze-border/40 flex flex-wrap items-center gap-2">
                <span className="text-xs text-sand-500 font-mono uppercase tracking-wider mr-2">
                  Themes:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-bronze-border/60 bg-charcoal-900 px-3 py-1 text-xs font-mono text-sand-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </SectionReveal>
        </Container>
      </section>

      {/* Footer Navigation & CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pt-12 border-t border-bronze-border/40">
        <Container size="narrow">
          <SectionReveal yOffset={25}>
            <div className="text-center space-y-6">
              <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                Inquire With Our Studio
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-light text-ivory-100">
                Have a Story You Wish to Preserve?
              </h2>
              <p className="text-xs sm:text-sm text-sand-400 font-light max-w-md mx-auto leading-relaxed">
                We look forward to connecting with you and exploring the intimate possibilities of your celebration.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticButton strength={0.25}>
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 transition-all hover:bg-gold-400 shadow-gold-subtle"
                  >
                    <span>Inquire With The Studio</span>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.2}>
                  <Link
                    href="/stories"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-bronze-border bg-charcoal-900/80 px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-ivory-200 hover:text-gold-300 transition-all"
                  >
                    <span>Read More Stories</span>
                    <ArrowRight size={13} />
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </article>
  );
}
