"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { api, hasApi } from "@/lib/api";
import { brand } from "@/theme/tokens";
import { Reveal, SectionHeadline, SectionKicker } from "./motion";

type Role = "rider" | "driver";

type WaitlistForm = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  consent: boolean;
};

function blankForm(): WaitlistForm {
  return {
    fullName: "",
    phone: "",
    email: "",
    city: "",
    consent: false,
  };
}

export function WaitlistBand() {
  const dark = useTheme().palette.mode === "dark";
  const [role, setRole] = useState<Role>("rider");
  const [form, setForm] = useState<WaitlistForm>(blankForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  function patch<K extends keyof WaitlistForm>(key: K, value: WaitlistForm[K]) {
    setForm((current) => ({ ...blankForm(), ...current, [key]: value }));
    setError("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.consent) {
      setError("Tick the box so we can contact you on WhatsApp about the pilot.");
      return;
    }
    if (!hasApi()) {
      setError("Waitlist API is not configured yet.");
      return;
    }
    setLoading(true);
    setError("");
    setDone("");
    try {
      const body = await api<{ message?: string }>("/waitlist", {
        method: "POST",
        body: JSON.stringify({
          role,
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: role === "rider" ? form.email.trim() : undefined,
          city: form.city.trim(),
          source: "landing",
        }),
      });
      setDone(body.message || "You are on the waitlist.");
      setForm(blankForm());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join the waitlist.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      id="waitlist"
      component="section"
      sx={{
        maxWidth: 1180,
        mx: "auto",
        px: { xs: 2, md: 3 },
        pt: { xs: 12, md: 16 },
        pb: { xs: 10, md: 14 },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.9fr) minmax(0, 1.1fr)" },
          gap: { xs: 4, md: 6 },
          alignItems: "start",
        }}
      >
        <Reveal>
          <SectionKicker>Early access</SectionKicker>
          <SectionHeadline type lines={["Join the waitlist"]} maxWidth={420} />
          <Typography color="text.secondary" sx={{ mt: 1.8, maxWidth: 420, lineHeight: 1.55 }}>
            Abuja and Lagos first. Leave your WhatsApp number — we will reach out when seats open.
          </Typography>
        </Reveal>

        <Box
          component="form"
          onSubmit={(event) => void submit(event)}
          sx={{ display: "grid", gap: 1.6 }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 0.5,
              width: "fit-content",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            {([
              ["rider", "Passenger"],
              ["driver", "Driver"],
            ] as const).map(([value, label]) => {
              const active = role === value;
              return (
                <Button
                  key={value}
                  type="button"
                  onClick={() => {
                    setRole(value);
                    setDone("");
                    setError("");
                  }}
                  sx={{
                    borderRadius: 0,
                    px: 1.6,
                    py: 0.85,
                    fontWeight: 700,
                    bgcolor: "transparent",
                    color: active ? "text.primary" : "text.secondary",
                    borderBottom: "2px solid",
                    borderColor: active ? (dark ? brand.gold : brand.orange) : "transparent",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "transparent", boxShadow: "none" },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>

          <Typography color="text.secondary" sx={{ lineHeight: 1.5 }}>
            {role === "driver"
              ? "Drivers: name, WhatsApp number, and city / state."
              : "Passengers: name, WhatsApp number, city / state, and email."}
          </Typography>

          <TextField
            required
            label="Full name"
            value={form.fullName ?? ""}
            onChange={(event) => patch("fullName", event.target.value)}
            autoComplete="name"
          />
          <TextField
            required
            label="Phone number"
            helperText="WhatsApp preferred"
            placeholder="0803…"
            value={form.phone ?? ""}
            onChange={(event) => patch("phone", event.target.value)}
            autoComplete="tel"
            inputMode="tel"
          />
          <TextField
            required
            label="City / state"
            placeholder="e.g. Abuja, FCT"
            value={form.city ?? ""}
            onChange={(event) => patch("city", event.target.value)}
            autoComplete="address-level2"
          />
          {role === "rider" ? (
            <TextField
              required
              label="Email"
              type="email"
              value={form.email ?? ""}
              onChange={(event) => patch("email", event.target.value)}
              autoComplete="email"
            />
          ) : null}

          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(form.consent)}
                onChange={(event) => patch("consent", event.target.checked)}
                sx={{
                  color: dark ? brand.gold : brand.orange,
                  "&.Mui-checked": { color: dark ? brand.gold : brand.orange },
                }}
              />
            }
            label="Rapyd Ryd can contact me on WhatsApp about the pilot."
          />

          {error ? <Alert severity="error">{error}</Alert> : null}
          {done ? <Alert severity="success">{done}</Alert> : null}

          <Button
            type="submit"
            disabled={loading}
            sx={{
              mt: 0.5,
              minHeight: 52,
              borderRadius: 0,
              fontWeight: 700,
              bgcolor: dark ? brand.gold : brand.orange,
              color: dark ? brand.black : brand.orangeInk,
              "&:hover": { bgcolor: dark ? brand.goldDeep : brand.orangeHover },
            }}
          >
            {loading ? "Joining…" : role === "driver" ? "Join as a driver" : "Join as a passenger"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
