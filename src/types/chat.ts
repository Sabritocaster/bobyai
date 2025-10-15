export type CharacterId =
  | "astral-guide"
  | "quantum-prof"
  | "poetic-muse"
  | "battle-strategist"
  | "startup-coach";

export interface CharacterDefinition {
  id: CharacterId;
  name: string;
  avatar: string;
  description: string;
  tone: string;
  systemPrompt: string;
  accentColor: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  character_id: CharacterId;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  streaming?: boolean;
}
