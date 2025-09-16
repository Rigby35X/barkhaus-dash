import { NextRequest, NextResponse } from 'next/server'
import { XANO_BASE_URL, xanoFetch } from '@/lib/xano'

// Expected Xano endpoint: GET /animals with optional ?q= &species= &limit= &offset=
// Map the result to { animals: [...] }

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const species = searchParams.get('species') || ''
    const limit = searchParams.get('limit') || '20'

    if (!XANO_BASE_URL) {
      // mock
      return NextResponse.json({ animals: [] })
    }

    const query = new URLSearchParams()
    if (q) query.set('q', q)
    if (species) query.set('species', species)
    if (limit) query.set('limit', limit)

    const data = await xanoFetch({ group: "primary", path: `/animals?${query.toString()}` })
    // If data is already the array:
    const animals = Array.isArray(data) ? data : data.animals || []
    return NextResponse.json({ animals })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
