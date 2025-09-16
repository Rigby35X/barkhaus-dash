import { NextRequest, NextResponse } from "next/server";
import { baseFor } from "@/lib/xano-groups";

// Always return a plain Record<string,string> (no undefineds)
function buildAuthHeader(req: NextRequest): Record<string, string> {
  const h: Record<string, string> = {};
  const incoming = req.headers.get("authorization");
  if (incoming) {
    h.Authorization = incoming;
    return h;
  }
  const envToken = process.env.XANO_API_KEY?.trim();
  if (envToken) {
    h.Authorization = `Bearer ${envToken}`;
  }
  return h; // may be empty {}, but never has undefined values
}

function dogsBase(): string | undefined {
  return (typeof baseFor === "function" ? baseFor("dogs") : undefined)
    || process.env.XANO_GROUP_DOGS;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const base = dogsBase();
  if (!base) {
    return NextResponse.json(
      { error: "XANO_GROUP_DOGS not set. Define it in .env.local" },
      { status: 500 }
    );
  }

  const qs = req.nextUrl.searchParams.toString();
  const url = `${base}/orgs/${encodeURIComponent(params.orgId)}/animals${qs ? `?${qs}` : ""}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...buildAuthHeader(req), // safe: no undefineds
  };

  const res = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }
  return NextResponse.json(await res.json());
}

export async function POST(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const base = dogsBase();
  if (!base) {
    return NextResponse.json(
      { error: "XANO_GROUP_DOGS not set. Define it in .env.local" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const url = `${base}/orgs/${encodeURIComponent(params.orgId)}/animals`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...buildAuthHeader(req), // safe: no undefineds
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }
  return NextResponse.json(await res.json());
}
