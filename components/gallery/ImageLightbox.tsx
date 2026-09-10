"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxImage {
  url: string;
  caption?: string | null;
  alt?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  const handleNext = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Fine-Art Lightbox: ${currentImg.caption || "Archival Print"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-charcoal-950/95 backdrop-blur-2xl select-none"
        onClick={onClose}
      >
        {/* Top Controls Header */}
        <div
          className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-gold-400">
            <span className="rounded-full border border-gold-500/40 bg-charcoal-900/80 px-3 py-1">
              {currentIndex + 1} / {images.length}
            </span>
            <span className="hidden sm:inline text-sand-400">
              {currentImg.caption || "Archival Print"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="rounded-full border border-bronze-border bg-charcoal-900/80 p-2 text-sand-300 hover:text-gold-300 hover:border-gold-500/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/80"
              title={isZoomed ? "Reset Zoom" : "Zoom In"}
              aria-label={isZoomed ? "Reset zoom level" : "Zoom in on image"}
            >
              {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-bronze-border bg-charcoal-900/80 p-2 text-sand-300 hover:text-gold-300 hover:border-gold-500/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/80"
              title="Close [Esc]"
              aria-label="Close lightbox"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Prev Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 sm:left-8 z-50 rounded-full border border-bronze-border bg-charcoal-900/80 p-3 text-sand-300 hover:text-gold-300 hover:border-gold-500/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/80"
            title="Previous [Left Arrow]"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Central Fine-Art Image Presentation */}
        <div
          className="relative max-h-[85vh] max-w-[90vw] sm:max-w-[85vw] flex items-center justify-center overflow-hidden rounded-2xl"
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(!isZoomed);
          }}
        >
          <motion.div
            key={currentImg.url}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: isZoomed ? 1.6 : 1.0,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`relative max-h-[80vh] w-auto cursor-${
              isZoomed ? "zoom-out" : "zoom-in"
            }`}
          >
            <Image
              src={currentImg.url}
              alt={currentImg.alt || currentImg.caption || "Fine-art heirloom photo"}
              width={1600}
              height={1067}
              priority
              className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Navigation Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 sm:right-8 z-50 rounded-full border border-bronze-border bg-charcoal-900/80 p-3 text-sand-300 hover:text-gold-300 hover:border-gold-500/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/80"
            title="Next [Right Arrow]"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Bottom Caption Bar */}
        {currentImg.caption && (
          <div
            className="absolute bottom-6 left-6 right-6 z-50 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-display text-sm sm:text-base font-light text-sand-300 italic max-w-xl mx-auto backdrop-blur-md bg-charcoal-950/70 py-1.5 px-4 rounded-full border border-bronze-border/50 inline-block">
              &ldquo;{currentImg.caption}&rdquo;
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
