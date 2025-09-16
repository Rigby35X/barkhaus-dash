import { EditableElement } from "@/components/editable-element"
import { EditableText } from '@/components/editable-text'
import { EditableImage } from '@/components/editable-image'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <div className="grid gap-6 md:grid-cols-2 items-center">
        <EditableImage id="about-image" alt="Barkhaus Facility" className="w-full rounded-lg border" />
        <div className="space-y-4">
          <EditableText id="about-page-title" as="h1" className="text-4xl font-bold">
            About Barkhaus
          </EditableText>
          <EditableText id="about-page-body" as="p" className="text-muted-foreground">
            Barkhaus is dedicated to rescuing pets, providing compassionate care, and connecting them with loving families. Our team specializes in rehabilitation, enrichment, and responsible placement.
          </EditableText>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[1,2,3].map((i) => (
          <div key={i} className="rounded-lg border p-6">
            <h3 className="font-semibold mb-2">Our Value {i}</h3>
            <p className="text-sm text-muted-foreground">
              We believe in humane care, transparency, and community partnerships that change lives.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
