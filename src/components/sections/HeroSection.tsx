import React from 'react'

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
      className="relative py-24 px-4 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${design.primary_color || '#3B82F6'}15 0%, ${design.secondary_color || '#1E40AF'}10 100%)`,
        color: design.font_color || '#1F2937'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto text-center max-w-5xl relative z-10">
        <h1
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          style={{
            color: design.primary_color || '#3B82F6',
            fontFamily: design.heading_font_family || 'Inter, sans-serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
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

        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
          {data.primaryCta && (
            <a
              href={data.primaryCta.href}
              className="group relative px-10 py-5 rounded-full text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: design.primary_color || '#3B82F6',
                boxShadow: `0 8px 25px ${design.primary_color || '#3B82F6'}40`
              }}
            >
              <span className="relative z-10">{data.primaryCta.label}</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </a>
          )}

          {data.secondaryCta && (
            <a
              href={data.secondaryCta.href}
              className="group relative px-10 py-5 rounded-full text-lg font-bold border-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                borderColor: design.primary_color || '#3B82F6',
                color: design.primary_color || '#3B82F6',
                borderWidth: '3px'
              }}
            >
              <span className="relative z-10">{data.secondaryCta.label}</span>
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: design.primary_color || '#3B82F6' }}
              ></div>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
