"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { EditableText } from "@/components/editable-text"

export default function AdoptPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setIsSubmitting(false); alert("Adoption application submitted! (demo)")
  }
  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
  <EditableText id="adopt-title" as="h1" className="text-4xl font-bold" defaultText="Adopt" />
      <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm">First Name</label><Input required /></div>
          <div><label className="text-sm">Last Name</label><Input required /></div>
        </div>
        <div><label className="text-sm">Email</label><Input type="email" required /></div>
        <div><label className="text-sm">Phone</label><Input required /></div>
        <div><label className="text-sm">Why do you want to adopt?</label><Textarea rows={5} required /></div>
        <Button disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit adoption application"}</Button>
      </form>
    </div>
  )
}
