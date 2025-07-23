// src/pages/templates/classic/sections/Mission.tsx
import React from 'react';
import { useLiveSite } from '@/contexts/LiveSiteContext';

const Mission = () => {
  const { organization } = useLiveSite();

  return (
    <section className="py-12 bg-white text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700">
          {organization?.mission || 'We’re here to rescue dogs and find them homes.'}
        </p>
      </div>
    </section>
  );
};

export default Mission;
