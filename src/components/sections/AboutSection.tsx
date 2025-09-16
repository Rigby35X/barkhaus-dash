import React from 'react'

interface AboutSectionProps {
  data: {
    type?: string
    heading?: string
    body?: string
  }
  design: any
  organization: any
  site_content?: any
}

export function AboutSection({ data, design, organization, site_content }: AboutSectionProps) {
  const heading = data.heading || 'About Our Mission'
  const body = data.body || site_content?.mission_statement || `${organization.name} is dedicated to helping animals find loving homes.`

  return (
    <section 
      className="py-16 px-4"
      style={{ 
        backgroundColor: design.background_color || '#FFFFFF',
        color: design.font_color || '#1F2937'
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ 
              color: design.primary_color || '#3B82F6',
              fontFamily: design.heading_font_family || 'Inter, sans-serif'
            }}
          >
            {heading}
          </h2>
        </div>

        <div className="prose prose-lg mx-auto">
          <p 
            className="text-lg leading-relaxed"
            style={{ 
              color: design.font_color || '#1F2937',
              fontFamily: design.body_font_family || 'Inter, sans-serif'
            }}
          >
            {body}
          </p>
        </div>
      </div>
    </section>
  )
}
