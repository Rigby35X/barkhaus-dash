import { EditableText } from '@/components/editable-text'
import { EditableButton } from '@/components/editable-button'
import { AboutPreview } from "@/components/sections/about-preview"
import { AnimalsPreview } from "@/components/sections/animals-preview"
import { ApplicationsPreview } from "@/components/sections/applications-preview"
import { DonatePreview } from "@/components/sections/donate-preview"
import { EventsPreview } from "@/components/sections/events-preview"
import { ContactPreview } from "@/components/sections/contact-preview"

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 py-20 text-center space-y-6">
          <EditableText id="home-hero-title" as="h1" className="text-5xl font-bold" defaultText="Welcome to Barkhaus" />
          <EditableText id="home-hero-subtitle" as="p" className="text-lg text-muted-foreground max-w-2xl mx-auto" defaultText="Adoption, care, and community—everything we do is for pets who deserve a loving home." />
          <div className="flex items-center justify-center gap-3">
            <EditableButton id="home-cta-primary" variant="outline" />
            <EditableButton id="home-cta-secondary" />
          </div>
        </div>
      </section>

      {/* Aggregated Sections */}
      <AboutPreview />
      <AnimalsPreview />
      <ApplicationsPreview />
      <DonatePreview />
      <EventsPreview />
      <ContactPreview />
    </>
  )
}
