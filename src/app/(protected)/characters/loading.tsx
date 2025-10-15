import { Box, Skeleton, Stack } from "@mui/material";

export default function CharactersLoading() {
  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Skeleton variant="text" width={200} height={36} />
        <Box
          sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Box key={`character-skeleton-${index}`}>
              <Skeleton variant="rounded" height={200} animation="wave" />
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}
