"use client";

import { PropsWithChildren, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAuthActions } from "@/lib/auth/client";
import type { Session } from "@supabase/supabase-js";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CharacterAvatar } from "@/components/ui/character-avatar";

type AppShellProps = PropsWithChildren<{
  session: Session;
  title?: string;
}>;

const motionVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export function AppShell({ session, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const displayName = session.user.user_metadata.full_name ?? session.user.email;
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;
    try {
      setSigningOut(true);
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        pt: { xs: 2, md: 3 },
        pb: { xs: 9, md: 4 },
      }}
    >
      <AppBar
        elevation={0}
        color="transparent"
        position="static"
        sx={{
          px: 2,
          pb: 1,
        }}
      >
        <Toolbar disableGutters sx={{ gap: 1.5 }}>
          <CharacterAvatar
            name={displayName ?? "You"}
            src={session.user.user_metadata.avatar_url}
            size={44}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Logged in as
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {displayName ?? "Guest"}
            </Typography>
          </Box>
          <IconButton
            onClick={handleSignOut}
            aria-label="Sign out"
            size="large"
            disabled={signingOut}
            sx={{
              bgcolor: "action.hover",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            <LogoutRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          px: 2,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={motionVariants}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>

      <BottomNav />
    </Box>
  );
}
