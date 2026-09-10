"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export interface ProjectInput {
  title: string;
  slug: string;
  category_id?: string | null;
  cover_image_url?: string;
  location?: string | null;
  event_date?: string | null;
  description?: string | null;
  story?: string | null;
  featured?: boolean;
  published?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Creates a new photoshoot project with slug validation.
 */
export async function createProjectAction(
  data: ProjectInput
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  if (!data.title || !data.slug) {
    return { success: false, error: "Title and slug are required." };
  }

  // Clean slug
  const cleanSlug = data.slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Default fallback cover image if not provided yet
  const cover = data.cover_image_url || "/assets/logo/logo.png";

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      title: data.title.trim(),
      slug: cleanSlug,
      category_id: data.category_id || null,
      cover_image_url: cover,
      location: data.location?.trim() || null,
      event_date: data.event_date || null,
      description: data.description?.trim() || null,
      story: data.story?.trim() || null,
      featured: data.featured ?? false,
      published: data.published ?? false,
      seo_title: data.seo_title?.trim() || `${data.title.trim()} | RK Visual Photography`,
      seo_description: data.seo_description?.trim() || data.description?.trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A project with this URL slug already exists." };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  return { success: true, data: { id: project.id } };
}

/**
 * Updates an existing project.
 */
export async function updateProjectAction(
  id: string,
  data: Partial<ProjectInput>
): Promise<ActionResult> {
  const supabase = await createClient();

  const updates: ProjectUpdate = {};
  if (data.title !== undefined) updates.title = data.title.trim();
  if (data.slug !== undefined) {
    updates.slug = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  if (data.category_id !== undefined) updates.category_id = data.category_id || null;
  if (data.cover_image_url !== undefined) updates.cover_image_url = data.cover_image_url;
  if (data.location !== undefined) updates.location = data.location?.trim() || null;
  if (data.event_date !== undefined) updates.event_date = data.event_date || null;
  if (data.description !== undefined) updates.description = data.description?.trim() || null;
  if (data.story !== undefined) updates.story = data.story?.trim() || null;
  if (data.featured !== undefined) updates.featured = data.featured;
  if (data.published !== undefined) updates.published = data.published;
  if (data.seo_title !== undefined) updates.seo_title = data.seo_title?.trim() || null;
  if (data.seo_description !== undefined) updates.seo_description = data.seo_description?.trim() || null;

  const { data: updated, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A project with this URL slug already exists." };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  revalidatePath("/admin");
  return { success: true, data: updated };
}

/**
 * Toggles project publication state.
 */
export async function toggleProjectPublishAction(
  id: string,
  currentStatus: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ published: !currentStatus })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  return { success: true };
}

/**
 * Toggles project featured state.
 */
export async function toggleProjectFeaturedAction(
  id: string,
  currentStatus: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ featured: !currentStatus })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/projects");
  return { success: true };
}

/**
 * Deletes a project (cascades to project_images in PostgreSQL).
 */
export async function deleteProjectAction(
  id: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/admin/galleries");
  revalidatePath("/admin");
  return { success: true };
}
