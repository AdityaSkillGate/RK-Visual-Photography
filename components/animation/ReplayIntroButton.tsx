"use client";

import React, { useState } from "react";
import RKIntroAnimation from "./RKIntroAnimation";
import { Play } from "lucide-react";

export default function ReplayIntroButton() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsPlaying(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-charcoal-900/60 px-3 py-1 text-[10px] uppercase font-mono tracking-widest text-sand-400 hover:text-gold-300 hover:border-gold-500/50 transition-colors"
        title="Replay Signature RK Opening Experience"
      >
        <Play size={9} className="text-gold-400" />
        <span>Replay Intro</span>
      </button>

      {isPlaying && (
        <RKIntroAnimation
          forcePlay={true}
          onComplete={() => setIsPlaying(false)}
        />
      )}
    </>
  );
}
