import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SiteRenderer } from '../components/SiteRenderer'
import { fetchSiteData, logAnalyticsEvent, fetchAnimals } from '../api/xano'

interface SiteData {
  design: {
    template_name?: string
    primary_color?: string
    secondary_color?: string
    background_color?: string
    font_color?: string
    heading_font_family?: string
    body_font_family?: string
    logo_url?: string
  }
  page: {
    id: number
    title: string
    path: string
    sections: Array<{
      id: number
      section_name: string
      sort_order: number
      content_json?: string
      data?: any
      type?: string
    }>
  }
  animals?: any[]
  services?: any[]
  site_content?: any
  site_config?: any
  organization: {
    name: string
    slug: string
    logo_url?: string
    tenant_id: number
  }
}

export default function PublicSite() {
  const { slug } = useParams<{ slug: string }>()
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    loadSiteData(slug)
  }, [slug])

  const loadSiteData = async (slug: string) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch real data from Xano
      console.log('Fetching site data for slug:', slug)
      const result = await fetchSiteData(slug, '/')

      if (result.success && result.data && !result.data.error) {
        console.log('✅ Real data loaded from Xano:', result.data)
        setSiteData(result.data)

        // Log analytics event
        if (result.data.organization?.tenant_id) {
          await logAnalyticsEvent(result.data.organization.tenant_id, {
            event_type: 'page_view',
            page_path: `/${slug}`,
            user_agent: navigator.userAgent,
            referrer: document.referrer
          })
        }
      } else {
        // Fallback to mock data for development
        console.log('⚠️ No real data found, using mock data for:', slug)
        if (slug === 'happy-paws' || slug === 'happy-paws-rescue') {
          const mockData: SiteData = {
          design: {
            template_name: 'classic',
            primary_color: '#3B82F6',
            secondary_color: '#1E40AF',
            background_color: '#FFFFFF',
            font_color: '#1F2937',
            heading_font_family: 'Inter',
            body_font_family: 'Inter',
            logo_url: ''
          },
          page: {
            id: 1,
            title: 'Home',
            path: '/',
            sections: [
              {
                id: 1,
                section_name: 'header',
                sort_order: 0,
                type: 'header',
                data: {
                  type: 'header',
                  links: [
                    { label: 'Home', href: '/' },
                    { label: 'Available Pets', href: '/pets' },
                    { label: 'About', href: '/about' },
                    { label: 'Contact', href: '/contact' }
                  ],
                  showDonate: true
                }
              },
              {
                id: 2,
                section_name: 'hero',
                sort_order: 1,
                type: 'hero',
                data: {
                  type: 'hero',
                  heading: 'Welcome to Happy Paws Rescue',
                  subheading: 'Saving lives, one paw at a time. Find your perfect companion today.',
                  primaryCta: {
                    label: 'View Available Pets',
                    href: '/pets'
                  }
                }
              },
              {
                id: 3,
                section_name: 'value-props',
                sort_order: 2,
                type: 'value-props',
                data: {
                  type: 'value-props',
                  heading: 'Why Choose Us',
                  items: [
                    {
                      title: 'Loving Care',
                      description: 'Every animal receives individual attention and medical care'
                    },
                    {
                      title: 'Perfect Matches',
                      description: 'We help you find the perfect companion for your family'
                    },
                    {
                      title: 'Ongoing Support',
                      description: 'We provide support throughout the adoption process'
                    }
                  ]
                }
              },
              {
                id: 4,
                section_name: 'grid-animals',
                sort_order: 3,
                type: 'grid-animals',
                data: {
                  type: 'grid-animals',
                  heading: 'Available Pets',
                  showFilters: true,
                  maxItems: 12
                }
              },
              {
                id: 5,
                section_name: 'about',
                sort_order: 4,
                type: 'about',
                data: {
                  type: 'about',
                  heading: 'About Our Mission',
                  body: 'Happy Paws Rescue is dedicated to helping animals find loving homes. We provide shelter, medical care, and love to abandoned animals while finding them perfect forever homes. Every animal deserves a second chance at happiness.'
                }
              },
              {
                id: 6,
                section_name: 'contact',
                sort_order: 5,
                type: 'contact',
                data: {
                  type: 'contact',
                  heading: 'Get In Touch',
                  email: 'info@happypaws.org',
                  phone: '(555) 123-4567',
                  address: '123 Rescue Lane, San Francisco, CA 94102'
                }
              },
              {
                id: 7,
                section_name: 'footer',
                sort_order: 6,
                type: 'footer',
                data: {
                  type: 'footer',
                  ein: '12-3456789',
                  links: [
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Contact', href: '/contact' }
                  ],
                  socials: []
                }
              }
            ]
          },
          animals: [
            {
              id: 1,
              name: 'Buddy',
              breed: 'Golden Retriever',
              age: '3 years',
              gender: 'Male',
              description: 'Buddy is a friendly and energetic dog who loves to play fetch and go on long walks.',
              image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop'
            },
            {
              id: 2,
              name: 'Luna',
              breed: 'Border Collie',
              age: '2 years',
              gender: 'Female',
              description: 'Luna is a smart and loyal companion who would make a great addition to any family.',
              image_url: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop'
            },
            {
              id: 3,
              name: 'Max',
              breed: 'Labrador Mix',
              age: '4 years',
              gender: 'Male',
              description: 'Max is a gentle giant who loves children and other pets. He\'s looking for a loving home.',
              image_url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop'
            }
          ],
          services: [],
          site_content: {
            site_name: 'Happy Paws Rescue',
            mission_statement: 'Saving lives, one paw at a time',
            email: 'info@happypaws.org',
            phone: '(555) 123-4567',
            address_line1: '123 Rescue Lane',
            address_line2: 'San Francisco, CA 94102'
          },
          site_config: {
            site_name: 'Happy Paws Rescue',
            mission_statement: 'Saving lives, one paw at a time',
            primary_color: '#3B82F6'
          },
          organization: {
            name: 'Happy Paws Rescue',
            slug: slug, // Use the actual slug from the URL
            tenant_id: 3
          }
        }

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500))
          setSiteData(mockData)
        } else {
          setError(`Site '${slug}' not found. Available: happy-paws, happy-paws-rescue (mock)`)
        }
      }
    } catch (err) {
      setError('Failed to load site - network error')
      console.error('Error fetching site data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading site...</p>
        </div>
      </div>
    )
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Site Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested site could not be found.'}</p>
          <a href="/" className="text-blue-600 hover:underline">
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  return <SiteRenderer data={siteData} />
}
