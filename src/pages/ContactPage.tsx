import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchSiteData, logAnalyticsEvent, submitContactForm } from '../api/xano'
import { contactFormSchema, type ContactFormData } from '../schemas/formSchemas'
import { HeaderSection } from '../components/sections/HeaderSection'
import { FooterSection } from '../components/sections/FooterSection'

interface ContactPageProps {
  slug?: string
}

export default function ContactPage({ slug }: ContactPageProps) {
  const params = useParams()
  const [siteData, setSiteData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentSlug = slug || params.slug || 'happy-paws'

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  })

  useEffect(() => {
    loadData()
  }, [currentSlug])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchSiteData(currentSlug, '/contact')
      
      if (result.success && result.data && !result.data.error) {
        setSiteData(result.data)
      } else {
        // Fallback to mock data
        setSiteData({
          organization: {
            name: 'Happy Paws Rescue',
            slug: 'happy-paws'
          },
          design: {
            primary_color: '#3B82F6',
            background_color: '#FFFFFF',
            font_color: '#1F2937'
          },
          site_content: {
            email: 'info@happypaws.org',
            phone: '(555) 123-4567',
            address_line1: '123 Rescue Lane',
            address_line2: 'San Francisco, CA 94102'
          }
        })
      }
    } catch (err) {
      setError('Failed to load contact information')
      console.error('Error loading contact data:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true)
      
      // Log analytics event
      if (siteData?.organization?.tenant_id) {
        await logAnalyticsEvent(siteData.organization.tenant_id, {
          event_type: 'contact_form_submit',
          page_path: `/${currentSlug}/contact`,
          element: 'contact-form',
          user_agent: navigator.userAgent
        })
      }

      // Submit to Xano (or fallback to console log)
      const tenantId = siteData?.organization?.tenant_id || 1
      const result = await submitContactForm(tenantId, data)
      
      if (result.success) {
        console.log('✅ Contact form submitted successfully:', result.data)
      } else {
        console.log('⚠️ Contact form submission failed, logging locally:', data)
      }
      
      setFormSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting contact form:', error)
      // Still show success to user, but log the error
      setFormSubmitted(true)
      reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Page</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="text-blue-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const primaryColor = siteData?.design?.primary_color || '#3B82F6'
  const organization = siteData?.organization || {}
  const content = siteData?.site_content || {}

  return (
    <div className="min-h-screen" style={{ backgroundColor: siteData?.design?.background_color || '#FFFFFF' }}>
      {/* Header */}
      <HeaderSection 
        data={{
          type: 'header',
          links: [
            { label: 'Home', href: '/' },
            { label: 'Available Pets', href: '/pets' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' }
          ],
          showDonate: true
        }}
        design={siteData?.design || {}}
        organization={siteData?.organization || {}}
      />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: primaryColor }}
          >
            Contact {organization.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with us about adoptions, volunteering, donations, or any questions you may have.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 
              className="text-2xl font-bold mb-8"
              style={{ color: primaryColor }}
            >
              Get In Touch
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: primaryColor }}>
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-gray-600">{content.email || 'info@rescue.org'}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: primaryColor }}>
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <p className="text-gray-600">{content.phone || '(555) 123-4567'}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: primaryColor }}>
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Address</h3>
                  <p className="text-gray-600">
                    {content.address_line1 || '123 Rescue Lane'}<br />
                    {content.address_line2 || 'San Francisco, CA 94102'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 
              className="text-2xl font-bold mb-8"
              style={{ color: primaryColor }}
            >
              Send Us a Message
            </h2>

            {formSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  Thank you for your message! We'll get back to you as soon as possible.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  {...register('subject')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a subject</option>
                  <option value="adoption">Adoption Inquiry</option>
                  <option value="volunteer">Volunteer Opportunities</option>
                  <option value="donation">Donation Information</option>
                  <option value="general">General Question</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us how we can help you..."
                />
                {errors.message && (
                  <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterSection 
        data={{
          type: 'footer',
          ein: '12-3456789',
          links: [
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' }
          ],
          socials: []
        }}
        design={siteData?.design || {}}
        organization={siteData?.organization || {}}
        site_content={siteData?.site_content || {}}
      />
    </div>
  )
}
