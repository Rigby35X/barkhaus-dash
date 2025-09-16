"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { EditableElement } from "@/components/editable-element"

export default function ApplicationsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsSubmitting(false)
    alert("Application submitted! (demo)")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <EditableElement id="applications-page-title" type="text" className="text-4xl font-bold mb-2">
        Applications
      </EditableElement>
      <p className="text-muted-foreground mb-8">
        Choose an application type to get started.
      </p>

      <Tabs defaultValue="adopt" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="adopt" id="adopt">Adopt</TabsTrigger>
          <TabsTrigger value="volunteer" id="volunteer">Volunteer</TabsTrigger>
          <TabsTrigger value="foster" id="foster">Foster</TabsTrigger>
        </TabsList>

        {["adopt", "volunteer", "foster"].map((kind) => (
          <TabsContent key={kind} value={kind}>
            <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">First Name</label>
                  <Input required />
                </div>
                <div>
                  <label className="text-sm">Last Name</label>
                  <Input required />
                </div>
              </div>
              <div>
                <label className="text-sm">Email</label>
                <Input type="email" required />
              </div>
              <div>
                <label className="text-sm">Phone</label>
                <Input required />
              </div>
              <div>
                <label className="text-sm">Tell us about your home and experience</label>
                <Textarea rows={5} required />
              </div>
              <Button disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : `Submit ${kind} application`}
              </Button>
            </form>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
