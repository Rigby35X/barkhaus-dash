import { NextResponse } from 'next/server'
import { XANO_BASE_URL, xanoFetch } from '@/lib/xano'

const SETTINGS_PATH = '/settings' // adjust if your Xano path differs

export async function GET() {
  try {
    if (!XANO_BASE_URL) {
      // fallback mock
      return NextResponse.json({
        orgName: 'Barkhaus',
        tagline: 'Caring for pets. Building forever homes.',
        logoUrl: '/placeholder.svg?height=32&width=120',
        primaryColor: '#16a34a',
        secondaryColor: '#0f766e',
        fontBody: 'Inter, ui-sans-serif, system-ui',
        fontHeading: 'Poppins, ui-sans-serif, system-ui',
        addressLine1: '1234 Wagging Tail Rd',
        addressLine2: 'Barkville, BH 00000',
        email: 'hello@barkhaus.com',
        phone: '(555) 123-4567',
      })
    }
    const data = await xanoFetch(SETTINGS_PATH)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    if (!XANO_BASE_URL) return NextResponse.json(body) // noop in mock mode
    const data = await xanoFetch(SETTINGS_PATH, { method: 'PUT', body: JSON.stringify(body) })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
