import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'

interface GivebutterWebhookPayload {
  event: string
  data: {
    id: string
    campaign_id: string
    amount: number
    currency: string
    donor: {
      first_name?: string
      last_name?: string
      email?: string
    }
    created_at: string
    message?: string
  }
}

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false
  
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const signature = headersList.get('x-givebutter-signature')
    const webhookSecret = process.env.GIVEBUTTER_WEBHOOK_SECRET
    
    // Get raw body for signature verification
    const body = await request.text()
    
    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(body, signature, webhookSecret)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    // Parse the webhook payload
    const payload: GivebutterWebhookPayload = JSON.parse(body)
    
    console.log('Received Givebutter webhook:', {
      event: payload.event,
      campaignId: payload.data.campaign_id,
      amount: payload.data.amount,
      donor: payload.data.donor
    })

    // Handle different webhook events
    switch (payload.event) {
      case 'donation.created':
        await handleDonationCreated(payload.data)
        break
      
      case 'donation.updated':
        await handleDonationUpdated(payload.data)
        break
      
      case 'campaign.updated':
        await handleCampaignUpdated(payload.data)
        break
      
      default:
        console.log(`Unhandled webhook event: ${payload.event}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook processing failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handleDonationCreated(data: GivebutterWebhookPayload['data']) {
  try {
    // Here you could:
    // 1. Store the donation in your database
    // 2. Send thank you emails
    // 3. Update campaign statistics
    // 4. Trigger notifications to admins
    // 5. Update live donation widgets on the site
    
    console.log('New donation received:', {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      donor: data.donor,
      campaign: data.campaign_id
    })

    // Example: Store in database (you would implement this based on your needs)
    // await storeDonation({
    //   givebutter_id: data.id,
    //   campaign_id: data.campaign_id,
    //   amount: data.amount,
    //   currency: data.currency,
    //   donor_name: `${data.donor.first_name} ${data.donor.last_name}`.trim(),
    //   donor_email: data.donor.email,
    //   message: data.message,
    //   created_at: data.created_at
    // })

    // Example: Send notification to admin
    // await sendAdminNotification({
    //   type: 'new_donation',
    //   amount: data.amount,
    //   donor: data.donor,
    //   campaign: data.campaign_id
    // })

  } catch (error) {
    console.error('Failed to handle donation created:', error)
    throw error
  }
}

async function handleDonationUpdated(data: GivebutterWebhookPayload['data']) {
  try {
    console.log('Donation updated:', {
      id: data.id,
      amount: data.amount,
      campaign: data.campaign_id
    })

    // Update donation record in database
    // await updateDonation(data.id, {
    //   amount: data.amount,
    //   updated_at: new Date().toISOString()
    // })

  } catch (error) {
    console.error('Failed to handle donation updated:', error)
    throw error
  }
}

async function handleCampaignUpdated(data: GivebutterWebhookPayload['data']) {
  try {
    console.log('Campaign updated:', {
      campaign: data.campaign_id
    })

    // Refresh campaign statistics
    // This could trigger a cache invalidation or update
    // await refreshCampaignStats(data.campaign_id)

  } catch (error) {
    console.error('Failed to handle campaign updated:', error)
    throw error
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Givebutter webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
