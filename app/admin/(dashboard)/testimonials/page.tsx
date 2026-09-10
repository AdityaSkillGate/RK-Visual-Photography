import React from "react";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Badge from "@/components/ui/Badge";
import { Quote, Plus, Star } from "lucide-react";

export const revalidate = 0;

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  const testimonialList = testimonials || [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Testimonials"
        description="Client reviews, wedding couple words, and editorial endorsements."
        badge={
          <Badge variant="gold" size="sm">
            {testimonialList.length} Quotes
          </Badge>
        }
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-3.5 py-2 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-gold-subtle"
          >
            <Plus size={14} />
            <span>Add Review</span>
          </button>
        }
      />

      {testimonialList.length === 0 ? (
        <AdminEmptyState
          icon={Quote}
          title="No Testimonials Yet"
          description="Add client reviews and praise to showcase credibility on the studio homepage."
          actionLabel="Add First Review"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonialList.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-gold-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <Badge variant={t.published ? "gold" : "outline"} size="sm">
                    {t.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-xs text-sand-300 font-light italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-bronze-border/40 flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-ivory-100 block">{t.client_name}</span>
                  <span className="text-[11px] text-sand-500">{t.event_type || "Client"}</span>
                </div>
                <button
                  type="button"
                  className="text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
