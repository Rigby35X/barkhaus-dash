import { NextRequest, NextResponse } from 'next/server'

const XANO_BASE_URL = process.env.XANO_LIVE_SITE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR'
const XANO_AUTH_TOKEN = process.env.XANO_AUTH_TOKEN

export async function POST(request: NextRequest) {
  try {
    const { tenant_id, action = 'publish' } = await request.json()

    if (!tenant_id) {
      return NextResponse.json(
        { success: false, error: 'tenant_id is required' },
        { status: 400 }
      )
    }

    // Call Xano to update page status
    const response = await fetch(`${XANO_BASE_URL}/publish-site`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XANO_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ 
        tenant_id,
        status: action === 'publish' ? 'published' : 'draft'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { success: false, error: error.message || 'Publishing failed' },
        { status: response.status }
      )
    }

    const result = await response.json()

    // Log analytics event
    await logAnalyticsEvent(tenant_id, action === 'publish' ? 'site_published' : 'site_unpublished')

    return NextResponse.json({
      success: true,
      message: `Site ${action}ed successfully`,
      ...result
    })

  } catch (error) {
    console.error('Publishing error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function logAnalyticsEvent(tenantId: number, event: string) {
  try {
    await fetch(`${XANO_BASE_URL}/analytics/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XANO_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        tenant_id: tenantId,
        event_type: event,
        timestamp: new Date().toISOString()
      })
    })
  } catch (error) {
    console.error('Analytics logging failed:', error)
  }
}
