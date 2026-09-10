import React from "react";

export function AdminCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-bronze-border/50 bg-charcoal-900/60 p-5 animate-pulse ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-28 rounded bg-charcoal-800" />
        <div className="h-8 w-8 rounded-lg bg-charcoal-800" />
      </div>
      <div className="h-8 w-16 rounded bg-charcoal-800 mb-2" />
      <div className="h-3 w-36 rounded bg-charcoal-800/60" />
    </div>
  );
}

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-bronze-border/50 bg-charcoal-900/60 overflow-hidden animate-pulse">
      <div className="border-b border-bronze-border/50 bg-charcoal-850/50 p-4 flex gap-4">
        <div className="h-4 w-1/4 rounded bg-charcoal-800" />
        <div className="h-4 w-1/4 rounded bg-charcoal-800" />
        <div className="h-4 w-1/4 rounded bg-charcoal-800" />
        <div className="h-4 w-1/4 rounded bg-charcoal-800" />
      </div>
      <div className="divide-y divide-bronze-border/30">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 items-center">
            <div className="h-4 w-1/4 rounded bg-charcoal-800/80" />
            <div className="h-4 w-1/4 rounded bg-charcoal-800/60" />
            <div className="h-4 w-1/4 rounded bg-charcoal-800/40" />
            <div className="h-4 w-1/4 rounded bg-charcoal-800/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminPageHeaderSkeleton() {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bronze-border/50 pb-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded bg-charcoal-800" />
        <div className="h-4 w-72 rounded bg-charcoal-800/60" />
      </div>
      <div className="h-9 w-32 rounded-xl bg-charcoal-800" />
    </div>
  );
}
