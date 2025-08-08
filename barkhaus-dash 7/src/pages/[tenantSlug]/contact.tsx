"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MapPin, Phone, Mail, Clock, ArrowLeft, Send } from "lucide-react"

interface LiveSiteData {
  site_name: string
  logo_url: string
  contact_info: {
    address: string
    phone: string
    email: string
    hours: string
  }
  contact_form_content: string
}

const PublicContactPage: React.FC = () => {
  const { tenantSlug } = useParams<{ tenantSlug: string }>()
  const [liveSiteData, setLiveSiteData] = useState<LiveSiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiry_type: "general",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    loadContactData()
  }, [tenantSlug])

  const loadContactData = async () => {
    if (!tenantSlug) return

    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_XANO_BASE_URL}/live_sites/public/${tenantSlug}`)
      if (response.ok) {
        const data = await response.json()
        setLiveSiteData(data)
      }
    } catch (error) {
      console.error("Error loading contact data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Submit to your contact form endpoint
      const response = await fetch(`${import.meta.env.VITE_XANO_BASE_URL}/contact_submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tenant_slug: tenantSlug,
          submitted_at: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          inquiry_type: "general",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!liveSiteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={liveSiteData.logo_url || "/placeholder.svg?height=40&width=40"}
                alt={liveSiteData.site_name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{liveSiteData.site_name}</h1>
                <p className="text-sm text-gray-600">Contact Us</p>
              </div>
            </div>
            <a
              href={`/${tenantSlug}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{liveSiteData.contact_form_content}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600">{liveSiteData.contact_info.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <a href={`tel:${liveSiteData.contact_info.phone}`} className="text-blue-600 hover:text-blue-700">
                      {liveSiteData.contact_info.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <a href={`mailto:${liveSiteData.contact_info.email}`} className="text-blue-600 hover:text-blue-700">
                      {liveSiteData.contact_info.email}
                    </a>
                  </div>
                </div>

                {liveSiteData.contact_info.hours && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Hours</h4>
                      <p className="text-gray-600">{liveSiteData.contact_info.hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h3>
              <div className="space-y-3">
                <a href={`/${tenantSlug}/dogs`} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900">Available Pets</span>
                  <p className="text-sm text-gray-600">Browse our adoptable animals</p>
                </a>
                <a href={`/${tenantSlug}/adopt`} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900">Adoption Application</span>
                  <p className="text-sm text-gray-600">Start the adoption process</p>
                </a>
                <a
                  href={`/${tenantSlug}/volunteer`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">Volunteer</span>
                  <p className="text-sm text-gray-600">Join our volunteer team</p>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
                  <Send className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                <button onClick={() => setSubmitSuccess(false)} className="btn-primary">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
                      <select
                        name="inquiry_type"
                        value={formData.inquiry_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="adoption">Pet Adoption</option>
                        <option value="volunteer">Volunteering</option>
                        <option value="foster">Foster Program</option>
                        <option value="donation">Donations</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default PublicContactPage
