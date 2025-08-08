"use client"

import { Link } from '../../next-shims'
import { EditableText } from '../editable-text'
import { EditableImage } from '../editable-image'

export function AboutPreview() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 grid gap-6 md:grid-cols-2 items-center">
        <EditableImage id="about-image" alt="About Barkhaus" className="w-full rounded-lg border" />
        <div className="space-y-4">
          <EditableText id="about-title" as="h2" className="text-3xl font-bold" defaultText="Barkhaus Story" />
          <EditableText id="about-blurb" as="p" className="text-muted-foreground" defaultText="We provide exceptional care, rehabilitation, and placement for pets in need—powered by a passionate team and loving community." />
          <Link
            href="/about"
            className="inline-flex items-center text-sm font-medium underline underline-offset-4"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </section>
  )
}
