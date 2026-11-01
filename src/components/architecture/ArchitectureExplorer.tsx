"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DiagramCanvas } from "./DiagramCanvas";
import {
  classes,
  classesIn,
  classById,
  journeyLayout,
  packages,
  relationsFor,
  relationsTouching,
} from "@/data/domain";
import { useDiagramStore } from "@/store/useDiagramStore";
import { EarnWithRapidButton } from "@/components/ui/Actions";

const legend = [
  ["extends", "Hollow triangle toward the parent"],
  ["composition", "Filled diamond on the owner"],
  ["aggregation", "Open diamond on the owner"],
  ["association", "Arrow toward the target"],
  ["dependency", "Dashed arrow. A service uses another"],
];

export function ArchitectureExplorer() {
  const packageId = useDiagramStore((state) => state.packageId);
  const selectedId = useDiagramStore((state) => state.selectedId);
  const query = useDiagramStore((state) => state.query);
  const setPackage = useDiagramStore((state) => state.setPackage);
  const select = useDiagramStore((state) => state.select);
  const setQuery = useDiagramStore((state) => state.setQuery);
  const params = useSearchParams();
  const focus = params.get("class");
  const requested = params.get("package");
  useEffect(() => {
    if (focus) {
      select(focus, requested ?? undefined);
      return;
    }
    if (requested && packages.some((item) => item.id === requested)) {
      setPackage(requested, classesIn(requested)[0]?.id ?? null);
    }
  }, [focus, requested, select, setPackage]);
  const pack = packages.find((item) => item.id === packageId) ?? packages[0];
  const items = classesIn(pack.id);
  const relations = relationsFor(items.map((item) => item.id));
  const selected = selectedId ? classById(selectedId) : null;
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return classes.filter((item) => `${item.name} ${item.summary} ${item.packageId}`.toLowerCase().includes(needle));
  }, [query]);

  return (
    <Box sx={{ maxWidth: 1520, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 4, md: 6 }, pb: 8 }}>
      <Typography sx={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "text.secondary" }}>
        Application architecture
      </Typography>
      <Typography variant="h1" sx={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", mt: 1, maxWidth: 860 }}>
        Class model of the whole product.
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 760 }}>
        Riders and drivers both clear a NIN check before a trip can start. Pick a package, then a class. The journey view is the booking path. Driver, fleet, and DriverCare are the earning path.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <EarnWithRapidButton />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
        {legend.map(([name, body]) => (
          <Typography key={name} variant="body2" color="text.secondary">
            <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>{name}. </Box>
            {body}
          </Typography>
        ))}
      </Box>

      <TextField
        fullWidth
        label="Find a class"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        sx={{ mt: 3, maxWidth: 480 }}
      />
      {query.trim() && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 1.5, maxWidth: 640 }}>
          {matches.length === 0 && <Typography color="text.secondary">No class matches.</Typography>}
          {matches.map((item) => (
            <Button key={item.id} type="button" onClick={() => select(item.id, item.packageId)} sx={{ justifyContent: "flex-start", color: "text.primary", textAlign: "left" }}>
              {item.name}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>{packages.find((packItem) => packItem.id === item.packageId)?.name}</Typography>
            </Button>
          ))}
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 0.7, overflowX: "auto", py: 2, mt: 1 }}>
        {packages.map((item) => {
          const count = classesIn(item.id).length;
          const on = item.id === packageId && !query.trim();
          return (
            <Button
              key={item.id}
              type="button"
              onClick={() => setPackage(item.id, classesIn(item.id)[0]?.id ?? null)}
              sx={{
                flex: "0 0 auto",
                borderRadius: 999,
                border: "1px solid",
                borderColor: on ? "text.primary" : "divider",
                bgcolor: on ? "text.primary" : "transparent",
                color: on ? "background.default" : "text.primary",
              }}
            >
              {item.name} · {count}
            </Button>
          );
        })}
      </Box>

      <Typography variant="h3">{pack.name}</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.8, mb: 2, maxWidth: 720 }}>{pack.summary}</Typography>
      <DiagramCanvas items={items} relations={relations} layout={pack.id === "journey" ? journeyLayout : undefined} />
      <Box sx={{ mt: 4, p: { xs: 2, md: 2.5 }, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
        {!selected && <Typography color="text.secondary">Select a class.</Typography>}
        {selected && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr 1fr" }, gap: { xs: 2, md: 4 } }}>
            <Box>
              <Typography sx={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary" }}>«{selected.stereotype}»</Typography>
              <Typography variant="h3" sx={{ fontStyle: selected.abstract ? "italic" : "normal" }}>{selected.name}</Typography>
              <Typography sx={{ mt: 1 }}>{selected.summary}</Typography>
            </Box>
            <Box>
              <Typography variant="h4">Does</Typography>
              {selected.methods.map((operation) => (
                <Box key={operation.name} sx={{ mt: 1.2 }}>
                  <Typography sx={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>{operation.name}: {operation.returns}</Typography>
                  <Typography variant="body2" color="text.secondary">{operation.detail}</Typography>
                </Box>
              ))}
            </Box>
            <Box>
              <Typography variant="h4">Links</Typography>
              {relationsTouching(selected.id).map((relation) => {
                const otherId = relation.from === selected.id ? relation.to : relation.from;
                const other = classById(otherId);
                return (
                  <Button key={relation.id} type="button" onClick={() => select(other.id, other.packageId)} sx={{ display: "flex", justifyContent: "flex-start", px: 0, color: "text.primary", textAlign: "left" }}>
                    {relation.kind} {other.name}
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>{relation.label}</Typography>
                  </Button>
                );
              })}
              {selected.collaborates && selected.collaborates.length > 0 && (
                <>
                  <Typography variant="h4" sx={{ mt: 2 }}>Works with</Typography>
                  {selected.collaborates.map((id) => {
                    const other = classById(id);
                    return (
                      <Button key={id} type="button" onClick={() => select(other.id, other.packageId)} sx={{ display: "block", px: 0, color: "text.primary", textAlign: "left" }}>
                        {other.name}
                      </Button>
                    );
                  })}
                </>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
