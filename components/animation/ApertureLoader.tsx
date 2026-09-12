"use client";

import React, { useState, useEffect } from "react";

interface ApertureLoaderProps {
  onDismiss?: () => void;
  canSkip?: boolean;
}

export default function ApertureLoader({
  onDismiss,
  canSkip = true,
}: ApertureLoaderProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = React.useCallback(() => {
    setIsDismissed(true);
    onDismiss?.();
  }, [onDismiss]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDismiss]);

  if (isDismissed) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading RK Visual Photography"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal-950 text-ivory-100 select-none overflow-hidden"
    >
      {/* Deep Charcoal Opening Ambient Radial Vignette */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(28,30,34,0.98)_0%,#08090B_100%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Skip button in top right */}
      {canSkip && (
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-6 right-6 z-20 rounded-full border border-gold-500/30 bg-charcoal-900/80 px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-sand-300 hover:text-gold-300 hover:border-gold-400 backdrop-blur-md transition-colors"
          aria-label="Skip introductory loading animation"
        >
          Skip [Esc]
        </button>
      )}

      {/* Main RK Mask Monogram Composition */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Monogram Shape with SVG/PNG Mask */}
        <div
          style={{
            WebkitMaskImage: "url(/assets/logo/rk-monogram-mask-crop.png)",
            maskImage: "url(/assets/logo/rk-monogram-mask-crop.png)",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
          className="relative w-52 sm:w-72 md:w-88 lg:w-96 aspect-[447/404] overflow-hidden drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)]"
        >
          {/* Real studio photograph gliding horizontally inside the RK letters */}
          <div
            style={{
              backgroundImage: "url(/assets/images/image8.png)",
              backgroundSize: "cover",
              backgroundPosition: "center 42%",
            }}
            className="absolute -inset-12 w-[calc(100%+96px)] h-[calc(100%+96px)] animate-aperture-drift"
          />

          {/* Gold Foil Grain Texture Overlay */}
          <div
            style={{
              backgroundImage: "url(/assets/logo/rk-monogram-gold-crop.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              mixBlendMode: "screen",
            }}
            className="absolute inset-0 w-full h-full pointer-events-none animate-aperture-pulse"
          />

          {/* Radiant Gold Shimmer Sweep */}
          <div
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-gold-200/60 to-transparent pointer-events-none animate-aperture-shimmer"
            aria-hidden="true"
          />
        </div>

        {/* Overture Brand Signature Typography */}
        <div className="mt-7 text-center space-y-1.5 pointer-events-none">
          <div className="font-display text-sm sm:text-base tracking-[0.35em] text-ivory-100 uppercase">
            RK Visual
          </div>
          <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] text-gold-400 uppercase">
            Fine-Art Wedding Cinema
          </div>
        </div>

        {/* Subtle glowing loading pulse */}
        <div className="mt-5 flex items-center justify-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-gold-400 animate-ping" />
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-sand-500">
            Immortalizing Moments
          </span>
        </div>
      </div>
    </div>
  );
}
