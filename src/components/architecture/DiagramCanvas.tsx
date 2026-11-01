"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  parentOf,
  type JourneySlot,
  type RelationKind,
  type UmlClass,
  type UmlRelation,
} from "@/data/domain";
import { useDiagramStore } from "@/store/useDiagramStore";
import { brand } from "@/theme/tokens";

interface Segment {
  id: string;
  kind: RelationKind;
  label: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function DiagramCanvas({ items, relations, layout }: { items: UmlClass[]; relations: UmlRelation[]; layout?: Record<string, JourneySlot> }) {
  const theme = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const selectedId = useDiagramStore((state) => state.selectedId);
  const select = useDiagramStore((state) => state.select);
  const ids = items.map((item) => item.id).join("|");
  const relationKey = relations.map((relation) => relation.id).join("|");

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const origin = wrap.getBoundingClientRect();
    const next: Segment[] = [];
    relations.forEach((relation) => {
      const from = wrap.querySelector<HTMLElement>(`[data-class="${relation.from}"]`);
      const to = wrap.querySelector<HTMLElement>(`[data-class="${relation.to}"]`);
      if (!from || !to) return;
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const start = edge(a, b, origin);
      const end = edge(b, a, origin);
      next.push({ id: relation.id, kind: relation.kind, label: relation.label, ...trim(start, end) });
    });
    setSegments(next);
  }, [relations]);

  useLayoutEffect(() => {
    measure();
  }, [measure, ids, relationKey]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(wrap);
    window.addEventListener("resize", measure);
    const timer = window.setTimeout(measure, 280);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(timer);
    };
  }, [measure]);

  const columns = layout ? { xs: "1fr", md: "1fr 1fr", lg: "repeat(4, minmax(0, 1fr))" } : { xs: "1fr", md: "1fr 1fr", lg: "repeat(3, minmax(0, 1fr))" };

  return (
    <Box ref={wrapRef} sx={{ position: "relative" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "visible" }}>
        <defs>
          <marker id="uml-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill={theme.palette.text.primary} />
          </marker>
          <marker id="uml-triangle" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto">
            <path d="M0,0 L12,5 L0,10 Z" fill={theme.palette.background.paper} stroke={theme.palette.text.primary} />
          </marker>
          <marker id="uml-diamond" markerWidth="14" markerHeight="10" refX="0" refY="5" orient="auto">
            <path d="M1,5 L7,0 L13,5 L7,10 Z" fill={theme.palette.text.primary} />
          </marker>
          <marker id="uml-diamond-open" markerWidth="14" markerHeight="10" refX="0" refY="5" orient="auto">
            <path d="M1,5 L7,0 L13,5 L7,10 Z" fill={theme.palette.background.paper} stroke={theme.palette.text.primary} />
          </marker>
        </defs>
        {segments.map((segment) => (
          <g key={segment.id}>
            <line
              x1={segment.x1}
              y1={segment.y1}
              x2={segment.x2}
              y2={segment.y2}
              stroke={theme.palette.text.primary}
              strokeWidth="1.25"
              strokeDasharray={segment.kind === "dependency" ? "5 4" : undefined}
              markerEnd={segment.kind === "extends" ? "url(#uml-triangle)" : segment.kind === "composition" || segment.kind === "aggregation" ? undefined : "url(#uml-arrow)"}
              markerStart={segment.kind === "composition" ? "url(#uml-diamond)" : segment.kind === "aggregation" ? "url(#uml-diamond-open)" : undefined}
            />
            <text x={(segment.x1 + segment.x2) / 2} y={(segment.y1 + segment.y2) / 2} fill={theme.palette.text.secondary} fontSize="11" textAnchor="middle">
              {segment.label}
            </text>
          </g>
        ))}
      </svg>
      <Box sx={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: columns, gap: { xs: 2, lg: 3.5 }, alignItems: "stretch" }}>
        {items.map((item) => {
          const slot = layout?.[item.id];
          const parent = parentOf(item.id);
          const parentHere = parent ? items.some((candidate) => candidate.id === parent.id) : false;
          const selected = selectedId === item.id;
          return (
            <Box
              key={item.id}
              component="button"
              type="button"
              data-class={item.id}
              onClick={() => select(item.id)}
              sx={{
                gridColumn: slot ? { lg: slot.c } : undefined,
                gridRow: slot ? { lg: slot.r } : undefined,
                textAlign: "left",
                font: "inherit",
                color: "inherit",
                cursor: "pointer",
                p: 0,
                borderRadius: 2,
                border: "1px solid",
                borderColor: selected ? "text.primary" : "divider",
                bgcolor: "background.paper",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {selected && <Box sx={{ position: "absolute", top: 10, right: 10, width: 10, height: 10, borderRadius: "50%", bgcolor: theme.palette.mode === "dark" ? brand.gold : brand.lemon }} />}
              <Box sx={{ px: 1.4, py: 1, borderBottom: "1px solid", borderColor: "divider", bgcolor: "action.hover" }}>
                <Typography sx={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary" }}>
                  «{item.stereotype}»
                </Typography>
                <Typography sx={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 700, fontStyle: item.abstract ? "italic" : "normal" }}>
                  {item.abstract ? `abstract ${item.name}` : item.name}
                </Typography>
                {parent && !parentHere && (
                  <Typography variant="caption" color="text.secondary">extends {parent.name}</Typography>
                )}
              </Box>
              <Box sx={{ px: 1.4, py: 1, fontFamily: "ui-monospace, monospace", fontSize: 12, lineHeight: 1.55, overflowWrap: "anywhere" }}>
                {item.attributes.length === 0 && <Box sx={{ color: "text.secondary" }}>—</Box>}
                {item.attributes.map((attribute) => (
                  <Box key={attribute.name}>{attribute.visibility} {attribute.name}: {attribute.type}</Box>
                ))}
              </Box>
              <Box sx={{ px: 1.4, py: 1, borderTop: "1px solid", borderColor: "divider", fontFamily: "ui-monospace, monospace", fontSize: 12, lineHeight: 1.55, overflowWrap: "anywhere" }}>
                {item.methods.map((operation) => (
                  <Box key={operation.name}>{operation.visibility} {operation.name}: {operation.returns}</Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function edge(self: DOMRect, other: DOMRect, origin: DOMRect) {
  const scx = self.left + self.width / 2 - origin.left;
  const scy = self.top + self.height / 2 - origin.top;
  const ocx = other.left + other.width / 2 - origin.left;
  const ocy = other.top + other.height / 2 - origin.top;
  const dx = ocx - scx;
  const dy = ocy - scy;
  if (Math.abs(dx) > Math.abs(dy)) {
    return { x: dx > 0 ? self.right - origin.left : self.left - origin.left, y: scy };
  }
  return { x: scx, y: dy > 0 ? self.bottom - origin.top : self.top - origin.top };
}

function trim(start: { x: number; y: number }, end: { x: number; y: number }) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy) || 1;
  const cut = 8;
  return {
    x1: start.x + (dx / length) * 2,
    y1: start.y + (dy / length) * 2,
    x2: end.x - (dx / length) * cut,
    y2: end.y - (dy / length) * cut,
  };
}
