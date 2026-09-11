import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";


/**
 * Returns true if Supabase URL and anon key are properly configured in environment variables.
 */
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project-id") &&
    !supabaseUrl.includes("placeholder") &&
    supabaseUrl.startsWith("http")
  );
}

/**
 * Creates a Supabase server client for use in Server Components,
 * Server Actions, and Route Handlers.
 * Gracefully provides safe client even if environment variables are not yet configured.
 */
export async function createClient() {
  let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;

  try {
    cookieStore = await cookies();
  } catch {
    // Static generation has no request cookie store.
  }

  const supabaseUrl =
    (process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "https://placeholder.supabase.co");
  const supabaseAnonKey =
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "placeholder-anon-key");

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore?.getAll() || [];
      },
      setAll(cookiesToSet) {
        if (!cookieStore) return;

        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if middleware is refreshing user sessions.
        }
      },
    },
  });
}
