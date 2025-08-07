import type React from "react"
import { useLiveSite } from "../../../../contexts/LiveSiteContext"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Heart } from "lucide-react"

const Footer = () => {
  const { siteContent, designSettings } = useLiveSite()
  const { organization } = siteContent

  const SectionWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <section
      className={`py-12 md:py-16 ${className}`}
      style={{ backgroundColor: designSettings.primaryColor, fontFamily: designSettings.fontFamily }}
    >
      {children}
    </section>
  )

  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
  }

  return (
    <SectionWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={organization.logo || "/placeholder.svg?height=48&width=48"}
                alt={organization.siteName}
                className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
              />
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: designSettings.headingFont }}>
                  {organization.siteName}
                </h3>
                <p className="text-gray-200 text-sm">{organization.tagline}</p>
              </div>
            </div>
            <p className="text-gray-200 leading-relaxed text-sm mb-4">{organization.aboutUs}</p>
            {organization.registrationNumber && (
              <p className="text-gray-300 text-xs">Registration: {organization.registrationNumber}</p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white" style={{ fontFamily: designSettings.headingFont }}>
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>
                <a href="#hero" className="hover:text-white transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#pets" className="hover:text-white transition-colors text-sm">
                  Available Pets
                </a>
              </li>
              <li>
                <a href="#success-stories" className="hover:text-white transition-colors text-sm">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white" style={{ fontFamily: designSettings.headingFont }}>
              Get Involved
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Adopt a Pet
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Foster Program
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Volunteer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Donate
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Sponsor a Pet
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white" style={{ fontFamily: designSettings.headingFont }}>
              Contact Info
            </h3>
            <div className="space-y-3 text-gray-200">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{organization.contactInfo.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <a
                  href={`tel:${organization.contactInfo.phone}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {organization.contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <a
                  href={`mailto:${organization.contactInfo.email}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {organization.contactInfo.email}
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3 text-sm">Follow Us</h4>
              <div className="flex space-x-3">
                {Object.entries(organization.contactInfo.socialMedia).map(([platform, url]) => {
                  if (!url) return null
                  const IconComponent = socialIcons[platform as keyof typeof socialIcons]
                  if (!IconComponent) return null

                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                    >
                      <IconComponent className="h-4 w-4 text-white" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-200 text-sm mb-4 md:mb-0">
              <p className="flex items-center">
                &copy; {new Date().getFullYear()} {organization.siteName}. All rights reserved.
                <Heart className="h-4 w-4 mx-2 text-red-400" />
                Powered by BarkHaus.
              </p>
            </div>
            <div className="flex space-x-4 text-gray-200 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Footer
