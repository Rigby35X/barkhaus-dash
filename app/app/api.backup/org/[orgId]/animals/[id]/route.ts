import { NextResponse } from "next/server"
import { xanoFetch } from "@/lib/xano"
import { getServerXanoToken } from "@/lib/server/xano-auth"

const ANIMALS_GROUP = "dogs" as const
const animalPath = (orgId: string, id: string) => `/orgs/${encodeURIComponent(orgId)}/animals/${encodeURIComponent(id)}`

export async function GET(_: Request, { params }: { params: { orgId: string; id: string } }) {
  try {
    const token = await getServerXanoToken()
    const data = await xanoFetch({ group: ANIMALS_GROUP, path: animalPath(params.orgId, params.id), token })
    const animal = data?.animal ?? data
    return NextResponse.json({ animal })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
