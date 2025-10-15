import { z } from "zod";

const baseSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: "NEXT_PUBLIC_SUPABASE_URL must be a valid URL",
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
});

type EnvShape = z.infer<typeof baseSchema>;

let cachedEnv: EnvShape | null = null;

export function getEnv(): EnvShape {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = baseSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  });

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment configuration:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Environment variables are misconfigured.");
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getClientEnv() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getEnv();
  return { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY };
}
