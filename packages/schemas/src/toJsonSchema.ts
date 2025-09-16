import { zodToJsonSchema } from 'zod-to-json-schema'
import {
  HeaderSectionSchema,
  HeroSectionSchema,
  ValuePropsSectionSchema,
  AboutSectionSchema,
  GridAnimalsSectionSchema,
  TestimonialsSectionSchema,
  CTASectionSchema,
  FAQSectionSchema,
  ContactSectionSchema,
  FooterSectionSchema,
  SectionSchema
} from './sections'
import { PlannerOutputSchema } from './pages'
import { DesignSettingsSchema } from './design'

// Export JSON schemas for AI prompts
export const Schema_Header = zodToJsonSchema(HeaderSectionSchema, {
  name: 'HeaderSection',
  $refStrategy: 'none'
})

export const Schema_Hero = zodToJsonSchema(HeroSectionSchema, {
  name: 'HeroSection', 
  $refStrategy: 'none'
})

export const Schema_ValueProps = zodToJsonSchema(ValuePropsSectionSchema, {
  name: 'ValuePropsSection',
  $refStrategy: 'none'
})

export const Schema_About = zodToJsonSchema(AboutSectionSchema, {
  name: 'AboutSection',
  $refStrategy: 'none'
})

export const Schema_GridAnimals = zodToJsonSchema(GridAnimalsSectionSchema, {
  name: 'GridAnimalsSection',
  $refStrategy: 'none'
})

export const Schema_Testimonials = zodToJsonSchema(TestimonialsSectionSchema, {
  name: 'TestimonialsSection',
  $refStrategy: 'none'
})

export const Schema_CTA = zodToJsonSchema(CTASectionSchema, {
  name: 'CTASection',
  $refStrategy: 'none'
})

export const Schema_FAQ = zodToJsonSchema(FAQSectionSchema, {
  name: 'FAQSection',
  $refStrategy: 'none'
})

export const Schema_Contact = zodToJsonSchema(ContactSectionSchema, {
  name: 'ContactSection',
  $refStrategy: 'none'
})

export const Schema_Footer = zodToJsonSchema(FooterSectionSchema, {
  name: 'FooterSection',
  $refStrategy: 'none'
})

export const Schema_Section = zodToJsonSchema(SectionSchema, {
  name: 'Section',
  $refStrategy: 'none'
})

export const Schema_PlannerOutput = zodToJsonSchema(PlannerOutputSchema, {
  name: 'PlannerOutput',
  $refStrategy: 'none'
})

export const Schema_DesignSettings = zodToJsonSchema(DesignSettingsSchema, {
  name: 'DesignSettings',
  $refStrategy: 'none'
})

// Helper to get schema by section type
export function getSchemaForSectionType(sectionType: string) {
  switch (sectionType) {
    case 'header': return Schema_Header
    case 'hero': return Schema_Hero
    case 'value-props': return Schema_ValueProps
    case 'about': return Schema_About
    case 'grid-animals': return Schema_GridAnimals
    case 'testimonials': return Schema_Testimonials
    case 'cta': return Schema_CTA
    case 'faq': return Schema_FAQ
    case 'contact': return Schema_Contact
    case 'footer': return Schema_Footer
    default: throw new Error(`Unknown section type: ${sectionType}`)
  }
}

// Export all schemas as a map
export const SECTION_SCHEMAS = {
  header: Schema_Header,
  hero: Schema_Hero,
  'value-props': Schema_ValueProps,
  about: Schema_About,
  'grid-animals': Schema_GridAnimals,
  testimonials: Schema_Testimonials,
  cta: Schema_CTA,
  faq: Schema_FAQ,
  contact: Schema_Contact,
  footer: Schema_Footer
} as const
