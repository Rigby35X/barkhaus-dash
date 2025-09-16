import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchSiteData, logAnalyticsEvent } from '../api/xano'

type Animal = {
  id: number | string
  name: string
  litter_name?: string
  species: string
  age?: string
  description?: string
  description_long?: string
  image?: string | { url?: string }
  image_url?: string
  images?: Array<string | { url?: string }>
  photo?: { url?: string }
  breed?: string
  gender?: string
  weight?: string
  vaccinated?: boolean
  spayed_neutered?: boolean
  status?: string
  location?: string
  medical_notes?: string
  color?: string
  size?: string
  intake_date?: string
  adoption_fee?: number | string
  microchip?: boolean | string
  house_trained?: boolean
  energy_level?: string
  good_with_kids?: boolean
  good_with_dogs?: boolean
  good_with_cats?: boolean
  special_needs?: string
  training_notes?: string
  playgroup_notes?: string
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
    return "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop"
  }

  if (raw.startsWith("//")) raw = "https:" + raw
  if (/^https?:\/\//i.test(raw)) return raw.replace(/^http:\/\//i, "https://")
  if (raw.startsWith("/")) return fallbackOrigin + raw
  if (/^(_?file|uploads?|image:|assets?)/i.test(raw)) {
    return `${fallbackOrigin}/${raw.replace(/^\/+/, "")}`
  }
  return `${fallbackOrigin.replace(/\/+$/, "")}/${raw.replace(/^\/+/, "")}`
}

export default function PetDetailPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>()
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [siteData, setSiteData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  useEffect(() => {
    if (slug && id) {
      loadAnimalData()
    }
  }, [slug, id])

  const loadAnimalData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to fetch real data first
      const siteResult = await fetchSiteData(slug!, `/pets/${id}`)
      
      if (siteResult.success && siteResult.data && !siteResult.data.error) {
        setSiteData(siteResult.data)
        // Find the specific animal from the animals array
        const foundAnimal = siteResult.data.animals?.find((a: Animal) => String(a.id) === id)
        if (foundAnimal) {
          setAnimal(foundAnimal)
          
          // Log analytics event
          if (siteResult.data.organization?.tenant_id) {
            await logAnalyticsEvent(siteResult.data.organization.tenant_id, {
              event_type: 'pet_view',
              page_path: `/${slug}/pets/${id}`,
              element: `pet-${id}`,
              user_agent: navigator.userAgent,
              referrer: document.referrer
            })
          }
        } else {
          setError('Pet not found')
        }
      } else {
        // Fallback to mock data with different animals based on ID
        console.log('Using mock animal data for ID:', id)
        const mockAnimals: Animal[] = [
          {
            id: 1,
            name: 'Buddy',
            breed: 'Golden Retriever',
            age: '3 years',
            gender: 'Male',
            species: 'Dog',
            weight: '65 lbs',
            description: 'Buddy is a friendly and energetic dog who loves to play fetch and go on long walks.',
            description_long: 'Buddy is an amazing Golden Retriever who has been with us for 2 months. He came to us as a surrender when his previous family could no longer care for him. Buddy is house-trained, knows basic commands, and gets along well with other dogs. He would do best in a home with a yard where he can run and play. Buddy loves children and would make a wonderful family pet.',
            image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop',
            status: 'Available',
            vaccinated: true,
            spayed_neutered: true,
            microchip: true,
            house_trained: true,
            energy_level: 'High',
            good_with_kids: true,
            good_with_dogs: true,
            good_with_cats: false,
            adoption_fee: 350,
            color: 'Golden',
            size: 'Large'
          },
          {
            id: 2,
            name: 'Luna',
            breed: 'Border Collie',
            age: '2 years',
            gender: 'Female',
            species: 'Dog',
            weight: '45 lbs',
            description: 'Luna is a smart and loyal companion who would make a great addition to any family.',
            description_long: 'Luna is an intelligent Border Collie who loves to learn new tricks and commands. She is very active and would do best with an experienced dog owner who can provide mental stimulation and exercise. Luna is great with children and other dogs, but can be a bit shy with new people at first.',
            image_url: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=600&h=400&fit=crop',
            status: 'Available',
            vaccinated: true,
            spayed_neutered: true,
            microchip: true,
            house_trained: true,
            energy_level: 'Very High',
            good_with_kids: true,
            good_with_dogs: true,
            good_with_cats: true,
            adoption_fee: 400,
            color: 'Black and White',
            size: 'Medium'
          },
          {
            id: 3,
            name: 'Luna',
            breed: 'Husky Mix',
            age: '2 years',
            gender: 'Female',
            species: 'Dog',
            weight: '55 lbs',
            description: 'Luna is an energetic and intelligent dog who loves outdoor adventures.',
            description_long: 'Luna is a beautiful Husky mix with striking blue eyes. She\'s very active and would do best with an experienced dog owner who can provide plenty of exercise and mental stimulation. Luna is great with other dogs but can be a bit strong-willed, so she needs consistent training.',
            image_url: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&h=600&fit=crop',
            images: [
              'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&h=600&fit=crop'
            ],
            location: 'San Diego, CA',
            status: 'Available',
            house_trained: true,
            good_with_kids: true,
            good_with_dogs: true,
            good_with_cats: false,
            adoption_fee: 350,
            color: 'Gray and White',
            size: 'Large'
          },
          {
            id: 4,
            name: 'Charlie',
            breed: 'Beagle',
            age: '5 years',
            gender: 'Male',
            species: 'Dog',
            weight: '30 lbs',
            description: 'Charlie is a gentle, older dog who loves quiet companionship.',
            description_long: 'Charlie is a sweet senior Beagle looking for a calm, loving home. He\'s past his puppy energy and just wants to be your loyal companion. Charlie is great with kids and other pets, and he\'s perfectly content with short walks and lots of cuddles.',
            image_url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop',
            images: [
              'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop'
            ],
            location: 'San Diego, CA',
            status: 'Available',
            house_trained: true,
            good_with_kids: true,
            good_with_dogs: true,
            good_with_cats: true,
            adoption_fee: 200,
            color: 'Brown and White',
            size: 'Medium'
          },
          {
            id: 5,
            name: 'Daisy',
            breed: 'Border Collie',
            age: '3 years',
            gender: 'Female',
            species: 'Dog',
            weight: '45 lbs',
            description: 'Daisy is incredibly smart and would love a family who enjoys outdoor activities.',
            description_long: 'Daisy is a brilliant Border Collie who needs an active family. She knows many tricks and loves to learn new ones. Daisy would excel in agility training or any dog sport. She needs daily mental and physical stimulation to be happy.',
            image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop',
            images: [
              'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop'
            ],
            location: 'San Diego, CA',
            status: 'Available',
            house_trained: true,
            good_with_kids: true,
            good_with_dogs: true,
            good_with_cats: true,
            adoption_fee: 375,
            color: 'Black and White',
            size: 'Medium'
          }
        ]
        
        const foundAnimal = mockAnimals.find(a => String(a.id) === id)
        if (foundAnimal) {
          setAnimal(foundAnimal)
          setSiteData({
            organization: { name: 'Happy Paws Rescue' },
            design: { primary_color: '#3B82F6' }
          })
        } else {
          setError('Pet not found')
        }
      }
    } catch (err) {
      setError('Failed to load pet details')
      console.error('Error loading animal:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdoptionInquiry = async () => {
    setShowApplicationForm(true)
    
    // Log analytics event
    if (siteData?.organization?.tenant_id && animal) {
      await logAnalyticsEvent(siteData.organization.tenant_id, {
        event_type: 'adoption_inquiry',
        page_path: `/${slug}/pets/${id}`,
        element: `adopt-${animal.id}`,
        user_agent: navigator.userAgent
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pet details...</p>
        </div>
      </div>
    )
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pet Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested pet could not be found.'}</p>
          <a href={`/${slug}/pets`} className="text-blue-600 hover:underline">
            View All Available Pets
          </a>
        </div>
      </div>
    )
  }

  const primaryColor = siteData?.design?.primary_color || '#3B82F6'
  const imageUrl = resolveImageURL(animal)

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <a 
          href={`/${slug}/pets`}
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          ← Back to Available Pets
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img
            src={imageUrl}
            alt={animal.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Details */}
        <div>
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            {animal.name}
          </h1>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span className="font-medium text-gray-700">Species:</span>
              <p>{animal.species}</p>
            </div>
            {animal.breed && (
              <div>
                <span className="font-medium text-gray-700">Breed:</span>
                <p>{animal.breed}</p>
              </div>
            )}
            {animal.age && (
              <div>
                <span className="font-medium text-gray-700">Age:</span>
                <p>{animal.age}</p>
              </div>
            )}
            {animal.gender && (
              <div>
                <span className="font-medium text-gray-700">Gender:</span>
                <p>{animal.gender}</p>
              </div>
            )}
            {animal.weight && (
              <div>
                <span className="font-medium text-gray-700">Weight:</span>
                <p>{animal.weight}</p>
              </div>
            )}
            {animal.size && (
              <div>
                <span className="font-medium text-gray-700">Size:</span>
                <p>{animal.size}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3" style={{ color: primaryColor }}>
              About {animal.name}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {animal.description_long || animal.description}
            </p>
          </div>

          {/* Medical & Behavioral Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Medical Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Vaccinated:</span>
                  <span className={animal.vaccinated ? 'text-green-600' : 'text-red-600'}>
                    {animal.vaccinated ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Spayed/Neutered:</span>
                  <span className={animal.spayed_neutered ? 'text-green-600' : 'text-red-600'}>
                    {animal.spayed_neutered ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Microchipped:</span>
                  <span className={animal.microchip ? 'text-green-600' : 'text-red-600'}>
                    {animal.microchip ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Behavioral Info</h4>
              <div className="space-y-2 text-sm">
                {animal.energy_level && (
                  <div className="flex justify-between">
                    <span>Energy Level:</span>
                    <span>{animal.energy_level}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Good with Kids:</span>
                  <span className={animal.good_with_kids ? 'text-green-600' : 'text-red-600'}>
                    {animal.good_with_kids ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Good with Dogs:</span>
                  <span className={animal.good_with_dogs ? 'text-green-600' : 'text-red-600'}>
                    {animal.good_with_dogs ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Good with Cats:</span>
                  <span className={animal.good_with_cats ? 'text-green-600' : 'text-red-600'}>
                    {animal.good_with_cats ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Adoption Fee */}
          {animal.adoption_fee && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Adoption Fee</h4>
              <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                ${animal.adoption_fee}
              </p>
            </div>
          )}

          {/* Adoption Button */}
          <button
            onClick={handleAdoptionInquiry}
            className="w-full text-white py-3 px-6 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            Apply to Adopt {animal.name}
          </button>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Adoption Application</h3>
            <p className="text-gray-600 mb-4">
              Thank you for your interest in adopting {animal.name}! Please contact us to start the adoption process.
            </p>
            <div className="space-y-2 text-sm mb-6">
              <p><strong>Email:</strong> info@{slug}.org</p>
              <p><strong>Phone:</strong> (555) 123-4567</p>
            </div>
            <button
              onClick={() => setShowApplicationForm(false)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
