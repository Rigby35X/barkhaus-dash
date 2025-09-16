import { NextRequest, NextResponse } from 'next/server'
import { XANO_BASE_URL, xanoFetch } from '@/lib/xano'

// Adjust these to match your Xano endpoints
const PAGE_ELEMENTS_PATH = (slug: string) => `/pages/${slug}/elements`

function normalizeToMap(input: any): Record<string, any> {
  if (!input) return {}
  if (Array.isArray(input)) {
    return input.reduce((acc: Record<string, any>, item: any) => {
      if (item?.id) acc[item.id] = item
      return acc
    }, {})
  }
  if (input.elements && typeof input.elements === 'object') return input.elements
  return input
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params // ✅ Await params and destructure
    
    if (!XANO_BASE_URL) {
      // Return a minimal default for local/mock
      return NextResponse.json({ elements: {} })
    }
    
    // Use the proper xanoFetch object format
    const data = await xanoFetch({
      group: 'pages', // Specify which Xano group to use
      path: PAGE_ELEMENTS_PATH(slug)
    })
    const elements = normalizeToMap(data)
    return NextResponse.json({ elements })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params // ✅ Await params and destructure
    const { elements, userId } = await request.json()
    
    if (!elements) return NextResponse.json({ error: 'Missing elements' }, { status: 400 })
    if (!XANO_BASE_URL) {
      return NextResponse.json({ success: true })
    }
    
    const payload = { elements, userId }
    // Use the proper xanoFetch object format
    const data = await xanoFetch({
      group: 'pages', // Specify which Xano group to use
      path: PAGE_ELEMENTS_PATH(slug),
      init: { method: 'PUT', body: JSON.stringify(payload) }
    })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}