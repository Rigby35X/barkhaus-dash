import ClassicHomepage from "./templates/classic/ClassicHomepage"
import ModernHomepage from "./templates/modern/ModernHomepage"
import PublicLayout from "../components/PublicLayout"
import { LiveSiteProvider } from "../contexts/LiveSiteContext"
import type { DesignSettings, LiveSiteConfig } from "../services/xanoApi"

// Mock organization data - in a real app, this would come from API/database
const getOrganizationData = (_orgId?: string) => {
  // This would typically fetch from your backend based on orgId
  return {
    organization: {
      siteName: "Paws & Hearts Rescue",
      logo: "/Duggy.png",
      tagline: "Every paw deserves a loving heart",
      aboutUs: "Dedicated to rescuing and rehoming animals in need since 2015.",
      mission:
        "To provide shelter, medical care, and love to abandoned animals while finding them perfect forever homes.",
      vision: "A community where no animal is left behind.",
      foundedYear: 2015,
      registrationNumber: "12-3456789", // Added EIN/registration number
      contactInfo: {
        address: "456 Rescue Lane, Pet City, PC 67890",
        phone: "(555) 987-6543",
        email: "hello@pawsandhearts.org",
        website: "https://pawsandhearts.org",
        socialMedia: {
          facebook: "https://facebook.com/pawsandhearts",
          instagram: "https://instagram.com/pawsandhearts",
          twitter: "https://twitter.com/pawsandhearts",
          linkedin: "https://linkedin.com/company/pawsandhearts",
        },
      },
    },
    pages: {
      home: {
        heroSection: {
          title: "Give a Pet a Second Chance",
          subtitle: "Open your heart and home to a furry friend in need.",
          ctaText: "Meet Our Pets",
          ctaLink: "#pets",
          backgroundImage: "/default-hero.jpg", // or undefined if you want to omit
        },
        featuredPets: [
          {
            id: "1",
            name: "Buddy",
            breed: "Golden Retriever",
            age: "2 years",
            image: "/pets/buddy.jpg",
            description: "A friendly and energetic dog looking for a loving home.",
          },
        ],
      },
      about: {
        aboutSection: {
          title: "About Us",
          content: "We are a passionate team dedicated to animal welfare and rescue.",
          image: "/about-us.jpg",
        },
      },
      successStories: {
        headerSection: {
          title: "Success Stories",
          content: "Read about our happy adoption stories and the lives we've changed together.",
        },
        stories: [
          {
            id: "1",
            petName: "Max",
            beforeImage: "/success/max-before.jpg",
            afterImage: "/success/max.jpg",
            story: "Max found his forever family and is happier than ever!",
            adoptionDate: "2023-05-10",
          },
        ],
      },
    },
  }
}

const getDesignSettings = (template?: string) => {
  switch (template) {
    case "classic":
      return {
        primaryColor: "#2563eb",
        secondaryColor: "#3b82f6",
        accentColor: "#f59e0b",
        headingFont: "Poppins, sans-serif",
        fontFamily: "Inter, system-ui, sans-serif",
      }
    default:
      return {}
  }
}

const TemplatePreview = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const template = searchParams.get("template")
  const orgId = searchParams.get("org")

  // Get organization-specific data
  const organizationData = getOrganizationData(orgId || undefined)
  const designSettings = getDesignSettings(template || undefined)

  // Transform organizationData to match LiveSiteConfig interface
  const transformedLiveSiteConfig: LiveSiteConfig = {
    id: 1, // default or get from your data
    tenant_id: 1, // default or get from your data
    site_name: organizationData.organization.siteName,
    site_url: organizationData.organization.contactInfo.website,
    logo_url: organizationData.organization.logo,
    about_us: organizationData.organization.aboutUs,
    mission_statement: organizationData.organization.mission,
    contact_info: {
      address: organizationData.organization.contactInfo.address,
      phone: organizationData.organization.contactInfo.phone,
      email: organizationData.organization.contactInfo.email,
      hours: "9 AM - 5 PM", // add default
    },
    ein_number: organizationData.organization.registrationNumber,
    social_media: {
      facebook: organizationData.organization.contactInfo.socialMedia?.facebook || "",
      instagram: organizationData.organization.contactInfo.socialMedia?.instagram || "",
      twitter: organizationData.organization.contactInfo.socialMedia?.twitter || "",
      linkedin: organizationData.organization.contactInfo.socialMedia?.linkedin || "",
    },
  }

  // Transform designSettings to match DesignSettings interface
  const transformedDesignSettings: DesignSettings = {
    id: 1,
    tenantSlug: "preview",
    liveSite: 1,
    templateName: "classic",
    headingFont: designSettings?.headingFont || "Inter",
    bodyFont: designSettings?.fontFamily || "Inter",
    google_heading_font_link: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
    google_body_font_link: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap",
    primaryColor: designSettings?.primaryColor || "#3B82F6",
    secondaryColor: designSettings?.secondaryColor || "#8B5CF6",
    accentColor: designSettings?.accentColor || "#10B981",
    backgroundColor: "#FFFFFF",
    fontColor: "#1F2937",
    border_radius: "0.75rem",
    shadow_style: "shadow-lg",
  }

  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return (
          <LiveSiteProvider initialData={transformedLiveSiteConfig} initialDesign={transformedDesignSettings}>
            <ClassicHomepage />
          </LiveSiteProvider>
        )
      case "modern":
        return (
          <LiveSiteProvider initialData={transformedLiveSiteConfig} initialDesign={transformedDesignSettings}>
            <ModernHomepage />
          </LiveSiteProvider>
        )
      default:
        return (
          <PublicLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Template Not Found</h1>
                <p className="text-gray-600 mb-8">The requested template could not be loaded.</p>
                <a
                  href="/templates"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Templates
                </a>
              </div>
            </div>
          </PublicLayout>
        )
    }
  }

  return renderTemplate()
}

export default TemplatePreview
