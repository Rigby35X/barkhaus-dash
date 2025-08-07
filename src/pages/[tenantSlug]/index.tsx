"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { LiveSiteProvider } from "../../contexts/LiveSiteContext"
import ClassicHomepage from "../templates/classic/ClassicHomepage"

interface LiveSiteData {
  id: number
  tenant_id: number
  site_name: string
  site_url: string
  logo_url: string
  about_us: string
  mission_statement: string
  contact_info: {
    address: string
    phone: string
    email: string
    hours: string
  }
  ein_number: string
  social_media: {
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
  }
  integrations: any
  contact_form_content: string
  donate_form_content: string
  is_published: boolean
}

interface DesignSettings {
  id: number
  tenant_slug: number
  live_site: number
  template_name: string
  headingFont: string
  fontFamily: string
  google_heading_font_link: string
  googleBodyFontLink: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  fontColor: string
}

const PublicHomepage: React.FC = () => {
  const { tenantSlug } = useParams<{ tenantSlug: string }>()
  const [liveSiteData, setLiveSiteData] = useState<LiveSiteData | null>(null)
  const [designSettings, setDesignSettings] = useState<DesignSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load Google Fonts
  useEffect(() => {
    if (designSettings) {
      const headingLink = document.createElement("link")
      headingLink.href = designSettings.google_heading_font_link
      headingLink.rel = "stylesheet"
      document.head.appendChild(headingLink)

      const bodyLink = document.createElement("link")
      bodyLink.href = designSettings.googleBodyFontLink
      bodyLink.rel = "stylesheet"
      document.head.appendChild(bodyLink)

      return () => {
        document.head.removeChild(headingLink)
        document.head.removeChild(bodyLink)
      }
    }
  }, [designSettings])

  useEffect(() => {
    loadPublicSiteData()
  }, [tenantSlug])

  const loadPublicSiteData = async () => {
    if (!tenantSlug) return

    try {
      setLoading(true)

      // Load live site data by tenant slug
      const liveSiteResponse = await fetch(`${import.meta.env.VITE_XANO_BASE_URL}/live_sites/public/${tenantSlug}`)
      if (!liveSiteResponse.ok) {
        throw new Error("Site not found")
      }
      const liveSite = await liveSiteResponse.json()

      if (!liveSite.is_published) {
        throw new Error("Site is not published")
      }

      setLiveSiteData(liveSite)

      // Load design settings
      const designResponse = await fetch(
        `https://x8ki-letl-twmt.n7.xano.io/api:0BQDG239/design_settings?live_site=${liveSite.id}`,
      )
      if (designResponse.ok) {
        const designData = await designResponse.json()
        if (designData.length > 0) {
          setDesignSettings(designData[0])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load site")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !liveSiteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "The requested site could not be found."}</p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  // Convert data to LiveSiteContext format
  const contextData = {
    organization: {
      siteName: liveSiteData.site_name,
      logo: liveSiteData.logo_url,
      tagline: "Saving lives, one paw at a time",
      aboutUs: liveSiteData.about_us,
      mission: liveSiteData.mission_statement,
      vision: "A world where every animal has a loving home.",
      foundedYear: 2015,
      registrationNumber: liveSiteData.ein_number,
      contactInfo: {
        address: liveSiteData.contact_info.address,
        phone: liveSiteData.contact_info.phone,
        email: liveSiteData.contact_info.email,
        website: liveSiteData.site_url,
        socialMedia: liveSiteData.social_media,
      },
    },
    pages: {
      home: {
        heroSection: {
          title: "Find Your Perfect Companion",
          subtitle: "Every animal deserves a loving home. Help us make that happen.",
          ctaText: "View Available Pets",
          ctaLink: "#pets",
        },
      },
      about: {
        aboutSection: {
          title: "Our Mission",
          content: liveSiteData.mission_statement,
        },
      },
      successStories: {
        headerSection: {
          title: "Success Stories",
          content: "See the amazing transformations and happy endings made possible by our community.",
        },
      },
    },
  }

  const contextDesign = designSettings
    ? {
        primaryColor: designSettings.primaryColor,
        secondaryColor: designSettings.secondaryColor,
        accentColor: designSettings.primaryColor,
        fontFamily: designSettings.fontFamily,
        headingFont: designSettings.headingFont,
        backgroundColor: designSettings.backgroundColor,
        textColor: designSettings.fontColor,
        borderRadius: "0.75rem",
        shadowStyle: "shadow-lg",
      }
    : undefined

  const renderTemplate = () => {
    const templateName = designSettings?.template_name || "classic"

    switch (templateName) {
      case "classic":
      default:
        return <ClassicHomepage />
    }
  }

  return (
    <LiveSiteProvider initialData={contextData} initialDesign={contextDesign}>
      {renderTemplate()}
    </LiveSiteProvider>
  )
}

export default PublicHomepage
