"use client";

import { createTheme, type PaletteMode } from "@mui/material/styles";
import { brand, dark, light } from "./tokens";

export function buildTheme(mode: PaletteMode) {
  const surface = mode === "light" ? light : dark;

  const heading = {
    fontFamily: "var(--font-sora), Sora, sans-serif",
    letterSpacing: "-0.04em",
    fontWeight: 600,
  };

  return createTheme({
    palette: {
      mode,
      primary: {
        main: surface.ink,
        contrastText: surface.bg,
      },
      secondary: {
        main: surface.muted,
        contrastText: surface.bg,
      },
      background: {
        default: surface.bg,
        paper: surface.paper,
      },
      text: {
        primary: surface.ink,
        secondary: surface.muted,
      },
      divider: surface.line,
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: "var(--font-outfit), Outfit, sans-serif",
      h1: { ...heading, fontSize: "clamp(2.6rem, 6vw, 4.6rem)", lineHeight: 0.98 },
      h2: { ...heading, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.08 },
      h3: { ...heading, fontSize: "1.35rem", lineHeight: 1.2 },
      h4: { ...heading, fontSize: "1.05rem", lineHeight: 1.3, letterSpacing: "-0.02em" },
      button: { fontWeight: 600, letterSpacing: 0 },
      body1: { fontSize: "1.02rem", lineHeight: 1.6 },
      body2: { fontSize: "0.94rem", lineHeight: 1.55 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: surface.bg,
            color: surface.ink,
          },
          "::selection": {
            backgroundColor: mode === "dark" ? brand.gold : brand.lemon,
            color: brand.black,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 650,
            borderRadius: 999,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 999,
            color: surface.ink,
            "&.Mui-selected": {
              backgroundColor: surface.soft,
              color: surface.ink,
            },
          },
        },
      },
    },
  });
}
