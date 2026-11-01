"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion, useReducedMotion } from "framer-motion";
import { placeById } from "@/data/catalog";
import { useBookingStore } from "@/store/useBookingStore";
import { brand } from "@/theme/tokens";

const step = 64;

function point(id: string) {
  const place = placeById(id);
  return {
    x: 48 + place.x * 6.2,
    y: 56 + place.y * 6.4,
  };
}

function snap(value: number) {
  return Math.round(value / step) * step;
}

function roadPath(start: { x: number; y: number }, end: { x: number; y: number }) {
  let x1 = snap(start.x);
  let y1 = snap(start.y);
  let x2 = snap(end.x);
  let y2 = snap(end.y);
  if (Math.hypot(x2 - x1, y2 - y1) < 260) {
    x2 = Math.min(576, Math.max(64, x1 + (end.x >= start.x ? 320 : -320)));
    y2 = Math.min(512, Math.max(64, y1 + (end.y >= start.y ? 192 : -192)));
    x2 = snap(x2);
    y2 = snap(y2);
  }
  const xTurn = snap(x1 + (x2 - x1) * 0.42);
  const yTurn = snap(y1 + (y2 - y1) * 0.62);
  return fillet([
    { x: x1, y: y1 },
    { x: xTurn, y: y1 },
    { x: xTurn, y: yTurn },
    { x: x2, y: yTurn },
    { x: x2, y: y2 },
  ], 28);
}

function fillet(points: { x: number; y: number }[], radius: number) {
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const next = points[index + 1];
    const inLength = Math.hypot(current.x - previous.x, current.y - previous.y) || 1;
    const outLength = Math.hypot(next.x - current.x, next.y - current.y) || 1;
    const curve = Math.min(radius, inLength / 2.2, outLength / 2.2);
    const enterX = current.x - ((current.x - previous.x) / inLength) * curve;
    const enterY = current.y - ((current.y - previous.y) / inLength) * curve;
    const leaveX = current.x + ((next.x - current.x) / outLength) * curve;
    const leaveY = current.y + ((next.y - current.y) / outLength) * curve;
    path += ` L ${enterX} ${enterY} Q ${current.x} ${current.y} ${leaveX} ${leaveY}`;
  }
  const last = points[points.length - 1];
  return `${path} L ${last.x} ${last.y}`;
}

export function RouteMap({ hideLabel = false }: { hideLabel?: boolean }) {
  const reduce = useReducedMotion();
  const service = useBookingStore((state) => state.service);
  const pickupId = useBookingStore((state) => state.pickupId);
  const dropoffId = useBookingStore((state) => state.dropoffId);
  const city = useBookingStore((state) => state.city);
  const intercity = service === "intercity";
  const pickup = point(pickupId);
  const dropoff = point(dropoffId);
  const path = intercity
    ? fillet([
      { x: 64, y: 512 },
      { x: 192, y: 512 },
      { x: 192, y: 320 },
      { x: 384, y: 320 },
      { x: 384, y: 192 },
      { x: 576, y: 192 },
    ], 36)
    : roadPath(pickup, dropoff);
  const majors = [64, 192, 320, 448, 576];
  const minors = [128, 256, 384, 512];

  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, bgcolor: "#171C14", overflow: "hidden" }}>
      <svg viewBox="0 0 640 640" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        {majors.map((position) => (
          <g key={`major-${position}`}>
            <line x1="0" x2="640" y1={position} y2={position} stroke="#3A4334" strokeWidth="11" />
            <line y1="0" y2="640" x1={position} x2={position} stroke="#3A4334" strokeWidth="11" />
          </g>
        ))}
        {minors.map((position) => (
          <g key={`minor-${position}`}>
            <line x1="0" x2="640" y1={position} y2={position} stroke="#2A3226" strokeWidth="5" />
            <line y1="0" y2="640" x1={position} x2={position} stroke="#2A3226" strokeWidth="5" />
          </g>
        ))}
        <motion.path
          d={path}
          fill="none"
          stroke="#6E8228"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: "easeInOut" }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke={brand.lemon}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: "easeInOut" }}
        />
        <g key={path}>
          {reduce ? (
            <animateMotion path={path} rotate="auto" keyPoints="0;0" keyTimes="0;1" dur="0.01s" fill="freeze" />
          ) : (
            <animateMotion dur="7.5s" repeatCount="indefinite" path={path} rotate="auto" />
          )}
          <MapCar />
        </g>
        <circle cx={intercity ? 64 : snap(pickup.x)} cy={intercity ? 512 : snap(pickup.y)} r="8" fill="#F4F5F1" stroke="#171C14" strokeWidth="3" />
        <circle cx={intercity ? 576 : snap(roadEnd(pickup, dropoff).x)} cy={intercity ? 192 : snap(roadEnd(pickup, dropoff).y)} r="8" fill={brand.lemon} stroke="#171C14" strokeWidth="3" />
      </svg>
      {!hideLabel && (
        <Typography sx={{ position: "absolute", left: 16, bottom: 14, color: "#C9CEBF", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {intercity ? "Abuja  ·  Lagos" : `${city} pilot zone`}
        </Typography>
      )}
    </Box>
  );
}

function MapCar() {
  return (
    <g>
      <rect x="-30" y="-16" width="60" height="32" rx="9" fill="#10140E" />
      <rect x="-27" y="-13" width="54" height="26" rx="8" fill="#F7F8F2" />
      <path d="M4 -9 H18 Q24 -9 24 0 Q24 9 18 9 H4 Q-2 9 -2 0 Q-2 -9 4 -9 Z" fill={brand.lemon} />
      <rect x="-18" y="-8" width="12" height="16" rx="3" fill="#C9D0B4" />
      <rect x="-22" y="-19" width="10" height="6" rx="2" fill="#0C0E0A" />
      <rect x="10" y="-19" width="10" height="6" rx="2" fill="#0C0E0A" />
      <rect x="-22" y="13" width="10" height="6" rx="2" fill="#0C0E0A" />
      <rect x="10" y="13" width="10" height="6" rx="2" fill="#0C0E0A" />
    </g>
  );
}

function roadEnd(start: { x: number; y: number }, end: { x: number; y: number }) {
  let x2 = snap(end.x);
  let y2 = snap(end.y);
  const x1 = snap(start.x);
  const y1 = snap(start.y);
  if (Math.hypot(x2 - x1, y2 - y1) < 260) {
    x2 = snap(Math.min(576, Math.max(64, x1 + (end.x >= start.x ? 320 : -320))));
    y2 = snap(Math.min(512, Math.max(64, y1 + (end.y >= start.y ? 192 : -192))));
  }
  return { x: x2, y: y2 };
}
