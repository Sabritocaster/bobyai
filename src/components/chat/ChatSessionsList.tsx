"use client";

import { useMemo, useState } from "react";
import {
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { motion, AnimatePresence } from "framer-motion";
import type { CharacterDefinition, ChatSession } from "@/types/chat";
import { ChatSessionCard } from "./ChatSessionCard";

interface ChatSessionsListProps {
  sessions: ChatSession[];
  characters: Record<string, CharacterDefinition>;
  lastMessageBySession?: Record<string, string>;
}

const MotionStack = motion(Stack);

export function ChatSessionsList({
  sessions,
  characters,
  lastMessageBySession = {},
}: ChatSessionsListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return sessions;
    }

    return sessions.filter((session) => {
      const character = characters[session.character_id];
      const haystacks = [
        session.title,
        character?.name ?? "",
        character?.description ?? "",
        lastMessageBySession[session.id] ?? "",
      ];

      return haystacks.some((value) =>
        value.toLowerCase().includes(normalized),
      );
    });
  }, [characters, lastMessageBySession, query, sessions]);

  return (
    <Stack spacing={3}>
      <TextField
        placeholder="Search moments or characters"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon />
            </InputAdornment>
          ),
        }}
        size="medium"
        variant="outlined"
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
        }}
      />

      <AnimatePresence mode="popLayout">
        <MotionStack
          key={filtered.length}
          spacing={2.5}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {filtered.length > 0 ? (
            filtered.map((session) => {
              const character = characters[session.character_id];

              if (!character) {
                return null;
              }

              return (
                <ChatSessionCard
                  key={session.id}
                  session={session}
                  character={character}
                  lastMessage={lastMessageBySession[session.id]}
                />
              );
            })
          ) : (
            <Stack spacing={1.5} alignItems="center" textAlign="center" mt={6}>
              <Typography variant="h6" fontWeight={700}>
                No conversations found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try expanding your search or start a fresh chat from the
                characters tab.
              </Typography>
            </Stack>
          )}
          <div style={{ height: 16 }} />
        </MotionStack>
      </AnimatePresence>
    </Stack>
  );
}
