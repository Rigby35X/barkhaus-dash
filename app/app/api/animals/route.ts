import { NextRequest, NextResponse } from "next/server";
import { baseFor } from "@/lib/xano-groups"; // if you have it

// Tiny helper: only attach Authorization when we actually have a token.
function buildAuthHeader(req: NextRequest) {
  // 1) Prefer incoming user token (if you ever forward it)
  const incoming = req.headers.get("authorization");
  if (incoming) return { Authorization: incoming };

  // 2) Else use a server token from .env (only if you set it later)
  const envToken = process.env.XANO_API_KEY?.trim();
  if (envToken) return { Authorization: `Bearer ${envToken}` };

  // 3) Public mode (no auth header)
  return {};
}

export async function GET(req: NextRequest) {
  const orgId = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID || "1";

  // Use your helper if available; otherwise fall back to env var
  const base =
    (typeof baseFor === "function" ? baseFor("dogs") : undefined) ||
    process.env.XANO_GROUP_DOGS;

  if (!base) {
    return NextResponse.json(
      { error: "XANO base URL not set. Define XANO_GROUP_DOGS or use baseFor('dogs')." },
      { status: 500 }
    );
  }

  const apiUrl = `${base}/orgs/${orgId}/animals`;

  const res = await fetch(apiUrl, {
    method: "GET",
    headers: (() => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const authHeader = buildAuthHeader(req);
      if (authHeader.Authorization) {
        headers["Authorization"] = authHeader.Authorization;
      }
      return headers;
    })(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
