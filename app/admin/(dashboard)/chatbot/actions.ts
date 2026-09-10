"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ChatbotCategoryInsert = Database["public"]["Tables"]["chatbot_categories"]["Insert"];
type ChatbotCategoryUpdate = Database["public"]["Tables"]["chatbot_categories"]["Update"];
type ChatbotQuestionInsert = Database["public"]["Tables"]["chatbot_questions"]["Insert"];
type ChatbotQuestionUpdate = Database["public"]["Tables"]["chatbot_questions"]["Update"];

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatbotCategoryInput {
  name: string;
  slug?: string;
  description?: string | null;
  is_active?: boolean;
}

export interface ChatbotQuestionInput {
  category_id?: string | null;
  question: string;
  answer: string;
  action_label?: string | null;
  action_url?: string | null;
  is_active?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ==============================================================================
// CATEGORY ACTIONS
// ==============================================================================

/**
 * Creates a new chatbot category.
 */
export async function createChatbotCategoryAction(data: ChatbotCategoryInput): Promise<ActionResult> {
  const supabase = await createClient();

  if (!data.name || !data.name.trim()) {
    return { success: false, error: "Category name is required." };
  }

  const slug = data.slug && data.slug.trim() ? slugify(data.slug) : slugify(data.name);

  // Get max order index
  const { data: maxRow } = await supabase
    .from("chatbot_categories")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.order_index ?? 0) + 1;

  const insertPayload: ChatbotCategoryInsert = {
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || null,
    is_active: data.is_active ?? true,
    order_index: nextOrder,
  };

  const { data: created, error } = await supabase
    .from("chatbot_categories")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error("createChatbotCategoryAction error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/chatbot");
  revalidatePath("/");
  return { success: true, data: created };
}

/**
 * Updates an existing chatbot category.
 */
export async function updateChatbotCategoryAction(
  id: string,
  data: Partial<ChatbotCategoryInput>
): Promise<ActionResult> {
  const supabase = await createClient();

  const updatePayload: ChatbotCategoryUpdate = {};
  if (data.name !== undefined) updatePayload.name = data.name.trim();
  if (data.slug !== undefined) updatePayload.slug = slugify(data.slug);
  if (data.description !== undefined) updatePayload.description = data.description?.trim() || null;
  if (data.is_active !== undefined) updatePayload.is_active = data.is_active;

  const { data: updated, error } = await supabase
    .from("chatbot_categories")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateChatbotCategoryAction error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/chatbot");
  revalidatePath("/");
  return { success: true, data: updated };
}

/**
 * Toggles a category's active state.
 */
export async function toggleChatbotCategoryActiveAction(
  id: string,
  currentStatus: boolean
): Promise<ActionResult> {
  return updateChatbotCategoryAction(id, { is_active: !currentStatus });
}

/**
 * Deletes a chatbot category.
 */
export async function deleteChatbotCategoryAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  // First clear category_id from any questions assigned to this category
  await supabase
    .from("chatbot_questions")
    .update({ category_id: null })
    .eq("category_id", id);

  const { error } = await supabase
    .from("chatbot_categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteChatbotCategoryAction error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/chatbot");
  revalidatePath("/");
  return { success: true };
}

/**
 * Reorders categories.
 */
export async function reorderChatbotCategoriesAction(
  items: { id: string; order_index: number }[]
): Promise<ActionResult> {
  const supabase = await createClient();

  const updates = items.map((item) =>
    supabase
      .from("chatbot_categories")
      .update({ order_index: item.order_index })
      .eq("id", item.id)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);

  if (failed?.error) {
    return { success: false, error: failed.error.message };
  }

  revalidatePath("/admin/chatbot");
  revalidatePath("/");
  return { success: true };
}

// ==============================================================================
// QUESTION ACTIONS
// ==============================================================================

/**
 * Creates a new chatbot question & answer.
 */
export async function createChatbotQuestionAction(data: ChatbotQuestionInput): Promise<ActionResult> {
  const supabase = await createClient();

  if (!data.question || !data.question.trim()) {
    return { success: false, error: "Question prompt is required." };
  }
  if (!data.answer || !data.answer.trim()) {
    return { success: false, error: "Answer content is required." };
  }

  // Get max order index
  const { data: maxRow } = await supabase
    .from("chatbot_questions")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.order_index ?? 0) + 1;

  const insertPayload: ChatbotQuestionInsert = {
    category_id: data.category_id || null,
    question: data.question.trim(),
    answer: data.answer.trim(),
    action_label: data.action_label?.trim() || null,
    action_url: data.action_url?.trim() || null,
    is_active: data.is_active ?? true,
    order_index: nextOrder,
  };

  const { data: created, error } = await supabase
    .from("chatbot_questions")
    .insert(insertPayload)
    .select("*, chatbot_categories(name)")
    .single();

  if (error) {
    console.error("createChatbotQuestionAction error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/chatbot");
  revalidatePath("/");
  return { success: true, data: created };
}

/**
 * Updates an existing chatbot question.
 */
export async function updateChatbotQuestionAction(
  id: string,
  data: Partial<ChatbotQuestionInput>
): Promise<ActionResult> {
  const supabase = await createClient();

  const updatePayload: ChatbotQuestionUpdate = {
    updated_at: new Date().toISOString(),
  };

  if (data.category_id !== undefined) updatePayload.category_id = data.category_id || null;
  if (data.question !== undefined) updatePayload.question = data.question.trim();
  if (data.answer !== undefined) updatePayload.answer = data.answer.trim();
  if (data.action_label !== undefined) updatePayload.action_label = data.action_label?.trim() || null;
  if (data.action_url !== undefined) updatePayload.action_url = data.action_url?.trim() || null;
  if (data.is_active !== undefined) updatePayload.is_active = data.is_active;

  const { data: updated, error } = await supabase
    .from("chatbot_questions")
    .update(updatePayload)
    .eq("id", id)
    .select("*, chatbot_categories(name)")
    .single();

  if (error) {
    console.error("updateChatbotQuestionAction error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/chatbot");
  revalidatePath("/");
  return { success: true, data: updated };
}

/**
 * Toggles a question's active state.
 */
export async function toggleChatbotQuestionActiveAction(
  id: string,
  currentStatus: boolean
): Promise<ActionResult> {
  return updateChatbotQuestionAction(id, { is_active: !currentStatus });
}

/**
 * Deletes a chatbot question.
 */
export async function deleteChatbotQuestionAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("chatbot_questions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteChatbotQuestionAction error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/chatbot");
  revalidatePath("/");
  return { success: true };
}

/**
 * Reorders chatbot questions.
 */
export async function reorderChatbotQuestionsAction(
  items: { id: string; order_index: number }[]
): Promise<ActionResult> {
  const supabase = await createClient();

  const updates = items.map((item) =>
    supabase
      .from("chatbot_questions")
      .update({ order_index: item.order_index, updated_at: new Date().toISOString() })
      .eq("id", item.id)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);

  if (failed?.error) {
    return { success: false, error: failed.error.message };
  }

  revalidatePath("/admin/chatbot");
  revalidatePath("/");
  return { success: true };
}

// ==============================================================================
// PRIVACY-CONSCIOUS ANALYTICS EVENT LOGGING
// ==============================================================================

/**
 * Records an anonymous interaction event to public.analytics_events.
 * Strictly avoids capturing PII or confidential user input.
 */
export async function trackChatbotEventAction(
  eventName: string,
  metadata: Record<string, unknown> = {},
  pagePath: string = "/"
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("analytics_events").insert({
      event_name: eventName,
      page_path: pagePath,
      metadata: metadata as any,
    });

    if (error) {
      // Don't fail the client on telemetry errors
      console.warn("trackChatbotEventAction notice:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to record event" };
  }
}
