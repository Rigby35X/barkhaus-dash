'use client'

import { use, useRef, useState, useEffect } from 'react'
import { useOrg } from '@/components/org-provider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Save, Rocket } from 'lucide-react'
import { withXanoAuth } from '@/components/xano-auth-client'

export default function StudioSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { orgId } = useOrg()
  const resolvedParams = use(params)
  const slug = resolvedParams.slug || 'home'
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [src, setSrc] = useState('') // Initialize as empty string

  // Set the src after component mounts (client-side only)
  useEffect(() => {
    const path = slug === 'home' ? '/home' : `/${slug}`
    const url = new URL(path, window.location.origin)
    url.searchParams.set('edit', 'true')
    url.searchParams.set('orgId', orgId)
    url.searchParams.set('embed', 'studio')
    setSrc(url.toString())
  }, [slug, orgId])

  const postToIframe = (payload: any) => {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    win.postMessage(payload, window.location.origin)
  }

  const handleTogglePreview = () => {
    setPreview((p) => !p)
    postToIframe({ type: 'studio:togglePreview' })
  }

  const handleSave = async () => {
    setSaving(true)
    postToIframe({ type: 'studio:save' })
    // Give the iframe a moment; optionally you could await a reply
    setTimeout(() => setSaving(false), 600)
  }

  const handlePublish = async () => {
    try {
      setPublishing(true)
      // Optional: tell iframe to save before publishing
      postToIframe({ type: 'studio:save' })
      const res = await fetch(`/api/orgs/${orgId}/publish`, withXanoAuth({ method: 'POST' }))
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Publish failed')
      }
      alert('Published!')
    } catch (e: any) {
      alert(e.message || 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  // Ensure the iframe reloads when org changes or slug changes
  useEffect(() => {
    if (src) { // Only send message when src is available
      iframeRef.current?.contentWindow?.postMessage({ type: 'studio:init' }, window.location.origin)
    }
  }, [src])

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full flex flex-col">
      <div className="flex items-center gap-2 border-b bg-background px-4 py-2">
        <Button variant="outline" size="sm" onClick={handleTogglePreview}>
          {preview ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Exit Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </>
          )}
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button size="sm" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button size="sm" variant="secondary" onClick={handlePublish} disabled={publishing}>
          <Rocket className="h-4 w-4 mr-2" />
          {publishing ? 'Publishing…' : 'Publish'}
        </Button>
        <div className="ml-auto text-xs text-muted-foreground">Editing: {slug}</div>
      </div>
      {src ? (
        <iframe
          ref={iframeRef}
          src={src}
          className="w-full flex-1"
          title="Barkhaus Editor"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />
      ) : (
        <div className="w-full flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading editor...</div>
        </div>
      )}
    </div>
  )
}