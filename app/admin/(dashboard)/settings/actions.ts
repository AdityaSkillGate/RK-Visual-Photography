"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ExperienceMetricItem } from "@/lib/supabase/fallback-data";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface StudioSettingsInput {
  studio_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram_url: string;
}

/**
 * Saves general studio identity and contact settings to Supabase site_settings.
 */
export async function saveStudioSettings(
  input: StudioSettingsInput
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Check if key 'general' exists
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id, value")
      .eq("key", "general")
      .maybeSingle();

    const mergedValue = {
      ...(typeof existing?.value === "object" && existing?.value ? existing.value : {}),
      ...input,
    };

    if (existing?.id) {
      const { error } = await supabase
        .from("site_settings")
        .update({
          value: mergedValue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("site_settings").insert({
        key: "general",
        value: mergedValue,
        description: "General studio identity and contact information",
      });

      if (error) throw error;
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (err: any) {
    console.error("Error saving studio settings:", err);
    return { success: false, error: err.message || "Failed to update studio settings." };
  }
}

/**
 * Saves the 4 experience metrics (Media Experience, Weddings Shot, Events Managed, Happy Clients) to Supabase.
 */
export async function saveExperienceMetrics(
  metrics: ExperienceMetricItem[]
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // 1. Upsert dedicated key "experience_metrics"
    const { data: existingMetrics } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", "experience_metrics")
      .maybeSingle();

    if (existingMetrics?.id) {
      const { error } = await supabase
        .from("site_settings")
        .update({
          value: metrics as any,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingMetrics.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("site_settings").insert({
        key: "experience_metrics",
        value: metrics as any,
        description: "Studio experience and milestone metrics for homepage display",
      });

      if (error) throw error;
    }

    // 2. Also keep general.experience_metrics synchronized
    const { data: generalRow } = await supabase
      .from("site_settings")
      .select("id, value")
      .eq("key", "general")
      .maybeSingle();

    if (generalRow?.id) {
      const updatedGeneral = {
        ...(typeof generalRow.value === "object" && generalRow.value ? generalRow.value : {}),
        experience_metrics: metrics,
      };

      await supabase
        .from("site_settings")
        .update({
          value: updatedGeneral as any,
          updated_at: new Date().toISOString(),
        })
        .eq("id", generalRow.id);
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (err: any) {
    console.error("Error saving experience metrics:", err);
    return { success: false, error: err.message || "Failed to update experience metrics." };
  }
}
