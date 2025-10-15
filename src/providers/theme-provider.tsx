"use client";

import { PropsWithChildren, useMemo } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    accent?: Palette["primary"];
  }
  interface PaletteOptions {
    accent?: PaletteOptions["primary"];
  }
}

const baseTheme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#7c3aed",
        },
        accent: {
          main: "#22d3ee",
        },
        background: {
          default: "#f8fafc",
          paper: "#ffffff",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#c084fc",
        },
        accent: {
          main: "#22d3ee",
        },
        background: {
          default: "#0f172a",
          paper: "#020617",
        },
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
        contained: {
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
  },
});

export function ThemeRegistry({ children }: PropsWithChildren) {
  const theme = useMemo(() => responsiveFontSizes(baseTheme), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
