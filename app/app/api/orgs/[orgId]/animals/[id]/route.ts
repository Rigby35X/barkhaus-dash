// app/api/orgs/[orgId]/animals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
// Update the import path if the file is actually located elsewhere, for example:
// Update the import path to the correct location of xano.ts
function dogsBase(): string {
  const base = process.env.XANO_GROUP_DOGS;
  if (!base) throw new Error("XANO_GROUP_DOGS not set in .env.local");
  return base;
}

// Dummy implementation of buildAuthHeader. Replace with your actual logic if needed.
function buildAuthHeader(req: NextRequest): Record<string, string> {
  // Example: extract token from headers/cookies and return as Authorization header
  const token = req.headers.get("authorization") || "";
  return token ? { Authorization: token } : {};
}
// Update the import path to the correct location of xano.ts

function detailUrl(base: string, orgId: string, id: string) {
  return `${base}/orgs/${encodeURIComponent(orgId)}/animals/${encodeURIComponent(id)}`;
}

// Passes through the response from fetch to NextResponse
async function passThrough(res: Response) {
  const contentType = res.headers.get("content-type");
  const status = res.status;
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    return NextResponse.json(data, { status });
  } else {
    const text = await res.text();
    return new NextResponse(text, { status, headers: { "content-type": contentType || "text/plain" } });
  }
}

export async function GET(req: NextRequest, { params }: { params: { orgId: string; id: string } }) {
  try {
    const base = dogsBase();
    const url = detailUrl(base, params.orgId, params.id);
    const headers: Record<string, string> = { "Content-Type": "application/json", ...buildAuthHeader(req) };
    const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
    return passThrough(res);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { orgId: string; id: string } }) {
  try {
    const base = dogsBase();
    const url = detailUrl(base, params.orgId, params.id);
    const body = await req.text();
    const headers: Record<string, string> = { "Content-Type": "application/json", ...buildAuthHeader(req) };
    const res = await fetch(url, { method: "POST", headers, body, cache: "no-store" });
    return passThrough(res);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { orgId: string; id: string } }) {
  try {
    const base = dogsBase();
    const url = detailUrl(base, params.orgId, params.id);
    const headers: Record<string, string> = { "Content-Type": "application/json", ...buildAuthHeader(req) };
    const res = await fetch(url, { method: "DELETE", headers, cache: "no-store" });
    return passThrough(res);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
