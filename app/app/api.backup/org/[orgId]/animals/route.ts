import { NextRequest, NextResponse } from "next/server"
import { xanoFetch } from "@/lib/xano"
import { getServerXanoToken } from "@/lib/server/xano-auth"

// Use the dogs group for animals.
const ANIMALS_GROUP = "dogs" as const
const animalsPath = (orgId: string, qs: string) => `/orgs/${encodeURIComponent(orgId)}/animals${qs ? `?${qs}` : ""}`

export async function GET(req: NextRequest, { params }: { params: { orgId: string } }) {
  try {
    const token = await getServerXanoToken()
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q") || ""
    const species = searchParams.get("species") || ""
    const limit = searchParams.get("limit") || "24"
    const query = new URLSearchParams()
    if (q) query.set("q", q)
    if (species) query.set("species", species)
    if (limit) query.set("limit", limit)

    const data = await xanoFetch({
      group: ANIMALS_GROUP,
      path: animalsPath(params.orgId, query.toString()),
      token,
    })
    const animals = Array.isArray(data) ? data : data.animals || []
    return NextResponse.json({ animals })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
