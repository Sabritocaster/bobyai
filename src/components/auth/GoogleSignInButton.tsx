"use client";

import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuthActions } from "@/lib/auth/client";

export function GoogleSignInButton() {
  const { signInWithGoogle } = useAuthActions();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle(`${window.location.origin}/auth/callback`);
    } catch (error) {
      console.error("Google sign-in failed", error);
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      fullWidth
      size="large"
      loading={loading}
      startIcon={<GoogleIcon />}
      variant="contained"
      onClick={handleSignIn}
      sx={{
        mt: 2,
        borderRadius: 999,
        py: 1.5,
        fontWeight: 700,
      }}
    >
      Continue with Google
    </LoadingButton>
  );
}
