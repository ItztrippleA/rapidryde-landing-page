"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Mark } from "@/components/brand/Mark";
import { JoinWaitlistButton, EarnWithRapidButton } from "@/components/ui/Actions";
import { brand } from "@/theme/tokens";
import { PhoneApp } from "./PhoneApp";
import { Typewriter } from "./Typewriter";

const routes = [
  { d: "M-80 110 C 200 40, 380 200, 620 120 S 1040 20, 1520 140", flow: "32s", car: "18s", delay: "0s" },
  { d: "M-60 250 C 240 320, 460 150, 740 240 S 1160 360, 1520 200", flow: "38s", car: "23s", delay: "-7s" },
  { d: "M-40 420 C 280 350, 540 520, 840 410 S 1220 300, 1520 450", flow: "28s", car: "16s", delay: "-3s" },
  { d: "M1520 70 C 1180 160, 940 20, 680 110 S 220 210, -80 60", flow: "34s", car: "21s", delay: "-11s", reverse: true },
  { d: "M1520 540 C 1140 470, 860 640, 580 520 S 180 430, -80 580", flow: "36s", car: "25s", delay: "-5s", reverse: true },
  { d: "M-80 650 C 300 710, 560 560, 900 660 S 1260 740, 1520 600", flow: "40s", car: "19s", delay: "-9s" },
];

const places: [number, number][] = [
  [210, 168], [470, 250], [690, 130], [930, 310], [1180, 190], [300, 500], [820, 560], [1320, 430],
];

function RouteOverlay({ opacity }: { opacity: number }) {
  const dark = useTheme().palette.mode === "dark";
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
        transition: "opacity 0.2s linear",
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", color: "common.white" }}
      >
        {routes.map((route) => (
          <path key={route.d} d={route.d} fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
        ))}
        {routes.map((route, index) => {
          const lemonTouch = dark && index === routes.length - 1;
          const flow = dark ? (lemonTouch ? brand.lemon : brand.gold) : index % 2 === 0 ? brand.orange : brand.lemon;
          return (
            <path
              key={`${route.d}-flow`}
              className="rr-route-flow"
              d={route.d}
              pathLength={100}
              fill="none"
              stroke={flow}
              strokeOpacity={0.7}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeDasharray="0.55 6.8"
              vectorEffect="non-scaling-stroke"
              style={{ animationDuration: route.flow, animationDelay: route.delay, animationDirection: route.reverse ? "reverse" : "normal" }}
            />
          );
        })}
        {routes.map((route, index) => {
          const lemonTouch = dark && index === routes.length - 1;
          const casing = dark ? (lemonTouch ? "#6E8228" : "#8A6A2A") : index % 2 === 0 ? "#C24100" : "#6E8228";
          const car = dark ? (lemonTouch ? brand.lemon : brand.gold) : index % 2 === 0 ? brand.orange : brand.lemon;
          return (
            <g key={`${route.d}-car`}>
              <path
                className="rr-route-car"
                d={route.d}
                pathLength={100}
                fill="none"
                stroke={casing}
                strokeWidth={7}
                strokeLinecap="round"
                strokeDasharray="3.1 96.9"
                vectorEffect="non-scaling-stroke"
                style={{ animationDuration: route.car, animationDelay: route.delay, animationDirection: route.reverse ? "reverse" : "normal" }}
              />
              <path
                className="rr-route-car"
                d={route.d}
                pathLength={100}
                fill="none"
                stroke={car}
                strokeWidth={3.4}
                strokeLinecap="round"
                strokeDasharray="2.2 97.8"
                vectorEffect="non-scaling-stroke"
                style={{ animationDuration: route.car, animationDelay: route.delay, animationDirection: route.reverse ? "reverse" : "normal" }}
              />
            </g>
          );
        })}
        {places.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} fill="currentColor" opacity={0.28} />
        ))}
      </Box>
    </Box>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const dark = useTheme().palette.mode === "dark";
  const stageRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(false);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  const videoY = useTransform(progress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "22%"]);
  const videoScale = useTransform(progress, [0, 0.55, 1], reduce ? [1, 1, 1] : [1.18, 1.06, 1]);
  const routeOpacity = useTransform(progress, [0, 0.35, 0.7], reduce ? [0.35, 0.35, 0.35] : [0.55, 0.35, 0.12]);
  const copyY = useTransform(progress, [0, 1], reduce ? [0, 0] : [40, -48]);
  const copyOpacity = useTransform(progress, [0, 0.12, 0.78, 1], [1, 1, 1, 0.88]);
  const phoneY = useTransform(progress, [0, 1], reduce ? [0, 0] : [80, -90]);
  const phoneRotate = useTransform(progress, [0, 1], reduce ? [0, 0] : [4, -3]);
  const veil = useTransform(progress, [0, 0.45, 1], [0.42, 0.55, 0.62]);

  return (
    <Box
      id="product"
      ref={stageRef}
      component="section"
      sx={{
        position: "relative",
        height: { xs: "220vh", md: "260vh" },
        scrollMarginTop: 80,
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          height: "100vh",
          minHeight: 560,
          overflow: "hidden",
          bgcolor: brand.black,
        }}
      >
        <Box
          component={motion.div}
          style={{ y: videoY, scale: videoScale }}
          sx={{
            position: "absolute",
            inset: "-12% -6%",
            zIndex: 0,
          }}
        >
          <Box
            component="video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              filter: "saturate(1.05) contrast(1.05)",
            }}
          >
            <source src="/media/ride-reel.mp4" type="video/mp4" />
          </Box>
        </Box>

        <Box
          component={motion.div}
          style={{ opacity: veil }}
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: dark
              ? "linear-gradient(105deg, rgba(7,7,7,0.88) 0%, rgba(7,7,7,0.55) 42%, rgba(7,7,7,0.35) 100%)"
              : "linear-gradient(105deg, rgba(7,7,7,0.82) 0%, rgba(7,7,7,0.48) 45%, rgba(7,7,7,0.28) 100%)",
            pointerEvents: "none",
          }}
        />

        <Box component={motion.div} style={{ opacity: routeOpacity }} sx={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
          <RouteOverlay opacity={1} />
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            height: "100%",
            maxWidth: 1180,
            mx: "auto",
            px: { xs: 2, md: 3 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) minmax(280px, 420px)" },
            gap: { xs: 3, lg: 4 },
            alignItems: "center",
            pt: { xs: 10, md: 2 },
            pb: { xs: 4, md: 2 },
          }}
        >
          <Box
            component={motion.div}
            style={{ y: copyY, opacity: copyOpacity }}
            sx={{ color: "#F6E7C1", minWidth: 0 }}
          >
            <Box sx={{ mb: { xs: 2, md: 2.5 }, maxWidth: { xs: 220, sm: 280, md: 340 } }}>
              <Mark height={64} tone="onDark" />
            </Box>
            <Typography
              sx={{
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(246,231,193,0.72)",
              }}
            >
              Nigeria-first · Abuja and Lagos
            </Typography>
            <Typography
              variant="h1"
              sx={{
                mt: 1.5,
                color: "#FFF8E8",
                fontSize: { xs: "2.35rem", sm: "3rem", md: "3.55rem" },
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                minHeight: { xs: "4.8rem", md: "7.2rem" },
              }}
            >
              <Typewriter
                start
                lines={[
                  { text: "More than a ride." },
                  { text: "A better journey.", accent: true },
                ]}
                onComplete={() => setTyped(true)}
              />
            </Typography>
            <Box
              sx={{
                mt: 1.5,
                height: 16,
                overflow: "hidden",
                opacity: typed || reduce ? 1 : 0,
                transform: typed || reduce ? "none" : "translateY(8px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
              aria-hidden
            >
              <svg width="168" height="16" viewBox="0 0 168 16">
                <path
                  d="M2 11 C 36 2, 70 2, 96 9 S 140 16, 166 4"
                  stroke={brand.gold}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
            <Typography
              sx={{
                mt: 2.5,
                maxWidth: 520,
                fontSize: { xs: "1.02rem", md: "1.12rem" },
                lineHeight: 1.55,
                color: "rgba(246,231,193,0.82)",
                opacity: typed || reduce ? 1 : 0,
                transform: typed || reduce ? "none" : "translateY(12px)",
                transition: "opacity 0.55s ease 0.05s, transform 0.55s ease 0.05s",
              }}
            >
              Landmark pickups, upfront fares or your price, trip PIN, and a case number when something goes wrong.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mt: 3,
                flexWrap: "wrap",
                opacity: typed || reduce ? 1 : 0,
                transform: typed || reduce ? "none" : "translateY(14px)",
                transition: "opacity 0.55s ease 0.12s, transform 0.55s ease 0.12s",
              }}
            >
              <JoinWaitlistButton size="large" />
              <EarnWithRapidButton appearance="inverse" />
            </Box>
            <Typography
              sx={{
                mt: 3,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(246,231,193,0.45)",
                display: { xs: "none", md: "block" },
              }}
            >
              Scroll — the city moves with you
            </Typography>
          </Box>

          <Box
            component={motion.div}
            style={{ y: phoneY, rotate: phoneRotate }}
            sx={{
              justifySelf: { xs: "center", lg: "end" },
              width: "100%",
              maxWidth: 420,
              display: { xs: "none", sm: "block" },
              transformOrigin: "60% 80%",
            }}
          >
            <PhoneApp />
          </Box>
        </Box>

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 96,
            zIndex: 4,
            background: (theme) =>
              `linear-gradient(180deg, transparent 0%, ${theme.palette.background.default} 100%)`,
            pointerEvents: "none",
          }}
        />
      </Box>
    </Box>
  );
}
