import React from 'react'

interface FAQSectionProps {
  data: {
    type?: string
    heading?: string
    items?: Array<{
      q: string
      a: string
    }>
  }
  design: any
}

export function FAQSection({ data, design }: FAQSectionProps) {
  const heading = data.heading || 'Frequently Asked Questions'
  const items = data.items || [
    {
      q: 'What is the adoption process?',
      a: 'Our adoption process includes an application, meet and greet, and home visit to ensure the best match.'
    },
    {
      q: 'What are the adoption fees?',
      a: 'Adoption fees vary by animal and help cover medical care, vaccinations, and spaying/neutering.'
    }
  ]

  return (
    <section className="py-16 px-4" style={{ backgroundColor: design.background_color || '#FFFFFF' }}>
      <div className="container mx-auto max-w-3xl">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ 
            color: design.primary_color || '#3B82F6',
            fontFamily: design.heading_font_family || 'Inter, sans-serif'
          }}
        >
          {heading}
        </h2>
        
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h3 
                className="text-lg font-semibold mb-3"
                style={{ 
                  color: design.primary_color || '#3B82F6',
                  fontFamily: design.heading_font_family || 'Inter, sans-serif'
                }}
              >
                {item.q}
              </h3>
              <p 
                className="text-gray-700"
                style={{ 
                  color: design.font_color || '#1F2937',
                  fontFamily: design.body_font_family || 'Inter, sans-serif'
                }}
              >
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
