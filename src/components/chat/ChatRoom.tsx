"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Stack } from "@mui/material";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { ChatMessage, CharacterDefinition } from "@/types/chat";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import { useSupabase } from "@/providers/supabase-provider";

interface ChatRoomProps {
  sessionId: string;
  character: CharacterDefinition;
  initialMessages: ChatMessage[];
}

interface StreamingState {
  id: string;
  content: string;
}

const sortMessages = (items: ChatMessage[]) =>
  [...items].sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

export function ChatRoom({
  sessionId,
  character,
  initialMessages,
}: ChatRoomProps) {
  const { supabase } = useSupabase();
  const [messages, setMessages] = useState<ChatMessage[]>(
    sortMessages(initialMessages),
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState<StreamingState | null>(null);
  const idsRef = useRef(new Set(initialMessages.map((msg) => msg.id)));
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    setMessages(sortMessages(initialMessages));
    idsRef.current = new Set(initialMessages.map((msg) => msg.id));
  }, [initialMessages, sessionId]);

  useEffect(() => {
    const channel = supabase
      .channel(`chat-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;

          if (idsRef.current.has(newMessage.id)) {
            return;
          }

          idsRef.current.add(newMessage.id);
          setMessages((prev) => sortMessages([...prev, newMessage]));
          setStreaming((current) =>
            current && current.id === newMessage.id ? null : current,
          );
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [sessionId, supabase]);

  const handleSend = async (rawContent: string) => {
    const content = rawContent.trim();
    if (!content || pending) {
      return;
    }

    setError(null);

    const userMessageId = crypto.randomUUID();
    const optimisticMessage: ChatMessage = {
      id: userMessageId,
      session_id: sessionId,
      sender: "user",
      content,
      created_at: new Date().toISOString(),
    };

    idsRef.current.add(userMessageId);
    setMessages((prev) => sortMessages([...prev, optimisticMessage]));

    try {
      setPending(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          characterId: character.id,
          message: content,
          userMessageId,
        }),
      });

      if (!response.ok || !response.body) {
        const text = await response.text();
        let message = "Failed to send message";
        if (text) {
          try {
            const parsed = JSON.parse(text);
            message = parsed.message ?? message;
          } catch {
            message = text;
          }
        }
        throw new Error(message);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantId: string | null = null;
      let assistantContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf("\n");
        while (boundary !== -1) {
          const line = buffer.slice(0, boundary).trim();
          buffer = buffer.slice(boundary + 1);

          if (line) {
            try {
              const payload = JSON.parse(line) as {
                type: string;
                token?: string;
                message?: string;
                messageId?: string;
              };

              if (payload.type === "token" && payload.token) {
                assistantId = payload.messageId ?? assistantId ?? crypto.randomUUID();
                assistantContent += payload.token;
                setStreaming({
                  id: assistantId,
                  content: assistantContent,
                });
              } else if (payload.type === "done" && payload.messageId) {
                if (assistantId) {
                  const finalMessage: ChatMessage = {
                    id: assistantId,
                    session_id: sessionId,
                    sender: "assistant",
                    content: assistantContent,
                    created_at: new Date().toISOString(),
                  };

                  if (!idsRef.current.has(assistantId)) {
                    idsRef.current.add(assistantId);
                    setMessages((prev) => sortMessages([...prev, finalMessage]));
                  }
                }
                setStreaming(null);
              } else if (payload.type === "error" && payload.message) {
                throw new Error(payload.message);
              }
            } catch (parseError) {
              console.error("Failed to parse stream chunk", parseError);
            }
          }

          boundary = buffer.indexOf("\n");
        }
      }
    } catch (err) {
      idsRef.current.delete(userMessageId);
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessageId));
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStreaming(null);
    } finally {
      setPending(false);
    }
  };

  const hasMessages = useMemo(() => messages.length > 0, [messages]);

  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <MessageList
        messages={messages}
        character={character}
        streamingMessage={streaming ?? undefined}
        isTyping={Boolean(streaming)}
      />
      <Box sx={{ position: "sticky", bottom: 0, mt: hasMessages ? "auto" : 0 }}>
        <MessageComposer onSend={handleSend} disabled={pending} loading={pending} />
      </Box>
    </Stack>
  );
}
