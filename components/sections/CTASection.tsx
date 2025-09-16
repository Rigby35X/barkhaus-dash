import React from 'react'
import Link from 'next/link'

interface CTASectionProps {
  data: {
    type?: string
    heading?: string
    body?: string
    cta?: {
      label: string
      href: string
    }
  }
  design: any
}

export function CTASection({ data, design }: CTASectionProps) {
  const heading = data.heading || 'Ready to Adopt?'
  const body = data.body || 'Browse our available pets and find your new best friend today.'
  const cta = data.cta || { label: 'View Available Pets', href: '/pets' }

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: design.primary_color || '#3B82F6' }}
    >
      <div className="container mx-auto text-center max-w-3xl">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-6 text-white"
          style={{ fontFamily: design.heading_font_family || 'Inter, sans-serif' }}
        >
          {heading}
        </h2>
        
        {body && (
          <p 
            className="text-xl mb-8 text-white opacity-90"
            style={{ fontFamily: design.body_font_family || 'Inter, sans-serif' }}
          >
            {body}
          </p>
        )}

        <Link
          href={cta.href}
          className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          style={{ color: design.primary_color || '#3B82F6' }}
        >
          {cta.label}
        </Link>
      </div>
    </section>
  )
}
