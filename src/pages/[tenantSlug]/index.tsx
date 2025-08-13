"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
// Fix this import path:
import { LiveSiteProvider } from "../../contexts/LiveSiteContext"
import ClassicHomepage from "../templates/classic/ClassicHomepage"
import ModernHomepage from "../templates/modern/ModernHomepage"
import type { DesignSettings, LiveSiteConfig } from "../../services/xanoApi"

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
      headingLink.href = designSettings.googleHeadingFontLink // ✅ Correct - camelCase
      headingLink.rel = "stylesheet"
      document.head.appendChild(headingLink)

      const bodyLink = document.createElement("link")
      bodyLink.href = designSettings.googleBodyFontLink // ✅ Correct - camelCase
      bodyLink.rel = "stylesheet"
      document.head.appendChild(bodyLink)

      return () => {
        if (document.head.contains(headingLink)) document.head.removeChild(headingLink)
        if (document.head.contains(bodyLink)) document.head.removeChild(bodyLink)
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

  const contextDesign = designSettings || undefined

  // Transform your data to match LiveSiteConfig interface
  const transformedLiveSiteConfig: LiveSiteConfig = {
    id: liveSiteData.id || 1,
    tenant_id: liveSiteData.tenant_id || 1,
    site_name: contextData.organization.siteName,
    site_url: contextData.organization.contactInfo.website,
    logo_url: contextData.organization.logo,
    about_us: contextData.organization.aboutUs,
    mission_statement: contextData.organization.mission,
    contact_info: {
      address: contextData.organization.contactInfo.address,
      phone: contextData.organization.contactInfo.phone,
      email: contextData.organization.contactInfo.email,
      hours: liveSiteData.contact_info?.hours || "9 AM - 5 PM",
    },
    ein_number: contextData.organization.registrationNumber,
    social_media: {
      facebook: contextData.organization.contactInfo.socialMedia?.facebook || "",
      instagram: contextData.organization.contactInfo.socialMedia?.instagram || "",
      twitter: contextData.organization.contactInfo.socialMedia?.twitter || "",
      linkedin: contextData.organization.contactInfo.socialMedia?.linkedin || "",
    },
  }

  const renderTemplate = () => {
    const templateName = designSettings?.templateName || "classic"

    switch (templateName) {
      case "classic":
        return <ClassicHomepage />
      case "modern":
        return <ModernHomepage />
      default:
        return <ClassicHomepage />
    }
  }

  return (
    <LiveSiteProvider initialData={transformedLiveSiteConfig} initialDesign={contextDesign}>
      {renderTemplate()}
    </LiveSiteProvider>
  )
}

export default PublicHomepage
