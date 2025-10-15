"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { CharacterDefinition, ChatSession } from "@/types/chat";
import { CharacterAvatar } from "@/components/ui/character-avatar";

interface ChatSessionCardProps {
  session: ChatSession;
  character: CharacterDefinition;
  lastMessage?: string;
}

const MotionBox = motion(Box);

export function ChatSessionCard({
  session,
  character,
  lastMessage,
}: ChatSessionCardProps) {
  const href = `/chat/${character.id}?session=${session.id}`;

  return (
    <MotionBox
      component={Link}
      href={href}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      layout
      sx={{
        textDecoration: "none",
        display: "block",
      }}
    >
      <Box
        sx={{
          p: 2.5,
          borderRadius: 4,
          bgcolor: alpha(character.accentColor, 0.1),
          border: `1px solid ${alpha(character.accentColor, 0.12)}`,
          backdropFilter: "blur(12px)",
          display: "flex",
          gap: 2,
        }}
      >
        <CharacterAvatar
          name={character.name}
          accentColor={character.accentColor}
          src={character.avatar}
          size={52}
        />
        <Stack spacing={1} flexGrow={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1" fontWeight={700}>
              {session.title}
            </Typography>
            <Chip
              label={character.name}
              size="small"
              sx={{
                bgcolor: alpha(character.accentColor, 0.12),
                color: character.accentColor,
                fontWeight: 600,
              }}
            />
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {lastMessage ?? character.description}
          </Typography>
        </Stack>
        <IconButton
          size="large"
          sx={{
            alignSelf: "center",
            bgcolor: alpha(character.accentColor, 0.18),
            color: character.accentColor,
            "&:hover": {
              bgcolor: alpha(character.accentColor, 0.28),
            },
          }}
        >
          <ArrowForwardRoundedIcon />
        </IconButton>
      </Box>
    </MotionBox>
  );
}
