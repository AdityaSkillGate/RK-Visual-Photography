import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  backHref?: string;
}

export default function AdminPageHeader({
  title,
  description,
  badge,
  action,
  backHref,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bronze-border/50 pb-6">
      <div className="space-y-1">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs text-sand-400 hover:text-gold-400 transition-colors mb-2 uppercase tracking-editorial"
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </Link>
        )}
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl sm:text-3xl font-normal text-ivory-100 tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-sand-400 font-light max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
}
