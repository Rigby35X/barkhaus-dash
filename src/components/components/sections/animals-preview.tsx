"use client"

import Link from "next/link"
import { animals } from "@/lib/data/animals"
import { EditableElement } from "@/components/editable-element"

export function AnimalsPreview() {
  const featured = animals.slice(0, 3)

  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <EditableElement id="animals-title" type="text" className="text-3xl font-bold">
            Featured Friends
          </EditableElement>
          <Link href="/animals" className="text-sm underline underline-offset-4">
            View all
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((pet) => (
            <Link
              key={pet.id}
              href={`/animals/${pet.id}`}
              className="group rounded-lg border bg-background overflow-hidden hover:shadow-sm transition-shadow"
            >
              <img
                src={pet.image || "/placeholder.svg"}
                alt={pet.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 space-y-1">
                <h3 className="font-semibold group-hover:underline underline-offset-4">
                  {pet.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {pet.species} • {pet.age}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
