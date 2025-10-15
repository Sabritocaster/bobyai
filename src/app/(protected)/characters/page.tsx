import { Box, Grid, Stack, Typography } from "@mui/material";
import { CharacterCard } from "@/components/characters/CharacterCard";
import { CHARACTERS } from "@/constants/characters";

export default function CharactersPage() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={800}>
          Choose your guide
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pick a character to match your vibe. Each persona carries a tailored
          prompt and conversation style.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {CHARACTERS.map((character) => (
          <Grid item xs={12} sm={6} key={character.id}>
            <CharacterCard character={character} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
