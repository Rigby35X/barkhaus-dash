import { NextRequest, NextResponse } from "next/server"
import { xanoFetch } from "@/lib/xano"
import { getServerXanoToken } from "@/lib/server/xano-auth"

// We use the pages group for editable page elements by default.
const PAGES_GROUP = "pages" as const
const pageElementsPath = (orgId: string, slug: string) =>
  `/orgs/${encodeURIComponent(orgId)}/pages/${encodeURIComponent(slug)}/elements`

function toMap(input: any): Record<string, any> {
  if (!input) return {}
  if (Array.isArray(input)) {
    return input.reduce((acc: Record<string, any>, item: any) => {
      if (item?.id) acc[item.id] = item
      return acc
    }, {})
  }
  if (input.elements && typeof input.elements === "object") return input.elements
  return input
}

export async function GET(_: NextRequest, { params }: { params: { orgId: string; slug: string } }) {
  try {
    const token = await getServerXanoToken()
    const data = await xanoFetch({
      group: PAGES_GROUP,
      path: pageElementsPath(params.orgId, params.slug),
      token,
    })
    return NextResponse.json({ elements: toMap(data) })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { orgId: string; slug: string } }) {
  try {
    const token = await getServerXanoToken()
    const body = await request.json() // { elements, userId }
    if (!body?.elements) return NextResponse.json({ error: "Missing elements" }, { status: 400 })
    const data = await xanoFetch({
      group: PAGES_GROUP,
      path: pageElementsPath(params.orgId, params.slug),
      token,
      init: { method: "PUT", body: JSON.stringify(body) },
    })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
