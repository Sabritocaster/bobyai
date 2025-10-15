import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Breadcrumbs,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { CHARACTERS } from "@/constants/characters";
import { ChatRoom } from "@/components/chat/ChatRoom";
import {
  ensureChatSession,
  fetchChatMessages,
  fetchChatSession,
  findLatestSessionForCharacter,
} from "@/lib/chat-service";
import { getAuthenticatedUser } from "@/lib/auth/server";
import type { CharacterId } from "@/types/chat";

interface ChatPageProps {
  params: Promise<{ characterId: CharacterId }> | { characterId: CharacterId };
  searchParams:
    | Promise<{ session?: string; new?: string }>
    | { session?: string; new?: string }
    | undefined;
}

export default async function CharacterChatPage(props: ChatPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    props.params instanceof Promise ? props.params : Promise.resolve(props.params),
    props.searchParams instanceof Promise
      ? props.searchParams
      : Promise.resolve(props.searchParams ?? {}),
  ]);

  const character = CHARACTERS.find(
    (item) => item.id === resolvedParams.characterId,
  );

  if (!character) {
    notFound();
  }

  const user = await getAuthenticatedUser().catch(() => null);

  if (!user) {
    redirect("/");
  }

  const userId = user.id;

  const query = resolvedSearchParams ?? {};

  let activeSessionId =
    typeof query.session === "string" ? query.session : undefined;

  if (activeSessionId) {
    const existing = await fetchChatSession(activeSessionId);
    if (!existing || existing.user_id !== userId) {
      activeSessionId = undefined;
    }
  }

  let activeSession = null;

  if (!activeSessionId) {
    if (query.new === "1") {
      activeSession = await ensureChatSession(
        userId,
        character.id,
        `Chat with ${character.name}`,
      );
    } else {
      activeSession =
        (await findLatestSessionForCharacter(userId, character.id)) ??
        (await ensureChatSession(
          userId,
          character.id,
          `Chat with ${character.name}`,
        ));
    }

    activeSessionId = activeSession?.id;
  } else {
    activeSession = await fetchChatSession(activeSessionId);
  }

  const messages = activeSessionId
    ? await fetchChatMessages(activeSessionId)
    : [];

  return (
    <Stack spacing={3} sx={{ flexGrow: 1 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/chat">Chats</Link>
        <Link href="/characters">Characters</Link>
        <Typography color="text.primary">{character.name}</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 30px 80px -60px rgba(15,23,42,0.45)",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 2,
        }}
      >
        <Stack spacing={0.5} pt={2} pl={2}>
          <Typography variant="h5" fontWeight={800}>
            {character.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {character.description}
          </Typography>
        </Stack>

        {activeSessionId && (
          <ChatRoom
            key={activeSessionId}
            sessionId={activeSessionId}
            character={character}
            initialMessages={messages}
          />
        )}
      </Box>
    </Stack>
  );
}
