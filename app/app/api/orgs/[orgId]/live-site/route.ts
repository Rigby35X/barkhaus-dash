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
    
    const liveSite = await Xano.getLiveSite(orgId, token)
    
    return NextResponse.json(liveSite)
  } catch (error: any) {
    console.error('Failed to get live site:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const snapshot = await request.json()
    const token = await getServerXanoToken()
    
    if (!snapshot) {
      return NextResponse.json({ error: 'Missing snapshot data' }, { status: 400 })
    }

    const liveSite = await Xano.publishLiveSite(snapshot, orgId, token)
    
    return NextResponse.json(liveSite)
  } catch (error: any) {
    console.error('Failed to update live site:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
