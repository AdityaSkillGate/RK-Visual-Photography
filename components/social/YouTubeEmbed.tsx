"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink } from "lucide-react";
import { YouTubeIcon } from "@/components/ui/SocialIcons";

interface YouTubeEmbedProps {
  url: string;
  title?: string | null;
  thumbnailUrl?: string | null;
  className?: string;
  isShort?: boolean;
}

export default function YouTubeEmbed({
  url,
  title,
  thumbnailUrl,
  className = "",
  isShort,
}: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube ID
  const match = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : null;
  const isShortVideo = isShort ?? url.includes("/shorts/");

  // Poster fallback
  const poster =
    thumbnailUrl ||
    (videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "/assets/images/image10.png");

  if (!videoId) {
    // Fallback if URL is irregular
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 rounded-2xl border border-bronze-border bg-charcoal-900 text-ivory-100 hover:border-gold-500/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <YouTubeIcon className="text-red-500" size={20} />
          <span className="text-xs font-medium">{title || "Watch on YouTube"}</span>
        </div>
        <ExternalLink size={14} className="text-sand-400" />
      </a>
    );
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-bronze-border/70 bg-charcoal-900 shadow-md transition-all duration-300 hover:border-gold-500/40 ${
        isShortVideo ? "aspect-[9/16] max-w-sm mx-auto" : "aspect-video w-full"
      } ${className}`}
    >
      {isPlaying ? (
        <iframe
          src={embedUrl}
          title={title || "YouTube video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsPlaying(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsPlaying(true);
            }
          }}
          className="relative h-full w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label={`Play ${title || "YouTube video"}`}
        >
          {/* Poster Image */}
          <Image
            src={poster}
            alt={title || "YouTube video thumbnail"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-transparent" />

          {/* Platform Tag */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-charcoal-950/80 backdrop-blur-md px-3 py-1 border border-bronze-border/70">
            <YouTubeIcon size={13} className="text-red-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ivory-200">
              {isShortVideo ? "YouTube Short" : "Cinema"}
            </span>
          </div>

          {/* Play Button Facade */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-950/80 border border-gold-500/60 text-gold-400 shadow-gold-subtle backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-charcoal-950">
              <Play size={22} className="ml-1 fill-current" />
            </div>
          </div>

          {/* Title & External Link */}
          <div className="absolute bottom-3 inset-x-3 flex items-end justify-between gap-2">
            <p className="line-clamp-2 text-xs font-medium text-ivory-100 drop-shadow-md">
              {title || "Cinematic Highlight"}
            </p>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-full bg-charcoal-900/80 text-sand-300 hover:text-gold-400 transition-colors shrink-0"
              title="Open directly on YouTube"
            >
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
