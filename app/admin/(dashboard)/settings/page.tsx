import React from "react";
import { createClient } from "@/lib/supabase/server";
import { getExperienceMetrics } from "@/lib/supabase/queries";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Badge from "@/components/ui/Badge";
import AdminSettingsForm from "./AdminSettingsForm";
import type { StudioSettingsInput } from "./actions";

export const revalidate = 0;

const defaultSettings: StudioSettingsInput = {
  studio_name: "RK Visual Photography",
  tagline: "Luxury Fine-Art Wedding & Editorial Studio",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "contact@rkvisual.com",
  address: "Tamil Nadu, India",
  instagram_url: "https://www.instagram.com/rk_visual_photography/",
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // Fetch general studio settings
  const { data: settingRow } = await supabase
    .from("site_settings")
    .select("*")
    .eq("key", "general")
    .maybeSingle();

  const currentStudio: StudioSettingsInput = {
    ...defaultSettings,
    ...((settingRow?.value as unknown as Partial<StudioSettingsInput>) || {}),
  };

  // Fetch current experience metrics
  const currentMetrics = await getExperienceMetrics();

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminPageHeader
        title="Studio Settings"
        description="Manage live homepage experience metrics, contact details, booking WhatsApp numbers, and global identity."
        badge={
          <Badge variant="gold" size="sm">
            Configuration
          </Badge>
        }
      />

      <AdminSettingsForm
        initialStudio={currentStudio}
        initialMetrics={currentMetrics}
      />
    </div>
  );
}
