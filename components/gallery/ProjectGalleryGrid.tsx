"use client";

import React, { useState } from "react";
import RKImage from "@/components/ui/RKImage";
import ImageLightbox, { LightboxImage } from "@/components/gallery/ImageLightbox";
import ImageReveal from "@/components/motion/ImageReveal";
import { ZoomIn } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
        {images.map((img, idx) => {
          const pattern = idx % 5;
          let colSpan = "md:col-span-6";
          let aspect = "aspect-[4/3]";

          if (pattern === 0) {
            colSpan = "md:col-span-12";
            aspect = "aspect-[16/9] sm:aspect-[21/9]";
          } else if (pattern === 1 || pattern === 2) {
            colSpan = "md:col-span-6";
            aspect = "aspect-[4/5] sm:aspect-[3/4]";
          } else {
            colSpan = "md:col-span-6 lg:col-span-6";
            aspect = "aspect-[4/3]";
          }

          return (
            <figure key={img.id} className={`group ${colSpan} space-y-2`}>
              <ImageReveal delay={0.05 * (idx % 3)}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Enlarge photograph: ${img.caption || `${projectTitle} - Frame ${idx + 1}`}`}
                  onClick={() => openLightbox(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openLightbox(idx);
                    }
                  }}
                  className={`relative overflow-hidden rounded-2xl border border-bronze-border/60 bg-charcoal-900 shadow-xl cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 ${aspect}`}
                >
                  <RKImage
                    src={img.image_url}
                    alt={img.caption || `${projectTitle} - Frame ${idx + 1}`}
                    preset={pattern === 0 ? "fullscreen" : "editorial"}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Subtle hover overlay with zoom loupe */}
                  <div className="absolute inset-0 bg-charcoal-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="rounded-full bg-charcoal-950/80 border border-gold-500/40 p-3 text-gold-400 backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn size={18} />
                    </div>
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
