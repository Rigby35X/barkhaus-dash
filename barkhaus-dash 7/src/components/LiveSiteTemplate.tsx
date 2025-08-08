import React from "react"

interface LiveSiteTemplateProps {
  config: {
    site_name: string
    logo_url: string
    about_us: string
    mission_statement: string
    contact_info: {
      address: string
      phone: string
      email: string
      hours?: string
    }
    social_media: {
      facebook?: string
      instagram?: string
      twitter?: string
      linkedin?: string
    }
  }
  designSettings: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
    headingFont: string
    backgroundColor: string
    textColor: string
    borderRadius: string
    shadowStyle: string
  }
  pets?: Array<any>
  successStories?: Array<any>
}

const LiveSiteTemplate: React.FC<LiveSiteTemplateProps> = ({
  config,
  designSettings,
  pets = [],
  successStories = [],
}) => {
  const {
    primaryColor,
    secondaryColor,
    accentColor,
    fontFamily,
    headingFont,
    backgroundColor,
    textColor,
    borderRadius,
    shadowStyle,
  } = designSettings

  // Set CSS variables for global use
  const customStyles = {
    "--primary-color": primaryColor,
    "--secondary-color": secondaryColor,
    "--accent-color": accentColor,
    "--background-color": backgroundColor,
    "--font-color": textColor,
    "--heading-font": headingFont,
    "--body-font": fontFamily,
    "--radius": borderRadius,
    "--shadow": shadowStyle,
  } as React.CSSProperties

  return (
    <div style={customStyles} className="min-h-screen body-font bg-[var(--background-color)] text-[var(--font-color)]">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src={config.logo_url || "/Duggy.png"}
                alt={config.site_name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h1 className="heading-font text-xl font-bold" style={{ color: "var(--font-color)" }}>
                  {config.site_name || "Happy Paws Rescue"}
                </h1>
              </div>
            </div>
            <div className="flex space-x-4">
              {config.social_media?.facebook && (
                <a href={config.social_media.facebook} target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12"></path>
                  </svg>
                </a>
              )}
              {/* Add other social icons as needed */}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gray-50" style={{ fontFamily: "var(--heading-font)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="heading-font text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--primary-color)" }}>
            Find Your Perfect Companion
          </h2>
          <p className="body-font text-lg mb-8" style={{ color: "var(--font-color)" }}>
            Every animal deserves a loving home. Help us make that happen.
          </p>
          <a
            href="#pets"
            className="inline-block px-8 py-3 rounded-full font-semibold text-white"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            View Available Pets
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20 bg-white" style={{ fontFamily: "var(--body-font)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="heading-font text-3xl md:text-4xl font-bold mb-6" style={{ color: "var(--font-color)" }}>
            About Our Mission
          </h3>
          <p className="body-font text-gray-600 text-lg mb-6">
            {config.about_us ||
              "We are dedicated to rescuing and rehoming animals in need. Our mission is to provide loving care and find forever homes for every animal that comes through our doors."}
          </p>
        </div>
      </section>

      {/* Pets Section */}
      <section id="pets" className="py-16 md:py-20 bg-gray-50" style={{ fontFamily: "var(--body-font)" }}>
        <div className="max-w-6xl mx-auto">
          <h3 className="heading-font text-3xl md:text-4xl font-bold mb-8 text-center" style={{ color: "var(--primary-color)" }}>
            Available Pets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pets.length > 0 ? (
              pets.map((pet, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                  <img src={pet.image} alt={pet.name} className="w-32 h-32 object-cover rounded-full mb-4" />
                  <h4 className="heading-font text-xl font-bold mb-2">{pet.name}</h4>
                  <p className="body-font text-gray-600 mb-2">{pet.breed}</p>
                  <p className="body-font text-gray-500">{pet.age}</p>
                </div>
              ))
            ) : (
              <p className="body-font text-gray-500 col-span-3 text-center">No pets available at this time.</p>
            )}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-20 bg-white" style={{ fontFamily: "var(--body-font)" }}>
        <div className="max-w-6xl mx-auto">
          <h3 className="heading-font text-3xl md:text-4xl font-bold mb-8 text-center" style={{ color: "var(--primary-color)" }}>
            Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.length > 0 ? (
              successStories.map((story, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg shadow p-6 flex flex-col md:flex-row items-center">
                  <img src={story.image} alt={story.petName} className="w-32 h-32 object-cover rounded-full mb-4 md:mb-0 md:mr-6" />
                  <div>
                    <h4 className="heading-font text-xl font-bold mb-2">{story.petName}</h4>
                    <p className="body-font text-gray-600 mb-2">{story.story}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="body-font text-gray-500 col-span-2 text-center">No stories yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 text-center body-font" style={{ color: "var(--font-color)" }}>
        <div>
          <p>
            &copy; {new Date().getFullYear()} {config.site_name || "Happy Paws Rescue"}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LiveSiteTemplate
