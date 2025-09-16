import { NextRequest, NextResponse } from 'next/server'
import { xanoFetch } from '@/lib/xano'
import { getServerXanoToken } from '@/lib/server/xano-auth'

const EVENTS_GROUP = 'primary' as const // Adjust if events are in a different group
const eventsPath = (orgId: string) => `/orgs/${encodeURIComponent(orgId)}/events`

export async function GET(request: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  try {
    const { orgId } = await params // ✅ Await params and destructure
    const token = await getServerXanoToken()
    
    // Extract query parameters for filtering
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    let path = eventsPath(orgId)
    const queryParams = new URLSearchParams()
    if (limit) queryParams.set('limit', limit)
    if (status) queryParams.set('status', status)
    if (startDate) queryParams.set('startDate', startDate)
    if (endDate) queryParams.set('endDate', endDate)
    
    if (queryParams.toString()) {
      path += `?${queryParams.toString()}`
    }
    
    const data = await xanoFetch({ group: EVENTS_GROUP, path, token })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  try {
    const { orgId } = await params // ✅ Await params and destructure
    const token = await getServerXanoToken()
    const body = await request.json()
    
    const data = await xanoFetch({
      group: EVENTS_GROUP,
      path: eventsPath(orgId),
      token,
      init: { method: 'POST', body: JSON.stringify(body) },
    })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}