"use client";

import { useTheme } from "@mui/material/styles";

const RATIO = 1024 / 312;

export function Mark({
  height = 44,
  tone = "auto",
}: {
  height?: number;
  /** auto follows the page theme. onDark is for surfaces that stay black, such as the phone. */
  tone?: "auto" | "onDark";
}) {
  const mode = useTheme().palette.mode;
  const onDark = tone === "onDark" || mode === "dark";
  const src = onDark ? "/brand/logo-dark.png" : "/brand/logo-light.png";
  const width = Math.round(height * RATIO);

  return (
    <img
      src={src}
      alt="Rapyd Ryd"
      width={width}
      height={height}
      style={{ display: "block", height, width: "auto", maxWidth: "100%" }}
    />
  );
}
