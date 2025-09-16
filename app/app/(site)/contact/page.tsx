"use client"

import { useState } from "react"
import { EditableText } from "@/components/editable-text"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsSubmitting(false)
    alert("Message sent! (demo)")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <EditableText id="contact-page-title" className="text-4xl font-bold">
            Contact Us
          </EditableText>
          <EditableText id="contact-page-body" className="text-muted-foreground">
            Reach out to our team for adoption, volunteering, fostering, or general inquiries.
          </EditableText>

          <div className="rounded-lg border p-6 space-y-2">
            <h3 className="font-semibold">Barkhaus Headquarters</h3>
            <p className="text-sm text-muted-foreground">1234 Wagging Tail Rd, Barkville, BH</p>
            <p className="text-sm text-muted-foreground">hello@barkhaus.com</p>
            <p className="text-sm text-muted-foreground">(555) 123-4567</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-lg border p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Name</label>
              <Input required />
            </div>
            <div>
              <label className="text-sm">Email</label>
              <Input type="email" required />
            </div>
          </div>
          <div>
            <label className="text-sm">Message</label>
            <Textarea rows={6} required />
          </div>
          <Button disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send message"}</Button>
        </form>
      </div>
    </div>
  )
}
