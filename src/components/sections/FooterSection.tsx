import React from 'react'

interface FooterSectionProps {
  data: {
    type?: string
    ein?: string
    links?: Array<{
      label: string
      href: string
    }>
    socials?: Array<{
      platform: string
      href: string
    }>
  }
  design: any
  organization: any
  site_content?: any
}

export function FooterSection({ data, design, organization, site_content }: FooterSectionProps) {
  const ein = data.ein || site_content?.ein || organization.tax_id || '00-0000000'
  const links = data.links || [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ]
  const socials = data.socials || []

  // Get current slug from URL for proper navigation
  const currentSlug = window.location.pathname.split('/')[1] || organization.slug

  return (
    <footer 
      className="py-12 px-4"
      style={{ 
        backgroundColor: design.primary_color || '#1F2937',
        color: '#FFFFFF'
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Organization Info */}
          <div>
            <h3 
              className="text-xl font-bold mb-4"
              style={{ fontFamily: design.heading_font_family || 'Inter, sans-serif' }}
            >
              {organization.name}
            </h3>
            <p 
              className="text-gray-300 mb-4"
              style={{ fontFamily: design.body_font_family || 'Inter, sans-serif' }}
            >
              {site_content?.mission_statement || 'Helping animals find loving homes'}
            </p>
            <p 
              className="text-sm text-gray-400"
              style={{ fontFamily: design.body_font_family || 'Inter, sans-serif' }}
            >
              EIN: {ein}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              className="text-lg font-semibold mb-4"
              style={{ fontFamily: design.heading_font_family || 'Inter, sans-serif' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href === '/' ? `/${currentSlug}` : `/${currentSlug}${link.href}`}
                    className="text-gray-300 hover:text-white transition-colors"
                    style={{ fontFamily: design.body_font_family || 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 
              className="text-lg font-semibold mb-4"
              style={{ fontFamily: design.heading_font_family || 'Inter, sans-serif' }}
            >
              Connect With Us
            </h4>
            
            {site_content?.email && (
              <p 
                className="text-gray-300 mb-2"
                style={{ fontFamily: design.body_font_family || 'Inter, sans-serif' }}
              >
                {site_content.email}
              </p>
            )}
            
            {site_content?.phone && (
              <p 
                className="text-gray-300 mb-4"
                style={{ fontFamily: design.body_font_family || 'Inter, sans-serif' }}
              >
                {site_content.phone}
              </p>
            )}

            {socials.length > 0 && (
              <div className="flex space-x-4">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p 
            className="text-gray-400 text-sm"
            style={{ fontFamily: design.body_font_family || 'Inter, sans-serif' }}
          >
            © {new Date().getFullYear()} {organization.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
