"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Globe,
  Eye,
  Settings,
  Palette,
  Upload,
  Save,
  ExternalLink,
  Check,
  Edit,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Cloud,
  Server,
  Code,
  Share2,
  MapPin,
  Clock,
  Building,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTenant } from "../contexts/TenantContext"
import { xanoAPI, type LiveSiteConfig, type DesignSettings } from "../services/xanoApi"
import LiveSiteTemplate from "../components/LiveSiteTemplate"

const LiveSite: React.FC = () => {
  const navigate = useNavigate()
  const { currentTenant } = useTenant()
  const [activeTab, setActiveTab] = useState("content")
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [configSection, setConfigSection] = useState("")
  const [showHostingModal, setShowHostingModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [pets, setPets] = useState([])

  const [liveSiteConfig, setLiveSiteConfig] = useState<LiveSiteConfig>({
    tenant_id: currentTenant?.id || 0,
    site_name: "",
    site_url: "",
    logo_url: "",
    about_us: "",
    mission_statement: "",
    contact_info: {
      address: "",
      phone: "",
      email: "",
      hours: "",
    },
    ein_number: "",
    social_media: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
    integrations: {
      petfinder: {
        enabled: false,
        api_key: "",
        organization_id: "",
      },
      givebutter: {
        enabled: false,
        api_key: "",
        campaign_id: "",
      },
    },
    contact_form_content:
      "Thank you for your interest in our animals! Please fill out the form below and we'll get back to you soon.",
    donate_form_content:
      "Your donation helps us continue our mission of rescuing and caring for animals in need. Every contribution makes a difference!",
    is_published: false,
  })

  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    tenant_slug: currentTenant?.id || 0,
    live_site: 0,
    template_name: "classic",
    heading_font_family: "Bebas Neue",
    body_font_family: "Inter",
    google_heading_font_link: "https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap",
    google_body_font_link: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    primary_color: "#009688",
    secondary_color: "#4db6ac",
    background_color: "#ffffff",
    font_color: "#111827",
  })

  // Load existing data on component mount
  useEffect(() => {
    if (currentTenant) {
      loadLiveSiteData()
    }
  }, [currentTenant])

  const loadLiveSiteData = async () => {
    if (!currentTenant) return

    setIsLoading(true)
    try {
      // Load live site config
      const liveSiteData = await xanoAPI.getLiveSites(currentTenant.id)
      if (liveSiteData.length > 0) {
        setLiveSiteConfig(liveSiteData[0])
      } else {
        // Create default live site config
        const defaultConfig = {
          ...liveSiteConfig,
          tenant_id: currentTenant.id,
          site_name: currentTenant.name || "My Rescue Organization",
        }
        setLiveSiteConfig(defaultConfig)
      }

      // Load design settings
      const designData = await xanoAPI.getDesignSettings(currentTenant.id)
      if (designData.length > 0) {
        setDesignSettings(designData[0])
      }

      // Load pets for preview
      const petsData = await xanoAPI.getDogs()
      setPets(petsData.filter((pet) => pet.published).slice(0, 6))
    } catch (error) {
      console.error("Error loading live site data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLiveSiteChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setLiveSiteConfig((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof LiveSiteConfig],
          [child]: value,
        },
      }))
    } else {
      setLiveSiteConfig((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleDesignChange = (field: keyof DesignSettings, value: string) => {
    setDesignSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveLiveSiteData = async () => {
    if (!currentTenant) return

    setSaving(true)
    try {
      // Save live site config
      let savedLiveSite
      if (liveSiteConfig.id) {
        savedLiveSite = await xanoAPI.updateLiveSite(liveSiteConfig.id, {
          ...liveSiteConfig,
          tenant_id: currentTenant.id,
        })
      } else {
        savedLiveSite = await xanoAPI.createLiveSite({
          ...liveSiteConfig,
          tenant_id: currentTenant.id,
        })
      }
      setLiveSiteConfig(savedLiveSite)

      // Save design settings
      let savedDesign
      if (designSettings.id) {
        savedDesign = await xanoAPI.updateDesignSettings(designSettings.id, {
          ...designSettings,
          tenant_slug: currentTenant.id,
          live_site: savedLiveSite.id || 0,
        })
      } else {
        savedDesign = await xanoAPI.createDesignSettings({
          ...designSettings,
          tenant_slug: currentTenant.id,
          live_site: savedLiveSite.id || 0,
        })
      }
      setDesignSettings(savedDesign)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving live site data:", error)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    await saveLiveSiteData()

    // Generate site URL if not set
    if (!liveSiteConfig.site_url) {
      const siteUrl = `https://${liveSiteConfig.site_name.toLowerCase().replace(/\s+/g, "-")}.barkhaus.live`
      handleLiveSiteChange("site_url", siteUrl)
    }

    handleLiveSiteChange("is_published", true)
  }

  const handleViewLiveSite = () => {
    if (liveSiteConfig.site_url) {
      window.open(liveSiteConfig.site_url, "_blank")
    } else {
      setActiveTab("preview")
    }
  }

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "max-w-sm mx-auto"
      case "tablet":
        return "max-w-2xl mx-auto"
      default:
        return "max-w-6xl mx-auto"
    }
  }

  const tabs = [
    { id: "content", name: "Site Content", icon: Settings },
    { id: "design", name: "Design & Branding", icon: Palette },
    { id: "integrations", name: "Integrations", icon: Share2 },
    { id: "forms", name: "Forms & Content", icon: Edit },
    { id: "preview", name: "Preview", icon: Eye },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bebas uppercase text-gray-900">Live Site Builder</h1>
          <p className="text-gray-600 mt-2">Create and manage your public-facing website</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button onClick={() => setShowHostingModal(true)} className="btn-secondary flex items-center space-x-2">
            <Cloud className="h-4 w-4" />
            <span>Hosting Info</span>
          </button>
          <button onClick={handleViewLiveSite} className="btn-secondary flex items-center space-x-2">
            <ExternalLink className="h-4 w-4" />
            <span>Preview Site</span>
          </button>
          <button onClick={saveLiveSiteData} disabled={isSaving} className="btn-secondary flex items-center space-x-2">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
          <button
            onClick={handlePublish}
            className={`btn-primary flex items-center space-x-2 ${liveSiteConfig.is_published ? "bg-success-600 hover:bg-success-700" : ""}`}
          >
            <Globe className="h-4 w-4" />
            <span>{liveSiteConfig.is_published ? "Update Site" : "Publish Site"}</span>
          </button>
        </div>
      </div>

      {/* Status Card */}
      {liveSiteConfig.is_published && (
        <div className="card bg-success-50 border-success-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-success-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-success-800">Site is Live</p>
                <p className="text-sm text-success-600">
                  Your public website is accessible at: {liveSiteConfig.site_url}
                </p>
              </div>
            </div>
            <Globe className="h-8 w-8 text-success-600" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === "content" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bebas uppercase text-gray-900">Site Content</h2>

                {/* Basic Site Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                    <input
                      type="text"
                      value={liveSiteConfig.site_name}
                      onChange={(e) => handleLiveSiteChange("site_name", e.target.value)}
                      className="input"
                      placeholder="Happy Paws Rescue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
                    <input
                      type="url"
                      value={liveSiteConfig.site_url}
                      onChange={(e) => handleLiveSiteChange("site_url", e.target.value)}
                      className="input"
                      placeholder="https://yourrescue.barkhaus.live"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Logo</label>
                  <div className="flex items-center space-x-4">
                    {liveSiteConfig.logo_url && (
                      <img
                        src={liveSiteConfig.logo_url || "/placeholder.svg"}
                        alt="Logo"
                        className="h-16 w-16 object-contain rounded-lg border"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="url"
                        value={liveSiteConfig.logo_url}
                        onChange={(e) => handleLiveSiteChange("logo_url", e.target.value)}
                        className="input"
                        placeholder="Logo URL"
                      />
                    </div>
                    <button className="btn-secondary flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                {/* About & Mission */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">About Us</label>
                    <textarea
                      rows={3}
                      value={liveSiteConfig.about_us}
                      onChange={(e) => handleLiveSiteChange("about_us", e.target.value)}
                      className="input"
                      placeholder="Tell visitors about your organization..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                    <textarea
                      rows={3}
                      value={liveSiteConfig.mission_statement}
                      onChange={(e) => handleLiveSiteChange("mission_statement", e.target.value)}
                      className="input"
                      placeholder="What is your organization's mission?"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Address
                      </label>
                      <textarea
                        rows={2}
                        value={liveSiteConfig.contact_info.address}
                        onChange={(e) => handleLiveSiteChange("contact_info.address", e.target.value)}
                        className="input"
                        placeholder="123 Main St, City, State 12345"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={liveSiteConfig.contact_info.phone}
                        onChange={(e) => handleLiveSiteChange("contact_info.phone", e.target.value)}
                        className="input"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={liveSiteConfig.contact_info.email}
                        onChange={(e) => handleLiveSiteChange("contact_info.email", e.target.value)}
                        className="input"
                        placeholder="info@yourrescue.org"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline h-4 w-4 mr-1" />
                        Hours of Operation
                      </label>
                      <input
                        type="text"
                        value={liveSiteConfig.contact_info.hours}
                        onChange={(e) => handleLiveSiteChange("contact_info.hours", e.target.value)}
                        className="input"
                        placeholder="Mon-Fri 9AM-5PM, Sat 10AM-3PM"
                      />
                    </div>
                  </div>
                </div>

                {/* EIN Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline h-4 w-4 mr-1" />
                    EIN Number (Tax ID)
                  </label>
                  <input
                    type="text"
                    value={liveSiteConfig.ein_number}
                    onChange={(e) => handleLiveSiteChange("ein_number", e.target.value)}
                    className="input"
                    placeholder="12-3456789"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be displayed on your donation pages for tax purposes
                  </p>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Page URL</label>
                      <input
                        type="url"
                        value={liveSiteConfig.social_media.facebook}
                        onChange={(e) => handleLiveSiteChange("social_media.facebook", e.target.value)}
                        className="input"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Profile URL</label>
                      <input
                        type="url"
                        value={liveSiteConfig.social_media.instagram}
                        onChange={(e) => handleLiveSiteChange("social_media.instagram", e.target.value)}
                        className="input"
                        placeholder="https://instagram.com/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Profile URL</label>
                      <input
                        type="url"
                        value={liveSiteConfig.social_media.twitter}
                        onChange={(e) => handleLiveSiteChange("social_media.twitter", e.target.value)}
                        className="input"
                        placeholder="https://twitter.com/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        value={liveSiteConfig.social_media.linkedin}
                        onChange={(e) => handleLiveSiteChange("social_media.linkedin", e.target.value)}
                        className="input"
                        placeholder="https://linkedin.com/company/yourorg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "design" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bebas uppercase text-gray-900">Design & Branding</h2>

                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Website Template</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["classic", "modern", "warm"].map((template) => (
                      <div
                        key={template}
                        onClick={() => handleDesignChange("template_name", template)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          designSettings.template_name === template
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-center">
                          <div
                            className={`h-16 w-full rounded mb-2 ${
                              template === "modern"
                                ? "bg-gradient-to-r from-blue-500 to-purple-600"
                                : template === "classic"
                                  ? "bg-gradient-to-r from-gray-700 to-gray-900"
                                  : "bg-gradient-to-r from-orange-400 to-red-500"
                            }`}
                          ></div>
                          <p className="font-medium capitalize">{template}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={designSettings.primary_color}
                          onChange={(e) => handleDesignChange("primary_color", e.target.value)}
                          className="h-10 w-20 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={designSettings.primary_color}
                          onChange={(e) => handleDesignChange("primary_color", e.target.value)}
                          className="input flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={designSettings.secondary_color}
                          onChange={(e) => handleDesignChange("secondary_color", e.target.value)}
                          className="h-10 w-20 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={designSettings.secondary_color}
                          onChange={(e) => handleDesignChange("secondary_color", e.target.value)}
                          className="input flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={designSettings.background_color}
                          onChange={(e) => handleDesignChange("background_color", e.target.value)}
                          className="h-10 w-20 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={designSettings.background_color}
                          onChange={(e) => handleDesignChange("background_color", e.target.value)}
                          className="input flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={designSettings.font_color}
                          onChange={(e) => handleDesignChange("font_color", e.target.value)}
                          className="h-10 w-20 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={designSettings.font_color}
                          onChange={(e) => handleDesignChange("font_color", e.target.value)}
                          className="input flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fonts */}
                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Typography</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Heading Font</label>
                      <select
                        value={designSettings.heading_font_family}
                        onChange={(e) => {
                          handleDesignChange("heading_font_family", e.target.value)
                          // Update Google Font link based on selection
                          const fontLinks: Record<string, string> = {
                            "Bebas Neue": "https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap",
                            Poppins:
                              "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
                            Montserrat:
                              "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap",
                            "Playfair Display":
                              "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap",
                          }
                          handleDesignChange("google_heading_font_link", fontLinks[e.target.value] || "")
                        }}
                        className="input"
                      >
                        <option value="Bebas Neue">Bebas Neue</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Playfair Display">Playfair Display</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Body Font</label>
                      <select
                        value={designSettings.body_font_family}
                        onChange={(e) => {
                          handleDesignChange("body_font_family", e.target.value)
                          // Update Google Font link based on selection
                          const fontLinks: Record<string, string> = {
                            Inter:
                              "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
                            "Open Sans":
                              "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap",
                            Lato: "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap",
                            "Source Sans Pro":
                              "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap",
                          }
                          handleDesignChange("google_body_font_link", fontLinks[e.target.value] || "")
                        }}
                        className="input"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Source Sans Pro">Source Sans Pro</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bebas uppercase text-gray-900">Integrations</h2>

                {/* Petfinder Integration */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Petfinder</h3>
                      <p className="text-sm text-gray-600">Sync your pets to Petfinder.com for wider visibility</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={liveSiteConfig.integrations.petfinder.enabled}
                        onChange={(e) => handleLiveSiteChange("integrations.petfinder.enabled", e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable</span>
                    </label>
                  </div>
                  {liveSiteConfig.integrations.petfinder.enabled && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <input
                          type="text"
                          value={liveSiteConfig.integrations.petfinder.api_key}
                          onChange={(e) => handleLiveSiteChange("integrations.petfinder.api_key", e.target.value)}
                          className="input"
                          placeholder="Your Petfinder API Key"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
                        <input
                          type="text"
                          value={liveSiteConfig.integrations.petfinder.organization_id}
                          onChange={(e) =>
                            handleLiveSiteChange("integrations.petfinder.organization_id", e.target.value)
                          }
                          className="input"
                          placeholder="Your Petfinder Organization ID"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Givebutter Integration */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Givebutter</h3>
                      <p className="text-sm text-gray-600">Connect your Givebutter account for donation processing</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={liveSiteConfig.integrations.givebutter.enabled}
                        onChange={(e) => handleLiveSiteChange("integrations.givebutter.enabled", e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable</span>
                    </label>
                  </div>
                  {liveSiteConfig.integrations.givebutter.enabled && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <input
                          type="text"
                          value={liveSiteConfig.integrations.givebutter.api_key}
                          onChange={(e) => handleLiveSiteChange("integrations.givebutter.api_key", e.target.value)}
                          className="input"
                          placeholder="Your Givebutter API Key"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign ID</label>
                        <input
                          type="text"
                          value={liveSiteConfig.integrations.givebutter.campaign_id}
                          onChange={(e) => handleLiveSiteChange("integrations.givebutter.campaign_id", e.target.value)}
                          className="input"
                          placeholder="Your Givebutter Campaign ID"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "forms" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bebas uppercase text-gray-900">Forms & Content</h2>

                {/* Contact Form Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Form Introduction</label>
                  <textarea
                    rows={3}
                    value={liveSiteConfig.contact_form_content}
                    onChange={(e) => handleLiveSiteChange("contact_form_content", e.target.value)}
                    className="input"
                    placeholder="Message displayed above the contact form..."
                  />
                  <p className="text-sm text-gray-500 mt-1">This text will appear above your contact form</p>
                </div>

                {/* Donate Form Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Donation Page Content</label>
                  <textarea
                    rows={4}
                    value={liveSiteConfig.donate_form_content}
                    onChange={(e) => handleLiveSiteChange("donate_form_content", e.target.value)}
                    className="input"
                    placeholder="Message displayed on your donation page..."
                  />
                  <p className="text-sm text-gray-500 mt-1">This text will appear on your donation page</p>
                </div>

                {/* Form Settings */}
                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Application Forms</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Pet Adoption Application</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Automatically generated form for pet adoption inquiries
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Form Status: Active</span>
                        <button className="btn-secondary text-sm">Configure Fields</button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Foster Application</h4>
                      <p className="text-sm text-gray-600 mb-3">Form for potential foster families</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Form Status: Active</span>
                        <button className="btn-secondary text-sm">Configure Fields</button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Volunteer Application</h4>
                      <p className="text-sm text-gray-600 mb-3">Form for volunteer sign-ups</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Form Status: Active</span>
                        <button className="btn-secondary text-sm">Configure Fields</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bebas uppercase text-gray-900">Site Preview</h2>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setPreviewMode("desktop")}
                      className={`p-2 rounded transition-colors ${previewMode === "desktop" ? "bg-white shadow-sm text-primary-600" : "text-gray-600 hover:text-gray-900"}`}
                    >
                      <Monitor className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPreviewMode("tablet")}
                      className={`p-2 rounded transition-colors ${previewMode === "tablet" ? "bg-white shadow-sm text-primary-600" : "text-gray-600 hover:text-gray-900"}`}
                    >
                      <Tablet className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPreviewMode("mobile")}
                      className={`p-2 rounded transition-colors ${previewMode === "mobile" ? "bg-white shadow-sm text-primary-600" : "text-gray-600 hover:text-gray-900"}`}
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div
                    className={`border-2 border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${getPreviewWidth()}`}
                  >
                    <div className="bg-white">
                      {/* Preview Header */}
                      <div className="bg-gray-100 px-4 py-2 border-b">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                            <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                            {liveSiteConfig.site_url ||
                              `${liveSiteConfig.site_name.toLowerCase().replace(/\s+/g, "-")}.barkhaus.live`}
                          </div>
                        </div>
                      </div>

                      {/* Live Site Template Preview */}
                      <div className="h-[600px] overflow-y-auto">
                        <LiveSiteTemplate
                          config={liveSiteConfig}
                          designSettings={designSettings}
                          pets={pets}
                          successStories={[]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hosting Information Modal */}
      {showHostingModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Live Site Hosting Strategy</h2>
              <button onClick={() => setShowHostingModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Cloud className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">How Client Sites Are Hosted</h3>
                    <p className="text-blue-800 text-sm">
                      BarkHaus provides a complete hosting solution for your rescue organization's public website.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                    <Server className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Managed Hosting</h4>
                    <p className="text-gray-600 text-sm">
                      We host your site on our secure, fast servers with automatic backups and 99.9% uptime guarantee.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Custom Domain</h4>
                    <p className="text-gray-600 text-sm">
                      Your site gets a professional URL like "yourrescue.barkhaus.live" or you can use your own domain.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                    <Code className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Template System</h4>
                    <p className="text-gray-600 text-sm">
                      Sites are built from our responsive templates and automatically updated with your pet data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Publishing Process:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Customize your site content and design in the builder</li>
                  <li>Click "Publish Site" to deploy your changes</li>
                  <li>Your site goes live instantly at your custom URL</li>
                  <li>Pet data automatically syncs from your admin dashboard</li>
                  <li>Form submissions flow directly to your Inbox</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Features Included:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                  <li>Mobile-responsive design</li>
                  <li>SEO optimization</li>
                  <li>SSL security certificate</li>
                  <li>Contact form integration</li>
                  <li>Social media integration</li>
                  <li>Analytics tracking</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={() => setShowHostingModal(false)} className="btn-primary">
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveSite
