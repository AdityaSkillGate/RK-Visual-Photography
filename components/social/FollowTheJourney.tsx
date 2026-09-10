"use client";

import React, { useState, useMemo } from "react";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import ImageReveal from "@/components/motion/ImageReveal";
import YouTubeEmbed from "./YouTubeEmbed";
import InstagramReelCard from "./InstagramReelCard";
import type { SocialLinkRow, SocialPostRow } from "@/lib/supabase/queries";
import { ArrowUpRight, Sparkles } from "lucide-react";
import {
  InstagramIcon,
  YouTubeIcon,
  FacebookIcon,
  WhatsAppIcon,
  GoogleBusinessIcon,
} from "@/components/ui/SocialIcons";

interface FollowTheJourneyProps {
  posts: SocialPostRow[];
  links: SocialLinkRow[];
}

export default function FollowTheJourney({ posts, links }: FollowTheJourneyProps) {
  const [filter, setFilter] = useState<"all" | "instagram" | "youtube">("all");

  const filteredPosts = useMemo(() => {
    if (filter === "all") return posts;
    return posts.filter((p) => p.platform.toLowerCase() === filter);
  }, [posts, filter]);

  // Find direct channel links for quick header buttons
  const igLink = links.find((l) => l.platform === "instagram")?.url || "https://www.instagram.com/rk_visual_photography/";
  const ytLink = links.find((l) => l.platform === "youtube")?.url || "https://www.youtube.com/@rkvisualphotography";
  const waLink = links.find((l) => l.platform === "whatsapp")?.url || "https://wa.me/919876543210";

  const getChannelIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <InstagramIcon size={15} className="text-pink-400" />;
      case "youtube":
        return <YouTubeIcon size={15} className="text-red-400" />;
      case "whatsapp":
        return <WhatsAppIcon size={15} className="text-emerald-400" />;
      case "facebook":
        return <FacebookIcon size={15} className="text-blue-400" />;
      case "google_business":
        return <GoogleBusinessIcon size={15} className="text-amber-400" />;
      default:
        return <Sparkles size={15} className="text-gold-400" />;
    }
  };

  return (
    <section id="social" className="relative px-4 sm:px-6 lg:px-8 py-12">
      <Container size="wide">
        {/* Section Header */}
        <SectionReveal yOffset={25}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-bronze-border/60 pb-8 mb-12">
            <div className="space-y-3 max-w-2xl">
              <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                Visual Feed & Cinema
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-ivory-100">
                Follow the Journey
              </h2>
              <p className="text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                Glimpses of sacred dawn rituals, heirloom temple gold, and fleeting cinematic moments from our active commissions in Tamil Nadu and worldwide.
              </p>
            </div>

            {/* Quick Profile Links */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-charcoal-900 px-4 py-2 text-xs font-semibold uppercase tracking-editorial text-pink-300 hover:border-pink-500/60 hover:bg-pink-950/20 transition-all shadow-sm"
              >
                <InstagramIcon size={14} />
                <span>@rk_visual_photography</span>
                <ArrowUpRight size={12} />
              </a>

              <a
                href={ytLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-charcoal-900 px-4 py-2 text-xs font-semibold uppercase tracking-editorial text-red-300 hover:border-red-500/60 hover:bg-red-950/20 transition-all shadow-sm"
              >
                <YouTubeIcon size={14} />
                <span>YouTube Cinema</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </SectionReveal>

        {/* Filter Pills */}
        <SectionReveal delay={0.08} yOffset={15}>
          <div className="flex items-center gap-2 pb-8">
            <span className="text-[11px] uppercase tracking-wider text-sand-500 mr-2 font-medium">
              Filter:
            </span>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-editorial transition-all ${
                filter === "all"
                  ? "bg-gold-500 text-charcoal-950 shadow-gold-subtle"
                  : "border border-bronze-border bg-charcoal-900/60 text-sand-400 hover:text-ivory-100 hover:border-gold-500/40"
              }`}
            >
              All Curated ({posts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("instagram")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-editorial transition-all ${
                filter === "instagram"
                  ? "bg-gold-500 text-charcoal-950 shadow-gold-subtle"
                  : "border border-bronze-border bg-charcoal-900/60 text-sand-400 hover:text-ivory-100 hover:border-gold-500/40"
              }`}
            >
              Instagram Reels
            </button>
            <button
              type="button"
              onClick={() => setFilter("youtube")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-editorial transition-all ${
                filter === "youtube"
                  ? "bg-gold-500 text-charcoal-950 shadow-gold-subtle"
                  : "border border-bronze-border bg-charcoal-900/60 text-sand-400 hover:text-ivory-100 hover:border-gold-500/40"
              }`}
            >
              YouTube Cinema
            </button>
          </div>
        </SectionReveal>

        {/* Social Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {filteredPosts.map((post, idx) => (
            <ImageReveal key={post.id} delay={idx * 0.07}>
              {post.platform.toLowerCase() === "youtube" ? (
                <YouTubeEmbed
                  url={post.post_url}
                  title={post.caption}
                  thumbnailUrl={post.thumbnail_url}
                  isShort={post.post_url.includes("/shorts/")}
                  className="h-full"
                />
              ) : (
                <InstagramReelCard
                  url={post.post_url}
                  caption={post.caption}
                  thumbnailUrl={post.thumbnail_url}
                  className="h-full"
                />
              )}
            </ImageReveal>
          ))}
        </div>

        {/* Connected Channels Bottom Strip */}
        <SectionReveal delay={0.2} yOffset={20}>
          <div className="mt-16 rounded-3xl border border-bronze-border/60 bg-charcoal-900/40 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                  Studio Channels
                </span>
                <h3 className="font-display text-xl text-ivory-100 font-light">
                  Direct Inquiries & Official Broadcasts
                </h3>
              </div>

              {/* Social Channels Pills */}
              <div className="flex flex-wrap items-center gap-3">
                {links.filter((l) => l.is_active).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-bronze-border/80 bg-charcoal-850 px-3.5 py-2 text-xs font-medium text-sand-300 hover:border-gold-500/50 hover:text-ivory-100 transition-all group"
                  >
                    {getChannelIcon(link.platform)}
                    <span>{link.label}</span>
                    {link.handle && (
                      <span className="text-[11px] font-mono text-sand-500 group-hover:text-gold-400/80">
                        {link.handle}
                      </span>
                    )}
                    <ArrowUpRight size={12} className="text-sand-500 group-hover:text-gold-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
