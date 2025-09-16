import { NextRequest, NextResponse } from 'next/server'

const XANO_BASE_URL = process.env.XANO_LIVE_SITE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR'
const XANO_AUTH_TOKEN = process.env.XANO_AUTH_TOKEN

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = parseInt(params.tenantId)

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Invalid tenant_id' },
        { status: 400 }
      )
    }

    // Fetch analytics data from Xano
    const response = await fetch(`${XANO_BASE_URL}/analytics?tenant_id=${tenantId}`, {
      headers: {
        'Authorization': `Bearer ${XANO_AUTH_TOKEN}`,
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Calculate additional metrics
    const analytics = {
      pageViews: data.page_views || 0,
      uniqueVisitors: data.unique_visitors || 0,
      adoptionInquiries: data.adoption_inquiries || 0,
      averageSessionDuration: data.avg_session_duration || 0,
      bounceRate: data.bounce_rate || 0,
      topPages: data.top_pages || [],
      recentActivity: data.recent_activity || [],
      conversionRate: data.adoption_inquiries && data.unique_visitors 
        ? ((data.adoption_inquiries / data.unique_visitors) * 100).toFixed(1)
        : 0
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = parseInt(params.tenantId)
    const { event_type, page_path, user_agent, referrer } = await request.json()

    if (!tenantId || !event_type) {
      return NextResponse.json(
        { error: 'tenant_id and event_type are required' },
        { status: 400 }
      )
    }

    // Log analytics event to Xano
    const response = await fetch(`${XANO_BASE_URL}/analytics/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XANO_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        tenant_id: tenantId,
        event_type,
        page_path,
        user_agent,
        referrer,
        timestamp: new Date().toISOString(),
        ip_address: request.ip || 'unknown'
      })
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to log analytics event' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Analytics logging error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
