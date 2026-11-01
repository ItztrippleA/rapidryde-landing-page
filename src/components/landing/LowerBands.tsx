"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useBookingStore } from "@/store/useBookingStore";
import { brand } from "@/theme/tokens";
import { SosButton, EarnWithRapidButton } from "@/components/ui/Actions";

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

export function LowerBands() {
  return (
    <>
      <Box component="section" sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 14, md: 16 } }}>
        <Typography variant="h2">How a trip runs</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(5, 1fr)" }, gap: { xs: 3, md: 1.5 }, mt: { xs: 4, md: 3 } }}>
          {steps.map((step, index) => (
            <Box key={step.title} sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontFamily: "ui-monospace, monospace", color: "text.secondary" }}>0{index + 1}</Typography>
              <Typography sx={{ fontWeight: 700, mt: 1 }}>{step.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>{step.body}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <DriverBand />
      <SafetyBand />
      <PilotBand />
    </>
  );
}

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

function DriverBand() {
  const reduce = useReducedMotion();
  return (
    <Box id="drivers" component="section" sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 14, md: 16 }, scrollMarginTop: 80 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.86fr) minmax(0, 1.14fr)" }, gap: { xs: 3, md: 5 }, alignItems: "center" }}>
        <Box
          component={motion.div}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          sx={{ position: "relative", height: { xs: 420, md: 620 }, borderRadius: "22px", overflow: "hidden", bgcolor: "#171814" }}
        >
          <Image src="/showcase/driver-portrait.jpg" alt="A woman in the driver seat of a car" fill sizes="(min-width: 900px) 480px, 100vw" style={{ objectFit: "cover", objectPosition: "center 20%" }} />
          <Box sx={{ position: "absolute", left: 16, right: 16, bottom: 16, p: 1.6, borderRadius: "14px", bgcolor: "rgba(23,24,20,0.72)", color: "#F3F4EE", backdropFilter: "blur(10px)" }}>
            <Typography sx={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>Behind the wheel</Typography>
            <Typography sx={{ mt: 0.4 }}>The cut is on the screen before the trip starts.</Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "text.secondary" }}>Drivers</Typography>
          <Typography variant="h2" sx={{ mt: 1.2, maxWidth: 520 }}>The person behind the wheel can see the cut.</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.6, maxWidth: 520 }}>
            A NIN check comes first. Then accept, decline, or counter. A partner fuel stop is optional, and skipping it does not touch dispatch or rating.
          </Typography>
          <Box sx={{ mt: 2.5 }}>
            <EarnWithRapidButton />
          </Box>
          <Box sx={{ display: "grid", gap: 1.6, mt: 3 }}>
            {driverNotes.map(([title, body]) => (
              <Box key={title}>
                <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
                <Typography variant="body2" color="text.secondary">{body}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 3.5, p: { xs: 2.2, md: 2.8 }, borderRadius: "20px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
            <Typography sx={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: "text.secondary" }}>On the driver’s screen</Typography>
            <Box sx={{ display: "grid", gap: 1.8, mt: 2.2 }}>
              {statement.map(([title, body]) => (
                <Box key={title}>
                  <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
                  <Typography variant="body2" color="text.secondary">{body}</Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2.4, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              Fuel, tyres, and repairs stay with the driver unless a funded partner offer says otherwise.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const safeguards = [
  ["NIN check", "Riders and drivers both clear a National Identification Number check. Each side sees verified, never the number."],
  ["Trip PIN", "Confirms the car before the trip starts. One code, then it dies."],
  ["Share", "One trusted contact sees status. Access ends with the trip."],
  ["CaseTrack", "A reference, a status, a next step, and an appeal if a decision lands hard."],
];

function SafetyBand() {
  const reduce = useReducedMotion();
  const dark = useTheme().palette.mode === "dark";
  const cases = useBookingStore((state) => state.cases);
  const openCase = useBookingStore((state) => state.openCase);
  return (
    <Box id="safety" component="section" sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 14, md: 16 }, scrollMarginTop: 80 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.86fr) minmax(0, 1.14fr)" }, gap: { xs: 3, md: 5 }, alignItems: "center" }}>
        <Box
          component={motion.div}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          sx={{ position: "relative", height: { xs: 380, md: 560 }, borderRadius: "22px", overflow: "hidden", bgcolor: "#171814" }}
        >
          <Image src="/showcase/safety-night.jpg" alt="A passenger in a car at night with a softly lit phone" fill sizes="(min-width: 900px) 480px, 100vw" style={{ objectFit: "cover", objectPosition: "center" }} />
          <Box sx={{ position: "absolute", left: 16, right: 16, bottom: 16, p: 1.6, borderRadius: "14px", bgcolor: "rgba(23,24,20,0.72)", color: "#F3F4EE", backdropFilter: "blur(10px)" }}>
            <Typography sx={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>After the trip</Typography>
            <Typography sx={{ mt: 0.4 }}>A concern gets a reference, not a dead end.</Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "text.secondary" }}>Safety</Typography>
          <Typography variant="h2" sx={{ mt: 1.2, maxWidth: 520 }}>A concern has a process.</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.6, maxWidth: 520 }}>
            Riders and drivers both pass a NIN check before a trip can start. The code confirms the car. A share link ends with the trip. A report stays open until someone decides.
          </Typography>
          <Box sx={{ display: "grid", gap: 1.6, mt: 3 }}>
            {safeguards.map(([title, body]) => (
              <Box key={title}>
                <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
                <Typography variant="body2" color="text.secondary">{body}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 3.5, p: { xs: 2.2, md: 2.8 }, borderRadius: "20px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
            <Typography sx={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: "text.secondary" }}>Open a preview case</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Nothing leaves this browser. SOS is the orange control.</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
              <Button type="button" onClick={() => openCase("Safety report")} sx={{ border: "1px solid", borderColor: "divider", color: "text.primary", bgcolor: "background.paper" }}>Report</Button>
              <Button type="button" onClick={() => openCase("Lost item")} sx={{ border: "1px solid", borderColor: "divider", color: "text.primary", bgcolor: "background.paper" }}>Lost item</Button>
              <SosButton onClick={() => openCase("SOS")} />
            </Box>
            <Box sx={{ mt: 2.2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              {cases.length === 0 && <Typography color="text.secondary">No cases yet.</Typography>}
              {cases.map((item) => (
                <Box key={item.id} sx={{ py: 1 }}>
                  <Typography sx={{ fontFamily: "ui-monospace, monospace", fontWeight: 700 }}>{item.id}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.kind} · {item.status}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: dark ? brand.gold : brand.lemon, flex: "0 0 auto" }} />
              <Typography variant="body2" color="text.secondary">Human review stays on for serious incidents.</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function PilotBand() {
  return (
    <Box component="section" sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 14, md: 16 }, pb: { xs: 4, md: 6 } }}>
      <Typography sx={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "text.secondary" }}>Pilot</Typography>
      <Typography variant="h2" sx={{ mt: 1.2, maxWidth: 640 }}>Pilot targets, not trophies</Typography>
      <Typography color="text.secondary" sx={{ mt: 1.6, maxWidth: 560 }}>
        Abuja and Lagos are the planning cities. These are gates in the requirements, still to be measured.
      </Typography>
      <Box sx={{ mt: 4, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, border: "1px solid", borderColor: "divider", borderRadius: "20px", overflow: "hidden", bgcolor: "background.paper" }}>
        {targets.map(([title, body], index) => (
          <Box
            key={title}
            sx={{
              p: { xs: 2.4, md: 3.2 },
              borderTop: { xs: index === 0 ? "none" : "1px solid", md: index < 2 ? "none" : "1px solid" },
              borderColor: "divider",
              borderLeft: { md: index % 2 === 0 ? "none" : "1px solid" },
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.8 }}>{body}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
