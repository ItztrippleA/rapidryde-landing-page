"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useBookingStore } from "@/store/useBookingStore";
import { brand } from "@/theme/tokens";
import { SosButton, EarnWithRapidButton } from "@/components/ui/Actions";
import { Reveal, SectionHeadline, SectionKicker } from "./motion";

const steps = [
  { title: "Name the landmark", body: "Pick a gate, market, or campus. The note travels with the request." },
  { title: "See the money", body: "Upfront fare, or your price above the floor. Surge is marked on the estimate, not added later." },
  { title: "Match", body: "A verified driver accepts, or you choose among offers." },
  { title: "Start with a PIN", body: "The code confirms both of you. Share the trip if you want someone to watch it." },
  { title: "Close it cleanly", body: "Receipt, rating, and a case reference if anything needs a person." },
];

const targets = [
  ["Completed rides", "85% of accepted trips"],
  ["Pickup window", "80% inside the agreed time"],
  ["Repeat riders", "30% book again in 30 days"],
  ["Case acknowledgement", "5 minutes when staffed"],
];

const driverNotes = [
  ["Accept or counter", "The offer is visible before anyone moves."],
  ["Destination filter", "Skipping a direction does not punish the driver."],
  ["Documents", "Papers stay with operations, not on the trip screen."],
];

const statement = [
  ["Gross fare", "The full trip, shown before accept."],
  ["Commission", "The platform cut, on the same screen."],
  ["Bonus", "Only when a bonus is actually funded."],
  ["Take-home before fuel", "What remains. Labelled as an estimate."],
];

const safeguards = [
  ["NIN check", "Riders and drivers both clear a National Identification Number check. Each side sees verified, never the number."],
  ["Trip PIN", "Confirms the car before the trip starts. One code, then it dies."],
  ["Share", "One trusted contact sees status. Access ends with the trip."],
  ["CaseTrack", "A reference, a status, a next step, and an appeal if a decision lands hard."],
];

export function LowerBands() {
  return (
    <>
      <Box component="section" sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 12, md: 16 } }}>
        <Reveal>
          <SectionKicker>Trip flow</SectionKicker>
          <SectionHeadline type lines={["How a trip runs"]} />
        </Reveal>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(5, 1fr)" },
            gap: { xs: 3.5, md: 2.5 },
            mt: { xs: 5, md: 4 },
          }}
        >
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.04} y={16}>
              <Typography sx={{ fontFamily: "ui-monospace, monospace", color: "text.secondary" }}>
                0{index + 1}
              </Typography>
              <Typography sx={{ fontWeight: 700, mt: 1.1 }}>{step.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8, lineHeight: 1.5 }}>
                {step.body}
              </Typography>
            </Reveal>
          ))}
        </Box>
      </Box>
      <DriverBand />
      <SafetyBand />
      <PilotBand />
    </>
  );
}

function DriverBand() {
  return (
    <Box
      id="drivers"
      component="section"
      sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 12, md: 16 }, scrollMarginTop: 80 }}
    >
      <Reveal>
        <SectionKicker>Drivers</SectionKicker>
        <SectionHeadline type lines={["The person behind the wheel", "can see the cut."]} maxWidth={640} />
        <Typography color="text.secondary" sx={{ mt: 1.8, maxWidth: 540, lineHeight: 1.55 }}>
          A NIN check comes first. Then accept, decline, or counter. A partner fuel stop is optional, and skipping it does not touch dispatch or rating.
        </Typography>
        <Box sx={{ mt: 2.5 }}>
          <EarnWithRapidButton />
        </Box>
      </Reveal>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 5, md: 6 },
          mt: { xs: 5, md: 6 },
        }}
      >
        <Box sx={{ display: "grid", gap: 2.2 }}>
          {driverNotes.map(([title, body], index) => (
            <Reveal key={title} delay={index * 0.04} y={12}>
              <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                {body}
              </Typography>
            </Reveal>
          ))}
        </Box>
        <Reveal delay={0.08} y={16}>
          <Typography
            sx={{
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "text.secondary",
            }}
          >
            On the driver’s screen
          </Typography>
          <Box sx={{ display: "grid", gap: 2, mt: 2.2 }}>
            {statement.map(([title, body]) => (
              <Box key={title}>
                <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>
                  {body}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
            Fuel, tyres, and repairs stay with the driver unless a funded partner offer says otherwise.
          </Typography>
        </Reveal>
      </Box>
    </Box>
  );
}

function SafetyBand() {
  const dark = useTheme().palette.mode === "dark";
  const cases = useBookingStore((state) => state.cases);
  const openCase = useBookingStore((state) => state.openCase);

  return (
    <Box
      id="safety"
      component="section"
      sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 12, md: 16 }, scrollMarginTop: 80 }}
    >
      <Reveal>
        <SectionKicker>Safety</SectionKicker>
        <SectionHeadline type lines={["A concern has a process."]} />
        <Typography color="text.secondary" sx={{ mt: 1.8, maxWidth: 540, lineHeight: 1.55 }}>
          Riders and drivers both pass a NIN check before a trip can start. The code confirms the car. A share link ends with the trip. A report stays open until someone decides.
        </Typography>
      </Reveal>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 5, md: 6 },
          mt: { xs: 5, md: 6 },
        }}
      >
        <Box sx={{ display: "grid", gap: 2.2 }}>
          {safeguards.map(([title, body], index) => (
            <Reveal key={title} delay={index * 0.04} y={12}>
              <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4, lineHeight: 1.5 }}>
                {body}
              </Typography>
            </Reveal>
          ))}
        </Box>
        <Reveal delay={0.08} y={16}>
          <Typography
            sx={{
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "text.secondary",
            }}
          >
            Open a preview case
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Nothing leaves this browser. SOS is the orange control.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
            <Button
              type="button"
              onClick={() => openCase("Safety report")}
              sx={{ border: "1px solid", borderColor: "divider", color: "text.primary" }}
            >
              Report
            </Button>
            <Button
              type="button"
              onClick={() => openCase("Lost item")}
              sx={{ border: "1px solid", borderColor: "divider", color: "text.primary" }}
            >
              Lost item
            </Button>
            <SosButton onClick={() => openCase("SOS")} />
          </Box>
          <Box sx={{ mt: 2.2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
            {cases.length === 0 && <Typography color="text.secondary">No cases yet.</Typography>}
            {cases.map((item) => (
              <Box key={item.id} sx={{ py: 0.8 }}>
                <Typography sx={{ fontFamily: "ui-monospace, monospace", fontWeight: 700 }}>{item.id}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.kind} · {item.status}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: dark ? brand.gold : brand.lemon,
                flex: "0 0 auto",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Human review stays on for serious incidents.
            </Typography>
          </Box>
        </Reveal>
      </Box>
    </Box>
  );
}

function PilotBand() {
  return (
    <Box
      component="section"
      sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 12, md: 16 }, pb: { xs: 2, md: 4 } }}
    >
      <Reveal>
        <SectionKicker>Pilot</SectionKicker>
        <SectionHeadline type lines={["Pilot targets, not trophies"]} />
        <Typography color="text.secondary" sx={{ mt: 1.6, maxWidth: 560 }}>
          Abuja and Lagos are the planning cities. These are gates in the requirements, still to be measured.
        </Typography>
      </Reveal>
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 3, md: 4 },
        }}
      >
        {targets.map(([title, body], index) => (
          <Reveal key={title} delay={index * 0.04} y={12}>
            <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.7 }}>
              {body}
            </Typography>
          </Reveal>
        ))}
      </Box>
    </Box>
  );
}
