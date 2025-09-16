import React from 'react'

interface FAQSectionProps {
  data: any
  design: any
}

export function FAQSection({ data, design }: FAQSectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <p>FAQ section - coming soon!</p>
      </div>
    </section>
  )
}
