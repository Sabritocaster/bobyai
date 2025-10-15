import { Box, Stack, Typography } from "@mui/material";
import { CHARACTERS } from "@/constants/characters";
import {
  fetchChatSessions,
  fetchLatestMessagesBySession,
} from "@/lib/chat-service";
import { getServerSession } from "@/lib/auth/server";
import { ChatSessionsHydrator } from "@/components/chat/ChatSessionsHydrator";
import type { ChatSession } from "@/types/chat";

const charactersMap = Object.fromEntries(
  CHARACTERS.map((character) => [character.id, character]),
);

export default async function ChatHistoryPage() {
  const session = await getServerSession().catch(() => null);
  const userId = session?.user.id;

  let chatSessions: ChatSession[] = [];
  let latestMessages: Record<string, string> = {};

  if (userId) {
    try {
      chatSessions = await fetchChatSessions(userId);
      latestMessages = await fetchLatestMessagesBySession(
        chatSessions.map((item) => item.id),
      );
    } catch (error) {
      console.error("Failed to load chat sessions", error);
    }
  }

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={800}>
          Conversations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pick up where you left off or revisit past chats with your favorite
          personas.
        </Typography>
      </Stack>

      {userId && (
        <ChatSessionsHydrator
          initialSessions={chatSessions}
          characters={charactersMap}
          initialLastMessages={latestMessages}
          userId={userId}
        />
      )}
    </Box>
  );
}
