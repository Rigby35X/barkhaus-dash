'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Progress } from '../ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

// Lightweight mock of the shared screenshot for UX reference.
const steps = [
  { key: 'basics', title: 'Basics', subtitle: 'Brand name and URL' },
  { key: 'design', title: 'Design', subtitle: 'Logo, fonts, colors' },
  { key: 'content', title: 'Content', subtitle: 'About, mission, tagline' },
  { key: 'services', title: 'Services', subtitle: 'Offerings' },
  { key: 'contact', title: 'Contact', subtitle: 'Pricing and contact info' },
]

export function BrandSetupWizard() {
  const [index, setIndex] = useState(0)
  const [form, setForm] = useState({
    brandName: '',
    websiteUrl: '',
  })
  const pct = ((index + 1) / steps.length) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-2xl overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle>Brand Setup Wizard</CardTitle>
          <div className="text-sm text-muted-foreground">Step {index + 1} of {steps.length}</div>
        </CardHeader>
        <Progress value={pct} className="mx-6" />
        <CardContent className="p-6 space-y-6">
          <div className="flex gap-4 justify-between text-sm text-muted-foreground">
            {steps.map((s, i) => (
              <div key={s.key} className="flex flex-col items-center w-full">
                <div className={`size-7 rounded-full flex items-center justify-center text-white text-xs ${i <= index ? 'bg-primary' : 'bg-muted'}`}>{i + 1}</div>
                <div className="mt-1 font-medium">{s.title}</div>
                <div className="text-xs">{s.subtitle}</div>
              </div>
            ))}
          </div>

          {index === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm">Brand Name *</label>
                <Input
                  placeholder="Enter your brand name"
                  value={form.brandName}
                  onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm">Website URL *</label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-md border bg-muted px-2 text-sm text-muted-foreground">https://</span>
                  <Input
                    placeholder="your-brand.com"
                    value={form.websiteUrl}
                    onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
              Back
            </Button>
            <Button onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}>
              {index === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>

          <div className="mt-4">
            <img src="/images/wizard-example.png" alt="Wizard reference" className="rounded-md border" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
