"use client";

import Button, { type ButtonProps } from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { brand } from "@/theme/tokens";

export function scrollToBook() {
  const node = document.getElementById("book");
  node?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function useBookScroll() {
  const pathname = usePathname();
  const router = useRouter();
  return () => {
    if (pathname === "/") scrollToBook();
    else router.push("/#book");
  };
}

export function BookRideButton({ size = "medium", type = "button", onClick, fullWidth = false }: { size?: ButtonProps["size"]; type?: "button" | "submit"; onClick?: () => void; fullWidth?: boolean }) {
  const go = useBookScroll();
  const dark = useTheme().palette.mode === "dark";
  return (
    <Button
      type={type}
      size={size}
      fullWidth={fullWidth}
      onClick={type === "submit" ? onClick : (onClick ?? go)}
      sx={{
        bgcolor: dark ? brand.gold : brand.orange,
        color: dark ? brand.black : brand.orangeInk,
        px: 2.4,
        py: size === "large" ? 1.2 : 0.9,
        fontSize: size === "large" ? "1rem" : "0.95rem",
        "&:hover": { bgcolor: dark ? brand.goldDeep : brand.orangeHover },
      }}
    >
      Book Ride Now
    </Button>
  );
}

export function EarnWithRapidButton({ fullWidth = false, appearance = "line" }: { fullWidth?: boolean; appearance?: "line" | "inverse" }) {
  const inverse = appearance === "inverse";
  const dark = useTheme().palette.mode === "dark";
  return (
    <Button
      component={NextLink}
      href="/earn"
      fullWidth={fullWidth}
      sx={{
        bgcolor: inverse ? "transparent" : dark ? "transparent" : brand.lemon,
        color: inverse ? "#F3F4EE" : dark ? brand.gold : brand.black,
        border: "1px solid",
        borderColor: inverse ? "rgba(243,244,238,0.55)" : dark ? brand.gold : brand.lemonDeep,
        px: 2.2,
        py: 0.9,
        "&:hover": {
          bgcolor: inverse ? "rgba(243,244,238,0.12)" : dark ? "rgba(226,182,87,0.12)" : "#C6DE4A",
          borderColor: inverse ? "#F3F4EE" : dark ? brand.gold : brand.lemonDeep,
        },
      }}
    >
      Earn with Rapyd
    </Button>
  );
}

export function NeutralButton({ children, onClick, type = "button", fullWidth = false }: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; fullWidth?: boolean }) {
  return (
    <Button
      type={type}
      fullWidth={fullWidth}
      onClick={onClick}
      sx={{
        bgcolor: "text.primary",
        color: "background.default",
        px: 2.4,
        py: 1.15,
        "&:hover": { bgcolor: "text.primary", opacity: 0.9 },
      }}
    >
      {children}
    </Button>
  );
}

export function SosButton({ onClick }: { onClick: () => void }) {
  const dark = useTheme().palette.mode === "dark";
  return (
    <Button
      onClick={onClick}
      aria-label="Emergency SOS"
      sx={{
        bgcolor: dark ? brand.gold : brand.orange,
        color: dark ? brand.black : brand.orangeInk,
        px: 2,
        "&:hover": { bgcolor: dark ? brand.goldDeep : brand.orangeHover },
      }}
    >
      SOS
    </Button>
  );
}
