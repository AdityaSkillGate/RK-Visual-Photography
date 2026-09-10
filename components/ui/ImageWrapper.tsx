import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export interface ImageWrapperProps extends Omit<ImageProps, "className"> {
  aspectRatio?: "portrait" | "gallery" | "cinematic" | "square" | "auto";
  overlay?: "none" | "gradient" | "subtle" | "vignette";
  zoomOnHover?: boolean;
  className?: string;
  imageClassName?: string;
}

const aspectClasses = {
  portrait: "aspect-portrait",
  gallery: "aspect-gallery",
  cinematic: "aspect-cinematic",
  square: "aspect-square",
  auto: "aspect-auto",
};

const overlayClasses = {
  none: "",
  subtle: "bg-charcoal-950/20",
  gradient: "bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent",
  vignette: "shadow-[inset_0_0_80px_rgba(11,12,14,0.7)]",
};

export default function ImageWrapper({
  src,
  alt,
  aspectRatio = "gallery",
  overlay = "none",
  zoomOnHover = true,
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: ImageWrapperProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-bronze-border/70 bg-charcoal-900 transition-all duration-500",
        "hover:border-gold-500/40 hover:shadow-gold-subtle",
        aspectClasses[aspectRatio],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "object-cover transition-transform duration-700 ease-out",
          zoomOnHover && "group-hover:scale-105",
          imageClassName
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
