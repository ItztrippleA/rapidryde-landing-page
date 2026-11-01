"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { Mark } from "@/components/brand/Mark";

export function SiteFooter() {
  return (
    <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", mt: 8 }}>
      <Box sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, py: 5, display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr 1fr" } }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <Mark height={40} />
          </Box>
          <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
            More than a ride. A better journey. A Nigeria-first mobility product for clear pickups, a fare you can see, and a driver who can read the economics.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h4">On this site</Typography>
          <FooterLink href="/#features">Features</FooterLink>
          <FooterLink href="/earn">Earn with Rapyd</FooterLink>
          <FooterLink href="/#drivers">Drivers</FooterLink>
          <FooterLink href="/#safety">Safety</FooterLink>
        </Box>
        <Box>
          <Typography variant="h4">Pilot</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Abuja and Lagos. This page is a concept-stage preview. It does not dispatch a driver, charge a card, or redeem a partner offer.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Typography component={NextLink} href={href} sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "text.primary" } }}>
      {children}
    </Typography>
  );
}
