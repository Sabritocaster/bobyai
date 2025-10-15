"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Paper, Typography } from "@mui/material";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { motion } from "framer-motion";

const navItems = [
  {
    href: "/chat",
    label: "Chats",
    Icon: ChatBubbleRoundedIcon,
  },
  {
    href: "/characters",
    label: "Characters",
    Icon: GroupsRoundedIcon,
  },
  {
    href: "/profile",
    label: "Profile",
    Icon: PersonRoundedIcon,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <Paper
      elevation={8}
      sx={{
        position: { xs: "fixed", md: "static" },
        bottom: { xs: 16, md: "auto" },
        left: "50%",
        transform: { xs: "translateX(-50%)", md: "none" },
        width: { xs: "calc(100% - 2rem)", md: "auto" },
        borderRadius: 999,
        px: 2,
        py: 1,
        bgcolor: "background.paper",
        display: "flex",
        justifyContent: "space-between",
        gap: 1,
        zIndex: 10,
      }}
    >
      {navItems.map(({ href, label, Icon }) => {
        const isActive =
          pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Box
            key={href}
            component={Link}
            href={href}
            sx={{
              flex: 1,
              textDecoration: "none",
              color: isActive ? "primary.contrastText" : "text.secondary",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                py: 0.75,
              }}
            >
              <Box sx={{ position: "relative" }}>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    style={{
                      position: "absolute",
                      inset: -12,
                      borderRadius: 999,
                      background: "var(--mui-palette-primary-main)",
                      opacity: 0.1,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon
                  fontSize="small"
                  color={isActive ? "primary" : "inherit"}
                />
              </Box>
              <Typography
                variant="caption"
                fontWeight={600}
                color={isActive ? "primary.main" : "text.secondary"}
              >
                {label}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Paper>
  );
}
