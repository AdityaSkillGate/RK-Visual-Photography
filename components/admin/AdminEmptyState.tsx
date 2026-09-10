import React from "react";
import Link from "next/link";
import { type LucideIcon, Inbox } from "lucide-react";

interface AdminEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function AdminEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: AdminEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-bronze-border/70 bg-charcoal-900/40 px-6 py-14 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-bronze-border bg-charcoal-850 text-sand-400 mb-4 shadow-sm">
        <Icon size={22} className="text-gold-400" />
      </div>

      <h3 className="font-display text-lg font-normal text-ivory-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-sand-400 font-light leading-relaxed">
        {description}
      </p>

      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-5">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 transition-all hover:bg-gold-400 shadow-gold-subtle"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 transition-all hover:bg-gold-400 shadow-gold-subtle"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
