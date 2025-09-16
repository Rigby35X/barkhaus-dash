import { NextResponse } from 'next/server'
import { xanoFetch } from '@/lib/xano'

const SETTINGS_PATH = '/settings' // adjust if your Xano path differs

export async function GET() {
  try {
    // Always return mock data for now to prevent undefined URL errors
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
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    // Return the body as-is for mock mode
    return NextResponse.json(body)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
