'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrg } from '@/components/org-provider'
import { withXanoAuth } from '@/components/xano-auth-client'

type WizardProps = {
  onCloseAction?: () => void
}

type FormState = {
  // Step 1
  brandName: string
  websiteUrl: string
  // Step 2
  logoUrl: string
  primaryColor: string
  secondaryColor: string
  fontHeading: string
  fontBody: string
  // Step 3
  tagline: string
  about: string
  // Step 4 (kept local; not persisted yet unless you want)
  services: string[]
  // Step 5
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
}

const steps = [
  { key: 'basics', title: 'Basics', subtitle: 'Brand name and URL' },
  { key: 'design', title: 'Design', subtitle: 'Logo, fonts, colors' },
  { key: 'content', title: 'Content', subtitle: 'About, mission, tagline' },
  { key: 'services', title: 'Services', subtitle: 'Offerings' },
  { key: 'contact', title: 'Contact', subtitle: 'Contact information' },
] as const

export function BrandSetupWizard({ onCloseAction }: WizardProps) {
  const { orgId } = useOrg()
  const [index, setIndex] = useState(0)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<FormState>({
    brandName: '',
    websiteUrl: '',
    logoUrl: '',
    primaryColor: '#16a34a',
    secondaryColor: '#0f766e',
    fontHeading: 'Poppins, ui-sans-serif, system-ui',
    fontBody: 'Inter, ui-sans-serif, system-ui',
    tagline: '',
    about: '',
    services: ['Adoptions', 'Fostering', 'Volunteering'],
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
  })

  const pct = useMemo(() => ((index + 1) / steps.length) * 100, [index])

  const next = () => setIndex((i) => Math.min(steps.length - 1, i + 1))
  const back = () => setIndex((i) => Math.max(0, i - 1))

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`/api/upload?orgId=${encodeURIComponent(orgId)}`, {
        method: 'POST',
        body: fd,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      setForm((f) => ({ ...f, logoUrl: json.url }))
    } catch (e) {
      alert('Logo upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFinish = async () => {
    if (!form.brandName) {
      alert('Please enter your brand name')
      setIndex(0)
      return
    }
    setSaving(true)
    try {
      // Only persist fields supported by SiteSettings
      const payload = {
        orgName: form.brandName,
        tagline: form.tagline,
        logoUrl: form.logoUrl,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        fontBody: form.fontBody,
        fontHeading: form.fontHeading,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        email: form.email,
        phone: form.phone,
      }
      const res = await fetch(`/api/orgs/${orgId}/settings`, withXanoAuth({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }))
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      alert('Brand settings saved.')
      onCloseAction?.()
      // Optionally refresh to apply theming immediately
      location.reload()
    } catch (e: any) {
      alert(e.message || 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  const Header = () => (
    <div className="space-y-1">
      <div className="flex gap-4 justify-between text-sm text-muted-foreground">
        {steps.map((s, i) => (
          <div key={s.key} className="flex flex-col items-center w-full">
            <div className={`size-7 rounded-full flex items-center justify-center text-white text-xs ${i <= index ? 'bg-primary' : 'bg-muted'}`}>{i + 1}</div>
            <div className="mt-1 font-medium">{s.title}</div>
            <div className="text-xs">{s.subtitle}</div>
          </div>
        ))}
      </div>
      <div className="h-1 w-full bg-muted rounded">
        <div className="h-1 bg-primary rounded" style={{ width: `${pct}%`, transition: 'width .25s ease' }} />
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
      <Card className="w-full max-w-3xl overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle>Brand Setup Wizard</CardTitle>
          <div className="text-sm text-muted-foreground">Step {index + 1} of {steps.length}</div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Header />

          {/* Step bodies */}
          {index === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="brandName">Brand Name *</Label>
                <Input
                  id="brandName"
                  placeholder="Enter your brand name"
                  value={form.brandName}
                  onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-md border bg-muted px-2 text-sm text-muted-foreground">https://</span>
                  <Input
                    id="websiteUrl"
                    placeholder="your-brand.com"
                    value={form.websiteUrl}
                    onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {index === 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Logo</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <Input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0]; if (file) handleUpload(file)
                    }} />
                    <Button variant="outline" disabled>{uploading ? 'Uploading...' : 'Upload'}</Button>
                  </div>
                  {form.logoUrl && (
                    <img src={form.logoUrl || "/placeholder.svg"} alt="Logo preview" className="mt-3 h-10 w-auto rounded border bg-white p-1" />
                  )}
                </div>
                <div>
                  <Label htmlFor="fontHeading">Heading Font</Label>
                  <Input id="fontHeading" value={form.fontHeading} onChange={(e) => setForm((f) => ({ ...f, fontHeading: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="fontBody">Body Font</Label>
                  <Input id="fontBody" value={form.fontBody} onChange={(e) => setForm((f) => ({ ...f, fontBody: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input type="color" className="w-16 h-10 p-1" value={form.primaryColor} onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))} />
                    <Input value={form.primaryColor} onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input type="color" className="w-16 h-10 p-1" value={form.secondaryColor} onChange={(e) => setForm((f) => ({ ...f, secondaryColor: e.target.value }))} />
                    <Input value={form.secondaryColor} onChange={(e) => setForm((f) => ({ ...f, secondaryColor: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {index === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" placeholder="Caring for pets. Building forever homes." value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="about">About / Mission</Label>
                <Textarea id="about" rows={6} placeholder="Share your mission and story..." value={form.about} onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))} />
              </div>
            </div>
          )}

          {index === 3 && (
            <div className="space-y-3">
              <Label>Service Offerings</Label>
              <div className="space-y-2">
                {form.services.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={s} onChange={(e) => {
                      const val = e.target.value
                      setForm((f) => {
                        const next = [...f.services]
                        next[i] = val
                        return { ...f, services: next }
                      })
                    }} />
                    <Button variant="outline" onClick={() => setForm((f) => ({ ...f, services: f.services.filter((_, idx) => idx !== i) }))}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={() => setForm((f) => ({ ...f, services: [...f.services, ''] }))}>Add service</Button>
              <p className="text-xs text-muted-foreground">Note: Services are not saved to org settings yet. Tell me which Xano collection to persist to and I’ll wire it.</p>
            </div>
          )}

          {index === 4 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address1">Address Line 1</Label>
                <Input id="address1" value={form.addressLine1} onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input id="address2" value={form.addressLine2} onChange={(e) => setForm((f) => ({ ...f, addressLine2: e.target.value }))} />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <div className="flex gap-2">
              <Button variant="outline" onClick={back} disabled={index === 0}>
                Back
              </Button>
              <Button variant="ghost" onClick={onCloseAction}>
                Cancel
              </Button>
            </div>
            {index === steps.length - 1 ? (
              <Button onClick={handleFinish} disabled={saving}>
                {saving ? 'Saving...' : 'Finish'}
              </Button>
            ) : (
              <Button onClick={next}>Next</Button>
            )}
          </div>

        
        </CardContent>
      </Card>
    </div>
  )
}
