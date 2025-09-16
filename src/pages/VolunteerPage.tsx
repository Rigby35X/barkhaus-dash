import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchSiteData } from '../api/xano'
import { VolunteerApplicationForm } from '../components/forms/VolunteerApplicationForm'
import { HeaderSection } from '../components/sections/HeaderSection'
import { FooterSection } from '../components/sections/FooterSection'

interface VolunteerPageProps {
  slug?: string
}

export default function VolunteerPage({ slug }: VolunteerPageProps) {
  const params = useParams()
  const [siteData, setSiteData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const currentSlug = slug || params.slug || 'happy-paws'

  useEffect(() => {
    loadData()
  }, [currentSlug])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchSiteData(currentSlug, '/volunteer')
      
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
          }
        })
      }
    } catch (err) {
      setError('Failed to load volunteer information')
      console.error('Error loading volunteer data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading volunteer application...</p>
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

  if (formSubmitted) {
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
          <div className="max-w-2xl mx-auto text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" style={{ color: primaryColor }}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 
              className="text-3xl font-bold mb-4"
              style={{ color: primaryColor }}
            >
              Volunteer Application Submitted!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Thank you for your interest in volunteering with {organization.name}. We'll review your application and get back to you within 2-3 business days.
            </p>
            <div className="space-y-4">
              <a
                href={`/${currentSlug}/pets`}
                className="inline-block text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                View Available Pets
              </a>
              <br />
              <a
                href={`/${currentSlug}`}
                className="text-blue-600 hover:underline"
              >
                Return to Home
              </a>
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
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: primaryColor }}
          >
            Volunteer with {organization.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our team of dedicated volunteers and help us save more lives. Every hour you contribute makes a difference in an animal's life.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <VolunteerApplicationForm
            tenantId={siteData?.organization?.tenant_id || 1}
            onSuccess={() => setFormSubmitted(true)}
            primaryColor={primaryColor}
          />
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
