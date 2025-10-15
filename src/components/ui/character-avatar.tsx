"use client";

import { Avatar, Box } from "@mui/material";
import { motion } from "framer-motion";

interface CharacterAvatarProps {
  name: string;
  src?: string | null;
  accentColor?: string;
  size?: number;
}

const MotionAvatar = motion(Avatar);

export function CharacterAvatar({
  name,
  src,
  accentColor = "#7c3aed",
  size = 48,
}: CharacterAvatarProps) {
  const letter = name.trim().charAt(0).toUpperCase();

  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: "inline-flex",
        borderRadius: "50%",
        boxShadow: `0 8px 24px -12px ${accentColor}`,
      }}
    >
      <MotionAvatar
        alt={name}
        src={src ?? undefined}
        sx={{
          width: size,
          height: size,
          fontWeight: 700,
          bgcolor: `${accentColor}1A`,
          color: accentColor,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
      >
        {letter}
      </MotionAvatar>
    </Box>
  );
}
