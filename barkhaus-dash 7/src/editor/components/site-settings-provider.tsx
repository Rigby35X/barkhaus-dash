'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useOrg } from '@/components/org-provider'
import { withXanoAuth } from '@/components/xano-auth-client'

export type SiteSettings = {
  orgName: string
  tagline?: string
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
  fontBody?: string
  fontHeading?: string
  addressLine1?: string
  addressLine2?: string
  email?: string
  phone?: string
}

const defaultSettings: SiteSettings = {
  orgName: 'Barkhaus',
  tagline: 'Caring for pets. Building forever homes.',
  logoUrl: '',
  primaryColor: '#16a34a',
  secondaryColor: '#0f766e',
  fontBody: 'Inter, ui-sans-serif, system-ui',
  fontHeading: 'Poppins, ui-sans-serif, system-ui',
  addressLine1: '1234 Wagging Tail Rd',
  addressLine2: 'Barkville, BH 00000',
  email: 'hello@barkhaus.com',
  phone: '(555) 123-4567',
}

const SettingsContext = createContext<{ settings: SiteSettings } | null>(null)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { orgId } = useOrg()
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/org/${orgId}/settings`, withXanoAuth())
        if (res.ok) {
          const data = await res.json()
          setSettings({ ...defaultSettings, ...data })
        }
      } catch {
        // keep defaults
      }
    }
    if (orgId) load()
  }, [orgId])

  // Apply brand theming
  useEffect(() => {
    const root = document.documentElement
    if (settings.primaryColor) root.style.setProperty('--brand-primary', settings.primaryColor)
    if (settings.secondaryColor) root.style.setProperty('--brand-secondary', settings.secondaryColor)
    document.body.style.fontFamily = settings.fontBody || defaultSettings.fontBody
  }, [settings])

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider')
  return ctx
}
