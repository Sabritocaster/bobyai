import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "../env";
import type { Database } from "@/types/database";

export async function getSupabaseServerClient(): Promise<
  SupabaseClient<Database>
> {
  const env = getEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        async setAll(cookiesToSet) {
          try {
            await Promise.all(
              cookiesToSet.map(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              ),
            );
          } catch {
            // The `set` method fails inside a Server Component (read-only cookies).
          }
        },
      },
    },
  );
}
