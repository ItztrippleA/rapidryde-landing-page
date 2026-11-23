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
import { motion, useReducedMotion } from "framer-motion";
import { api, hasApi } from "@/lib/api";
import { brand } from "@/theme/tokens";

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
  const reduce = useReducedMotion();
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
        pt: { xs: 6, md: 8 },
        pb: { xs: 8, md: 12 },
      }}
    >
      <Box
        component={motion.div}
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.92fr) minmax(0, 1.08fr)" },
          gap: { xs: 3, md: 5 },
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            position: "relative",
            borderRadius: "28px",
            overflow: "hidden",
            minHeight: { xs: 420, md: 560 },
            bgcolor: "#f4f4f2",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {reduce ? (
            <Box
              component="img"
              src="/brand/deer-leap-poster.png"
              alt=""
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 45%",
              }}
            />
          ) : (
            <Box
              component="video"
              src="/brand/deer-leap.mp4"
              poster="/brand/deer-leap-poster.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 45%",
              }}
            />
          )}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(12,10,8,0.08) 0%, rgba(12,10,8,0.18) 42%, rgba(12,10,8,0.78) 100%)",
              pointerEvents: "none",
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1, p: { xs: 3, md: 4.5 } }}>
            <Typography sx={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, opacity: 0.85 }}>
              Early access
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                fontFamily: "var(--font-sora), Sora, sans-serif",
                fontWeight: 700,
                fontSize: { xs: "2.2rem", md: "3rem" },
                lineHeight: 1.05,
                maxWidth: 420,
              }}
            >
              Rapyd Ryd
            </Typography>
            <Typography sx={{ mt: 1.2, fontSize: { xs: "1.15rem", md: "1.35rem" }, fontWeight: 600, maxWidth: 420, lineHeight: 1.35 }}>
              Join the waitlist for passengers and drivers.
            </Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 420, opacity: 0.9, lineHeight: 1.55 }}>
              Abuja and Lagos first. Leave your WhatsApp number — we will reach out when seats open.
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={(event) => void submit(event)}
          sx={{
            p: { xs: 2.4, md: 3.2 },
            borderRadius: "28px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            display: "grid",
            gap: 1.6,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 0.5,
              borderRadius: 999,
              bgcolor: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              width: "fit-content",
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
                    borderRadius: 999,
                    px: 2,
                    py: 0.85,
                    fontWeight: 700,
                    bgcolor: active ? (dark ? brand.gold : brand.lemon) : "transparent",
                    color: active ? brand.black : "text.primary",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: active ? (dark ? brand.goldDeep : "#C6DE4A") : "action.hover",
                      boxShadow: "none",
                    },
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
              borderRadius: 999,
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
