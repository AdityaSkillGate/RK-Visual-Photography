"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Sparkles, Maximize2, Minimize2, MapPin } from "lucide-react";

interface RKHeroMaskProps {
  imageUrl?: string;
  altText?: string;
  location?: string;
  title?: string;
}

export default function RKHeroMask({
  imageUrl = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop",
  altText = "Fine-art South Indian wedding ceremony documented by RK Visual",
  location = "Karaikudi, Tamil Nadu",
  title = "Royal Chettinad Palace",
}: RKHeroMaskProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskLayerRef = useRef<HTMLDivElement>(null);
  const photoLayerRef = useRef<HTMLDivElement>(null);
  const fullPhotoRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll interaction: Expand the RK mask as user scrolls down the hero
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;

          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Compute how far down the hero has scrolled (0 to 1)
          const scrollDistance = window.scrollY;
          const maxScroll = 350; // Pixels of scroll for full expansion
          const progress = Math.min(Math.max(scrollDistance / maxScroll, 0), 1);

          setScrollProgress(progress);

          // Animate mask scale and opacity smoothly via GSAP
          if (maskLayerRef.current && fullPhotoRef.current && photoLayerRef.current) {
            // Scale mask from 1.0 to 3.8 as user scrolls
            const currentScale = 1.0 + progress * 2.8;
            gsap.set(maskLayerRef.current, {
              scale: currentScale,
              opacity: 1 - progress * 0.7,
            });

            // Fade in full unmasked photograph as mask expands
            gsap.set(fullPhotoRef.current, {
              opacity: progress * 0.95,
            });
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Ambient slow motion of the image inside the mask (Ken Burns drift)
    if (photoLayerRef.current) {
      gsap.to(photoLayerRef.current, {
        scale: 1.15,
        x: 12,
        y: -8,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Ambient gold shimmer cycle
    if (shimmerRef.current) {
      gsap.to(shimmerRef.current, {
        xPercent: 180,
        duration: 3.5,
        repeat: -1,
        repeatDelay: 2,
        ease: "power2.inOut",
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Manual toggle for tap/click
  const toggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);

    if (maskLayerRef.current && fullPhotoRef.current) {
      if (nextState) {
        gsap.to(maskLayerRef.current, {
          scale: 3.5,
          opacity: 0.15,
          duration: 0.8,
          ease: "power2.out",
        });
        gsap.to(fullPhotoRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        });
      } else {
        gsap.to(maskLayerRef.current, {
          scale: 1.0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.inOut",
        });
        gsap.to(fullPhotoRef.current, {
          opacity: 0,
          duration: 0.7,
          ease: "power2.inOut",
        });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] w-full overflow-hidden rounded-3xl border border-bronze-border/70 bg-charcoal-900 shadow-2xl group select-none"
    >
      {/* 1. Underlying Full High-Resolution Photograph (revealed on scroll or expand) */}
      <div
        ref={fullPhotoRef}
        style={{ opacity: 0 }}
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
      >
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-charcoal-950/30" />
      </div>

      {/* 2. Signature RK Mask Aperture Treatment */}
      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10 pointer-events-none">
        <div
          ref={maskLayerRef}
          style={{
            WebkitMaskImage: "url(/assets/logo/rk-monogram-mask-crop.png)",
            maskImage: "url(/assets/logo/rk-monogram-mask-crop.png)",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            transformOrigin: "center center",
          }}
          className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-[447/404] overflow-hidden drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
        >
          {/* Moving Photography Layer inside the RK letters */}
          <div
            ref={photoLayerRef}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center 40%",
            }}
            className="absolute -inset-8 w-[calc(100%+64px)] h-[calc(100%+64px)]"
          />

          {/* Tactile Antique Gold Foil Overlay */}
          <div
            style={{
              backgroundImage: "url(/assets/logo/rk-monogram-gold-crop.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              mixBlendMode: "screen",
              opacity: 0.55,
            }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Shimmer Light Reflection Sweep */}
          <div
            ref={shimmerRef}
            style={{ transform: "translateX(-130%)" }}
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-gold-200/40 to-transparent pointer-events-none -skew-x-12"
          />
        </div>
      </div>

      {/* 3. Interactive Controls & Editorial Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-charcoal-950/80 border border-bronze-border/60 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-gold-400 backdrop-blur-sm">
          <Sparkles size={11} className="text-gold-400" />
          <span>RK Aperture</span>
        </div>

        <button
          type="button"
          onClick={toggleExpand}
          className="rounded-full bg-charcoal-950/80 border border-bronze-border/60 p-2 text-sand-400 hover:text-gold-300 hover:border-gold-500/50 backdrop-blur-sm transition-colors"
          title={isExpanded ? "Collapse to Monogram" : "Expand Full Frame"}
          aria-label={isExpanded ? "Collapse to Monogram" : "Expand Full Frame"}
        >
          {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
      </div>

      {/* 4. Bottom Editorial Metadata */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-ivory-100 backdrop-blur-md rounded-xl bg-charcoal-950/70 border border-bronze-border/60 px-4 py-2.5">
        <div className="space-y-0.5">
          <p className="font-display text-sm text-ivory-100 font-light">{title}</p>
          <div className="flex items-center gap-1 text-[11px] text-sand-400 font-light">
            <MapPin size={11} className="text-gold-400" />
            <span>{location}</span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-gold-400/90 uppercase tracking-widest text-right">
          {scrollProgress > 0.4 || isExpanded ? "Full Scene" : "Scroll to Reveal"}
        </div>
      </div>
    </div>
  );
}
