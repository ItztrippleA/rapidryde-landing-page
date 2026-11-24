"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Reveal, SectionHeadline, SectionKicker } from "./motion";

const systems = [
  {
    id: "localiq",
    index: "01",
    kicker: "Pickup",
    title: "LocalIQ",
    body: "A landmark and a note beat a pin dropped on a roof. Gates, markets, campuses, and hospitals are curated, and a bad instruction can be reported.",
    detail: "Wuse Market gate",
    note: "Use the market side, not the loading bay.",
  },
  {
    id: "promise",
    index: "02",
    kicker: "Case",
    title: "Rapyd Ryd Promise",
    body: "A trip PIN, a share link, and CaseTrack. Every report gets a reference, a status, and a person when the decision matters.",
    detail: "RR-2041",
    note: "Acknowledged. Next update in the hour.",
  },
  {
    id: "care",
    index: "03",
    kicker: "Fare",
    title: "DriverCare",
    body: "True Earnings shows the fare, the commission, and the take-home before fuel. Partner savings stay optional. Nothing is promised that is not funded.",
    detail: "Gross ₦6,000 · commission 15%",
    note: "An estimate, not a guarantee.",
  },
];

export function Signature() {
  return (
    <Box
      component="section"
      sx={{
        maxWidth: 1180,
        mx: "auto",
        px: { xs: 2, md: 3 },
        pt: { xs: 12, md: 16 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Reveal>
        <SectionKicker>What is not a copy</SectionKicker>
        <SectionHeadline
          type
          lines={["Clear pickups, a visible case,", "and a fair view of the fare."]}
        />
        <Typography color="text.secondary" sx={{ mt: 1.8, maxWidth: 560 }}>
          The pickup note, the case reference, and the cut are on the screen before anyone moves.
        </Typography>
      </Reveal>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: { xs: 5, md: 4 },
          mt: { xs: 6, md: 7 },
        }}
      >
        {systems.map((system, index) => (
          <Reveal key={system.id} delay={index * 0.06} y={18}>
            <Box
              id={system.id === "localiq" ? "localiq" : undefined}
              sx={{ scrollMarginTop: 96, minWidth: 0 }}
            >
              <Typography sx={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "text.secondary" }}>
                {system.index} · {system.kicker}
              </Typography>
              <Typography variant="h3" sx={{ mt: 1.4 }}>
                {system.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1.2, lineHeight: 1.55 }}>
                {system.body}
              </Typography>
              <Typography sx={{ mt: 2.2, fontWeight: 700 }}>{system.detail}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                {system.note}
              </Typography>
            </Box>
          </Reveal>
        ))}
      </Box>
    </Box>
  );
}
