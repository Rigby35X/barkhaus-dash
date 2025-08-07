import type React from "react"
import { useLiveSite } from "../../../../contexts/LiveSiteContext"
import { MapPin, Heart, Calendar, Info } from "lucide-react"

const AvailablePets = () => {
  const { siteContent, designSettings } = useLiveSite()

  const SectionWrapper = ({
    children,
    id,
    className = "",
  }: { children: React.ReactNode; id?: string; className?: string }) => (
    <section
      id={id}
      className={`py-16 md:py-20 bg-gray-50 ${className}`}
      style={{ fontFamily: designSettings.fontFamily }}
    >
      {children}
    </section>
  )

  const Button = ({
    children,
    variant = "primary",
    size = "md",
    href,
    className = "",
  }: {
    children: React.ReactNode
    variant?: "primary" | "outline"
    size?: "sm" | "md" | "lg"
    href?: string
    className?: string
  }) => {
    const baseClasses = `inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 hover:opacity-90 hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`

    const variantClasses = variant === "primary" ? "text-white border-2" : "border-2 bg-transparent"

    const sizeClasses =
      size === "lg" ? "px-8 py-4 text-lg" : size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3 text-base"

    const style =
      variant === "primary"
        ? { backgroundColor: designSettings.primaryColor, borderColor: designSettings.primaryColor }
        : { color: designSettings.primaryColor, borderColor: designSettings.primaryColor }

    return href ? (
      <a href={href} className={`${baseClasses} ${variantClasses} ${sizeClasses}`} style={style}>
        {children}
      </a>
    ) : (
      <button className={`${baseClasses} ${variantClasses} ${sizeClasses}`} style={style}>
        {children}
      </button>
    )
  }

  // Use featured pets from context or fallback to mock data
  const featuredPets = siteContent.pages.home.featuredPets || [
    {
      id: "1",
      name: "Buddy",
      breed: "Labrador Mix",
      age: "2 years",
      image: "/placeholder.svg?height=400&width=400",
      description: "2-year-old Labrador mix looking for a loving home.",
    },
    {
      id: "2",
      name: "Luna",
      breed: "Husky Mix",
      age: "3 years",
      image: "/placeholder.svg?height=400&width=400",
      description: "Sweet husky mix who loves cuddles and walks.",
    },
    {
      id: "3",
      name: "Max",
      breed: "Terrier Mix",
      age: "1 year",
      image: "/placeholder.svg?height=400&width=400",
      description: "Playful terrier ready to bring joy to your home.",
    },
  ]

  // Extended pet data with additional info
  const petsWithDetails = featuredPets.map((pet, index) => ({
    ...pet,
    gender: index % 2 === 0 ? "Male" : "Female",
    location: index === 1 ? "Foster Home" : "Main Shelter",
    adoptionFee: "$150",
    vaccinated: true,
    spayedNeutered: true,
    goodWithKids: index !== 2,
    goodWithPets: index !== 0,
  }))

  return (
    <SectionWrapper id="pets">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ fontFamily: designSettings.headingFont, color: designSettings.textColor }}
          >
            Find Your Perfect Companion
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet our wonderful animals who are looking for their forever homes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {petsWithDetails.map((pet) => (
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
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pet.description}</p>

                {/* Pet Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {pet.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    Adoption Fee: {pet.adoptionFee}
                  </div>
                </div>

                {/* Pet Attributes */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {pet.vaccinated && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Vaccinated</span>
                  )}
                  {pet.spayedNeutered && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Spayed/Neutered</span>
                  )}
                  {pet.goodWithKids && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Good with Kids</span>
                  )}
                  {pet.goodWithPets && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Good with Pets</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1 flex items-center justify-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>Meet {pet.name}</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center justify-center bg-transparent">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="primary" size="lg" href="#contact">
            View All Available Pets
          </Button>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default AvailablePets
