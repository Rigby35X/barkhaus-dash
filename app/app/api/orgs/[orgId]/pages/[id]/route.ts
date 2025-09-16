import { NextRequest, NextResponse } from "next/server";
import { baseFor } from "@/lib/xano-groups";

function buildAuthHeader(req: NextRequest): Record<string, string> {
  const h: Record<string, string> = {};
  const incoming = req.headers.get("authorization");
  if (incoming) { h.Authorization = incoming; return h; }
  const envToken = process.env.XANO_API_KEY?.trim();
  if (envToken) h.Authorization = `Bearer ${envToken}`;
  return h;
}

function pagesBase(): string | undefined {
  return (typeof baseFor === "function" ? baseFor("pages") : undefined)
    || process.env.XANO_GROUP_PAGES;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string; id: string } }
) {
  const base = pagesBase();
  if (!base) return NextResponse.json({ error: "XANO_GROUP_PAGES not set" }, { status: 500 });

  const url = `${base}/orgs/${encodeURIComponent(params.orgId)}/pages/${encodeURIComponent(params.id)}`;
  const headers: Record<string, string> = { "Content-Type": "application/json", ...buildAuthHeader(req) };

  const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status });
  return NextResponse.json(await res.json());
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { orgId: string; id: string } }
) {
  const base = pagesBase();
  if (!base) return NextResponse.json({ error: "XANO_GROUP_PAGES not set" }, { status: 500 });

  const body = await req.json();
  const url = `${base}/orgs/${encodeURIComponent(params.orgId)}/pages/${encodeURIComponent(params.id)}`;
  const headers: Record<string, string> = { "Content-Type": "application/json", ...buildAuthHeader(req) };

  const res = await fetch(url, { method: "PUT", headers, body: JSON.stringify(body), cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status });
  return NextResponse.json(await res.json());
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { orgId: string; id: string } }
) {
  const base = pagesBase();
  if (!base) return NextResponse.json({ error: "XANO_GROUP_PAGES not set" }, { status: 500 });

  const url = `${base}/orgs/${encodeURIComponent(params.orgId)}/pages/${encodeURIComponent(params.id)}`;
  const headers: Record<string, string> = { "Content-Type": "application/json", ...buildAuthHeader(req) };

  const res = await fetch(url, { method: "DELETE", headers, cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status });
  return NextResponse.json(await res.json());
}
