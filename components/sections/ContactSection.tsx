import React from 'react'

interface ContactSectionProps {
  data: {
    type?: string
    heading?: string
    email?: string
    phone?: string
    address?: string
  }
  design: any
  organization: any
  site_content?: any
}

export function ContactSection({ data, design, organization, site_content }: ContactSectionProps) {
  const heading = data.heading || 'Get In Touch'
  const email = data.email || site_content?.email || organization.email || 'info@rescue.org'
  const phone = data.phone || site_content?.phone || organization.phone || '(555) 123-4567'
  const address = data.address || site_content?.address_line1 || organization.address || 'Address not provided'

  return (
    <section className="py-16 px-4" style={{ backgroundColor: design.background_color || '#FFFFFF' }}>
      <div className="container mx-auto max-w-4xl">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ 
            color: design.primary_color || '#3B82F6',
            fontFamily: design.heading_font_family || 'Inter, sans-serif'
          }}
        >
          {heading}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div 
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${design.primary_color || '#3B82F6'}20` }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: design.primary_color || '#3B82F6' }}>
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ 
                color: design.primary_color || '#3B82F6',
                fontFamily: design.heading_font_family || 'Inter, sans-serif'
              }}
            >
              Email
            </h3>
            <p 
              className="text-gray-600"
              style={{ 
                color: design.font_color || '#6B7280',
                fontFamily: design.body_font_family || 'Inter, sans-serif'
              }}
            >
              {email}
            </p>
          </div>

          <div>
            <div 
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${design.primary_color || '#3B82F6'}20` }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: design.primary_color || '#3B82F6' }}>
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ 
                color: design.primary_color || '#3B82F6',
                fontFamily: design.heading_font_family || 'Inter, sans-serif'
              }}
            >
              Phone
            </h3>
            <p 
              className="text-gray-600"
              style={{ 
                color: design.font_color || '#6B7280',
                fontFamily: design.body_font_family || 'Inter, sans-serif'
              }}
            >
              {phone}
            </p>
          </div>

          <div>
            <div 
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${design.primary_color || '#3B82F6'}20` }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: design.primary_color || '#3B82F6' }}>
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ 
                color: design.primary_color || '#3B82F6',
                fontFamily: design.heading_font_family || 'Inter, sans-serif'
              }}
            >
              Address
            </h3>
            <p 
              className="text-gray-600"
              style={{ 
                color: design.font_color || '#6B7280',
                fontFamily: design.body_font_family || 'Inter, sans-serif'
              }}
            >
              {address}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
