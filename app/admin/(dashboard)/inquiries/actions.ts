"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { InquiryStatus } from "@/types";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

const VALID_STATUSES = new Set([
  "new",
  "contacted",
  "follow_up",
  "quoted",
  "confirmed",
  "completed",
  "cancelled",
]);

/**
 * Updates the CRM status of an inquiry.
 */
export async function updateInquiryStatusAction(
  id: string,
  status: InquiryStatus | string
): Promise<ActionResult> {
  const cleanStatus = status.toLowerCase().trim();
  if (!VALID_STATUSES.has(cleanStatus)) {
    return { success: false, error: `Invalid status: ${status}` };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inquiries")
    .update({
      status: cleanStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateInquiryStatusAction error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin");
  return { success: true, data };
}

/**
 * Updates internal studio admin notes on an inquiry.
 */
export async function updateInquiryNotesAction(
  id: string,
  adminNotes: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inquiries")
    .update({
      admin_notes: adminNotes.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateInquiryNotesAction error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  return { success: true, data };
}

/**
 * Archives or unarchives an inquiry.
 */
export async function toggleInquiryArchiveAction(
  id: string,
  isArchived: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inquiries")
    .update({
      is_archived: isArchived,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("toggleInquiryArchiveAction error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin");
  return { success: true, data };
}

/**
 * Permanently deletes an inquiry.
 */
export async function deleteInquiryAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("inquiries").delete().eq("id", id);

  if (error) {
    console.error("deleteInquiryAction error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { success: true };
}
