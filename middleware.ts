import { NextRequest, NextResponse } from 'next/server'

const XANO_BASE_URL = process.env.XANO_LIVE_SITE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR'
const XANO_AUTH_TOKEN = process.env.XANO_AUTH_TOKEN

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl
  
  // Skip middleware for API routes, static files, and admin routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/app/') ||
    pathname.includes('.') ||
    hostname === 'localhost'
  ) {
    return NextResponse.next()
  }

  // Check if this is a custom domain
  if (hostname !== 'yourapp.com' && hostname !== 'localhost') {
    try {
      // Look up the organization by custom domain
      const response = await fetch(`${XANO_BASE_URL}/lookup-domain?host=${hostname}`, {
        headers: {
          'Authorization': `Bearer ${XANO_AUTH_TOKEN}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.slug) {
          // Rewrite to the organization's subdomain path
          const url = request.nextUrl.clone()
          url.pathname = `/${data.slug}${pathname}`
          return NextResponse.rewrite(url)
        }
      }
    } catch (error) {
      console.error('Domain lookup error:', error)
    }

    // If domain lookup fails, return 404
    return new NextResponse('Site not found', { status: 404 })
  }

  // Handle subdomain routing for yourapp.com
  const pathSegments = pathname.split('/').filter(Boolean)
  
  if (pathSegments.length > 0) {
    const potentialSlug = pathSegments[0]
    
    // Check if this looks like an organization slug
    if (potentialSlug && !potentialSlug.startsWith('_') && potentialSlug !== 'app') {
      // This is likely an organization site, let it pass through to the [slug] route
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
