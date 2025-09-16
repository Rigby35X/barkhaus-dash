"use client"

import Link from "next/link"
import { EditableElement } from "@/components/editable-element"

export function ApplicationsPreview() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 space-y-6">
        <EditableElement id="applications-title" type="text" className="text-3xl font-bold text-center">
          Become Part of Their Journey
        </EditableElement>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Adopt", href: "/applications#adopt", desc: "Find your new family member." },
            { title: "Volunteer", href: "/applications#volunteer", desc: "Lend a hand and a heart." },
            { title: "Foster", href: "/applications#foster", desc: "Provide a temporary loving home." },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border bg-background p-6">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
              <Link href={item.href} className="text-sm underline underline-offset-4">
                Apply →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
