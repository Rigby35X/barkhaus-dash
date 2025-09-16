import { z } from 'zod'

export const DesignSettingsSchema = z.object({
  organization_id: z.number(),
  theme_name: z.enum(['classic', 'bold']),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  bg_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#ffffff'),
  text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#132E2E'),
  heading_font: z.string(),
  body_font: z.string(),
  logo_url: z.string().url().optional(),
  favicon_url: z.string().url().optional(),
})

export type DesignSettings = z.infer<typeof DesignSettingsSchema>

// Theme tokens for runtime use
export interface ThemeTokens {
  colors: {
    primary: string
    secondary?: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  logo?: string
  favicon?: string
}

export function tokensFromDesign(design: DesignSettings): ThemeTokens {
  return {
    colors: {
      primary: design.primary_color,
      secondary: design.secondary_color,
      background: design.bg_color,
      text: design.text_color,
    },
    fonts: {
      heading: design.heading_font,
      body: design.body_font,
    },
    logo: design.logo_url,
    favicon: design.favicon_url,
  }
}
