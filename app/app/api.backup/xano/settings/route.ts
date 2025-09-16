import { NextResponse } from 'next/server'
import { XANO_BASE_URL } from '@/lib/xano'

export async function GET() {
  try {
    if (!XANO_BASE_URL) {
      return NextResponse.json({}) // falls back to mock in /api/site-settings
    }
    const res = await fetch(`${XANO_BASE_URL}/settings`, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to load Xano settings' }, { status: 500 })
  }
}
