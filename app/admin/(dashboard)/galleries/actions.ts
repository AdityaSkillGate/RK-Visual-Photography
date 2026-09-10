"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteFromImageKit } from "@/lib/imagekit/server";

export interface SaveImageInput {
  project_id: string;
  image_url: string;
  file_id?: string | null;
  blur_data_url?: string | null;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
  caption?: string | null;
  order_index?: number;
  is_cover?: boolean;
  is_featured?: boolean;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Saves a new image record to project_images.
 */
export async function saveProjectImageAction(
  data: SaveImageInput
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  // If order_index not specified, calculate next
  let order = data.order_index;
  if (order === undefined) {
    const { data: maxRow } = await supabase
      .from("project_images")
      .select("order_index")
      .eq("project_id", data.project_id)
      .order("order_index", { ascending: false })
      .limit(1)
      .maybeSingle();

    order = (maxRow?.order_index ?? 0) + 1;
  }

  const { data: row, error } = await supabase
    .from("project_images")
    .insert({
      project_id: data.project_id,
      image_url: data.image_url,
      file_id: data.file_id || null,
      blur_data_url: data.blur_data_url || null,
      width: data.width || null,
      height: data.height || null,
      alt_text: data.alt_text || null,
      caption: data.caption || null,
      order_index: order,
      is_cover: data.is_cover ?? false,
      is_featured: data.is_featured ?? false,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  // If marked as cover, also update project cover_image_url
  if (data.is_cover) {
    await supabase
      .from("projects")
      .update({ cover_image_url: data.image_url })
      .eq("id", data.project_id);
  }

  revalidatePath(`/admin/projects/${data.project_id}/gallery`);
  revalidatePath("/admin/galleries");
  return { success: true, data: { id: row.id } };
}

/**
 * Sets an image as the official project cover image.
 */
export async function setCoverImageAction(
  projectId: string,
  imageId: string,
  imageUrl: string
): Promise<ActionResult> {
  const supabase = await createClient();

  // Reset all images in this project to is_cover = false
  await supabase
    .from("project_images")
    .update({ is_cover: false })
    .eq("project_id", projectId);

  // Set the selected image to is_cover = true
  const { error: imgErr } = await supabase
    .from("project_images")
    .update({ is_cover: true })
    .eq("id", imageId);

  if (imgErr) return { success: false, error: imgErr.message };

  // Update project table cover_image_url
  const { error: projErr } = await supabase
    .from("projects")
    .update({ cover_image_url: imageUrl })
    .eq("id", projectId);

  if (projErr) return { success: false, error: projErr.message };

  revalidatePath(`/admin/projects/${projectId}/gallery`);
  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/admin/projects");
  return { success: true };
}

/**
 * Toggles an image's featured flag (for highlights & feed).
 */
export async function toggleImageFeaturedAction(
  imageId: string,
  projectId: string,
  currentStatus: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("project_images")
    .update({ is_featured: !currentStatus })
    .eq("id", imageId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/projects/${projectId}/gallery`);
  return { success: true };
}

/**
 * Reorders images in a gallery by array of IDs.
 */
export async function reorderProjectImagesAction(
  projectId: string,
  orderedImageIds: string[]
): Promise<ActionResult> {
  const supabase = await createClient();

  for (let i = 0; i < orderedImageIds.length; i++) {
    const { error } = await supabase
      .from("project_images")
      .update({ order_index: i + 1 })
      .eq("id", orderedImageIds[i]);

    if (error) return { success: false, error: error.message };
  }

  revalidatePath(`/admin/projects/${projectId}/gallery`);
  return { success: true };
}

/**
 * Deletes a single image from PostgreSQL and ImageKit CDN.
 */
export async function deleteProjectImageAction(
  imageId: string,
  projectId: string,
  fileId?: string | null
): Promise<ActionResult> {
  const supabase = await createClient();

  // If ImageKit file_id exists, delete from ImageKit
  if (fileId) {
    try {
      await deleteFromImageKit(fileId);
    } catch (err) {
      console.warn("Could not delete from ImageKit (continuing DB deletion):", err);
    }
  }

  const { error } = await supabase
    .from("project_images")
    .delete()
    .eq("id", imageId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/projects/${projectId}/gallery`);
  revalidatePath("/admin/galleries");
  return { success: true };
}
