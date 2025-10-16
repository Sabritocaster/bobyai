"use client";

import { memo } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { CHARACTERS } from "@/constants/characters";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { CharacterAvatar } from "@/components/ui/character-avatar";
import { useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";

const MotionPaper = motion(Paper);

export const LandingHero = memo(function LandingHero() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("authError");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
        gap: 4,
        background:
          "linear-gradient(145deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 60%, rgba(15,118,110,1) 100%)",
      }}
    >
      <Stack spacing={4} maxWidth={420} width="100%">
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="error" variant="outlined">
              {authError}
            </Alert>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            fontWeight={800}
            color="white"
            sx={{
              textAlign: { xs: "left", md: "center" },
              fontSize: { xs: "2.1rem", md: "2.75rem" },
              wordSpacing: 6,
              lineHeight: 1.1,
            }}
          >
            Chat with AI characters with personality and nuance.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Typography
            variant="body1"
            color="rgba(255,255,255,0.72)"
            sx={{ textAlign: { xs: "left", md: "center" } }}
          >
            Choose a persona, craft conversations, and enjoy realtime responses
            powered by Groq. Crafted to spotlight smooth micro-interactions and
            mobile-first usability.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GoogleSignInButton />
        </motion.div>

        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          {CHARACTERS.slice(0, 3).map((character) => (
            <MotionPaper
              key={character.id}
              elevation={0}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              sx={{
                flex: 1,
                p: 2,
                bgcolor: "rgba(255,255,255,0.06)",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Stack spacing={1.5} alignItems="flex-start">
                <CharacterAvatar
                  name={character.name}
                  accentColor={character.accentColor}
                  src={character.avatar}
                  size={48}
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="white"
                  >
                    {character.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="rgba(255,255,255,0.7)"
                    sx={{ display: "block" }}
                  >
                    {character.tone}
                  </Typography>
                </Box>
              </Stack>
            </MotionPaper>
          ))}
        </Stack>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Typography
            variant="caption"
            color="rgba(255,255,255,0.65)"
            textAlign="center"
          >
            Supabase Auth • Framer Motion • Tailwind + Material UI • Groq LLM
          </Typography>
        </motion.div>
      </Stack>
    </Box>
  );
});
