import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchSiteData } from '../api/xano'
import { HeaderSection } from '../components/sections/HeaderSection'
import { FooterSection } from '../components/sections/FooterSection'
import { Heart, MapPin, Calendar, User, Phone, Mail, Share2, ArrowLeft } from 'lucide-react'

interface Animal {
  id: string
  name: string
  species: string
  breed: string
  age: string
  gender: string
  size: string
  color: string
  description: string
  personality: string[]
  medical_notes: string
  adoption_fee: number
  images: string[]
  location: string
  date_available: string
  is_adopted: boolean
  special_needs: boolean
  good_with_kids: boolean
  good_with_dogs: boolean
  good_with_cats: boolean
  energy_level: string
  training_level: string
}

interface AnimalDetailPageProps {
  slug?: string
}

export default function AnimalDetailPage({ slug }: AnimalDetailPageProps) {
  const params = useParams()
  const navigate = useNavigate()
  const [siteData, setSiteData] = useState<any>(null)
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const currentSlug = slug || params.slug || 'happy-paws'
  const animalId = params.id

  useEffect(() => {
    loadData()
  }, [currentSlug, animalId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load site data
      const siteResult = await fetchSiteData(currentSlug, `/pets/${animalId}`)
      
      if (siteResult.success && siteResult.data && !siteResult.data.error) {
        setSiteData(siteResult.data)
      } else {
        // Fallback to mock data
        setSiteData({
          organization: {
            name: 'Happy Paws Rescue',
            slug: 'happy-paws'
          },
          design: {
            primary_color: '#3B82F6',
            background_color: '#FFFFFF',
            font_color: '#1F2937'
          }
        })
      }

      // Mock animal data (replace with real API call)
      const mockAnimal: Animal = {
        id: animalId || '1',
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever Mix',
        age: '3 years',
        gender: 'Male',
        size: 'Large',
        color: 'Golden',
        description: 'Buddy is a sweet, gentle soul who loves nothing more than being by your side. He\'s great with kids and other dogs, making him the perfect family companion. Buddy enjoys long walks, playing fetch, and snuggling on the couch.',
        personality: ['Friendly', 'Gentle', 'Playful', 'Loyal'],
        medical_notes: 'Up to date on all vaccinations. Neutered. Microchipped.',
        adoption_fee: 250,
        images: [
          'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop'
        ],
        location: 'San Diego, CA',
        date_available: '2024-01-15',
        is_adopted: false,
        special_needs: false,
        good_with_kids: true,
        good_with_dogs: true,
        good_with_cats: true,
        energy_level: 'Medium',
        training_level: 'House trained'
      }
      
      setAnimal(mockAnimal)
    } catch (err) {
      setError('Failed to load animal information')
      console.error('Error loading animal data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading animal details...</p>
        </div>
      </div>
    )
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Animal Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The animal you\'re looking for doesn\'t exist.'}</p>
          <button 
            onClick={() => navigate(`/${currentSlug}/pets`)}
            className="text-blue-600 hover:underline"
          >
            View All Available Pets
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
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/${currentSlug}/pets`)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Available Pets
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative">
              <img
                src={animal.images[currentImageIndex]}
                alt={animal.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              {animal.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? animal.images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === animal.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
                  >
                    <ArrowLeft className="w-5 h-5 transform rotate-180" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {animal.images.length > 1 && (
              <div className="flex space-x-2 mt-4">
                {animal.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${animal.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Animal Information */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{animal.name}</h1>
                <p className="text-xl text-gray-600">{animal.breed}</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-semibold">{animal.age}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-semibold">{animal.gender}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Size</p>
                <p className="font-semibold">{animal.size}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Color</p>
                <p className="font-semibold">{animal.color}</p>
              </div>
            </div>

            {/* Adoption Fee */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Adoption Fee</p>
              <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                ${animal.adoption_fee}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => navigate(`/${currentSlug}/applications?pet=${animal.name}`)}
                className="w-full text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                Apply to Adopt {animal.name}
              </button>
              <button
                onClick={() => navigate(`/${currentSlug}/contact?subject=Inquiry about ${animal.name}`)}
                className="w-full border-2 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                style={{ 
                  borderColor: primaryColor,
                  color: primaryColor
                }}
              >
                Ask About {animal.name}
              </button>
            </div>

            {/* Location & Date */}
            <div className="flex items-center space-x-4 text-gray-600 mb-6">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{animal.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm">Available since {new Date(animal.date_available).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
              About {animal.name}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {animal.description}
            </p>

            {/* Personality Traits */}
            <h3 className="text-xl font-semibold mb-3">Personality</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {animal.personality.map((trait, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${primaryColor}20`,
                    color: primaryColor
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>

            {/* Medical Information */}
            <h3 className="text-xl font-semibold mb-3">Medical Information</h3>
            <p className="text-gray-700 mb-6">{animal.medical_notes}</p>
          </div>

          {/* Compatibility */}
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>
              Good With
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Children</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  animal.good_with_kids ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {animal.good_with_kids ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Dogs</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  animal.good_with_dogs ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {animal.good_with_dogs ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cats</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  animal.good_with_cats ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {animal.good_with_cats ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4 mt-6" style={{ color: primaryColor }}>
              Additional Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Energy Level</span>
                <span className="text-gray-700">{animal.energy_level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Training</span>
                <span className="text-gray-700">{animal.training_level}</span>
              </div>
              {animal.special_needs && (
                <div className="flex items-center justify-between">
                  <span>Special Needs</span>
                  <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">Yes</span>
                </div>
              )}
            </div>
          </div>
        </div>
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
