import { v4 as uuid } from "uuid";
import { getSupabaseServerClient } from "./supabase/server";
import type { CharacterId, ChatMessage, ChatSession } from "@/types/chat";

const SESSIONS_TABLE = "chat_sessions" as const;
const MESSAGES_TABLE = "chat_messages" as const;

type NewChatSession = Pick<ChatSession, "user_id" | "character_id" | "title"> & {
  id: string;
};

type NewChatMessage = {
  id?: string;
  session_id: string;
  sender: ChatMessage["sender"];
  content: string;
  created_at?: string;
};

export async function ensureChatSession(
  userId: string,
  characterId: CharacterId,
  title: string,
): Promise<ChatSession> {
  const supabase = await getSupabaseServerClient();

  const payload: NewChatSession = {
    id: uuid(),
    user_id: userId,
    character_id: characterId,
    title,
  };

  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchChatSessions(userId: string): Promise<ChatSession[]> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchChatSession(
  sessionId: string,
): Promise<ChatSession | null> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
}

export async function findLatestSessionForCharacter(
  userId: string,
  characterId: CharacterId,
): Promise<ChatSession | null> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .eq("character_id", characterId)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  return data?.[0] ?? null;
}

export async function fetchChatMessages(
  sessionId: string,
): Promise<ChatMessage[]> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchLatestMessagesBySession(
  sessionIds: string[],
): Promise<Record<string, string>> {
  if (sessionIds.length === 0) {
    return {};
  }

  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .select("session_id, content, created_at")
    .in("session_id", sessionIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const latest: Record<string, string> = {};

  for (const entry of data ?? []) {
    if (!latest[entry.session_id]) {
      latest[entry.session_id] = entry.content;
    }
  }

  return latest;
}

export async function appendMessage(
  message: NewChatMessage,
): Promise<ChatMessage> {
  const supabase = await getSupabaseServerClient();

  const payload: ChatMessage = {
    ...message,
    id: message.id ?? uuid(),
    created_at: message.created_at ?? new Date().toISOString(),
  };

  const { error } = await supabase
    .from(MESSAGES_TABLE)
    .insert(payload);

  if (error) {
    throw error;
  }

  return payload;
}

export async function touchChatSession(sessionId: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from(SESSIONS_TABLE)
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (error) {
    throw error;
  }
}
