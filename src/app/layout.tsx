import type { Metadata } from "next";
import { Outfit, Sora } from "next/font/google";
import Box from "@mui/material/Box";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RapidRyde — More than a ride. A better journey.",
    template: "%s · RapidRyde",
  },
  description:
    "Nigeria-first mobility. Landmark pickups, upfront fares or your price, trip PIN, CaseTrack, and a clear view of driver earnings.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeRegistry>
          <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default", color: "text.primary" }}>
            <SiteHeader />
            <Box component="main" sx={{ flex: 1 }}>
              {children}
            </Box>
            <SiteFooter />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
