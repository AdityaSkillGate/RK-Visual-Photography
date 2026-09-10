import React from "react";
import { AdminCardSkeleton, AdminTableSkeleton } from "@/components/admin/AdminSkeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bronze-border/50 pb-6">
        <div className="space-y-2">
          <div className="h-7 w-44 rounded bg-charcoal-800" />
          <div className="h-4 w-72 rounded bg-charcoal-800/60" />
        </div>
        <div className="h-9 w-28 rounded-xl bg-charcoal-800" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminCardSkeleton />
        <AdminCardSkeleton />
        <AdminCardSkeleton />
        <AdminCardSkeleton />
      </div>

      {/* Content skeleton */}
      <AdminTableSkeleton rows={4} />
    </div>
  );
}
