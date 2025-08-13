// src/pages/templates/modern/sections/About.tsx

import { useLiveSite } from '../../../../contexts/LiveSiteContext';

const About = () => {
  const { liveSiteConfig } = useLiveSite();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {liveSiteConfig?.about_us || 'We are dedicated to rescuing and rehoming animals in need.'}
            </p>
            <p className="text-lg text-gray-600 mb-8">
              {liveSiteConfig?.mission_statement || 'Our mission is to provide shelter, medical care, and love to abandoned animals while finding them perfect forever homes.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Learn More
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Volunteer
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden">
              <img 
                src={liveSiteConfig?.logo_url || "/placeholder-about.jpg"} 
                alt="About us" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
