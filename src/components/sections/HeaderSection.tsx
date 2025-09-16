import React from 'react'

interface HeaderSectionProps {
  data: {
    type?: string
    links?: Array<{
      label: string
      href: string
    }>
    showDonate?: boolean
  }
  design: any
  organization: any
}

export function HeaderSection({ data, design, organization }: HeaderSectionProps) {
  const links = data.links || [
    { label: 'Home', href: '/' },
    { label: 'Available Pets', href: '/pets' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ]

  // Get current slug from URL for proper navigation
  const currentSlug = window.location.pathname.split('/')[1] || organization.slug

  return (
    <header 
      className="bg-white shadow-sm border-b"
      style={{ 
        backgroundColor: design.background_color || '#FFFFFF',
        borderColor: design.primary_color || '#3B82F6'
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {design.logo_url && (
              <img 
                src={design.logo_url} 
                alt={organization.name}
                className="h-10 w-auto"
              />
            )}
            <h1 
              className="text-xl font-bold"
              style={{ 
                color: design.primary_color || '#3B82F6',
                fontFamily: design.heading_font_family || 'Inter, sans-serif'
              }}
            >
              {organization.name}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href === '/' ? `/${currentSlug}` : `/${currentSlug}${link.href}`}
                className="text-gray-700 hover:text-blue-600 transition-colors"
                style={{ color: design.font_color || '#1F2937' }}
              >
                {link.label}
              </a>
            ))}
            
            {data.showDonate && (
              <a
                href={`/${currentSlug}/donate`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                style={{ backgroundColor: design.primary_color || '#3B82F6' }}
              >
                Donate
              </a>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
