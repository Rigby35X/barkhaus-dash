"use client"

import Link from "next/link"
import { EditableText } from '@/components/editable-text'
import { EditableImage } from '@/components/editable-image'

export function ContactPreview() {
  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4 grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <EditableText id="contact-title" as="h2" className="text-3xl font-bold" defaultText="We’d Love to Hear From You" />
          <EditableText id="contact-blurb" as="p" className="text-muted-foreground" defaultText="Questions about adoption, volunteering, or donations? Our team is here to help." />
          <Link
            href="/contact"
            className="inline-flex items-center text-sm font-medium underline underline-offset-4"
          >
            Contact us →
          </Link>
        </div>
        <EditableImage id="contact-image" alt="Contact Barkhaus" className="w-full rounded-lg border" />
      </div>
    </section>
  )
}
