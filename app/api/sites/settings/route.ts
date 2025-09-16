import { NextRequest, NextResponse } from 'next/server'

const XANO_BASE_URL = process.env.XANO_LIVE_SITE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR'
const XANO_AUTH_TOKEN = process.env.XANO_AUTH_TOKEN

export async function POST(request: NextRequest) {
  try {
    const { tenant_id, custom_domain, is_published } = await request.json()

    if (!tenant_id) {
      return NextResponse.json(
        { success: false, error: 'tenant_id is required' },
        { status: 400 }
      )
    }

    // Update organization settings
    const orgResponse = await fetch(`${XANO_BASE_URL}/update-organization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XANO_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        tenant_id,
        custom_domain: custom_domain || null,
        is_active: is_published
      })
    })

    if (!orgResponse.ok) {
      const error = await orgResponse.json()
      return NextResponse.json(
        { success: false, error: error.message || 'Settings update failed' },
        { status: orgResponse.status }
      )
    }

    // If publishing status changed, update all pages
    if (is_published !== undefined) {
      await fetch(`${XANO_BASE_URL}/publish-site`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${XANO_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          tenant_id,
          status: is_published ? 'published' : 'draft'
        })
      })
    }

    // Verify custom domain if provided
    let domainVerified = false
    if (custom_domain) {
      domainVerified = await verifyCustomDomain(custom_domain)
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      domain_verified: domainVerified
    })

  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function verifyCustomDomain(domain: string): Promise<boolean> {
  try {
    // Simple DNS verification - check if domain resolves
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    return response.ok
  } catch (error) {
    console.log(`Domain verification failed for ${domain}:`, error)
    return false
  }
}
