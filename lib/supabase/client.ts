import { createBrowserClient } from "@supabase/ssr";
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
 * Creates a Supabase browser client for use in Client Components.
 */
export function createClient() {
  const supabaseUrl =
    (process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "https://placeholder.supabase.co");
  const supabaseAnonKey =
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "placeholder-anon-key");

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
