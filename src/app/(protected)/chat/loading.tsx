import { Box, Skeleton, Stack } from "@mui/material";

export default function ChatListLoading() {
  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2.5}>
        <Skeleton variant="text" width={160} height={36} />
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={`session-skeleton-${index}`}
              variant="rounded"
              height={96}
              animation="wave"
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
