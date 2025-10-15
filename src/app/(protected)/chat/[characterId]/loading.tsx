import { Box, Skeleton, Stack } from "@mui/material";

export default function ChatRoomLoading() {
  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      <Skeleton variant="text" width={220} height={34} />
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid var(--mui-palette-divider)",
        }}
      >
        <Stack spacing={2}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={`chat-bubble-skeleton-${index}`}
              variant="rounded"
              height={72}
              animation="wave"
            />
          ))}
          <Skeleton variant="rounded" height={64} animation="wave" />
        </Stack>
      </Box>
    </Stack>
  );
}
