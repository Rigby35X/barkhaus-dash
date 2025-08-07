import type React from "react"
import { useLiveSite } from "../../../../contexts/LiveSiteContext"
import { Heart, Home, Users, Calendar, Award, Smile } from "lucide-react"

const Stats = () => {
  const { siteContent, designSettings } = useLiveSite()
  const { organization } = siteContent

  const SectionWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <section
      className={`py-16 md:py-20 ${className}`}
      style={{ backgroundColor: designSettings.primaryColor, fontFamily: designSettings.fontFamily }}
    >
      {children}
    </section>
  )

  // Use stats from context or default stats
  const stats = siteContent.pages.about.stats || [
    { number: "500+", label: "Animals Rescued", icon: "heart" },
    { number: "450+", label: "Successful Adoptions", icon: "home" },
    { number: "50+", label: "Active Volunteers", icon: "users" },
    {
      number: `${new Date().getFullYear() - (organization.foundedYear || 2015)}`,
      label: "Years of Service",
      icon: "calendar",
    },
  ]

  const getIcon = (iconName: string) => {
    const iconMap = {
      heart: Heart,
      home: Home,
      users: Users,
      calendar: Calendar,
      award: Award,
      smile: Smile,
    }
    return iconMap[iconName as keyof typeof iconMap] || Heart
  }

  return (
    <SectionWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: designSettings.headingFont }}>
            Our Impact
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Every number represents a life changed, a family completed, and a community strengthened.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = getIcon(stat.icon || "heart")
            return (
              <div key={index} className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-200 text-sm md:text-base font-medium">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-200 text-lg">Join us in making a difference, one paw at a time.</p>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Stats
