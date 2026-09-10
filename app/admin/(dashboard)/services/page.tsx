import React from "react";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Badge from "@/components/ui/Badge";
import { Briefcase, Plus } from "lucide-react";

export const revalidate = 0;

export default async function AdminServicesPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("order_index", { ascending: true });

  const serviceList = services || [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Services & Packages"
        description="Configure photography offerings, deliverables, starting prices, and booking details."
        badge={
          <Badge variant="gold" size="sm">
            {serviceList.length} Services
          </Badge>
        }
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-3.5 py-2 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-gold-subtle"
          >
            <Plus size={14} />
            <span>Add Service</span>
          </button>
        }
      />

      {serviceList.length === 0 ? (
        <AdminEmptyState
          icon={Briefcase}
          title="No Services Configured"
          description="Add your studio services (e.g., Luxury Wedding Documentation, Editorial Portrait Sessions)."
          actionLabel="Create Service"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceList.map((svc) => (
            <div
              key={svc.id}
              className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gold-400 font-mono">
                    /{svc.slug}
                  </span>
                  <Badge variant={svc.is_active ? "gold" : "outline"} size="sm">
                    {svc.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <h3 className="font-display text-lg font-medium text-ivory-100">
                  {svc.title}
                </h3>
                <p className="mt-1.5 text-xs text-sand-400 font-light leading-relaxed line-clamp-3">
                  {svc.description || "No description provided."}
                </p>
              </div>

              <div className="pt-3 border-t border-bronze-border/40 flex items-center justify-between text-xs">
                <span className="text-sand-400 truncate max-w-[180px]">
                  {svc.summary || "Quote on Request"}
                </span>
                <button
                  type="button"
                  className="text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
