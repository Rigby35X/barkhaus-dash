// app/(site)/[slug]/page.tsx  (Server Component)
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { SiteRenderer } from '../../../components/SiteRenderer'
import { AnalyticsTracker } from '../../../components/AnalyticsTracker'

async function fetchSiteData(slug: string, path: string = '/') {
  const baseUrl = process.env.XANO_LIVE_SITE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR'

  try {
    const response = await fetch(`${baseUrl}/render-payload?slug=${slug}&path=${path}`, {
      headers: {
        'Authorization': `Bearer ${process.env.XANO_AUTH_TOKEN}`,
      },
      next: { revalidate: 60 } // Cache for 1 minute
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch site data:', error)
    return null
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const siteData = await fetchSiteData(params.slug)

  if (!siteData || siteData.error) {
    notFound()
  }

  // Get request headers for analytics
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const referer = headersList.get('referer') || ''

  return (
    <>
      <SiteRenderer data={siteData} />
      <AnalyticsTracker
        tenantId={siteData.organization.tenant_id}
        pagePath={`/${params.slug}`}
        userAgent={userAgent}
        referrer={referer}
      />
    </>
  )
}