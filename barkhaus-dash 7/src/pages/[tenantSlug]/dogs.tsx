"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MapPin, Heart, Calendar, Info, ArrowLeft } from "lucide-react"

interface Pet {
  id: number
  name: string
  species: string
  breed: string
  age: string
  gender: string
  status: string
  image: string
  images?: string[]
  location: string
  description: string
  medical_notes?: string
  weight?: string
  vaccinated?: boolean
  spayed_neutered?: boolean
  published?: boolean
}

interface LiveSiteData {
  site_name: string
  logo_url: string
  primaryColor: string
  contact_info: {
    phone: string
    email: string
  }
}

const PublicDogsPage: React.FC = () => {
  const { tenantSlug } = useParams<{ tenantSlug: string }>()
  const [pets, setPets] = useState<Pet[]>([])
  const [liveSiteData, setLiveSiteData] = useState<LiveSiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDogsData()
  }, [tenantSlug])

  const loadDogsData = async () => {
    if (!tenantSlug) return

    try {
      setLoading(true)

      // Load site data
      const siteResponse = await fetch(`${import.meta.env.VITE_XANO_BASE_URL}/live_sites/public/${tenantSlug}`)
      if (siteResponse.ok) {
        const siteData = await siteResponse.json()
        setLiveSiteData(siteData)

        // Load pets for this tenant
        const petsResponse = await fetch(`${import.meta.env.VITE_XANO_DOGS_URL}/dogs/public/${siteData.tenant_id}`)
        if (petsResponse.ok) {
          const petsData = await petsResponse.json()
          setPets(petsData.filter((pet: Pet) => pet.published && pet.status === "available"))
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pets")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !liveSiteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={liveSiteData.logo_url || "/placeholder.svg?height=40&width=40"}
                alt={liveSiteData.site_name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{liveSiteData.site_name}</h1>
                <p className="text-sm text-gray-600">Available Pets</p>
              </div>
            </div>
            <a
              href={`/${tenantSlug}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Available Pets</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet our wonderful animals who are looking for their forever homes. Each pet has been lovingly cared for and
            is ready to bring joy to your family.
          </p>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pets available right now</h3>
            <p className="text-gray-600 mb-6">Check back soon or contact us to learn about upcoming arrivals.</p>
            <a
              href={`/${tenantSlug}/contact`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Contact Us
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={pet.image || "/placeholder.svg?height=256&width=400&query=adorable rescue pet"}
                    alt={pet.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-700">{pet.age}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Available
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                    <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>

                  <p className="text-gray-600 mb-3">
                    {pet.breed} • {pet.gender}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{pet.description}</p>

                  {/* Pet Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {pet.location}
                    </div>
                    {pet.weight && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        Weight: {pet.weight}
                      </div>
                    )}
                  </div>

                  {/* Pet Attributes */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pet.vaccinated && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Vaccinated</span>
                    )}
                    {pet.spayed_neutered && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Spayed/Neutered</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`/${tenantSlug}/dogs/${pet.id}`}
                      className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      <span>Meet {pet.name}</span>
                    </a>
                    <a
                      href={`/${tenantSlug}/dogs/${pet.id}`}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Interested in Adopting?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Ready to welcome a new family member? Contact us to learn more about our adoption process and schedule a
            meet-and-greet with your potential new best friend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${liveSiteData.contact_info.phone}`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Call Us: {liveSiteData.contact_info.phone}
            </a>
            <a
              href={`/${tenantSlug}/contact`}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Contact Form
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PublicDogsPage
