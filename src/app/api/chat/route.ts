import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { CHARACTERS } from "@/constants/characters";
import { getEnv } from "@/lib/env";
import {
  appendMessage,
  fetchChatMessages,
  fetchChatSession,
  touchChatSession,
} from "@/lib/chat-service";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const encoder = new TextEncoder();

export async function POST(request: NextRequest) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const message: string | undefined = body?.message;
  const sessionId: string | undefined = body?.sessionId;
  const characterId: string | undefined = body?.characterId;
  const userMessageId: string | undefined = body?.userMessageId;

  if (!message || !sessionId || !characterId || !userMessageId) {
    return new Response(
      JSON.stringify({ message: "Invalid payload" }),
      { status: 400 },
    );
  }

  const character = CHARACTERS.find((item) => item.id === characterId);

  if (!character) {
    return new Response(JSON.stringify({ message: "Character not found" }), {
      status: 404,
    });
  }

  const chatSession = await fetchChatSession(sessionId);

  if (!chatSession || chatSession.user_id !== session.user.id) {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
    });
  }

  const env = getEnv();

  if (!env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ message: "GROQ_API_KEY is not configured." }),
      { status: 500 },
    );
  }

  const groq = new Groq({ apiKey: env.GROQ_API_KEY });
  const assistantMessageId = crypto.randomUUID();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await appendMessage({
          session_id: sessionId,
          sender: "user",
          content: message,
          created_at: new Date().toISOString(),
          id: userMessageId,
        });

        const history = await fetchChatMessages(sessionId);
        const recent = history.slice(-12);

        const messages: ChatCompletionMessageParam[] = [
          {
            role: "system",
            content: character.systemPrompt,
          },
          ...recent.map((entry) => {
            const role: ChatCompletionMessageParam["role"] =
              entry.sender === "assistant"
                ? "assistant"
                : entry.sender === "system"
                  ? "system"
                  : "user";
            return {
              role,
              content: entry.content,
            } satisfies ChatCompletionMessageParam;
          }),
        ];

        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          stream: true,
          temperature: 0.7,
          max_tokens: 800,
          messages,
        });

        let assistantContent = "";

        for await (const chunk of completion) {
          const delta = chunk.choices?.[0]?.delta?.content ?? "";
          if (!delta) continue;
          assistantContent += delta;
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "token",
                token: delta,
                messageId: assistantMessageId,
              }) + "\n",
            ),
          );
        }

        await appendMessage({
          id: assistantMessageId,
          session_id: sessionId,
          sender: "assistant",
          content: assistantContent,
        });

        await touchChatSession(sessionId);

        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "done",
              messageId: assistantMessageId,
            }) + "\n",
          ),
        );
        controller.close();
      } catch (error) {
        console.error("Groq chat error", error);
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "error",
              message: "Failed to generate assistant response.",
            }) + "\n",
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
