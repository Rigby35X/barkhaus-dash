import { z } from 'zod'
import { SectionSchema } from './sections'

export const PageSchema = z.object({
  id: z.number().optional(),
  organization_id: z.number(),
  key: z.string(),
  title: z.string(),
  path: z.string(),
  sort_order: z.number().default(0),
  status: z.enum(['draft', 'published']).default('draft'),
  sections: z.array(SectionSchema),
})

export type Page = z.infer<typeof PageSchema>

// For AI planner output (sections as types only)
export const PlannerPageSchema = z.object({
  key: z.string(),
  title: z.string(), 
  path: z.string(),
  sections: z.array(z.enum([
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
  ])),
})

export const PlannerOutputSchema = z.object({
  pages: z.array(PlannerPageSchema),
})

export type PlannerOutput = z.infer<typeof PlannerOutputSchema>
export type PlannerPage = z.infer<typeof PlannerPageSchema>
