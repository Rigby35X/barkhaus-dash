import { NextResponse } from 'next/server'
import { XANO_GROUPS } from '@/lib/xano-groups'
import { getServerXanoToken } from '@/lib/server/xano-auth'

export async function GET() {
  try {
    // Check if token exists
    let tokenDetected = false
    try {
      const token = await getServerXanoToken()
      tokenDetected = !!token
    } catch {
      tokenDetected = false
    }

    // Get environment variables
    const env = {
      defaultOrgId: process.env.NEXT_PUBLIC_DEFAULT_ORG_ID,
      orgPrefix: process.env.XANO_ORG_PREFIX || '/orgs'
    }

    // Check Xano groups configuration
    const groups: Record<string, string | undefined> = {}
    Object.entries(XANO_GROUPS).forEach(([key, value]) => {
      groups[key] = value
    })

    return NextResponse.json({
      groups,
      tokenDetected,
      env,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      groups: {},
      tokenDetected: false,
      env: {}
    })
  }
}