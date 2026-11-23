const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export function hasApi() {
  return apiBase.length > 0;
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBase) {
    throw new Error("API URL is not configured.");
  }
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    const message =
      body && typeof body === "object" && "message" in body
        ? Array.isArray((body as { message: unknown }).message)
          ? (body as { message: string[] }).message.join(", ")
          : String((body as { message: unknown }).message)
        : typeof body === "string" && body
          ? body
          : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return body as T;
}
