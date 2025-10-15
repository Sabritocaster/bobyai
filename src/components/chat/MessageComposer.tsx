"use client";

import { useState, type KeyboardEvent } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { motion } from "framer-motion";

interface MessageComposerProps {
  onSend: (content: string) => Promise<void> | void;
  disabled?: boolean;
  placeholder?: string;
  loading?: boolean;
}

const MotionPaper = motion(Paper);

export function MessageComposer({
  onSend,
  disabled = false,
  placeholder = "Send a message",
  loading = false,
}: MessageComposerProps) {
  const [value, setValue] = useState("");

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }

    setValue("");
    await onSend(trimmed);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  return (
    <MotionPaper
      elevation={0}
      layout
      sx={{
        borderRadius: 999,
        px: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <TextField
        placeholder={placeholder}
        multiline
        maxRows={4}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        variant="standard"
        disabled={disabled || loading}
        sx={{
          flexGrow: 1,
          "& .MuiInputBase-root": {
            fontSize: "1rem",
            fontWeight: 500,
          },
        }}
        InputProps={{
          disableUnderline: true,
        }}
      />
      <Box>
        <IconButton
          color="primary"
          size="large"
          disabled={disabled || loading || value.trim().length === 0}
          onClick={() => void handleSend()}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "inherit" }} />
          ) : (
            <SendRoundedIcon />
          )}
        </IconButton>
      </Box>
    </MotionPaper>
  );
}
