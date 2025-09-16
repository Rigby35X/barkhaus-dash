import { NextRequest, NextResponse } from 'next/server'
import { Xano } from '@/lib/xanoClient'
import { getServerXanoToken } from '@/lib/server/xano-auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  try {
    const { orgId } = await params
    const { pageSlug } = await request.json()
    const token = await getServerXanoToken()

    if (!pageSlug) {
      return NextResponse.json({ error: 'Missing pageSlug' }, { status: 400 })
    }

    // Get all pages to find the one to publish
    const pages = await Xano.listPages(orgId, token)
    const pageToPublish = pages.find(p => p.slug === pageSlug)

    if (!pageToPublish) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Get current design settings
    const designSettings = await Xano.getDesignSettings(orgId, token)

    // Get site configuration
    const siteConfig = await Xano.getSiteConfig(orgId, token)

    // Create a snapshot of the current state
    const snapshot = {
      tenant_id: parseInt(orgId),
      snapshot_data: JSON.stringify({
        pages: pages.filter(p => p.published), // Only include published pages
        designSettings,
        siteConfig,
        publishedAt: new Date().toISOString(),
        publishedPage: pageToPublish
      }),
      version: Date.now(), // Use timestamp as version
      published_at: new Date().toISOString()
    }

    // Save the live site snapshot
    const liveSite = await Xano.publishLiveSite(snapshot, orgId, token)

    // Mark the page as published if it wasn't already
    if (!pageToPublish.published) {
      await Xano.updatePage(
        pageToPublish.id,
        { published: true },
        orgId,
        token
      )
    }

    return NextResponse.json({
      success: true,
      liveSite,
      message: `Page "${pageToPublish.title}" published successfully`
    })
  } catch (error: any) {
    console.error('Failed to publish:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}