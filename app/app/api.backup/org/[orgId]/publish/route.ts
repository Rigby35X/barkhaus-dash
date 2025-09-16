import { NextRequest, NextResponse } from 'next/server'
import { xanoFetch } from '@/lib/xano'
import { getServerXanoToken } from '@/lib/server/xano-auth'

// Adjust to your real publish endpoint (often in "live_site" group or a pages workflow endpoint).
const PUBLISH_GROUP = 'live_site' as const
const publishPath = (orgId: string) => `/orgs/${encodeURIComponent(orgId)}/publish`

export async function POST(req: NextRequest, { params }: { params: { orgId: string } }) {
  try {
    const token = await getServerXanoToken()
    const body = await req.json().catch(() => ({}))
    const data = await xanoFetch({
      group: PUBLISH_GROUP,
      path: publishPath(params.orgId),
      token,
      init: { method: 'POST', body: JSON.stringify(body) },
    })
    return NextResponse.json({ success: true, ...data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
