"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { brand } from "@/theme/tokens";
import { PhoneApp } from "./PhoneApp";

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

function HeroField() {
  const dark = useTheme().palette.mode === "dark";
  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <Box
        component="svg"
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", color: "text.primary" }}
      >
        {routes.map((route) => (
          <path key={route.d} d={route.d} fill="none" stroke="currentColor" strokeOpacity={0.09} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
        ))}
        {routes.map((route, index) => {
          const lemonTouch = dark && index === routes.length - 1;
          const flow = dark ? (lemonTouch ? brand.lemon : brand.gold) : index % 2 === 0 ? brand.orange : brand.lemonDeep;
          return (
          <path
            key={`${route.d}-flow`}
            className="rr-route-flow"
            d={route.d}
            pathLength={100}
            fill="none"
            stroke={flow}
            strokeOpacity={0.55}
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
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} fill="currentColor" opacity={0.16} />
        ))}
      </Box>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: (theme) => {
            const bg = theme.palette.background.default;
            return `linear-gradient(180deg, transparent 0%, transparent 68%, ${bg} 100%), linear-gradient(90deg, ${bg} 0%, transparent 14%, transparent 86%, ${bg} 100%)`;
          },
        }}
      />
    </Box>
  );
}

export function Hero() {
  const dark = useTheme().palette.mode === "dark";
  return (
    <Box id="product" component="section" sx={{ position: "relative", scrollMarginTop: 80 }}>
      <HeroField />
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 4, md: 7 } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 460px" }, gap: { xs: 4, lg: 4 }, alignItems: "center", minWidth: 0 }}>
        <Box>
          <Typography sx={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "text.secondary" }}>
            Nigeria-first · Abuja and Lagos
          </Typography>
          <Typography variant="h1" sx={{ mt: 1.5 }}>
            More than a ride.
            <Box component="span" sx={{ display: "block" }}>A better journey.</Box>
          </Typography>
          <Box sx={{ mt: 1.5 }} aria-hidden>
            <svg width="168" height="16" viewBox="0 0 168 16">
              <path d="M2 11 C 36 2, 70 2, 96 9 S 140 16, 166 4" stroke={dark ? brand.gold : brand.lemon} strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </Box>
          <Typography sx={{ mt: 2.5, maxWidth: 540, fontSize: "1.12rem", color: "text.secondary" }}>
            City rides, intercity, courier, freight, food, grocery, and self-drive hire. Take the upfront fare or name your price. The driver gets a landmark they can find. You get a case number if something goes wrong.
          </Typography>
          <Box sx={{ display: "flex", gap: 3, mt: 3, flexWrap: "wrap" }}>
            {["LocalIQ pickups", "Trip PIN", "True Earnings"].map((item) => (
              <Typography key={item} sx={{ fontWeight: 650 }}>{item}</Typography>
            ))}
          </Box>
        </Box>
        <PhoneApp />
      </Box>
      </Box>
    </Box>
  );
}
