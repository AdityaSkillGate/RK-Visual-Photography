"use client";

import React from "react";
import { Sparkles, MessageCircleQuestion } from "lucide-react";

interface AskRKTriggerButtonProps {
  className?: string;
  variant?: "banner" | "button";
}

export default function AskRKTriggerButton({
  className = "",
  variant = "banner",
}: AskRKTriggerButtonProps) {
  const handleLaunch = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-ask-rk"));
    }
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleLaunch}
        className={`inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-colors shadow-gold-subtle ${className}`}
      >
        <MessageCircleQuestion size={15} />
        <span>Ask RK Assistant</span>
      </button>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-gold-500/30 bg-charcoal-900/60 p-5 sm:p-6 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-display text-base font-medium text-ivory-100">
            Have a specific question about your celebration?
          </span>
        </div>
        <p className="text-xs text-sand-400 font-light">
          Ask our verified studio assistant about ceremony rituals, package structures, or date availability.
        </p>
      </div>

      <button
        type="button"
        onClick={handleLaunch}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-gold-subtle hover:scale-105 shrink-0"
      >
        <span>Launch Ask RK</span>
        <Sparkles size={13} />
      </button>
    </div>
  );
}
