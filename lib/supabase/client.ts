import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const DEFAULT_SUPABASE_URL = "https://dynalwqtaqilrunjtaug.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmFsd3F0YXFpbHJ1bmp0YXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMzU0MDgsImV4cCI6MjEwMDcxMTQwOH0.VTa7CPjpNK-Tq4lF-i8Xg-ZVlWl-qcwKCTAXa-SKP7Y";

/**
 * Returns true if Supabase URL and anon key are properly configured.
 */
export function isSupabaseConfigured(): boolean {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    DEFAULT_SUPABASE_ANON_KEY;

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
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
