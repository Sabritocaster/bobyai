import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/chat";
  const redirectUrl = new URL(next, requestUrl.origin);

  if (!code) {
    return NextResponse.redirect(new URL("/", requestUrl.origin));
  }

  const env = getEnv();
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const errorUrl = new URL("/", requestUrl.origin);
    errorUrl.searchParams.set("authError", error.message);
    return NextResponse.redirect(errorUrl);
  }

  return response;
}
