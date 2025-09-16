import React from 'react'

interface CTASectionProps {
  data: any
  design: any
}

export function CTASection({ data, design }: CTASectionProps) {
  return (
    <section className="py-16 px-4 bg-blue-600 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Ready to Adopt?</h2>
        <p>CTA section - coming soon!</p>
      </div>
    </section>
  )
}
