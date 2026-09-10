"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string | null;
  published?: boolean;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Creates a new category with slug uniqueness validation.
 */
export async function createCategoryAction(
  data: CategoryInput
): Promise<ActionResult> {
  const supabase = await createClient();

  // Validate required fields
  if (!data.name || !data.slug) {
    return { success: false, error: "Name and slug are required." };
  }

  // Sanitize slug
  const cleanSlug = data.slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Get current max order_index
  const { data: maxRow } = await supabase
    .from("categories")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.order_index ?? 0) + 1;

  const { data: newCat, error } = await supabase
    .from("categories")
    .insert({
      name: data.name.trim(),
      slug: cleanSlug,
      description: data.description?.trim() || null,
      published: data.published ?? true,
      order_index: nextOrder,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A category with this URL slug already exists." };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/projects");
  return { success: true, data: newCat };
}

/**
 * Updates an existing category.
 */
export async function updateCategoryAction(
  id: string,
  data: Partial<CategoryInput>
): Promise<ActionResult> {
  const supabase = await createClient();

  const updates: CategoryUpdate = {};
  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.slug !== undefined) {
    updates.slug = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  if (data.description !== undefined) updates.description = data.description?.trim() || null;
  if (data.published !== undefined) updates.published = data.published;

  const { data: updated, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A category with this URL slug already exists." };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/projects");
  return { success: true, data: updated };
}

/**
 * Toggles category published status.
 */
export async function toggleCategoryPublishAction(
  id: string,
  currentStatus: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({ published: !currentStatus })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/categories");
  return { success: true };
}

/**
 * Reorders categories by array of IDs in sequence.
 */
export async function reorderCategoriesAction(
  orderedIds: string[]
): Promise<ActionResult> {
  const supabase = await createClient();

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("categories")
      .update({ order_index: i + 1 })
      .eq("id", orderedIds[i]);

    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

/**
 * Deletes a category if no projects depend on it.
 */
export async function deleteCategoryAction(
  id: string
): Promise<ActionResult> {
  const supabase = await createClient();

  // Check if projects are linked
  const { count, error: countErr } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (countErr) return { success: false, error: countErr.message };

  if (count && count > 0) {
    return {
      success: false,
      error: `Cannot delete: ${count} project(s) belong to this category. Please reassign or delete them first.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/admin/projects");
  return { success: true };
}
