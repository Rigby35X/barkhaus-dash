import React from 'react'

interface TestimonialsSectionProps {
  data: any
  design: any
}

export function TestimonialsSection({ data, design }: TestimonialsSectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Happy Families</h2>
        <p>Testimonials section - coming soon!</p>
      </div>
    </section>
  )
}
