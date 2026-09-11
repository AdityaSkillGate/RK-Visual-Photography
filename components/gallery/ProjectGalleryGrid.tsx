"use client";

import React, { useState } from "react";
import RKImage from "@/components/ui/RKImage";
import ImageLightbox, { LightboxImage } from "@/components/gallery/ImageLightbox";
import ImageReveal from "@/components/motion/ImageReveal";
import { ZoomIn, Sparkles } from "lucide-react";
import type { Database } from "@/types/database";

type ProjectImageRow = Database["public"]["Tables"]["project_images"]["Row"];

interface ProjectGalleryGridProps {
  images: ProjectImageRow[];
  projectTitle: string;
}

export default function ProjectGalleryGrid({
  images,
  projectTitle,
}: ProjectGalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const lightboxImages: LightboxImage[] = images.map((img, idx) => ({
    url: img.image_url,
    caption: img.caption || `${projectTitle} — Frame ${idx + 1}`,
    alt: img.caption || projectTitle,
  }));

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
        {images.map((img, idx) => {
          // Asymmetrical 6-phase luxury magazine pattern
          const pattern = idx % 6;
          let colSpan = "md:col-span-6";
          let aspect = "aspect-[4/3]";
          let offsetClass = "";
          const isWide = pattern === 0 || pattern === 5;

          if (pattern === 0) {
            // Full-Width Monograph Spread
            colSpan = "md:col-span-12";
            aspect = "aspect-[16/9] sm:aspect-[21/9]";
          } else if (pattern === 1) {
            // 7-col Wide Landscape
            colSpan = "md:col-span-7";
            aspect = "aspect-[16/10] sm:aspect-[3/2]";
          } else if (pattern === 2) {
            // 5-col Vertical Heirloom Portrait (Staggered down)
            colSpan = "md:col-span-5";
            aspect = "aspect-[4/5]";
            offsetClass = "lg:pt-10";
          } else if (pattern === 3) {
            // 5-col Vertical Heirloom Portrait
            colSpan = "md:col-span-5";
            aspect = "aspect-[4/5]";
          } else if (pattern === 4) {
            // 7-col Wide Intimate Moment
            colSpan = "md:col-span-7";
            aspect = "aspect-[16/10] sm:aspect-[3/2]";
          } else if (pattern === 5) {
            // 12-col Anamorphic Cinema Breakout
            colSpan = "md:col-span-12";
            aspect = "aspect-[16/9] sm:aspect-[2.39/1]";
          }

          return (
            <figure
              key={img.id || `gallery-img-${idx}`}
              className={`group ${colSpan} ${offsetClass} space-y-2.5`}
            >
              <ImageReveal delay={0.05 * (idx % 3)}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Enlarge photograph: ${
                    img.caption || `${projectTitle} - Frame ${idx + 1}`
                  }`}
                  onClick={() => openLightbox(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openLightbox(idx);
                    }
                  }}
                  className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-bronze-border/70 bg-charcoal-900 shadow-xl cursor-zoom-in transition-all duration-700 hover:border-gold-500/50 hover:shadow-[0_15px_40px_rgba(0,0,0,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 ${aspect}`}
                >
                  <RKImage
                    src={img.image_url}
                    alt={img.caption || `${projectTitle} - Frame ${idx + 1}`}
                    preset={isWide ? "fullscreen" : "editorial"}
                    priority={false}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />

                  {/* Gentle hover overlay with loupe */}
                  <div className="absolute inset-0 bg-charcoal-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="rounded-full bg-charcoal-950/85 border border-gold-500/50 p-3.5 text-gold-400 backdrop-blur-md transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-gold-subtle">
                      <ZoomIn size={18} />
                    </div>
                  </div>

                  {/* Frame Counter Tag */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="rounded-full bg-charcoal-950/80 backdrop-blur-md border border-bronze-border/60 px-3 py-1 text-[10px] font-mono text-sand-400">
                      Frame {idx + 1}
                    </span>
                  </div>
                </div>
              </ImageReveal>

              {img.caption && (
                <figcaption className="text-right text-[11px] text-sand-500 font-light italic pr-2">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      <ImageLightbox
        images={lightboxImages}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
