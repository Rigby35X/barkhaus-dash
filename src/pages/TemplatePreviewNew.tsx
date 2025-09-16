import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClassicHomepage from "./templates/classic/ClassicHomepage"
import ModernHomepage from "./templates/modern/ModernHomepage"
import PublicLayout from "../components/PublicLayout"
import { LiveSiteProvider } from "../contexts/LiveSiteContext"
// import { useStrapiTemplate } from "../contexts/StrapiTemplateContext" // Disabled
import type { DesignSettings, LiveSiteConfig } from "../services/xanoApi"

const TemplatePreview = () => {
  console.log('🎬 TemplatePreview component loading...');

  const [searchParams] = useSearchParams();
  const template = searchParams.get('template') || 'classic';
  const orgSlug = searchParams.get('org') || 'happy-paws';

  console.log('📊 Preview params:', { template, orgSlug });

  // Mock organizations instead of Strapi
  const organizations = []
  const [orgData, setOrgData] = useState<any>(null);

  console.log('📊 Organizations (mock):', organizations);

  // Use mock organization data
  useEffect(() => {
    console.log('🔍 Looking for org with slug:', orgSlug);
    console.log('🔍 Available orgs:', organizations.map((org: any) => ({
      id: org.id,
      slug: org.slug || org.attributes?.slug,
      name: org.name || org.attributes?.name,
      fullOrg: org
    })));

    console.log('🔍 Raw organizations array:', organizations);

    // Try both data structures: direct properties and nested attributes
    const foundOrg = organizations.find((org: any) =>
      org.slug === orgSlug || org.attributes?.slug === orgSlug
    );

    if (foundOrg) {
      console.log('🎯 Found Strapi org data:', foundOrg);
      // Use direct properties if available, fallback to attributes
      const orgData = foundOrg.attributes || foundOrg;
      setOrgData(orgData);
    } else {
      console.log('🔄 Using fallback data for org:', orgSlug);
      setOrgData({
        name: "Paws & Hearts Rescue",
        primaryColor: "#2563eb",
        secondaryColor: "#3b82f6",
        accentColor: "#f59e0b",
        headingFont: "Poppins",
        bodyFont: "Inter",
        mission: "Every paw deserves a loving heart",
        about: "Dedicated to rescuing and rehoming animals in need since 2015.",
        contactInfo: {
          email: "hello@pawsandhearts.org",
          phone: "(555) 987-6543",
          address: "456 Rescue Lane, Pet City, PC 67890"
        }
      });
    }
  }, [organizations, orgSlug]);

  // Design settings based on template and org data
  const designSettings = {
    primaryColor: orgData?.primaryColor || "#2563eb",
    secondaryColor: orgData?.secondaryColor || "#3b82f6",
    accentColor: orgData?.accentColor || "#f59e0b",
    headingFont: orgData?.headingFont || "Poppins",
    bodyFont: orgData?.bodyFont || "Inter",
  };

  // Create organization data structure for templates
  const organizationData = {
    organization: {
      siteName: orgData?.name || "Paws & Hearts Rescue",
      logo: "/Duggy.png",
      tagline: orgData?.mission || "Every paw deserves a loving heart",
      aboutUs: orgData?.about || "Dedicated to rescuing and rehoming animals in need since 2015.",
      mission: orgData?.mission || "To provide shelter, medical care, and love to abandoned animals while finding them perfect forever homes.",
      vision: "A community where no animal is left behind.",
      foundedYear: 2015,
      registrationNumber: "12-3456789",
      contactInfo: {
        address: orgData?.contactInfo?.address || "456 Rescue Lane, Pet City, PC 67890",
        phone: orgData?.contactInfo?.phone || "(555) 987-6543",
        email: orgData?.contactInfo?.email || "hello@pawsandhearts.org",
        website: "https://pawsandhearts.org",
      },
      socialMedia: {
        facebook: orgData?.socialMedia?.facebook || "https://facebook.com/pawsandhearts",
        instagram: orgData?.socialMedia?.instagram || "https://instagram.com/pawsandhearts",
        twitter: orgData?.socialMedia?.twitter || "https://twitter.com/pawsandhearts",
      },
    }
  };

  // Transform to match LiveSiteConfig interface
  const transformedLiveSiteConfig: LiveSiteConfig = {
    id: 1,
    tenant_id: 1,
    site_name: organizationData.organization.siteName,
    site_url: organizationData.organization.contactInfo.website,
    logo_url: organizationData.organization.logo,
    tagline: organizationData.organization.tagline,
    about_us: organizationData.organization.aboutUs,
    mission: organizationData.organization.mission,
    vision: organizationData.organization.vision,
    founded_year: organizationData.organization.foundedYear,
    registration_number: organizationData.organization.registrationNumber,
    contact_email: organizationData.organization.contactInfo.email,
    contact_phone: organizationData.organization.contactInfo.phone,
    contact_address: organizationData.organization.contactInfo.address,
    social_facebook: organizationData.organization.socialMedia.facebook,
    social_instagram: organizationData.organization.socialMedia.instagram,
    social_twitter: organizationData.organization.socialMedia.twitter,
    hero_title: "Give a Pet a Second Chance",
    hero_subtitle: "Open your heart and home to a furry friend in need.",
    hero_cta_text: "Meet Our Pets",
    hero_cta_link: "#pets",
    hero_background_image: "/default-hero.jpg",
    about_title: "About Our Mission",
    about_content: orgData?.about || "We are dedicated to rescuing and rehoming animals in need.",
  };

  // Transform to match DesignSettings interface
  const transformedDesignSettings: DesignSettings = {
    id: 1,
    tenantSlug: "preview",
    liveSite: 1,
    templateName: template,
    headingFont: designSettings.headingFont,
    bodyFont: designSettings.bodyFont,
    google_heading_font_link: `https://fonts.googleapis.com/css2?family=${designSettings.headingFont.replace(' ', '+')}:wght@400;600;700&display=swap`,
    google_body_font_link: `https://fonts.googleapis.com/css2?family=${designSettings.bodyFont.replace(' ', '+')}:wght@400;500&display=swap`,
    primaryColor: designSettings.primaryColor,
    secondaryColor: designSettings.secondaryColor,
    accentColor: designSettings.accentColor,
    backgroundColor: "#FFFFFF",
    fontColor: "#1F2937",
    border_radius: "0.75rem",
    shadow_style: "shadow-lg",
  };

  const renderTemplate = () => {
    switch (template) {
      case "classic":
      case "bold":
        return (
          <LiveSiteProvider initialData={transformedLiveSiteConfig} initialDesign={transformedDesignSettings}>
            <ClassicHomepage />
          </LiveSiteProvider>
        );
      case "modern":
        return (
          <LiveSiteProvider initialData={transformedLiveSiteConfig} initialDesign={transformedDesignSettings}>
            <ModernHomepage />
          </LiveSiteProvider>
        );
      default:
        return (
          <PublicLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Template Not Found</h1>
                <p className="text-gray-600 mb-8">The requested template "{template}" could not be loaded.</p>
                <a
                  href="/app/templates"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Templates
                </a>
              </div>
            </div>
          </PublicLayout>
        );
    }
  };

  return renderTemplate();
};

export default TemplatePreview;
