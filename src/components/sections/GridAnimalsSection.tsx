import React from 'react'

interface GridAnimalsSectionProps {
  data: {
    type?: string
    heading?: string
    showFilters?: boolean
    maxItems?: number
  }
  design: any
  organization: any
  animals?: any[]
}

export function GridAnimalsSection({ data, design, organization, animals }: GridAnimalsSectionProps) {
  const heading = data.heading || 'Available Pets'
  const maxItems = data.maxItems || 12
  const displayAnimals = (animals || []).slice(0, maxItems)

  return (
    <section 
      className="py-16 px-4"
      style={{ 
        backgroundColor: design.background_color || '#F9FAFB',
        color: design.font_color || '#1F2937'
      }}
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ 
              color: design.primary_color || '#3B82F6',
              fontFamily: design.heading_font_family || 'Inter, sans-serif'
            }}
          >
            {heading}
          </h2>
        </div>

        {displayAnimals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayAnimals.map((animal, index) => (
              <div
                key={animal.id || index}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => {
                  // Navigate to animal detail page
                  window.location.href = `/${organization.slug || 'happy-paws'}/pets/${animal.id}`
                }}
              >
                <div className="relative overflow-hidden">
                  {animal.image_url && (
                    <img
                      src={animal.image_url}
                      alt={animal.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: design.primary_color || '#3B82F6' }}
                    >
                      Available
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className="text-2xl font-bold mb-3 group-hover:text-opacity-80 transition-colors"
                    style={{
                      color: design.primary_color || '#3B82F6',
                      fontFamily: design.heading_font_family || 'Inter, sans-serif'
                    }}
                  >
                    {animal.name}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {animal.breed && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {animal.breed}
                      </span>
                    )}
                    {animal.age && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {animal.age}
                      </span>
                    )}
                    {animal.gender && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {animal.gender}
                      </span>
                    )}
                  </div>

                  {animal.description && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {animal.description}
                    </p>
                  )}
                  
                  <button 
                    className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    style={{ backgroundColor: design.primary_color || '#3B82F6' }}
                    data-track="adoption-inquiry"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No pets available for adoption at this time. Please check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
