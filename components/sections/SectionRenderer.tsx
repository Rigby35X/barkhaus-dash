import React from 'react'
import { HeaderSection } from './HeaderSection'
import { HeroSection } from './HeroSection'
import { AboutSection } from './AboutSection'
import { ContactSection } from './ContactSection'
import { FooterSection } from './FooterSection'
import { GridAnimalsSection } from './GridAnimalsSection'
import { ValuePropsSection } from './ValuePropsSection'
import { TestimonialsSection } from './TestimonialsSection'
import { CTASection } from './CTASection'
import { FAQSection } from './FAQSection'

interface SectionProps {
  section: {
    id: number
    section_name: string
    sort_order: number
    content_json?: string
    data?: any
    type?: string
  }
  design: any
  organization: any
  animals?: any[]
  services?: any[]
  site_content?: any
  site_config?: any
}

export function SectionRenderer({ section, design, organization, animals, services, site_content, site_config }: SectionProps) {
  // Parse section data
  let sectionData = section.data
  if (!sectionData && section.content_json) {
    try {
      sectionData = JSON.parse(section.content_json)
    } catch (error) {
      console.error('Failed to parse section content_json:', error)
      sectionData = {}
    }
  }

  const sectionType = section.section_name || section.type

  // Common props for all sections
  const commonProps = {
    data: sectionData,
    design,
    organization,
    animals,
    services,
    site_content,
    site_config
  }

  switch (sectionType) {
    case 'header':
      return <HeaderSection {...commonProps} />
    
    case 'hero':
      return <HeroSection {...commonProps} />
    
    case 'value-props':
      return <ValuePropsSection {...commonProps} />
    
    case 'about':
      return <AboutSection {...commonProps} />
    
    case 'grid-animals':
      return <GridAnimalsSection {...commonProps} />
    
    case 'testimonials':
      return <TestimonialsSection {...commonProps} />
    
    case 'cta':
      return <CTASection {...commonProps} />
    
    case 'faq':
      return <FAQSection {...commonProps} />
    
    case 'contact':
      return <ContactSection {...commonProps} />
    
    case 'footer':
      return <FooterSection {...commonProps} />
    
    default:
      return (
        <div className="p-4 bg-gray-100 border border-gray-300">
          <p className="text-gray-600">Unknown section type: {sectionType}</p>
          <pre className="text-xs mt-2 overflow-auto">
            {JSON.stringify(sectionData, null, 2)}
          </pre>
        </div>
      )
  }
}
