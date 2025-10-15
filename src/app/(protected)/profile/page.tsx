import { redirect } from "next/navigation";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { CharacterAvatar } from "@/components/ui/character-avatar";
import { getServerSession } from "@/lib/auth/server";

export default async function ProfilePage() {
  const session = await getServerSession().catch(() => null);

  if (!session) {
    redirect("/");
  }

  const user = session.user;
  const displayName = user.user_metadata.full_name ?? user.email ?? "You";

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h4" fontWeight={800}>
        Profile
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <CharacterAvatar
            name={displayName}
            src={user.user_metadata.avatar_url}
            size={64}
          />
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={1.5} mt={4}>
          <Typography variant="subtitle1" fontWeight={700}>
            Session Metadata
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Signed in via Google using Supabase Auth. Your chats are securely
            stored and updated in realtime through Supabase Realtime channels.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
