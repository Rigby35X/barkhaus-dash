import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params
    
    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
    }

    // Get Givebutter API key from environment
    const apiKey = process.env.GIVEBUTTER_API_KEY
    
    if (!apiKey) {
      // Return mock data if no API key is configured
      return NextResponse.json({
        raised: 6500,
        goal: 10000,
        donors: 127,
        percentage: 65,
        mock: true
      })
    }

    // Call Givebutter API to get campaign stats
    const response = await fetch(`https://api.givebutter.com/v1/campaigns/${campaignId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Givebutter API error: ${response.status}`)
    }

    const campaignData = await response.json()
    
    // Transform Givebutter response to our format
    const stats = {
      raised: campaignData.amount_raised || 0,
      goal: campaignData.goal_amount || 0,
      donors: campaignData.supporter_count || 0,
      percentage: campaignData.goal_amount 
        ? Math.round((campaignData.amount_raised / campaignData.goal_amount) * 100)
        : 0
    }

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Failed to fetch Givebutter campaign stats:', error)
    
    // Return mock data on error
    return NextResponse.json({
      raised: 6500,
      goal: 10000,
      donors: 127,
      percentage: 65,
      error: error.message,
      mock: true
    })
  }
}
