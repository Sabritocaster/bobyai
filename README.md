# BobyAI — Character Chat Experience

Character-forward chat experience inspired by Character.AI. The project highlights mobile-first UI, rich interactions, and modern web tooling with real-time updates powered by Supabase and Groq LLM streaming.

## ✨ Features
- **Supabase Auth** with Google sign-in, session persistence, and protected routes
- **Persona system** exposing 5 curated AI characters with unique prompts, tones, and brand visuals
- **Realtime chat** updates via Supabase channels plus streaming Groq responses with live token rendering
- **Responsive, animated UI** combining Tailwind, Material UI, and Framer Motion for micro-interactions and page transitions
- **Chat history workspace** featuring search, filtering, empty states, and realtime updates when new replies land
- **Deployment-ready** for Vercel with SSR-friendly Supabase helpers and environment validation

## 🛠️ Tech Stack
- [Next.js 15 App Router](https://nextjs.org/) + React 18
- [Supabase](https://supabase.com/) (Auth, Postgres, Realtime)
- [Groq SDK](https://console.groq.com/docs/overview) for Llama/Gemma responses
- [Tailwind CSS](https://tailwindcss.com/) + [Material UI](https://mui.com/) hybrid design system
- [Framer Motion](https://www.framer.com/motion/) for transitions and streaming effects
- TypeScript, Zod env validation, UUID utilities

## 📁 Project Structure
```
src/
  app/
    (public)/page.tsx          # Landing & login experience
    (protected)/layout.tsx     # Auth gate + app shell
    (protected)/chat/...       # Chat list + detail routes
    (protected)/characters/... # Persona explorer
    (protected)/profile/...    # Account overview
    api/chat/route.ts          # Groq streaming endpoint
  components/                  # UI primitives, chat widgets
  constants/characters.ts      # Persona definitions
  lib/                         # Supabase, auth, chat services
  providers/                   # Global theme + Supabase context
  types/                       # Shared TypeScript contracts
```

## ⚙️ Environment Variables
Create a `.env.local` (or configure in Vercel) using the sample below:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://<your-project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<supabase-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<optional-service-role-key>"
GROQ_API_KEY="<groq-api-key>"
```

- The Groq key must have access to `llama-3.1-8b-instant` (or adjust the model in `app/api/chat/route.ts`).

## 🗄️ Database Schema (Supabase)
Run the SQL below in the Supabase SQL editor to create required tables:

```sql
create extension if not exists "uuid-ossp";

create table if not exists chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  character_id text not null,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  sender text not null check (sender in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_sessions_user_idx
  on chat_sessions(user_id, updated_at desc);

create index if not exists chat_messages_session_idx
  on chat_messages(session_id, created_at);

alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

create policy "Users manage their sessions"
  on chat_sessions
  for all using (auth.uid() = user_id);

create policy "Users manage their messages"
  on chat_messages
  for all using (
    exists (
      select 1 from chat_sessions cs
      where cs.id = chat_messages.session_id
        and cs.user_id = auth.uid()
    )
  );
```

Enable **Google OAuth** inside Supabase Auth settings and supply the client credentials there. Update the callback URL to `https://<your-domain>.supabase.co/auth/v1/callback` (Supabase handles the redirect).

## 🚀 Local Development
```bash
# install dependencies
npm install

# run lint (optional but recommended)
npm run lint

# start dev server
npm run dev
```

Visit `http://localhost:3000` and sign in with Google. Supabase sessions persist via the SSR helpers in `src/lib/supabase`.

### Test the Groq endpoint locally
1. Ensure `GROQ_API_KEY` is present.
2. Start the dev server and open a chat.
3. Messages stream token-by-token while Supabase realtime keeps other tabs/devices in sync.

If the Groq key is missing, the UI surfaces a friendly error.

## ☁️ Deploying to Vercel
1. Push this repo to GitHub (public as requested).
2. Create a new Vercel project and import the repository.
3. Add the environment variables from `.env.example` in the Vercel dashboard (Production + Preview + Development).
4. Set `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project, along with `GROQ_API_KEY`.
5. Vercel will build with `npm install && npm run build`. No extra build commands are required.
