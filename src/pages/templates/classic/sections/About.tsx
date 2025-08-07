import type React from "react"
import { useLiveSite } from "../../../../contexts/LiveSiteContext"
import { Heart, Users, HomeIcon, Award } from "lucide-react"

const About = () => {
  const { siteContent, designSettings } = useLiveSite()
  const { organization } = siteContent
  const aboutData = siteContent.pages.about.aboutSection

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

  const features = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Every animal receives love, medical attention, and rehabilitation",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: HomeIcon,
      title: "Forever Homes",
      description: "Matching pets with perfect families through careful screening",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Building a network of volunteers, donors, and animal lovers",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Award,
      title: "Proven Results",
      description: `${new Date().getFullYear() - (organization.foundedYear || 2015)} years of successful animal rescue and adoption`,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <SectionWrapper id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              style={{ fontFamily: designSettings.headingFont, color: designSettings.textColor }}
            >
              {aboutData.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed mb-6">
              {organization.mission}
            </p>

            <div className="mb-8">
              <p className="text-gray-600 leading-relaxed mb-4">{organization.aboutUs}</p>
              <p className="text-gray-600 leading-relaxed">
                Founded in {organization.foundedYear}, we have been a cornerstone of animal welfare in our community.
                Our vision is simple: {organization.vision}
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-start">
                    <div className={`${feature.bgColor} p-3 rounded-lg mr-4 flex-shrink-0`}>
                      <IconComponent className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <img
                src={aboutData.image || "/placeholder.svg?height=192&width=300&query=happy rescued pet"}
                alt="Happy pet"
                className="rounded-2xl shadow-lg w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <img
                src="/placeholder.svg?height=192&width=300"
                alt="Cute pet"
                className="rounded-2xl shadow-lg mt-8 w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <img
                src="/placeholder.svg?height=192&width=300"
                alt="Rescued pet"
                className="rounded-2xl shadow-lg -mt-8 w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <img
                src="/placeholder.svg?height=192&width=300"
                alt="Pet care"
                className="rounded-2xl shadow-lg w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default About
