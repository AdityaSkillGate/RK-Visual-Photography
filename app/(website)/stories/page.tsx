import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getPublishedBlogPosts } from "@/lib/supabase/queries";
import RKImage from "@/components/ui/RKImage";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import ImageReveal from "@/components/motion/ImageReveal";
import { Calendar, ArrowUpRight, BookOpen } from "lucide-react";

import { JsonLd, getBreadcrumbSchema } from "@/lib/seo/structured-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Journal & Cultural Stories | Fine-Art Wedding Essays | RK Visual",
  description:
    "Essays on photographic philosophy, South Indian wedding rituals, natural light craft, and destination chronicles by RK Visual Photography.",
  alternates: {
    canonical: "/stories",
  },
  openGraph: {
    title: "Journal & Cultural Stories | RK Visual Photography",
    description:
      "Essays on photographic philosophy, South Indian wedding rituals, and natural light craft.",
    url: "/stories",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Journal & Cultural Stories | RK Visual Photography",
    description:
      "Essays on photographic philosophy, South Indian wedding rituals, and natural light craft.",
  },
};

export default async function StoriesPage() {
  const posts = await getPublishedBlogPosts();

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="space-y-20 pb-32">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Journal & Stories", url: "/stories" },
        ])}
      />
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 text-center pt-8">
        <Container size="narrow">
          <SectionReveal yOffset={25}>
            <div className="space-y-4">
              <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                The Journal
              </span>
              <h1 className="font-display text-4xl sm:text-6xl font-light text-ivory-100 tracking-tightest">
                Stories & Reflections
              </h1>
              <p className="max-w-md mx-auto text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                Essays on South Indian wedding rituals, natural light craft, and the quiet poetry of enduring romance.
              </p>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Stories Content */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-bronze-border/70 py-24 text-center">
              <BookOpen size={36} className="text-gold-400/60 mb-3" />
              <h3 className="font-display text-xl font-normal text-ivory-100">
                No Journal Entries Yet
              </h3>
              <p className="mt-1 text-xs text-sand-400 font-light">
                Our upcoming editorial essays and wedding chronicles will be published here soon.
              </p>
            </div>
          ) : (
            <div className="space-y-16 lg:space-y-24">
              {/* Featured / Lead Article */}
              {featuredPost && (
                <SectionReveal yOffset={30}>
                  <article className="group">
                    <Link
                      href={`/stories/${featuredPost.slug}`}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl border border-bronze-border/60 bg-charcoal-900/40 p-6 sm:p-10 transition-all hover:border-gold-500/40"
                    >
                      <div className="lg:col-span-7">
                        <ImageReveal delay={0.15}>
                          <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl border border-bronze-border/70 bg-charcoal-900 shadow-xl">
                            <RKImage
                              src={featuredPost.cover_image_url || "/assets/logo/logo.png"}
                              alt={featuredPost.title}
                              preset="editorial"
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                        </ImageReveal>
                      </div>

                      <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-gold-500/10 border border-gold-500/30 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-gold-400">
                            Featured Essay
                          </span>
                          {featuredPost.published_at && (
                            <span className="flex items-center gap-1.5 text-[11px] text-sand-500 font-light">
                              <Calendar size={11} />
                              {new Date(featuredPost.published_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          )}
                        </div>

                        <h2 className="font-display text-2xl sm:text-4xl font-light text-ivory-100 group-hover:text-gold-300 transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>

                        {featuredPost.excerpt && (
                          <p className="text-xs sm:text-sm text-sand-300 font-light leading-relaxed line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                        )}

                        {Array.isArray(featuredPost.tags) &&
                          featuredPost.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {featuredPost.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] text-sand-400/80 font-mono"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                        <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-editorial text-gold-400">
                          <span>Read Full Essay</span>
                          <ArrowUpRight size={13} />
                        </div>
                      </div>
                    </Link>
                  </article>
                </SectionReveal>
              )}

              {/* Archive Grid for remaining entries */}
              {remainingPosts.length > 0 && (
                <div className="space-y-8">
                  <SectionReveal yOffset={20}>
                    <div className="border-b border-bronze-border/50 pb-4">
                      <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold">
                        Archive Essays
                      </span>
                    </div>
                  </SectionReveal>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {remainingPosts.map((post, pIdx) => (
                      <SectionReveal key={post.id} delay={pIdx * 0.1} yOffset={25}>
                        <article className="group">
                          <Link
                            href={`/stories/${post.slug}`}
                            className="block space-y-4"
                          >
                            <ImageReveal delay={0.1}>
                              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-bronze-border/60 bg-charcoal-900 shadow-xl">
                                <RKImage
                                  src={post.cover_image_url || "/assets/logo/logo.png"}
                                  alt={post.title}
                                  preset="card"
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              </div>
                            </ImageReveal>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[11px] text-sand-500 font-light">
                                {post.published_at && (
                                  <span className="flex items-center gap-1">
                                    <Calendar size={11} />
                                    {new Date(post.published_at).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      }
                                    )}
                                  </span>
                                )}
                              </div>

                              <h3 className="font-display text-xl sm:text-2xl font-light text-ivory-100 group-hover:text-gold-300 transition-colors leading-snug">
                                {post.title}
                              </h3>

                              {post.excerpt && (
                                <p className="text-xs text-sand-400 font-light leading-relaxed line-clamp-2">
                                  {post.excerpt}
                                </p>
                              )}

                              <div className="pt-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-editorial text-gold-400">
                                <span>Read Essay</span>
                                <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </div>
                            </div>
                          </Link>
                        </article>
                      </SectionReveal>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
