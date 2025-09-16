import React from 'react'

interface TestimonialsSectionProps {
  data: {
    type?: string
    heading?: string
    items?: Array<{
      quote: string
      author: string
    }>
  }
  design: any
}

export function TestimonialsSection({ data, design }: TestimonialsSectionProps) {
  const heading = data.heading || 'Happy Families'
  const items = data.items || [
    { quote: 'We found our perfect companion through this amazing rescue!', author: 'Sarah M.' },
    { quote: 'The staff was so helpful in finding the right pet for our family.', author: 'Mike D.' }
  ]

  return (
    <section className="py-16 px-4" style={{ backgroundColor: design.background_color || '#F9FAFB' }}>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {items.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <blockquote 
                className="text-lg italic mb-4"
                style={{ 
                  color: design.font_color || '#1F2937',
                  fontFamily: design.body_font_family || 'Inter, sans-serif'
                }}
              >
                "{item.quote}"
              </blockquote>
              <cite 
                className="text-sm font-semibold"
                style={{ color: design.primary_color || '#3B82F6' }}
              >
                — {item.author}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
