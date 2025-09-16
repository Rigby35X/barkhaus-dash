import { events } from "@/lib/data/events"
import { EditableElement } from "@/components/editable-element"

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div>
        <EditableElement id="events-page-title" type="text" className="text-4xl font-bold">
          Events
        </EditableElement>
        <p className="text-muted-foreground">
          Join us to connect with the community and support our mission.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {events.map((e) => (
          <div key={e.id} className="rounded-lg border bg-background p-6 space-y-2">
            <h3 className="font-semibold text-lg">{e.title}</h3>
            <p className="text-sm text-muted-foreground">{e.date} • {e.location}</p>
            <p className="text-sm text-muted-foreground">{e.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
