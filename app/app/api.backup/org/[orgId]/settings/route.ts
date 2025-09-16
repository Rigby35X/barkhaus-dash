import { NextResponse } from "next/server"
import { xanoFetch } from "@/lib/xano"
import { getServerXanoToken } from "@/lib/server/xano-auth"

// We will use the site_config group for org-level settings by default.
// Adjust the path to match your Xano routes exactly.
const SETTINGS_GROUP = "site_config" as const
const settingsPath = (orgId: string) => `/orgs/${encodeURIComponent(orgId)}/settings`

export async function GET(_: Request, { params }: { params: { orgId: string } }) {
  try {
    const { orgId } = params // No await needed
    const token = await getServerXanoToken()
    console.log({ orgId, token, path: settingsPath(orgId) })
    const data = await xanoFetch({ group: SETTINGS_GROUP, path: settingsPath(orgId), token })
    return NextResponse.json(data)
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { orgId: string } }) {
  try {
    const token = await getServerXanoToken()
    const body = await request.json()
    const data = await xanoFetch({
      group: SETTINGS_GROUP,
      path: settingsPath(params.orgId),
      token,
      init: { method: "PUT", body: JSON.stringify(body) },
    })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
