"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { EditableText } from "@/components/editable-text"

export default function VolunteerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setIsSubmitting(false); alert("Volunteer application submitted! (demo)")
  }
  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
      <EditableText id="volunteer-title" as="h1" className="text-4xl font-bold">Volunteer</EditableText>
      <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm">First Name</label><Input required /></div>
          <div><label className="text-sm">Last Name</label><Input required /></div>
        </div>
        <div><label className="text-sm">Email</label><Input type="email" required /></div>
        <div><label className="text-sm">Phone</label><Input required /></div>
        <div><label className="text-sm">How would you like to help?</label><Textarea rows={5} required /></div>
        <Button disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit volunteer application"}</Button>
      </form>
    </div>
  )
}
