'use client'

import { createContext, useContext, useEffect, useMemo, useState, ReactNode, Suspense } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'

interface Organization {
  id: string
  name: string
  domain?: string
  subdomain?: string
}

type OrgContextValue = {
  orgId: string
  orgName: string
  organizations: Organization[]
  setOrgId: (id: string) => void
  isMultiTenant: boolean
  currentOrg: Organization | null
}

const OrgContext = createContext<OrgContextValue | null>(null)

// Domain-to-org mapping - in production this would come from a database
const DOMAIN_ORG_MAP: Record<string, string> = {
  'demo1.example.com': 'org-1',
  'demo2.example.com': 'org-2',
  'localhost:3000': 'default',
}

// Mock organizations - in production this would come from an API
const ORGANIZATIONS: Organization[] = [
  { id: 'default', name: 'Default Organization', domain: 'localhost:3000' },
  { id: 'org-1', name: 'Animal Shelter A', domain: 'demo1.example.com' },
  { id: 'org-2', name: 'Animal Shelter B', domain: 'demo2.example.com' },
]

function resolveOrgFromDomain(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const hostname = window.location.hostname
    const port = window.location.port
    const hostWithPort = port ? `${hostname}:${port}` : hostname

    // Check exact domain match first
    if (DOMAIN_ORG_MAP[hostWithPort]) {
      return DOMAIN_ORG_MAP[hostWithPort]
    }

    // Check subdomain pattern (e.g., org1.myapp.com)
    const subdomain = hostname.split('.')[0]
    const orgBySubdomain = ORGANIZATIONS.find(org => org.subdomain === subdomain)
    if (orgBySubdomain) {
      return orgBySubdomain.id
    }

    return null
  } catch (error) {
    console.warn('Failed to resolve org from domain:', error)
    return null
  }
}

function OrgProviderInner({ children }: { children: ReactNode }) {
  const params = useSearchParams()
  const pathname = usePathname()
  const [orgId, setOrgId] = useState<string>('default')
  const [organizations] = useState<Organization[]>(ORGANIZATIONS)

  useEffect(() => {
    // Priority: ?orgId= -> domain/subdomain -> localStorage -> NEXT_PUBLIC_DEFAULT_ORG_ID -> 'default'
    const fromQuery = params.get('orgId')
    const fromDomain = resolveOrgFromDomain()
    const stored = typeof window !== 'undefined' ? localStorage.getItem('orgId') : null
    const envDefault = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID

    const resolved = fromQuery || fromDomain || stored || envDefault || 'default'
    setOrgId(resolved)
  }, [params])

  useEffect(() => {
    // Only store in localStorage if not resolved from domain
    // This prevents domain-based orgs from being overridden
    const fromDomain = resolveOrgFromDomain()
    if (!fromDomain && orgId) {
      localStorage.setItem('orgId', orgId)
    }
  }, [orgId])

  const currentOrg = organizations.find(org => org.id === orgId) || null
  const orgName = currentOrg?.name || 'Unknown Organization'
  const isMultiTenant = organizations.length > 1

  const value = useMemo(() => ({
    orgId,
    orgName,
    organizations,
    setOrgId,
    isMultiTenant,
    currentOrg
  }), [orgId, orgName, organizations, isMultiTenant, currentOrg])

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}

export function OrgProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrgProviderInner>{children}</OrgProviderInner>
    </Suspense>
  )
}

export function useOrg() {
  const ctx = useContext(OrgContext)
  if (!ctx) throw new Error('useOrg must be used within OrgProvider')
  return ctx
}
