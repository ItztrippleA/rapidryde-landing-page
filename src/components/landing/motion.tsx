"use client";

import { useRef, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Typewriter } from "./Typewriter";

const ease = [0.22, 1, 0.36, 1] as const;

export function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <Box
      component={motion.div}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </Box>
  );
}

export function SectionKicker({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        fontSize: 12,
        fontWeight: 700,
        color: "text.secondary",
      }}
    >
      {children}
    </Typography>
  );
}

export function SectionHeadline({
  lines,
  type = false,
  maxWidth = 760,
}: {
  lines: string[];
  type?: boolean;
  maxWidth?: number | string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduce = useReducedMotion();

  return (
    <Typography
      ref={ref}
      variant="h2"
      sx={{
        mt: 1.4,
        maxWidth,
        minHeight: type ? `${lines.length * 1.15}em` : undefined,
      }}
    >
      {type && !reduce ? (
        <Typewriter
          start={inView}
          lines={lines.map((text) => ({ text }))}
          charMs={28}
          linePauseMs={280}
        />
      ) : (
        lines.map((line) => (
          <Box component="span" key={line} sx={{ display: "block" }}>
            {line}
          </Box>
        ))
      )}
    </Typography>
  );
}

export function ParallaxMedia({
  children,
  progress,
  from = "-8%",
  to = "12%",
  scaleFrom = 1.12,
  scaleTo = 1,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  from?: string;
  to?: string;
  scaleFrom?: number;
  scaleTo?: number;
}) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [0, 1], reduce ? ["0%", "0%"] : [from, to]);
  const scale = useTransform(progress, [0, 1], reduce ? [1, 1] : [scaleFrom, scaleTo]);

  return (
    <Box
      component={motion.div}
      style={{ y, scale }}
      sx={{
        position: "absolute",
        inset: "-12% -4%",
        willChange: "transform",
      }}
    >
      {children}
    </Box>
  );
}

export function FullBleedBand({
  children,
  id,
  height = { xs: "150vh", md: "170vh" },
  stickyMinHeight = { xs: 520, md: 640 },
}: {
  children: (progress: MotionValue<number>) => ReactNode;
  id?: string;
  height?: { xs: string; md: string } | string;
  stickyMinHeight?: { xs: number; md: number } | number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <Box
      id={id}
      ref={ref}
      component="section"
      sx={{ position: "relative", height, scrollMarginTop: 80 }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          height: "100vh",
          minHeight: stickyMinHeight,
          overflow: "hidden",
        }}
      >
        {children(progress)}
      </Box>
    </Box>
  );
}
