import { NextRequest, NextResponse } from 'next/server'
import { XANO_BASE_URL } from '@/lib/xano'

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    if (!XANO_BASE_URL) {
      // Mock page content structure; map this to your Xano schema
      return NextResponse.json({
        slug: params.slug,
        elements: {},
      })
    }
    const res = await fetch(`${XANO_BASE_URL}/pages/${params.slug}`, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load Xano page' }, { status: 500 })
  }
}
