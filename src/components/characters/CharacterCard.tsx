"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import SparklesRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import type { CharacterDefinition } from "@/types/chat";
import { CharacterAvatar } from "@/components/ui/character-avatar";

interface CharacterCardProps {
  character: CharacterDefinition;
}

const MotionBox = motion(Box);

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <MotionBox
      layout
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      sx={{
        position: "relative",
        borderRadius: 4,
        p: 3,
        bgcolor: alpha(character.accentColor, 0.12),
        border: `1px solid ${alpha(character.accentColor, 0.18)}`,
        backdropFilter: "blur(16px)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: 220,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <CharacterAvatar
          name={character.name}
          src={character.avatar}
          accentColor={character.accentColor}
          size={56}
        />
        <Box>
          <Typography variant="h6" fontWeight={800}>
            {character.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {character.description}
          </Typography>
        </Box>
      </Stack>

      <Chip
        icon={<SparklesRoundedIcon fontSize="small" />}
        label={character.tone}
        sx={{
          alignSelf: "flex-start",
          bgcolor: alpha(character.accentColor, 0.16),
          color: character.accentColor,
          fontWeight: 600,
        }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ flexGrow: 1, lineHeight: 1.6 }}
      >
        {character.systemPrompt}
      </Typography>

      <Button
        component={Link}
        href={`/chat/${character.id}?new=1`}
        variant="contained"
        endIcon={<SparklesRoundedIcon />}
        sx={{
          borderRadius: 999,
          alignSelf: "flex-start",
          px: 2.5,
          bgcolor: character.accentColor,
          "&:hover": {
            bgcolor: alpha(character.accentColor, 0.9),
          },
        }}
      >
        Start chat
      </Button>
    </MotionBox>
  );
}
