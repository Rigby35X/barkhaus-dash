import React from 'react'
import Link from 'next/link'

interface HeroSectionProps {
  data: {
    type?: string
    heading?: string
    subheading?: string
    primaryCta?: {
      label: string
      href: string
    }
    secondaryCta?: {
      label: string
      href: string
    }
  }
  design: any
  organization: any
}

export function HeroSection({ data, design, organization }: HeroSectionProps) {
  const heading = data.heading || `Welcome to ${organization.name}`
  const subheading = data.subheading || 'Helping animals find loving homes'

  return (
    <section 
      className="py-20 px-4"
      style={{ 
        backgroundColor: design.background_color || '#FFFFFF',
        color: design.font_color || '#1F2937'
      }}
    >
      <div className="container mx-auto text-center max-w-4xl">
        <h1 
          className="text-4xl md:text-6xl font-bold mb-6"
          style={{ 
            color: design.primary_color || '#3B82F6',
            fontFamily: design.heading_font_family || 'Inter, sans-serif'
          }}
        >
          {heading}
        </h1>
        
        {subheading && (
          <p 
            className="text-xl md:text-2xl mb-8 text-gray-600"
            style={{ 
              color: design.font_color || '#6B7280',
              fontFamily: design.body_font_family || 'Inter, sans-serif'
            }}
          >
            {subheading}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {data.primaryCta && (
            <Link
              href={data.primaryCta.href}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              style={{ backgroundColor: design.primary_color || '#3B82F6' }}
            >
              {data.primaryCta.label}
            </Link>
          )}
          
          {data.secondaryCta && (
            <Link
              href={data.secondaryCta.href}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              style={{ 
                borderColor: design.primary_color || '#3B82F6',
                color: design.primary_color || '#3B82F6'
              }}
            >
              {data.secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
