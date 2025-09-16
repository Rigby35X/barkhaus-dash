import React from 'react'

interface ValuePropsSectionProps {
  data: {
    type?: string
    heading?: string
    items?: Array<{
      title: string
      description: string
    }>
  }
  design: any
}

export function ValuePropsSection({ data, design }: ValuePropsSectionProps) {
  const heading = data.heading || 'Why Choose Us'
  const items = data.items || [
    { title: 'Loving Care', description: 'Every animal receives individual attention and medical care' },
    { title: 'Perfect Matches', description: 'We help you find the perfect companion for your family' },
    { title: 'Ongoing Support', description: 'We provide support throughout the adoption process' }
  ]

  return (
    <section className="py-16 px-4" style={{ backgroundColor: design.background_color || '#FFFFFF' }}>
      <div className="container mx-auto">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ 
            color: design.primary_color || '#3B82F6',
            fontFamily: design.heading_font_family || 'Inter, sans-serif'
          }}
        >
          {heading}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={index} className="text-center">
              <h3 
                className="text-xl font-semibold mb-4"
                style={{ 
                  color: design.primary_color || '#3B82F6',
                  fontFamily: design.heading_font_family || 'Inter, sans-serif'
                }}
              >
                {item.title}
              </h3>
              <p 
                className="text-gray-600"
                style={{ 
                  color: design.font_color || '#6B7280',
                  fontFamily: design.body_font_family || 'Inter, sans-serif'
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
