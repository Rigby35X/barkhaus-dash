import React from 'react'
import { SectionRenderer } from './sections/SectionRenderer'

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

interface SiteRendererProps {
  data: SiteData
}

export function SiteRenderer({ data }: SiteRendererProps) {
  const { design, page, organization, animals, services, site_content, site_config } = data

  // Apply theme styles
  const themeStyles = {
    '--primary-color': design.primary_color || '#3B82F6',
    '--secondary-color': design.secondary_color || '#1E40AF',
    '--background-color': design.background_color || '#FFFFFF',
    '--font-color': design.font_color || '#1F2937',
    '--heading-font': design.heading_font_family || 'Inter',
    '--body-font': design.body_font_family || 'Inter',
  } as React.CSSProperties

  return (
    <div 
      className="min-h-screen"
      style={{
        ...themeStyles,
        backgroundColor: design.background_color || '#FFFFFF',
        color: design.font_color || '#1F2937',
        fontFamily: design.body_font_family || 'Inter, sans-serif'
      }}
    >
      {/* Render page sections */}
      {page.sections
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            design={design}
            organization={organization}
            animals={animals}
            services={services}
            site_content={site_content}
            site_config={site_config}
          />
        ))}
    </div>
  )
}
