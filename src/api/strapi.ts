// Strapi API integration for React project
const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.REACT_APP_STRAPI_API_TOKEN

interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface StrapiAnimal {
  id: number
  attributes: {
    name: string
    species: string
    breed?: string
    age?: string
    gender?: string
    size?: string
    color?: string
    description?: string
    description_long?: string
    weight?: string
    vaccinated?: boolean
    spayed_neutered?: boolean
    status?: string
    location?: string
    medical_notes?: string
    intake_date?: string
    adoption_fee?: number
    microchip?: boolean
    house_trained?: boolean
    energy_level?: string
    good_with_kids?: boolean
    good_with_dogs?: boolean
    good_with_cats?: boolean
    special_needs?: string
    training_notes?: string
    playgroup_notes?: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    image?: {
      data?: {
        id: number
        attributes: {
          url: string
          alternativeText?: string
          caption?: string
          width: number
          height: number
        }
      }
    }
    images?: {
      data?: Array<{
        id: number
        attributes: {
          url: string
          alternativeText?: string
          caption?: string
          width: number
          height: number
        }
      }>
    }
  }
}

// Transform Strapi animal data to our format
function transformStrapiAnimal(strapiAnimal: StrapiAnimal) {
  const { id, attributes } = strapiAnimal
  
  // Get main image URL
  const mainImage = attributes.image?.data?.attributes?.url
  const mainImageUrl = mainImage ? `${STRAPI_URL}${mainImage}` : undefined
  
  // Get all images
  const images = attributes.images?.data?.map(img => `${STRAPI_URL}${img.attributes.url}`) || []
  if (mainImageUrl && !images.includes(mainImageUrl)) {
    images.unshift(mainImageUrl)
  }

  return {
    id: id.toString(),
    name: attributes.name,
    species: attributes.species,
    breed: attributes.breed || 'Mixed Breed',
    age: attributes.age || 'Unknown',
    gender: attributes.gender || 'Unknown',
    size: attributes.size || 'Medium',
    color: attributes.color || 'Mixed',
    description: attributes.description || '',
    description_long: attributes.description_long || attributes.description || '',
    weight: attributes.weight,
    vaccinated: attributes.vaccinated || false,
    spayed_neutered: attributes.spayed_neutered || false,
    status: attributes.status || 'available',
    location: attributes.location || 'Rescue Center',
    medical_notes: attributes.medical_notes || '',
    intake_date: attributes.intake_date,
    adoption_fee: attributes.adoption_fee || 0,
    microchip: attributes.microchip || false,
    house_trained: attributes.house_trained || false,
    energy_level: attributes.energy_level || 'Medium',
    good_with_kids: attributes.good_with_kids || false,
    good_with_dogs: attributes.good_with_dogs || false,
    good_with_cats: attributes.good_with_cats || false,
    special_needs: attributes.special_needs || '',
    training_notes: attributes.training_notes || '',
    playgroup_notes: attributes.playgroup_notes || '',
    image_url: mainImageUrl,
    images: images,
    date_available: attributes.intake_date || attributes.createdAt,
    is_adopted: attributes.status === 'adopted',
    personality: [] // Can be derived from description or separate field
  }
}

// Fetch all animals from Strapi
export async function fetchAnimalsFromStrapi(page = 1, pageSize = 25) {
  try {
    const params = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': pageSize.toString(),
      'populate': 'image,images',
      'sort': 'createdAt:desc'
    })

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`
    }

    const response = await fetch(`${STRAPI_URL}/api/animals?${params}`, {
      headers
    })

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`)
    }

    const data: StrapiResponse<StrapiAnimal[]> = await response.json()
    
    return {
      success: true,
      data: data.data.map(transformStrapiAnimal),
      pagination: data.meta?.pagination
    }
  } catch (error) {
    console.error('Error fetching animals from Strapi:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: []
    }
  }
}

// Fetch single animal from Strapi
export async function fetchAnimalFromStrapi(id: string) {
  try {
    const params = new URLSearchParams({
      'populate': 'image,images'
    })

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`
    }

    const response = await fetch(`${STRAPI_URL}/api/animals/${id}?${params}`, {
      headers
    })

    if (response.status === 404) {
      return {
        success: false,
        error: 'Animal not found',
        data: null
      }
    }

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`)
    }

    const data: StrapiResponse<StrapiAnimal> = await response.json()
    
    return {
      success: true,
      data: transformStrapiAnimal(data.data)
    }
  } catch (error) {
    console.error('Error fetching animal from Strapi:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null
    }
  }
}

// Submit form data to Strapi
export async function submitFormToStrapi(formType: string, formData: any) {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`
    }

    // Map form types to Strapi collection names
    const collectionMap: Record<string, string> = {
      'contact': 'contact-forms',
      'adoption': 'adoption-applications',
      'volunteer': 'volunteer-applications',
      'foster': 'foster-applications'
    }

    const collection = collectionMap[formType] || 'form-submissions'

    const response = await fetch(`${STRAPI_URL}/api/${collection}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: {
          ...formData,
          form_type: formType,
          submitted_at: new Date().toISOString(),
          status: 'new'
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      data: data.data
    }
  } catch (error) {
    console.error('Error submitting form to Strapi:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Fetch organization data from Strapi
export async function fetchOrganizationFromStrapi(slug: string) {
  try {
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate': 'logo,hero_image'
    })

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`
    }

    const response = await fetch(`${STRAPI_URL}/api/organizations?${params}`, {
      headers
    })

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.data && data.data.length > 0) {
      return {
        success: true,
        data: data.data[0]
      }
    } else {
      return {
        success: false,
        error: 'Organization not found',
        data: null
      }
    }
  } catch (error) {
    console.error('Error fetching organization from Strapi:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null
    }
  }
}

export { STRAPI_URL }
