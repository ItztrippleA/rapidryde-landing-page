import { NextRequest, NextResponse } from "next/server";
import { sendXConversion, type XConversionKind } from "@/lib/x-conversions";

export const runtime = "nodejs";

type Body = {
  kind?: XConversionKind;
  eventSourceUrl?: string;
  conversionId?: string;
  twclid?: string;
  email?: string;
  phone?: string;
};

function clientIp(request: NextRequest): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || undefined;
}

export async function POST(request: NextRequest) {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    body = {};
  }

  const kind: XConversionKind = body.kind === "lead" ? "lead" : "pageview";
  const cookieTwclid = request.cookies.get("twclid")?.value;
  const twclid = body.twclid || cookieTwclid || undefined;

  const result = await sendXConversion({
    kind,
    eventSourceUrl: body.eventSourceUrl || request.headers.get("referer") || undefined,
    conversionId: body.conversionId,
    twclid,
    email: body.email,
    phone: body.phone,
    ipAddress: clientIp(request),
    userAgent: request.headers.get("user-agent"),
  });

  if (result.skipped) {
    return NextResponse.json({ ok: false, skipped: result.skipped }, { status: 200 });
  }
  if (!result.ok) {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
