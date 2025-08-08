"use client"

import Link from '@/editor/next-shims'
import { EditableText } from '@/components/editable-text'
import { EditableImage } from '@/components/editable-image'

export function DonatePreview() {
  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4 grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <EditableText id="donate-title" as="h2" className="text-3xl font-bold" defaultText="Your Gift Saves Lives" />
          <EditableText id="donate-blurb" as="p" className="text-muted-foreground" defaultText="Donations provide food, shelter, medical care, and training—ensuring every pet has a chance at a loving home." />
          <Link
            href="/donate"
            className="inline-flex items-center text-sm font-medium underline underline-offset-4"
          >
            Donate now →
          </Link>
        </div>
        <EditableImage id="donate-image" alt="Donate to help animals" className="w-full rounded-lg border" />
      </div>
    </section>
  )
}
