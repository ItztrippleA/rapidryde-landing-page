/** Browser helper — posts to our Next route (token stays server-side). */
export function trackXConversion(input: {
  kind: "pageview" | "lead";
  conversionId?: string;
  email?: string;
  phone?: string;
}) {
  if (typeof window === "undefined") return;

  let twclid: string | undefined;
  try {
    const match = document.cookie.match(/(?:^|; )twclid=([^;]*)/);
    twclid = match ? decodeURIComponent(match[1]) : undefined;
  } catch {
    twclid = undefined;
  }

  void fetch("/api/x-conversion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind: input.kind,
      eventSourceUrl: window.location.href,
      conversionId: input.conversionId,
      twclid,
      email: input.email,
      phone: input.phone,
    }),
    keepalive: true,
  }).catch(() => {
    /* best-effort */
  });
}
