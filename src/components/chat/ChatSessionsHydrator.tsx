"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatSession, CharacterDefinition, ChatMessage } from "@/types/chat";
import { ChatSessionsList } from "./ChatSessionsList";
import { useSupabase } from "@/providers/supabase-provider";

interface ChatSessionsHydratorProps {
  initialSessions: ChatSession[];
  characters: Record<string, CharacterDefinition>;
  initialLastMessages: Record<string, string>;
  userId: string;
}

const sortSessions = (sessions: ChatSession[]) =>
  [...sessions].sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

export function ChatSessionsHydrator({
  initialSessions,
  characters,
  initialLastMessages,
  userId,
}: ChatSessionsHydratorProps) {
  const { supabase } = useSupabase();
  const [sessions, setSessions] = useState<ChatSession[]>(
    sortSessions(initialSessions),
  );
  const [lastMessages, setLastMessages] = useState(initialLastMessages);
  const initializedRef = useRef(false);

  useEffect(() => {
    setSessions(sortSessions(initialSessions));
    setLastMessages(initialLastMessages);
  }, [initialLastMessages, initialSessions]);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    const sessionsChannel = supabase
      .channel(`chat-sessions-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_sessions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setSessions((previous) => {
            const next = [...previous];
            const record = payload.new as ChatSession;

            if (payload.eventType === "INSERT") {
              next.push(record);
            } else if (payload.eventType === "UPDATE") {
              const index = next.findIndex((item) => item.id === record.id);
              if (index !== -1) {
                next[index] = record;
              }
            } else if (payload.eventType === "DELETE") {
              return next.filter((item) => item.id !== payload.old?.id);
            }

            return sortSessions(next);
          });
        },
      )
      .subscribe();

    const messagesChannel = supabase
      .channel(`chat-messages-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const record = payload.new as ChatMessage;
          setLastMessages((prev) => ({
            ...prev,
            [record.session_id]: record.content,
          }));
          setSessions((prev) =>
            sortSessions(
              prev.map((session) =>
                session.id === record.session_id
                  ? { ...session, updated_at: record.created_at }
                  : session,
              ),
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [supabase, userId]);

  const charactersMemo = useMemo(() => characters, [characters]);

  return (
    <ChatSessionsList
      sessions={sessions}
      characters={charactersMemo}
      lastMessageBySession={lastMessages}
    />
  );
}
