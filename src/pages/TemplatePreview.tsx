import ClassicHomepage from "./templates/classic/ClassicHomepage"
import PublicLayout from "../components/PublicLayout"
import { LiveSiteProvider } from "../contexts/LiveSiteContext"

// Mock organization data - in a real app, this would come from API/database
const getOrganizationData = (orgId?: string) => {
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
      contactInfo: {
        address: "456 Rescue Lane, Pet City, PC 67890",
        phone: "(555) 987-6543",
        email: "hello@pawsandhearts.org",
        website: "https://pawsandhearts.org",
        socialMedia: {
          facebook: "https://facebook.com/pawsandhearts",
          instagram: "https://instagram.com/pawsandhearts",
          twitter: "https://twitter.com/pawsandhearts",
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

  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return (
          <LiveSiteProvider initialData={organizationData} initialDesign={designSettings}>
            <ClassicHomepage />
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
