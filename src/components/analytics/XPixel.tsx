"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const TWCLID_COOKIE = "twclid";
const TWCLID_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${TWCLID_MAX_AGE_SEC}; SameSite=Lax`;
}

/** Persist twclid from the ad click URL and fire X CAPI PageView via our API. */
export function XPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromQuery = searchParams.get("twclid")?.trim();
    if (fromQuery) writeCookie(TWCLID_COOKIE, fromQuery);
    const twclid = fromQuery || readCookie(TWCLID_COOKIE);

    void fetch("/api/x-conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "pageview",
        eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
        twclid,
      }),
      keepalive: true,
    }).catch(() => {
      /* ignore network errors — ads measurement is best-effort */
    });
  }, [pathname, searchParams]);

  return null;
}
