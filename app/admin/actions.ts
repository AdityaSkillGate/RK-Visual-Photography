"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export interface AuthActionResult {
  success?: boolean;
  error?: string;
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Signs in the admin with email and password.
 */
export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  let email = (formData.get("email") as string)?.trim() || "";
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/admin";

  if (!email || !password) {
    return { error: "Please provide both username/email and password." };
  }

  // Support username 'admin' or unqualified usernames
  if (email.toLowerCase() === "admin" || !email.includes("@")) {
    email = "admin@rkvisual.com";
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Database is not configured. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel Environment Variables.",
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err: any) {
    return { error: err?.message || "Failed to authenticate." };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

/**
 * Signs out the current admin session.
 */
export async function logoutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  }
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

/**
 * Retrieves the currently authenticated admin profile.
 */
export async function getAdminSession() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const profile = (data as Profile | null) ?? null;

    return { user, profile };
  } catch (err) {
    console.warn("Could not retrieve admin session:", err);
    return null;
  }
}
