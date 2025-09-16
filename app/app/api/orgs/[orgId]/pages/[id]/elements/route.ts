import { NextRequest, NextResponse } from 'next/server'
import { Xano } from '@/lib/xanoClient'
import { getServerXanoToken } from '@/lib/server/xano-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; id: string }> }
) {
  try {
    const { orgId, id } = await params
    const token = await getServerXanoToken()

    // Determine if id is a slug or numeric ID
    const isSlug = isNaN(Number(id))
    let page

    if (isSlug) {
      // Find page by slug
      const pages = await Xano.listPages(orgId, token)
      page = pages.find(p => p.slug === id)
    } else {
      // Get page by ID
      page = await Xano.getPage(id, orgId, token)
    }

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Parse the content_json to get elements
    let elements = {}
    try {
      if (page.content_json) {
        const content = JSON.parse(page.content_json)
        elements = content.elements || {}
      }
    } catch (e) {
      console.warn('Failed to parse page content_json:', e)
    }

    return NextResponse.json({
      elements,
      page: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        published: page.published
      }
    })
  } catch (error: any) {
    console.error('Failed to get page elements:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; id: string }> }
) {
  try {
    const { orgId, id } = await params
    const { elements, userId } = await request.json()
    const token = await getServerXanoToken()

    if (!elements) {
      return NextResponse.json({ error: 'Missing elements' }, { status: 400 })
    }

    // Determine if id is a slug or numeric ID
    const isSlug = isNaN(Number(id))
    let page

    if (isSlug) {
      // Find page by slug
      const pages = await Xano.listPages(orgId, token)
      page = pages.find(p => p.slug === id)
    } else {
      // Get page by ID
      page = await Xano.getPage(id, orgId, token)
    }

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Parse existing content and update elements
    let content = {}
    try {
      if (page.content_json) {
        content = JSON.parse(page.content_json)
      }
    } catch (e) {
      console.warn('Failed to parse existing content_json:', e)
    }

    // Update the content with new elements
    const updatedContent = {
      ...content,
      elements,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userId
    }

    // Save the updated page
    const updatedPage = await Xano.updatePage(
      page.id,
      {
        content_json: JSON.stringify(updatedContent),
        updated_at: new Date().toISOString()
      },
      orgId,
      token
    )

    return NextResponse.json({
      success: true,
      page: {
        id: updatedPage.id,
        slug: updatedPage.slug,
        title: updatedPage.title,
        published: updatedPage.published,
        updated_at: updatedPage.updated_at
      }
    })
  } catch (error: any) {
    console.error('Failed to update page elements:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}