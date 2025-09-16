import { NextRequest, NextResponse } from 'next/server'
import { Xano } from '@/lib/xanoClient'
import { getServerXanoToken } from '@/lib/server/xano-auth'

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const token = await getServerXanoToken()
    
    const designSettings = await Xano.getDesignSettings(orgId, token)
    
    return NextResponse.json(designSettings)
  } catch (error: any) {
    console.error('Failed to get design settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const settings = await request.json()
    const token = await getServerXanoToken()
    
    if (!settings) {
      return NextResponse.json({ error: 'Missing settings data' }, { status: 400 })
    }

    // Ensure tenant_id is set
    const settingsWithTenant = {
      ...settings,
      tenant_id: parseInt(orgId),
      updated_at: new Date().toISOString()
    }

    const updatedSettings = await Xano.saveDesignSettings(settingsWithTenant, orgId, token)
    
    return NextResponse.json(updatedSettings)
  } catch (error: any) {
    console.error('Failed to save design settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
