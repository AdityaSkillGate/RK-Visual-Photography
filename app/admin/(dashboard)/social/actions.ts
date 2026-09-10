"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type SocialLinkInsert = Database["public"]["Tables"]["social_links"]["Insert"];
type SocialLinkUpdate = Database["public"]["Tables"]["social_links"]["Update"];
type SocialPostInsert = Database["public"]["Tables"]["social_posts"]["Insert"];
type SocialPostUpdate = Database["public"]["Tables"]["social_posts"]["Update"];

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SocialLinkInput {
  platform: string;
  label: string;
  url: string;
  handle?: string | null;
  is_active?: boolean;
}

export interface SocialPostInput {
  platform: string;
  post_url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
  is_featured?: boolean;
}

/**
 * Intelligent helper to extract platform, IDs, and thumbnail URLs from social media links.
 */
export async function detectSocialMetadata(url: string) {
  const cleanUrl = url.trim();
  let platform: "instagram" | "youtube" | "facebook" | "whatsapp" | "google_business" = "instagram";
  let suggestedThumbnail = "";
  let extractedId = "";

  // YouTube match: /shorts/ID, ?v=ID, or youtu.be/ID
  const ytShortMatch = cleanUrl.match(/(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (ytShortMatch) {
    platform = "youtube";
    extractedId = ytShortMatch[1];
    suggestedThumbnail = `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`;
    return { platform, extractedId, suggestedThumbnail };
  }

  // Instagram match: /reel/CODE or /p/CODE
  const igMatch = cleanUrl.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
  if (igMatch) {
    platform = "instagram";
    extractedId = igMatch[1];
    return { platform, extractedId, suggestedThumbnail };
  }

  // Facebook
  if (cleanUrl.includes("facebook.com") || cleanUrl.includes("fb.watch")) {
    platform = "facebook";
    return { platform, extractedId: "", suggestedThumbnail };
  }

  // WhatsApp
  if (cleanUrl.includes("wa.me") || cleanUrl.includes("whatsapp.com")) {
    platform = "whatsapp";
    return { platform, extractedId: "", suggestedThumbnail };
  }

  // Google Maps / Business
  if (cleanUrl.includes("google.com/maps") || cleanUrl.includes("goo.gl")) {
    platform = "google_business";
    return { platform, extractedId: "", suggestedThumbnail };
  }

  return { platform, extractedId, suggestedThumbnail };
}

// ==============================================================================
// SOCIAL LINKS (PROFILES & CHANNELS)
// ==============================================================================

/**
 * Creates or updates a studio social link profile.
 */
export async function createSocialLinkAction(data: SocialLinkInput): Promise<ActionResult> {
  const supabase = await createClient();

  if (!data.platform || !data.label || !data.url) {
    return { success: false, error: "Platform, label, and URL are required." };
  }

  // Get max order index
  const { data: maxRow } = await supabase
    .from("social_links")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.order_index ?? 0) + 1;

  const insertData: SocialLinkInsert = {
    platform: data.platform.trim().toLowerCase(),
    label: data.label.trim(),
    url: data.url.trim(),
    handle: data.handle?.trim() || null,
    is_active: data.is_active ?? true,
    order_index: nextOrder,
  };

  const { data: inserted, error } = await supabase
    .from("social_links")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: `A profile for ${data.platform} already exists. Please edit it instead.` };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/social");
  revalidatePath("/");
  revalidatePath("/contact");
  return { success: true, data: inserted };
}

/**
 * Updates an existing social link profile.
 */
export async function updateSocialLinkAction(id: string, data: Partial<SocialLinkInput>): Promise<ActionResult> {
  const supabase = await createClient();

  const updates: SocialLinkUpdate = {};
  if (data.label !== undefined) updates.label = data.label.trim();
  if (data.url !== undefined) updates.url = data.url.trim();
  if (data.handle !== undefined) updates.handle = data.handle?.trim() || null;
  if (data.is_active !== undefined) updates.is_active = data.is_active;

  const { data: updated, error } = await supabase
    .from("social_links")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/social");
  revalidatePath("/");
  revalidatePath("/contact");
  return { success: true, data: updated };
}

/**
 * Toggles a social link's active state.
 */
export async function toggleSocialLinkActiveAction(id: string, currentStatus: boolean): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("social_links")
    .update({ is_active: !currentStatus })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/social");
  revalidatePath("/");
  revalidatePath("/contact");
  return { success: true };
}

/**
 * Reorders social links by an array of IDs in new order.
 */
export async function reorderSocialLinksAction(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await createClient();

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("social_links")
      .update({ order_index: i + 1 })
      .eq("id", orderedIds[i]);

    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/admin/social");
  revalidatePath("/");
  return { success: true };
}

/**
 * Deletes a social link profile.
 */
export async function deleteSocialLinkAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/social");
  revalidatePath("/");
  revalidatePath("/contact");
  return { success: true };
}

// ==============================================================================
// SOCIAL POSTS (CURATED REELS, SHORTS, & POSTS)
// ==============================================================================

/**
 * Creates a new curated social feed post.
 */
export async function createSocialPostAction(data: SocialPostInput): Promise<ActionResult> {
  const supabase = await createClient();

  if (!data.post_url) {
    return { success: false, error: "Post or Reel URL is required." };
  }

  // Detect platform and thumbnail if not specified
  const meta = await detectSocialMetadata(data.post_url);
  const finalPlatform = data.platform || meta.platform;
  const finalThumbnail = data.thumbnail_url?.trim() || meta.suggestedThumbnail || null;

  // Get max order index
  const { data: maxRow } = await supabase
    .from("social_posts")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.order_index ?? 0) + 1;

  const insertData: SocialPostInsert = {
    platform: finalPlatform,
    post_url: data.post_url.trim(),
    thumbnail_url: finalThumbnail,
    caption: data.caption?.trim() || null,
    is_featured: data.is_featured ?? true,
    order_index: nextOrder,
  };

  const { data: inserted, error } = await supabase
    .from("social_posts")
    .insert(insertData)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/social");
  revalidatePath("/");
  return { success: true, data: inserted };
}

/**
 * Updates an existing curated social post.
 */
export async function updateSocialPostAction(id: string, data: Partial<SocialPostInput>): Promise<ActionResult> {
  const supabase = await createClient();

  const updates: SocialPostUpdate = {};
  if (data.platform !== undefined) updates.platform = data.platform;
  if (data.post_url !== undefined) {
    updates.post_url = data.post_url.trim();
    // Auto-update thumbnail if changed and empty
    if (!data.thumbnail_url) {
      const meta = await detectSocialMetadata(data.post_url);
      if (meta.suggestedThumbnail) updates.thumbnail_url = meta.suggestedThumbnail;
    }
  }
  if (data.thumbnail_url !== undefined) updates.thumbnail_url = data.thumbnail_url?.trim() || null;
  if (data.caption !== undefined) updates.caption = data.caption?.trim() || null;
  if (data.is_featured !== undefined) updates.is_featured = data.is_featured;

  const { data: updated, error } = await supabase
    .from("social_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/social");
  revalidatePath("/");
  return { success: true, data: updated };
}

/**
 * Toggles whether a post is featured on the public site.
 */
export async function toggleSocialPostFeaturedAction(id: string, currentStatus: boolean): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("social_posts")
    .update({ is_featured: !currentStatus })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/social");
  revalidatePath("/");
  return { success: true };
}

/**
 * Reorders social posts by an array of IDs.
 */
export async function reorderSocialPostsAction(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await createClient();

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("social_posts")
      .update({ order_index: i + 1 })
      .eq("id", orderedIds[i]);

    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/admin/social");
  revalidatePath("/");
  return { success: true };
}

/**
 * Deletes a social post.
 */
export async function deleteSocialPostAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("social_posts").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/social");
  revalidatePath("/");
  return { success: true };
}
