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
    
    const history = await Xano.getLiveSiteHistory(orgId, token)
    
    return NextResponse.json(history)
  } catch (error: any) {
    console.error('Failed to get live site history:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
