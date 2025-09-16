import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return empty object for mock mode
    return NextResponse.json({})
  } catch {
    return NextResponse.json({ error: 'Failed to load Xano settings' }, { status: 500 })
  }
}
