"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink, X } from "lucide-react";
import { InstagramIcon } from "@/components/ui/SocialIcons";

interface InstagramReelCardProps {
  url: string;
  caption?: string | null;
  thumbnailUrl?: string | null;
  className?: string;
}

export default function InstagramReelCard({
  url,
  caption,
  thumbnailUrl,
  className = "",
}: InstagramReelCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract Instagram shortcode
  const match = url.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
  const shortcode = match ? match[1] : null;

  const poster =
    thumbnailUrl ||
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop";

  return (
    <>
      <div
        className={`group relative overflow-hidden rounded-2xl border border-bronze-border/70 bg-charcoal-900 shadow-md transition-all duration-300 hover:border-gold-500/40 aspect-[9/14] ${className}`}
      >
        {/* Poster Image */}
        <div className="relative h-full w-full">
          <Image
            src={poster}
            alt={caption || "Instagram Reel preview"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Luxury Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-charcoal-950/20" />

          {/* Platform Tag */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-charcoal-950/80 backdrop-blur-md px-3 py-1 border border-bronze-border/70">
            <InstagramIcon size={13} className="text-pink-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ivory-200">
              Reel
            </span>
          </div>

          {/* Handle Tag */}
          <div className="absolute top-3 right-3 rounded-full bg-charcoal-950/80 backdrop-blur-md px-2.5 py-1 border border-bronze-border/70">
            <span className="text-[10px] font-mono text-gold-400">
              @rk_visual_photography
            </span>
          </div>

          {/* Center Play / Watch Trigger */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute inset-0 flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform focus:outline-none"
            aria-label={`Watch ${caption || "Instagram Reel"}`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-950/80 border border-gold-500/60 text-gold-400 shadow-gold-subtle backdrop-blur-md transition-all duration-300 group-hover:bg-gold-500 group-hover:text-charcoal-950">
              <Play size={22} className="ml-1 fill-current" />
            </div>
          </button>

          {/* Caption & Actions Bottom Bar */}
          <div className="absolute bottom-3 inset-x-3 space-y-2">
            <p className="line-clamp-2 text-xs font-medium text-ivory-100 drop-shadow-md">
              {caption || "Heirloom wedding highlight on Instagram"}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-bronze-border/40">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-[11px] font-semibold uppercase tracking-editorial text-gold-400 hover:text-gold-300 transition-colors"
              >
                View Embed
              </button>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-sand-400 hover:text-gold-400 transition-colors"
                title="View original on Instagram"
              >
                <span>Instagram</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Official Embed Modal Dialog */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-bronze-border bg-charcoal-900 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-bronze-border/50 pb-3">
              <div className="flex items-center gap-2">
                <InstagramIcon size={18} className="text-pink-400" />
                <span className="font-display text-sm font-medium text-ivory-100">
                  Instagram Highlight
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-sand-400 hover:text-ivory-100 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Official Embed Container */}
            <div className="relative aspect-[9/13] w-full overflow-hidden rounded-2xl border border-bronze-border/60 bg-charcoal-950">
              {shortcode ? (
                <iframe
                  src={`https://www.instagram.com/p/${shortcode}/embed/captioned/`}
                  title={caption || "Instagram Reel"}
                  className="h-full w-full border-0"
                  allowTransparency
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-3">
                  <InstagramIcon size={40} className="text-sand-600" />
                  <p className="text-xs text-sand-400">
                    Unable to load inline preview for this URL format.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Link */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-sand-500">
                @rk_visual_photography
              </span>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-colors shadow-gold-subtle"
              >
                <span>Open in App</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
