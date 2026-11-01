"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const systems = [
  {
    id: "localiq",
    index: "01",
    kicker: "Pickup",
    title: "LocalIQ",
    body: "A landmark and a note beat a pin dropped on a roof. Gates, markets, campuses, and hospitals are curated, and a bad instruction can be reported.",
    detail: "Wuse Market gate",
    note: "Use the market side, not the loading bay.",
    image: "/showcase/city-abuja.jpg",
    alt: "A wide view of Abuja on a bright day",
  },
  {
    id: "promise",
    index: "02",
    kicker: "Case",
    title: "RapidRyde Promise",
    body: "A trip PIN, a share link, and CaseTrack. Every report gets a reference, a status, and a person when the decision matters.",
    detail: "RR-2041",
    note: "Acknowledged. Next update in the hour.",
    image: "/showcase/story-rider.jpg",
    alt: "A rider looking at a phone before a trip",
  },
  {
    id: "care",
    index: "03",
    kicker: "Fare",
    title: "DriverCare",
    body: "True Earnings shows the fare, the commission, and the take-home before fuel. Partner savings stay optional. Nothing is promised that is not funded.",
    detail: "Gross ₦6,000 · commission 15%",
    note: "An estimate, not a guarantee.",
    image: "/showcase/story-courier.jpg",
    alt: "A courier with a parcel on a city street",
  },
];

export function Signature() {
  const reduce = useReducedMotion();
  return (
    <Box component="section" sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 14, md: 16 } }}>
      <Typography sx={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "text.secondary" }}>
        What is not a copy
      </Typography>
      <Typography variant="h2" sx={{ mt: 1.2, maxWidth: 720 }}>
        Clear pickups, a visible case, and a fair view of the fare.
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.6, maxWidth: 560 }}>
        The pickup note, the case reference, and the cut are on the screen before anyone moves.
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: { xs: 4, md: 2.5 }, mt: { xs: 5, md: 5 } }}>
        {systems.map((system, index) => (
          <Box
            key={system.id}
            id={system.id === "localiq" ? "localiq" : undefined}
            component={motion.div}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            sx={{ display: "flex", flexDirection: "column", minWidth: 0, scrollMarginTop: 96 }}
          >
            <Box sx={{ position: "relative", height: { xs: 240, md: 280 }, borderRadius: "22px", overflow: "hidden", bgcolor: "#171814" }}>
              <Image src={system.image} alt={system.alt} fill sizes="(min-width: 900px) 360px, 100vw" style={{ objectFit: "cover" }} />
              <Box sx={{ position: "absolute", left: 14, right: 14, bottom: 14, p: 1.6, borderRadius: "14px", bgcolor: "rgba(23,24,20,0.72)", color: "#F3F4EE", backdropFilter: "blur(10px)" }}>
                <Typography sx={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>{system.kicker}</Typography>
                <Typography sx={{ mt: 0.4, fontWeight: 650 }}>{system.detail}</Typography>
                <Typography variant="body2" sx={{ mt: 0.3, color: "rgba(243,244,238,0.82)" }}>{system.note}</Typography>
              </Box>
            </Box>
            <Box sx={{ pt: 2.2 }}>
              <Typography sx={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "text.secondary" }}>{system.index}</Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>{system.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1.1 }}>{system.body}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
