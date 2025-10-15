import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getClientEnv } from "../env";
import type { Database } from "@/types/database";

let browserClient: SupabaseClient<Database> | undefined;

export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (!browserClient) {
    const env = getClientEnv();
    browserClient = createBrowserClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookieOptions: {
          lifetime: 60 * 60 * 24 * 7, // 7 days
          sameSite: "lax",
        },
      },
    );
  }

  return browserClient;
}
