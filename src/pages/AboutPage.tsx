import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchSiteData } from '../api/xano'
import { HeaderSection } from '../components/sections/HeaderSection'
import { FooterSection } from '../components/sections/FooterSection'

interface AboutPageProps {
  slug?: string
}

export default function AboutPage({ slug }: AboutPageProps) {
  const params = useParams()
  const [siteData, setSiteData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentSlug = slug || params.slug || 'happy-paws'

  useEffect(() => {
    loadData()
  }, [currentSlug])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchSiteData(currentSlug, '/about')
      
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
            mission_statement: 'Saving lives, one paw at a time',
            about_text: 'Happy Paws Rescue is a non-profit organization dedicated to rescuing, rehabilitating, and rehoming abandoned and neglected animals. Founded in 2015, we have successfully placed over 2,000 animals in loving homes.',
            history: 'Our journey began when our founder, Sarah Johnson, rescued her first stray dog from the streets. What started as a personal mission quickly grew into a community-wide effort to help animals in need.',
            team: [
              {
                name: 'Sarah Johnson',
                role: 'Founder & Executive Director',
                bio: 'Sarah has been working with animals for over 15 years and is passionate about animal welfare.',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop'
              },
              {
                name: 'Mike Chen',
                role: 'Veterinary Director',
                bio: 'Dr. Chen ensures all our animals receive the best medical care possible.',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Adoption Coordinator',
                bio: 'Emily helps match families with their perfect companion.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop'
              }
            ],
            stats: {
              animals_rescued: 2000,
              successful_adoptions: 1850,
              years_operating: 8,
              volunteers: 150
            }
          }
        })
      }
    } catch (err) {
      setError('Failed to load about information')
      console.error('Error loading about data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about information...</p>
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
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: primaryColor }}
        >
          About {organization.name}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {content.mission_statement || 'Dedicated to helping animals find loving homes'}
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 
              className="text-3xl font-bold mb-6"
              style={{ color: primaryColor }}
            >
              Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {content.about_text || 'We are dedicated to rescuing, rehabilitating, and rehoming abandoned and neglected animals. Our mission is to provide a safe haven for animals in need while working to find them loving, permanent homes.'}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              {content.history || 'Every animal deserves a second chance at happiness, and we work tirelessly to make that possible through our comprehensive rescue and adoption programs.'}
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop"
              alt="Animals at the rescue"
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {content.stats && (
        <section className="mb-16 py-12 bg-gray-50 rounded-lg">
          <div className="text-center mb-8">
            <h2 
              className="text-3xl font-bold"
              style={{ color: primaryColor }}
            >
              Our Impact
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div 
                className="text-4xl font-bold mb-2"
                style={{ color: primaryColor }}
              >
                {content.stats.animals_rescued?.toLocaleString() || '2,000+'}
              </div>
              <div className="text-gray-600">Animals Rescued</div>
            </div>
            <div>
              <div 
                className="text-4xl font-bold mb-2"
                style={{ color: primaryColor }}
              >
                {content.stats.successful_adoptions?.toLocaleString() || '1,850+'}
              </div>
              <div className="text-gray-600">Successful Adoptions</div>
            </div>
            <div>
              <div 
                className="text-4xl font-bold mb-2"
                style={{ color: primaryColor }}
              >
                {content.stats.years_operating || '8+'}
              </div>
              <div className="text-gray-600">Years Operating</div>
            </div>
            <div>
              <div 
                className="text-4xl font-bold mb-2"
                style={{ color: primaryColor }}
              >
                {content.stats.volunteers || '150+'}
              </div>
              <div className="text-gray-600">Volunteers</div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {content.team && content.team.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: primaryColor }}
            >
              Meet Our Team
            </h2>
            <p className="text-gray-600 text-lg">
              The dedicated people who make our mission possible
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.team.map((member: any, index: number) => (
              <div key={index} className="text-center">
                <img
                  src={member.image || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop'}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: primaryColor }}
                >
                  {member.name}
                </h3>
                <p className="text-gray-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-700 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Values Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            Our Values
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" style={{ color: primaryColor }}>
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Compassion</h3>
            <p className="text-gray-600">Every animal deserves love, care, and a second chance at happiness.</p>
          </div>
          <div className="text-center p-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" style={{ color: primaryColor }}>
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
            <p className="text-gray-600">We provide the highest quality care and support for all our animals.</p>
          </div>
          <div className="text-center p-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" style={{ color: primaryColor }}>
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Community</h3>
            <p className="text-gray-600">We work together with volunteers, donors, and adopters to save lives.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 px-6 rounded-lg" style={{ backgroundColor: `${primaryColor}10` }}>
        <h2 
          className="text-3xl font-bold mb-4"
          style={{ color: primaryColor }}
        >
          Join Our Mission
        </h2>
        <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
          Whether you're looking to adopt, volunteer, or donate, there are many ways to help us save more lives.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`/${currentSlug}/pets`}
            className="text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            View Available Pets
          </a>
          <a
            href={`/${currentSlug}/contact`}
            className="border-2 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            style={{ 
              borderColor: primaryColor,
              color: primaryColor
            }}
          >
            Get Involved
          </a>
        </div>
      </section>
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
