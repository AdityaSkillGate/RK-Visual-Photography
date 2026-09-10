"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { getImageKitUrl, imagePresets, ImageKitTransformOptions } from "@/lib/imagekit/transform";
import { cn } from "@/lib/utils";

export interface RKImageProps extends Omit<ImageProps, "src" | "placeholder" | "blurDataURL"> {
  src: string;
  preset?: "thumbnail" | "card" | "editorial" | "fullscreen" | "original";
  transforms?: ImageKitTransformOptions;
  aspectRatio?: "portrait" | "gallery" | "cinematic" | "square" | "editorial" | "auto";
  blurPlaceholder?: string;
  enableZoom?: boolean;
  overlay?: "none" | "gradient" | "subtle" | "vignette";
  containerClassName?: string;
}

const aspectClasses = {
  portrait: "aspect-portrait",
  gallery: "aspect-gallery",
  cinematic: "aspect-cinematic",
  square: "aspect-square",
  editorial: "aspect-editorial",
  auto: "aspect-auto",
};

const overlayClasses = {
  none: "",
  subtle: "bg-charcoal-950/25",
  gradient: "bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent",
  vignette: "shadow-[inset_0_0_80px_rgba(11,12,14,0.7)]",
};

export default function RKImage({
  src,
  alt,
  preset = "card",
  transforms,
  aspectRatio = "gallery",
  blurPlaceholder,
  enableZoom = true,
  overlay = "none",
  containerClassName,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: RKImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Compute transformed URL
  let resolvedUrl = src;
  if (transforms) {
    resolvedUrl = getImageKitUrl(src, transforms);
  } else if (preset !== "original") {
    resolvedUrl = imagePresets[preset](src);
  }

  // Generate blur placeholder URL if ImageKit asset
  const resolvedBlur = blurPlaceholder || imagePresets.lqipBlur(src);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-bronze-border/70 bg-charcoal-900 transition-all duration-500",
        "hover:border-gold-500/40 hover:shadow-gold-subtle",
        aspectClasses[aspectRatio],
        containerClassName
      )}
    >
      <Image
        src={resolvedUrl}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        placeholder={resolvedBlur ? "blur" : "empty"}
        blurDataURL={resolvedBlur}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "object-cover transition-all duration-700 ease-out",
          enableZoom && "group-hover:scale-105",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-102",
          className
        )}
        {...props}
      />

      {overlay !== "none" && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-10 transition-opacity duration-300",
            overlayClasses[overlay]
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
