"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { useReducedMotion } from "framer-motion";
import { brand } from "@/theme/tokens";

type Line = {
  text: string;
  accent?: boolean;
};

export function Typewriter({
  lines,
  start = true,
  charMs = 42,
  linePauseMs = 420,
  onComplete,
}: {
  lines: Line[];
  start?: boolean;
  charMs?: number;
  linePauseMs?: number;
  onComplete?: () => void;
}) {
  const reduce = useReducedMotion();
  const full = lines.map((line) => line.text).join("\n");
  const [shown, setShown] = useState(reduce || !start ? full : "");
  const [done, setDone] = useState(Boolean(reduce || !start));
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (reduce || !start) {
      setShown(full);
      setDone(true);
      onCompleteRef.current?.();
      return;
    }
    setShown("");
    setDone(false);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setShown(full.slice(0, i));
      if (i >= full.length) {
        setDone(true);
        onCompleteRef.current?.();
        return;
      }
      const justBroke = full[i - 1] === "\n";
      timer = setTimeout(tick, justBroke ? linePauseMs : charMs);
    };
    timer = setTimeout(tick, 280);
    return () => clearTimeout(timer);
  }, [full, start, reduce, charMs, linePauseMs]);

  const parts = shown.split("\n");
  while (parts.length < lines.length) parts.push("");

  return (
    <Box
      component="span"
      sx={{
        display: "block",
        "& .rr-caret": {
          display: "inline-block",
          width: "0.08em",
          height: "0.92em",
          ml: "0.08em",
          bgcolor: "currentColor",
          verticalAlign: "-0.08em",
          animation: done ? "none" : "rr-caret 0.9s steps(1) infinite",
          opacity: done ? 0 : 1,
          transition: "opacity 0.4s ease",
        },
      }}
      aria-label={full.replace(/\n/g, " ")}
    >
      {lines.map((line, index) => {
        const isLastActive =
          index === Math.min(parts.length - 1, lines.length - 1) && !done;
        const showCaret = isLastActive || (done && index === lines.length - 1);
        return (
          <Box
            key={line.text}
            component="span"
            sx={{
              display: "block",
              color: line.accent ? brand.gold : "inherit",
            }}
          >
            {parts[index] || "\u00A0"}
            {showCaret && !reduce ? <span className="rr-caret" aria-hidden /> : null}
          </Box>
        );
      })}
    </Box>
  );
}
