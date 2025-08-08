'use client'

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'

type OrgContextValue = {
  orgId: string
  setOrgId: (id: string) => void
}

const OrgContext = createContext<OrgContextValue | null>(null)

export function OrgProvider({ children }: { children: ReactNode }) {
  const params = useSearchParams()
  const [orgId, setOrgId] = useState<string>('default')

  useEffect(() => {
    // Priority: ?orgId= -> localStorage -> NEXT_PUBLIC_DEFAULT_ORG_ID -> 'default'
    const fromQuery = params.get('orgId')
    const stored = typeof window !== 'undefined' ? localStorage.getItem('orgId') : null
    const envDefault = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID
    const resolved = fromQuery || stored || envDefault || 'default'
    setOrgId(resolved)
  }, [params])

  useEffect(() => {
    if (orgId) localStorage.setItem('orgId', orgId)
  }, [orgId])

  const value = useMemo(() => ({ orgId, setOrgId }), [orgId])

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}

export function useOrg() {
  const ctx = useContext(OrgContext)
  if (!ctx) throw new Error('useOrg must be used within OrgProvider')
  return ctx
}
