
import React, { useEffect, useState } from 'react'
import { getDesignSettings, getLiveSite, getPages, savePage, publish } from './api'
// TODO: update these imports to your actual paths
// @ts-ignore
import { useTenant } from '@/contexts/TenantContext'
import InlineCanvas from './components/InlineCanvas'
import { applyDesignToDocument } from './design-theme'
import Sidebar from './components/Sidebar'

export default function EditorShell() {
  // @ts-ignore
  const { currentTenant } = useTenant()
  const [loading, setLoading] = useState(true)
  const [design, setDesign] = useState<any>(null)
  const [live, setLive] = useState<any>(null)
  const [pages, setPages] = useState<any[]>([])

  useEffect(() => {
    let ok = true
    async function run() {
      if (!currentTenant) return
      setLoading(true)
      const [d, l, p] = await Promise.all([
        getDesignSettings(currentTenant.slug),
        getLiveSite(currentTenant.id),
        getPages(currentTenant.id),
      ])
      if (!ok) return
      setDesign(d); setLive(l); setPages(p); applyDesignToDocument(d); setLoading(false)
    }
    run()
    return () => { ok = false }
  }, [currentTenant])

  if (!currentTenant) return <div className="p-6">No tenant selected.</div>
  if (loading) return <div className="p-6">Loading editor…</div>

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <Sidebar
        design={design}
        pages={pages}
        onSave={async (payload:any) => { await savePage(payload) }}
        onPublish={async (pageSlug?: string) => { await publish({ pageSlug, tenant_id: currentTenant.id }) }}
      />
      <InlineCanvas tenant={currentTenant} design={design} live={live} />
    </div>
  )
}
