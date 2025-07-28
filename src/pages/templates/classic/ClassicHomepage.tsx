import React from 'react';
import { LiveSiteProvider } from '../../../contexts/LiveSiteContext';
import Hero from './sections/Hero';
import About from './sections/About';
import AvailablePets from './sections/AvailablePets';
import Footer from './sections/Footer';

const ClassicHomepage = () => {
  return (
    <LiveSiteProvider>
      <div className="min-h-screen">
        <Hero />
        <About />
        <AvailablePets />
        <Footer />
      </div>
    </LiveSiteProvider>
  );
};

export default ClassicHomepage;
