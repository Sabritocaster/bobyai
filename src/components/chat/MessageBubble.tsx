"use client";

import { memo } from "react";
import { Box, Paper, Typography, alpha } from "@mui/material";
import { motion } from "framer-motion";
import type { ChatMessage, CharacterDefinition } from "@/types/chat";
import { CharacterAvatar } from "@/components/ui/character-avatar";

interface MessageBubbleProps {
  message: ChatMessage;
  character: CharacterDefinition;
  isOwn: boolean;
  isStreaming?: boolean;
}

const MotionPaper = motion(Paper);

export const MessageBubble = memo(function MessageBubble({
  message,
  character,
  isOwn,
  isStreaming = false,
}: MessageBubbleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        gap: 1.5,
        alignItems: "flex-end",
      }}
    >
      {!isOwn && (
        <CharacterAvatar
          name={character.name}
          src={character.avatar}
          accentColor={character.accentColor}
          size={36}
        />
      )}
      <MotionPaper
        elevation={0}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        sx={{
          p: 2,
          maxWidth: "80%",
          borderRadius: 3,
          bgcolor: isOwn
            ? alpha(character.accentColor, 0.22)
            : "background.paper",
          color: isOwn ? "text.primary" : "text.secondary",
          border: isOwn
            ? `1px solid ${alpha(character.accentColor, 0.3)}`
            : `1px solid ${alpha(character.accentColor, 0.12)}`,
          position: "relative",
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {message.content}
          {isStreaming && (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 10,
                height: 18,
                ml: 0.5,
                background: alpha(character.accentColor, 0.7),
                borderRadius: 999,
                animation: "pulse 0.6s ease-in-out infinite alternate",
              }}
            />
          )}
        </Typography>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: "block", mt: 0.75, textAlign: "right" }}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </MotionPaper>
    </Box>
  );
});
