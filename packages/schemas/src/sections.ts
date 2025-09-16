import { z } from 'zod'

// Link schema for reuse
const LinkSchema = z.object({
  label: z.string().max(50),
  href: z.string()
})

// CTA schema for reuse
const CTASchema = z.object({
  label: z.string().max(30),
  href: z.string()
})

// Header Section
export const HeaderSectionSchema = z.object({
  type: z.literal('header'),
  links: z.array(LinkSchema).max(7),
  showDonate: z.boolean()
})

// Hero Section
export const HeroSectionSchema = z.object({
  type: z.literal('hero'),
  heading: z.string().max(90),
  subheading: z.string().max(180).optional(),
  primaryCta: CTASchema.optional(),
  secondaryCta: CTASchema.optional(),
  backgroundImageUrl: z.string().url().optional()
})

// Value Props Section
export const ValuePropsSectionSchema = z.object({
  type: z.literal('value-props'),
  heading: z.string().max(80),
  items: z.array(z.object({
    icon: z.string().optional(),
    title: z.string().max(48),
    description: z.string().max(140)
  })).min(3).max(6)
})

// About Section
export const AboutSectionSchema = z.object({
  type: z.literal('about'),
  heading: z.string().max(80),
  body: z.string().max(600),
  imageUrl: z.string().url().optional()
})

// Grid Animals Section
export const GridAnimalsSectionSchema = z.object({
  type: z.literal('grid-animals'),
  heading: z.string().max(80),
  showFilters: z.boolean(),
  maxItems: z.number().min(3).max(24).default(12)
})

// Testimonials Section
export const TestimonialsSectionSchema = z.object({
  type: z.literal('testimonials'),
  heading: z.string().max(80),
  items: z.array(z.object({
    quote: z.string().max(220),
    author: z.string().max(60)
  })).min(2).max(6)
})

// CTA Section
export const CTASectionSchema = z.object({
  type: z.literal('cta'),
  heading: z.string().max(80),
  body: z.string().max(200).optional(),
  cta: CTASchema
})

// FAQ Section
export const FAQSectionSchema = z.object({
  type: z.literal('faq'),
  heading: z.string().max(80),
  items: z.array(z.object({
    q: z.string().max(100),
    a: z.string().max(300)
  })).min(3).max(8)
})

// Contact Section
export const ContactSectionSchema = z.object({
  type: z.literal('contact'),
  heading: z.string().max(80),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  mapEmbedUrl: z.string().url().optional()
})

// Footer Section
export const FooterSectionSchema = z.object({
  type: z.literal('footer'),
  socials: z.array(z.object({
    platform: z.string(),
    href: z.string().url()
  })).max(6),
  ein: z.string(),
  links: z.array(LinkSchema).max(6)
})

// Union of all sections
export const SectionSchema = z.discriminatedUnion('type', [
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
])

// Export types
export type Section = z.infer<typeof SectionSchema>
export type HeaderSection = z.infer<typeof HeaderSectionSchema>
export type HeroSection = z.infer<typeof HeroSectionSchema>
export type ValuePropsSection = z.infer<typeof ValuePropsSectionSchema>
export type AboutSection = z.infer<typeof AboutSectionSchema>
export type GridAnimalsSection = z.infer<typeof GridAnimalsSectionSchema>
export type TestimonialsSection = z.infer<typeof TestimonialsSectionSchema>
export type CTASection = z.infer<typeof CTASectionSchema>
export type FAQSection = z.infer<typeof FAQSectionSchema>
export type ContactSection = z.infer<typeof ContactSectionSchema>
export type FooterSection = z.infer<typeof FooterSectionSchema>

// Section type enum for easy reference
export const SECTION_TYPES = [
  'header',
  'hero', 
  'value-props',
  'about',
  'grid-animals',
  'testimonials',
  'cta',
  'faq',
  'contact',
  'footer',
] as const

export type SectionType = typeof SECTION_TYPES[number]
