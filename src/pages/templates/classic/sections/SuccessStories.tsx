import type React from "react"
import { useLiveSite } from "../../../../contexts/LiveSiteContext"
import { Calendar, Heart, ArrowRight } from "lucide-react"

const SuccessStories = () => {
  const { siteContent, designSettings } = useLiveSite()
  const successData = siteContent.pages.successStories

  const SectionWrapper = ({
    children,
    id,
    className = "",
  }: { children: React.ReactNode; id?: string; className?: string }) => (
    <section
      id={id}
      className={`py-16 md:py-20 bg-white ${className}`}
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

  // Mock success stories if none provided
  const stories = successData.stories || [
    {
      id: "1",
      petName: "Bella",
      beforeImage: "/placeholder.svg?height=300&width=300",
      afterImage: "/placeholder.svg?height=300&width=300",
      story:
        "Bella was found abandoned and scared. After months of care and rehabilitation, she found her perfect family and now lives her best life.",
      adoptionDate: "2024-01-15",
    },
    {
      id: "2",
      petName: "Charlie",
      beforeImage: "/placeholder.svg?height=300&width=300",
      afterImage: "/placeholder.svg?height=300&width=300",
      story:
        "Charlie came to us as a scared puppy. With love and training, he became a confident, happy dog who now brings joy to his new family every day.",
      adoptionDate: "2023-11-20",
    },
    {
      id: "3",
      petName: "Luna",
      beforeImage: "/placeholder.svg?height=300&width=300",
      afterImage: "/placeholder.svg?height=300&width=300",
      story:
        "Luna was a senior dog who needed special care. Her adopters saw past her age and gave her the loving retirement she deserved.",
      adoptionDate: "2023-09-10",
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <SectionWrapper id="success-stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ fontFamily: designSettings.headingFont, color: designSettings.textColor }}
          >
            {successData.headerSection.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {successData.headerSection.content}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Before/After Images */}
              <div className="relative">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img
                      src={story.beforeImage || "/placeholder.svg?height=192&width=200&query=pet before rescue"}
                      alt={`${story.petName} before`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      Before
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src={story.afterImage || "/placeholder.svg?height=192&width=200&query=happy pet after adoption"}
                      alt={`${story.petName} after`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                      After
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <ArrowRight className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: designSettings.headingFont }}>
                    {story.petName}'s Story
                  </h3>
                  <Heart className="h-5 w-5 text-red-500" />
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">{story.story}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Adopted {formatDate(story.adoptionDate)}
                  </div>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Read More
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="primary" size="lg" href="#contact">
            Share Your Success Story
          </Button>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default SuccessStories
