import { NextResponse } from "next/server"
import { xanoFetch } from "@/lib/xano"
import { getServerXanoToken } from "@/lib/server/xano-auth"

// Default to "primary" or another group if your events live elsewhere.
// If events are part of "live_site" for published listings, flip the group below.
const EVENTS_GROUP = "primary" as const
const eventsPath = (orgId: string) => `/orgs/${encodeURIComponent(orgId)}/events`

export async function GET(_: Request, { params }: { params: { orgId: string } }) {
  try {
    const token = await getServerXanoToken()
    const data = await xanoFetch({ group: EVENTS_GROUP, path: eventsPath(params.orgId), token })
    const events = Array.isArray(data) ? data : data.events || []
    return NextResponse.json({ events })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
