"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if configured
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <span className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
          An Unexpected Event Occurred
        </span>
        <h2 className="font-display text-3xl font-light tracking-tight text-ivory-100 sm:text-4xl">
          Something went wrong
        </h2>
        <p className="text-sm font-light text-sand-400">
          We encountered an issue while loading this page. Please try again or
          return to the home showcase.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => reset()}
            className="rounded-full border border-gold-500/50 bg-gold-500/10 px-6 py-2 text-xs font-medium tracking-editorial text-gold-300 transition-all hover:bg-gold-500/20 hover:text-ivory-100"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-full border border-bronze-border px-6 py-2 text-xs font-medium tracking-editorial text-sand-400 transition-all hover:border-ivory-100/30 hover:text-ivory-100"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
