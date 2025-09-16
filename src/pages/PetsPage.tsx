import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchSiteData } from '../api/xano'
import { HeaderSection } from '../components/sections/HeaderSection'
import { FooterSection } from '../components/sections/FooterSection'

type Animal = {
  id: number | string
  name: string
  species: string
  age?: string
  description?: string
  image?: string | { url?: string }
  image_url?: string
  images?: Array<string | { url?: string }>
  photo?: { url?: string }
  breed?: string
  gender?: string
  status?: string
}

interface PetsPageProps {
  slug?: string
}

function resolveImageURL(pet: Animal, fallbackOrigin: string = '') {
  const firstArrayImage =
    Array.isArray(pet.images) && pet.images.length
      ? (typeof pet.images[0] === "string" ? pet.images[0] : (pet.images[0] as any)?.url)
      : undefined

  let raw =
    (typeof pet.image === "string" ? pet.image : (pet.image as any)?.url) ||
    pet.image_url ||
    firstArrayImage ||
    pet.photo?.url

  if (!raw || typeof raw !== "string") {
    return "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop"
  }

  if (raw.startsWith("//")) raw = "https:" + raw
  if (/^https?:\/\//i.test(raw)) return raw.replace(/^http:\/\//i, "https://")
  if (raw.startsWith("/")) return fallbackOrigin + raw
  if (/^(_?file|uploads?|image:|assets?)/i.test(raw)) {
    return `${fallbackOrigin}/${raw.replace(/^\/+/, "")}`
  }
  return `${fallbackOrigin.replace(/\/+$/, "")}/${raw.replace(/^\/+/, "")}`
}

export default function PetsPage({ slug }: PetsPageProps) {
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [siteData, setSiteData] = useState<any>(null)

  const currentSlug = slug || params.slug || 'happy-paws'
  const searchQuery = searchParams.get('q') || ''
  const speciesFilter = searchParams.get('species') || 'all'

  useEffect(() => {
    loadData()
  }, [currentSlug, searchQuery, speciesFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch site data to get organization info
      const siteResult = await fetchSiteData(currentSlug, '/pets')
      
      if (siteResult.success && siteResult.data && !siteResult.data.error) {
        setSiteData(siteResult.data)
        setAnimals(siteResult.data.animals || [])
      } else {
        // Fallback to mock data
        console.log('Using mock animals data')
        const mockAnimals: Animal[] = [
          {
            id: 1,
            name: 'Buddy',
            breed: 'Golden Retriever',
            age: '3 years',
            gender: 'Male',
            species: 'Dog',
            description: 'Buddy is a friendly and energetic dog who loves to play fetch and go on long walks.',
            image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
            status: 'Available'
          },
          {
            id: 2,
            name: 'Luna',
            breed: 'Border Collie',
            age: '2 years',
            gender: 'Female',
            species: 'Dog',
            description: 'Luna is a smart and loyal companion who would make a great addition to any family.',
            image_url: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop',
            status: 'Available'
          },
          {
            id: 3,
            name: 'Max',
            breed: 'Labrador Mix',
            age: '4 years',
            gender: 'Male',
            species: 'Dog',
            description: 'Max is a gentle giant who loves children and other pets.',
            image_url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop',
            status: 'Available'
          },
          {
            id: 4,
            name: 'Whiskers',
            breed: 'Domestic Shorthair',
            age: '1 year',
            gender: 'Female',
            species: 'Cat',
            description: 'Whiskers is a playful kitten who loves to chase toys and cuddle.',
            image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
            status: 'Available'
          },
          {
            id: 5,
            name: 'Shadow',
            breed: 'Maine Coon',
            age: '5 years',
            gender: 'Male',
            species: 'Cat',
            description: 'Shadow is a calm and affectionate cat who enjoys quiet companionship.',
            image_url: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop',
            status: 'Available'
          }
        ]
        setAnimals(mockAnimals)
        setSiteData({
          organization: { name: 'Happy Paws Rescue' },
          design: { primary_color: '#3B82F6' }
        })
      }
    } catch (err) {
      setError('Failed to load animals')
      console.error('Error loading animals:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = !searchQuery || 
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSpecies = speciesFilter === 'all' || 
      animal.species.toLowerCase() === speciesFilter.toLowerCase()
    
    return matchesSearch && matchesSpecies && animal.status === 'Available'
  })

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newSearchParams = new URLSearchParams()
    
    const q = formData.get('q') as string
    const species = formData.get('species') as string
    
    if (q) newSearchParams.set('q', q)
    if (species && species !== 'all') newSearchParams.set('species', species)
    
    setSearchParams(newSearchParams)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available pets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Pets</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="text-blue-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const primaryColor = siteData?.design?.primary_color || '#3B82F6'

  return (
    <div className="min-h-screen" style={{ backgroundColor: siteData?.design?.background_color || '#FFFFFF' }}>
      {/* Header */}
      <HeaderSection
        data={{
          type: 'header',
          links: [
            { label: 'Home', href: '/' },
            { label: 'Available Pets', href: '/pets' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' }
          ],
          showDonate: true
        }}
        design={siteData?.design || {}}
        organization={siteData?.organization || {}}
      />

      <main className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 
          className="text-4xl font-bold mb-4"
          style={{ color: primaryColor }}
        >
          Available Pets
        </h1>
        <p className="text-gray-600 text-lg">
          Find your perfect companion and give them a loving home
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="w-64">
            <input
              name="q"
              defaultValue={searchQuery}
              placeholder="Search by name or breed..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            name="species"
            defaultValue={speciesFilter}
            className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Animals</option>
            <option value="Dog">Dogs</option>
            <option value="Cat">Cats</option>
            <option value="Other">Other</option>
          </select>
          <button 
            type="submit" 
            className="rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {filteredAnimals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No pets found matching your criteria. Try adjusting your search.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAnimals.map((animal) => {
            const imageUrl = resolveImageURL(animal)
            return (
              <div
                key={String(animal.id)}
                className="group overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <a href={`/${currentSlug}/pets/${encodeURIComponent(String(animal.id))}`}>
                  <img
                    src={imageUrl}
                    alt={animal.name}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 
                      className="font-semibold text-lg mb-2 group-hover:underline"
                      style={{ color: primaryColor }}
                    >
                      {animal.name}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Species:</span> {animal.species}
                      </p>
                      {animal.breed && (
                        <p>
                          <span className="font-medium">Breed:</span> {animal.breed}
                        </p>
                      )}
                      {animal.age && (
                        <p>
                          <span className="font-medium">Age:</span> {animal.age}
                        </p>
                      )}
                      {animal.gender && (
                        <p>
                          <span className="font-medium">Gender:</span> {animal.gender}
                        </p>
                      )}
                    </div>
                    {animal.description && (
                      <p className="text-gray-700 mt-3 text-sm line-clamp-3">
                        {animal.description}
                      </p>
                    )}
                    <button 
                      className="w-full mt-4 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Learn More
                    </button>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
      )}
      </main>

      {/* Footer */}
      <FooterSection
        data={{
          type: 'footer',
          ein: '12-3456789',
          links: [
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' }
          ],
          socials: []
        }}
        design={siteData?.design || {}}
        organization={siteData?.organization || {}}
        site_content={siteData?.site_content || {}}
      />
    </div>
  )
}
