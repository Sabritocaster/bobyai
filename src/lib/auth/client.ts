"use client";

import { useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function useAuthActions() {
  const supabase = getSupabaseBrowserClient();

  const signInWithGoogle = useCallback(
    async (redirectTo?: string) => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw error;
      }
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }, [supabase]);

  return {
    signInWithGoogle,
    signOut,
  };
}
