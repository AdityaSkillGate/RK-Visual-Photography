import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Creates a privileged Supabase admin client using the service role key.
 * 
 * SECURITY WARNING:
 * This client bypasses Row Level Security (RLS).
 * It must ONLY be called from secure server contexts (Server Actions / Route Handlers)
 * and NEVER bundled into client-side code.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("Security Violation: createAdminClient cannot be executed on the client side.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
