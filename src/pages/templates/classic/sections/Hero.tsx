// src/pages/templates/classic/sections/Hero.tsx
import React from 'react';
import { useLiveSite } from '@/pages/LiveSiteContext';

const Hero = () => {
  const { design, organization } = useLiveSite();

  return (
    <section className="bg-primary-600 text-white py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {organization?.name || 'Welcome to BarkHaus Rescue'}
        </h1>
        <p className="text-lg md:text-xl mb-6">
          {organization?.tagline || 'Giving every dog a second chance at a loving home.'}
        </p>
        <a
          href="#available-pets"
          className="inline-block bg-white text-primary-600 font-semibold px-6 py-3 rounded hover:bg-gray-100"
        >
          {organization?.cta_label || 'Meet Our Dogs'}
        </a>
      </div>
    </section>
  );
};

export default Hero;
