// src/pages/templates/classic/ClassicHomepage.tsx

import Hero from './sections/Hero';
import About from './sections/About';
import AvailablePets from './sections/AvailablePets';
import Footer from './sections/Footer';

const ClassicHomepage = () => {
  return (
    <>
      <Hero />
      <About />
      <AvailablePets />
      <Footer />
    </>
  );
};

export default ClassicHomepage;
