"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Stack, Typography } from "@mui/material";
import type { ChatMessage, CharacterDefinition } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  character: CharacterDefinition;
  streamingMessage?: {
    id: string;
    content: string;
  };
  isTyping?: boolean;
}

const MotionStack = motion(Stack);

export function MessageList({
  messages,
  character,
  streamingMessage,
  isTyping,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typing = isTyping ?? Boolean(streamingMessage);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typing, streamingMessage?.content]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        py: 2,
        pr: 1,
        display: "flex",
      }}
    >
      <MotionStack
        spacing={2}
        sx={{ width: "100%", mx: "auto", maxWidth: 720 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Stack
                spacing={1}
                textAlign="center"
                sx={{ py: 8, color: "text.secondary" }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Say hello to {character.name}
                </Typography>
                <Typography variant="body2">
                  Introduce yourself or ask a question to get the conversation
                  flowing.
                </Typography>
              </Stack>
            </motion.div>
          )}
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <MessageBubble
                message={message}
                character={character}
                isOwn={message.sender === "user"}
                isStreaming={message.streaming}
              />
            </motion.div>
          ))}
          {streamingMessage && (
            <motion.div
              key={streamingMessage.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <MessageBubble
                message={{
                  id: streamingMessage.id,
                  session_id: "live",
                  sender: "assistant",
                  content: streamingMessage.content,
                  created_at: new Date().toISOString(),
                  streaming: true,
                }}
                character={character}
                isOwn={false}
                isStreaming
              />
            </motion.div>
          )}
        </AnimatePresence>

        {typing && (
          <motion.div
            key="typing-indicator"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                {character.name} is crafting a response…
              </Typography>
              <Box className="typing-dots">
                <span />
              </Box>
            </Stack>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </MotionStack>
    </Box>
  );
}
