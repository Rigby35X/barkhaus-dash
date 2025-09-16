import { NextRequest, NextResponse } from 'next/server'

const XANO_BASE_URL = process.env.XANO_LIVE_SITE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR'
const XANO_AUTH_TOKEN = process.env.XANO_AUTH_TOKEN

export async function POST(request: NextRequest) {
  try {
    const { tenant_id } = await request.json()

    if (!tenant_id) {
      return NextResponse.json(
        { success: false, error: 'tenant_id is required' },
        { status: 400 }
      )
    }

    // Call Xano AI generation endpoint
    const response = await fetch(`${XANO_BASE_URL}/ai/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XANO_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ tenant_id })
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: result.error || 'AI generation failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
