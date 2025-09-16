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
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {animal.image_url && (
                  <img 
                    src={animal.image_url} 
                    alt={animal.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ 
                      color: design.primary_color || '#3B82F6',
                      fontFamily: design.heading_font_family || 'Inter, sans-serif'
                    }}
                  >
                    {animal.name}
                  </h3>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    {animal.breed && <p><span className="font-medium">Breed:</span> {animal.breed}</p>}
                    {animal.age && <p><span className="font-medium">Age:</span> {animal.age}</p>}
                    {animal.gender && <p><span className="font-medium">Gender:</span> {animal.gender}</p>}
                  </div>
                  
                  {animal.description && (
                    <p className="text-gray-700 mt-3 text-sm line-clamp-3">
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
