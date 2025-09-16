import { NextResponse } from "next/server"
import { xanoFetch } from "@/lib/xano"
import { getServerXanoToken } from "@/lib/server/xano-auth"

// Proxies to your "pages" group to list site pages for an org.
// Adjust the path to your Xano "pages list" endpoint if it differs.
const PAGES_GROUP = "pages" as const
const listPath = (orgId: string) => `/orgs/${encodeURIComponent(orgId)}/pages`

export async function GET(_: Request, { params }: { params: { orgId: string } }) {
  try {
    const token = await getServerXanoToken()
    const data = await xanoFetch({ group: PAGES_GROUP, path: listPath(params.orgId), token })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
