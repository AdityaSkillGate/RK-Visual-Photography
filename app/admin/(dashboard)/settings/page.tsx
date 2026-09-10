import React from "react";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Settings, Save, Phone, Mail, MapPin, Globe, Shield } from "lucide-react";

export const revalidate = 0;

interface StudioSettings {
  studio_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram_url: string;
}

const defaultSettings: StudioSettings = {
  studio_name: "RK Visual Photography",
  tagline: "Luxury Editorial Wedding & Portrait Photography",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "contact@rkvisual.com",
  address: "Tamil Nadu, India",
  instagram_url: "https://instagram.com/rkvisual",
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: settingRow } = await supabase
    .from("site_settings")
    .select("*")
    .eq("key", "general")
    .maybeSingle();

  const current: StudioSettings = {
    ...defaultSettings,
    ...((settingRow?.value as unknown as Partial<StudioSettings>) || {}),
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminPageHeader
        title="Studio Settings"
        description="Global studio details, contact info, booking WhatsApp numbers, and branding parameters."
        badge={
          <Badge variant="gold" size="sm">
            Configuration
          </Badge>
        }
      />

      <div className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 p-6 sm:p-8 space-y-6">
        <div className="border-b border-bronze-border/50 pb-4">
          <h2 className="font-display text-lg font-medium text-ivory-100 flex items-center gap-2">
            <Settings size={18} className="text-gold-400" />
            <span>Studio Identity</span>
          </h2>
          <p className="text-xs text-sand-400 font-light mt-1">
            Displayed across meta tags, hero headers, and footer credits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              Studio Name
            </label>
            <input
              type="text"
              defaultValue={current.studio_name || ""}
              className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none"
              placeholder="RK Visual Photography"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              Studio Tagline
            </label>
            <input
              type="text"
              defaultValue={current.tagline || ""}
              className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none"
              placeholder="Luxury Editorial Photography"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              Contact Phone
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500">
                <Phone size={13} />
              </span>
              <input
                type="text"
                defaultValue={current.phone || ""}
                className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-8 pr-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none font-mono"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              WhatsApp Booking Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500">
                <Globe size={13} />
              </span>
              <input
                type="text"
                defaultValue={current.whatsapp || ""}
                className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-8 pr-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none font-mono"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              Studio Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500">
                <Mail size={13} />
              </span>
              <input
                type="email"
                defaultValue={current.email || ""}
                className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-8 pr-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none"
                placeholder="contact@rkvisual.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              Location / Region
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500">
                <MapPin size={13} />
              </span>
              <input
                type="text"
                defaultValue={current.address || ""}
                className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-8 pr-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none"
                placeholder="Tamil Nadu, India"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-bronze-border/50 flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="md"
            leftIcon={<Save size={14} />}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
