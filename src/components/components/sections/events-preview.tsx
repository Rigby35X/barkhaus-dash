"use client"

import Link from "next/link"
import { events } from "@/lib/data/events"
import { EditableElement } from "@/components/editable-element"

export function EventsPreview() {
  const upcoming = events.slice(0, 3)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <EditableElement id="events-title" type="text" className="text-3xl font-bold">
            Upcoming Events
          </EditableElement>
          <Link href="/events" className="text-sm underline underline-offset-4">
            See all events
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {upcoming.map((e) => (
            <div key={e.id} className="rounded-lg border bg-background p-6">
              <h3 className="font-semibold text-lg">{e.title}</h3>
              <p className="text-sm text-muted-foreground">
                {e.date} • {e.location}
              </p>
              <p className="text-sm text-muted-foreground mt-2">{e.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
