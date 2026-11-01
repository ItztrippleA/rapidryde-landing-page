"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mark } from "@/components/brand/Mark";
import { useBookingStore } from "@/store/useBookingStore";
import { brand } from "@/theme/tokens";
import { BookingPanel } from "./BookingPanel";
import { RouteMap } from "./RouteMap";

export function PhoneApp() {
  const reduce = useReducedMotion();
  const [booting, setBooting] = useState(true);
  const city = useBookingStore((state) => state.city);
  const setCity = useBookingStore((state) => state.setCity);

  useEffect(() => {
    if (reduce) {
      setBooting(false);
      return;
    }
    const timer = window.setTimeout(() => setBooting(false), 1500);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0 }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 414,
          minWidth: 0,
          height: { xs: 700, lg: 812 },
        }}
      >
        <Box aria-hidden sx={{ display: { xs: "none", lg: "block" }, position: "absolute", left: -3, top: 128, width: 3, height: 26, borderRadius: 2, bgcolor: "#2A2E26" }} />
        <Box aria-hidden sx={{ display: { xs: "none", lg: "block" }, position: "absolute", left: -3, top: 166, width: 3, height: 46, borderRadius: 2, bgcolor: "#2A2E26" }} />
        <Box aria-hidden sx={{ display: { xs: "none", lg: "block" }, position: "absolute", right: -3, top: 168, width: 3, height: 72, borderRadius: 2, bgcolor: "#2A2E26" }} />
        <Box
          aria-label="Rapyd Ryd"
          sx={{
            height: "100%",
            borderRadius: { xs: "32px", lg: "48px" },
            p: { xs: "8px", lg: "12px" },
            background: "linear-gradient(165deg, #3C4038 0%, #161814 38%, #0E100C 100%)",
            boxShadow: "0 28px 70px rgba(16, 18, 14, 0.28), inset 0 0 0 1px rgba(255,255,255,0.14)",
          }}
        >
          <Box sx={{ position: "relative", height: "100%", borderRadius: { xs: "26px", lg: "36px" }, overflow: "hidden", bgcolor: "#14170F", display: "flex", flexDirection: "column", minWidth: 0 }}>
            <Box aria-hidden sx={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 108, height: 28, borderRadius: 999, bgcolor: "#0C0E0A", zIndex: 8 }} />
            <Box sx={{ position: "relative", height: { xs: 248, lg: 368 }, flex: "0 0 auto" }}>
              <RouteMap hideLabel />
              <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, px: 2.4, pt: 1.6, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#F4F5F1" }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>9:41</Typography>
                <StatusIcons />
              </Box>
              <Box sx={{ position: "absolute", top: 46, left: 16, right: 16, zIndex: 2, display: "flex", alignItems: "center" }}>
                <Mark height={34} tone="onDark" />
              </Box>
              <Box sx={{ position: "absolute", left: 14, bottom: 26, zIndex: 2, display: "flex", gap: 0.6 }}>
                {(["abuja", "lagos"] as const).map((id) => {
                  const on = city === id;
                  return (
                    <Button
                      key={id}
                      type="button"
                      onClick={() => setCity(id)}
                      sx={{
                        minWidth: 0,
                        px: 1.4,
                        py: 0.35,
                        fontSize: 13,
                        color: on ? "#171814" : "#F4F5F1",
                        bgcolor: on ? "#F4F5F1" : "rgba(12,14,10,0.45)",
                        border: "1px solid rgba(255,255,255,0.22)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {id === "abuja" ? "Abuja" : "Lagos"}
                    </Button>
                  );
                })}
              </Box>
            </Box>
            <Box
              id="app-sheet"
              sx={{
                position: "relative",
                zIndex: 3,
                flex: 1,
                minHeight: 0,
                mt: "-18px",
                borderRadius: "26px 26px 0 0",
                bgcolor: "background.paper",
                boxShadow: "0 -10px 30px rgba(0,0,0,0.18)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Box aria-hidden sx={{ width: 40, height: 4, borderRadius: 99, bgcolor: "divider", mx: "auto", mt: 1, mb: 0.4, flex: "0 0 auto" }} />
              <BookingPanel />
            </Box>
            <Box aria-hidden sx={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: 124, height: 4, borderRadius: 99, bgcolor: "text.primary", opacity: 0.28, zIndex: 8, pointerEvents: "none" }} />
            <AnimatePresence>
              {booting && <Splash />}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

function Splash() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#10120E",
        color: "#F3F4EE",
      }}
    >
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
        <Mark height={78} tone="onDark" />
      </motion.div>
      <Typography sx={{ mt: 1.2, fontSize: 13, color: "rgba(243,244,238,0.72)" }}>More than a ride.</Typography>
      <Box aria-hidden sx={{ mt: 2.4, width: 72, height: 3, borderRadius: 99, bgcolor: "rgba(243,244,238,0.16)", overflow: "hidden" }}>
        <Box sx={{ width: "100%", height: "100%", bgcolor: brand.lemon, transformOrigin: "left center", animation: "rr-slide 1.15s ease-out" }} />
      </Box>
    </Box>
  );
}

function StatusIcons() {
  return (
    <Box aria-hidden sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
      <svg width="17" height="12" viewBox="0 0 17 12" fill="#F4F5F1">
        <rect x="0" y="7" width="3" height="5" rx="0.6" />
        <rect x="4.5" y="5" width="3" height="7" rx="0.6" />
        <rect x="9" y="2.5" width="3" height="9.5" rx="0.6" />
        <rect x="13.5" y="0" width="3" height="12" rx="0.6" />
      </svg>
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
        <rect x="0.6" y="0.6" width="20" height="10.8" rx="2.4" stroke="#F4F5F1" strokeWidth="1.2" />
        <rect x="2" y="2" width="14" height="8" rx="1.2" fill="#F4F5F1" />
        <rect x="21.5" y="3.5" width="1.6" height="5" rx="0.6" fill="#F4F5F1" />
      </svg>
    </Box>
  );
}
