import { NextResponse } from 'next/server'
import { XANO_BASE_URL, xanoFetch } from '@/lib/xano'

// Expected Xano endpoint: GET /events
export async function GET() {
  try {
    if (!XANO_BASE_URL) {
      return NextResponse.json({ events: [] })
    }
    const data = await xanoFetch({ group: 'primary', path: '/events' })
    const events = Array.isArray(data) ? data : data.events || []
    return NextResponse.json({ events })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
