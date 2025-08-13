// src/pages/templates/modern/sections/Hero.tsx

import { useLiveSite } from '../../../../contexts/LiveSiteContext';

const Hero = () => {
  const { liveSiteConfig } = useLiveSite();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {liveSiteConfig?.site_name || 'Modern Animal Rescue'}
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          {liveSiteConfig?.mission_statement || 'Connecting loving families with pets in need'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
            Adopt Now
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
