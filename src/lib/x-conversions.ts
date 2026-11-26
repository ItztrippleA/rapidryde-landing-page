import { createHash } from "node:crypto";

/** X Ads pixel id (path segment on ads-api.x.com/…/conversions/{id}). */
export const X_PIXEL_ID =
  process.env.X_PIXEL_ID?.trim() ||
  process.env.NEXT_PUBLIC_X_PIXEL_ID?.trim() ||
  "rkd7i";

export type XConversionKind = "pageview" | "lead";

/** Map logical events → X event_id (`tw-{pixel}-{tag}` from Ads Manager). */
function eventIdFor(kind: XConversionKind): string {
  const fromEnv =
    kind === "pageview"
      ? process.env.X_EVENT_ID_PAGEVIEW?.trim()
      : process.env.X_EVENT_ID_LEAD?.trim();
  if (fromEnv) return fromEnv;
  // Fallback tags — replace with Ads Manager values via env when ready.
  return kind === "pageview" ? `tw-${X_PIXEL_ID}-pageview` : `tw-${X_PIXEL_ID}-lead`;
}

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Normalize then hash email for X CAPI. */
export function hashEmail(email?: string | null): string | undefined {
  const normalized = String(email || "")
    .trim()
    .toLowerCase();
  if (!normalized || !normalized.includes("@")) return undefined;
  return sha256Hex(normalized);
}

/** Digits-only phone hash (best-effort; E.164 preferred when known). */
export function hashPhone(phone?: string | null): string | undefined {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 8) return undefined;
  return sha256Hex(digits);
}

export type XConversionInput = {
  kind: XConversionKind;
  eventSourceUrl?: string;
  conversionId?: string;
  twclid?: string | null;
  email?: string | null;
  phone?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function sendXConversion(input: XConversionInput): Promise<{ ok: boolean; status?: number; skipped?: string }> {
  const token = process.env.X_PIXEL_TOKEN?.trim();
  if (!token) {
    return { ok: false, skipped: "X_PIXEL_TOKEN not configured" };
  }

  const hashedEmail = hashEmail(input.email);
  const hashedPhone = hashPhone(input.phone);
  const twclid = String(input.twclid || "").trim() || undefined;
  const ip = String(input.ipAddress || "").trim() || undefined;
  const ua = String(input.userAgent || "").trim() || undefined;

  if (!twclid && !hashedEmail && !hashedPhone && !(ip && ua)) {
    return { ok: false, skipped: "Need twclid, hashed email/phone, or ip+user_agent" };
  }

  const identifiers: Record<string, string> = {};
  if (twclid) identifiers.twclid = twclid;
  if (hashedEmail) identifiers.hashed_email = hashedEmail;
  if (hashedPhone) identifiers.hashed_phone_number = hashedPhone;
  if (ip) identifiers.ip_address = ip;
  if (ua) identifiers.user_agent = ua;

  const conversion: Record<string, unknown> = {
    conversion_time: new Date().toISOString(),
    event_id: eventIdFor(input.kind),
    identifiers: [identifiers],
  };
  if (input.eventSourceUrl) conversion.event_source_url = input.eventSourceUrl;
  if (input.conversionId) conversion.conversion_id = input.conversionId;

  const response = await fetch(`https://ads-api.x.com/12/measurement/conversions/${X_PIXEL_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Pixel-Token": token,
    },
    body: JSON.stringify({ conversions: [conversion] }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("[x-conversion]", response.status, text.slice(0, 400));
    return { ok: false, status: response.status };
  }

  return { ok: true, status: response.status };
}
