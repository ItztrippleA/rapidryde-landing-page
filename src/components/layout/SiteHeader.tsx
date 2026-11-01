"use client";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Mark } from "@/components/brand/Mark";
import { BookRideButton, EarnWithRapidButton } from "@/components/ui/Actions";
import { useUiStore } from "@/store/useUiStore";

const links = [
  { href: "/#product", label: "Product" },
  { href: "/#features", label: "Features" },
  { href: "/#drivers", label: "Drivers" },
  { href: "/#safety", label: "Safety" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const mode = useTheme().palette.mode;
  const toggleMode = useUiStore((state) => state.toggleMode);
  const navOpen = useUiStore((state) => state.navOpen);
  const setNavOpen = useUiStore((state) => state.setNavOpen);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname, setNavOpen]);

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        backdropFilter: "blur(16px)",
        bgcolor: "color-mix(in srgb, var(--mui-palette-background-default) 88%, transparent)",
        backgroundColor: (theme) => `${theme.palette.background.default}ee`,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, height: 72, display: "flex", alignItems: "center", gap: 2 }}>
        <Box component={NextLink} href="/" aria-label="Rapyd Ryd" sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit", minWidth: 0 }}>
          <Mark height={46} />
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, ml: 2, flex: 1, minWidth: 0, overflowX: "auto" }}>
          {links.map((link) => (
              <Typography
                key={link.href}
                component={NextLink}
                href={link.href}
                sx={{
                  textDecoration: "none",
                  px: 1.3,
                  py: 0.7,
                  borderRadius: 999,
                  fontWeight: 550,
                  fontSize: "0.94rem",
                  color: "text.primary",
                }}
              >
                {link.label}
              </Typography>
          ))}
        </Box>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton aria-label={mode === "dark" ? "Switch to light" : "Switch to dark"} onClick={toggleMode}>
            {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
            <EarnWithRapidButton />
            <BookRideButton size="medium" />
          </Box>
          <IconButton sx={{ display: { md: "none" } }} aria-label="Open menu" onClick={() => setNavOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>
      <Drawer anchor="right" open={navOpen} onClose={() => setNavOpen(false)}>
        <Box sx={{ width: 280, p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <IconButton aria-label="Close menu" onClick={() => setNavOpen(false)} sx={{ alignSelf: "flex-end" }}>
            <CloseIcon />
          </IconButton>
          {links.map((link) => (
            <Typography key={link.href} component={NextLink} href={link.href} onClick={() => setNavOpen(false)} sx={{ textDecoration: "none", color: "text.primary", fontWeight: 650, fontSize: "1.2rem", py: 1 }}>
              {link.label}
            </Typography>
          ))}
          <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
            <EarnWithRapidButton fullWidth />
            <BookRideButton />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
