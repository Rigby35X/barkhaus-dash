// Animal Rescue Template - Main Export
// This file exports all pages and components from the template

// Pages
export { default as HomePage } from './pages/HomePage.jsx';
export { default as AboutPage } from './pages/AboutPage.jsx';
export { default as AnimalsPage } from './pages/AnimalsPage.jsx';
export { default as AnimalDetailPage } from './pages/AnimalDetailPage.jsx';
export { default as AdoptionProcessPage } from './pages/AdoptionProcessPage.jsx';
export { default as DonatePage } from './pages/DonatePage.jsx';
export { default as ContactPage } from './pages/ContactPage.jsx';

// Components - Navigation
export { Navbar1 } from './components/navbar-01.jsx';

// Components - Headers
export { Header15 } from './components/header-15.jsx';
export { Header46 } from './components/header-46.jsx';
export { Header47 } from './components/header-47.jsx';
export { Header49 } from './components/header-49.jsx';
export { Header54 } from './components/header-54.jsx';
export { Header62 } from './components/header-62.jsx';

// Components - Layouts
export { Layout4 } from './components/layout-04.jsx';
export { Layout12 } from './components/layout-12.jsx';
export { Layout22 } from './components/layout-22.jsx';
export { Layout24 } from './components/layout-24.jsx';
export { Layout90 } from './components/layout-90.jsx';
export { Layout117 } from './components/layout-117.jsx';
export { Layout192 } from './components/layout-192.jsx';
export { Layout238 } from './components/layout-238.jsx';
export { Layout240 } from './components/layout-240.jsx';
export { Layout241 } from './components/layout-241.jsx';

// Components - Contact
export { Contact1 } from './components/contact-01.jsx';
export { Contact3 } from './components/contact-03.jsx';
export { Contact13 } from './components/contact-13.jsx';
export { Contact16 } from './components/contact-16.jsx';
export { Contact19 } from './components/contact-19.jsx';

// Components - Call to Action
export { Cta1 } from './components/cta-01.jsx';
export { Cta4 } from './components/cta-04.jsx';
export { Cta7 } from './components/cta-07.jsx';
export { Cta25 } from './components/cta-25.jsx';
export { Cta39 } from './components/cta-39.jsx';

// Components - FAQ
export { Faq1 } from './components/faq-01.jsx';
export { Faq2 } from './components/faq-02.jsx';
export { Faq8 } from './components/faq-08.jsx';

// Components - Footer
export { Footer1 } from './components/footer-01.jsx';

// Components - Logo
export { Logo2 } from './components/logo-02.jsx';

// Components - Portfolio
export { Portfolio13 } from './components/portfolio-13.jsx';

// Components - Pricing
export { Pricing14 } from './components/pricing-14.jsx';

// Components - Product
export { ProductHeader4 } from './components/product-header-04.jsx';

// Components - Team
export { Team2 } from './components/team-02.jsx';
export { Team8 } from './components/team-08.jsx';

// Components - Testimonials
export { Testimonial1 } from './components/testimonial-01.jsx';
export { Testimonial4 } from './components/testimonial-04.jsx';
export { Testimonial6 } from './components/testimonial-06.jsx';

// Components - Timeline
export { Timeline13 } from './components/timeline-13.jsx';

// Components - Content
export { Content1 } from './components/content-01.jsx';

// Template Configuration
export { default as templateConfig } from './config.json';

// Template Registry Entry
export const animalRescueTemplate = {
  id: 'animal-rescue',
  name: 'Animal Rescue Template',
  description: 'A beautiful, modern template designed specifically for animal rescue organizations',
  pages: {
    HomePage,
    AboutPage,
    AnimalsPage,
    AnimalDetailPage,
    AdoptionProcessPage,
    DonatePage,
    ContactPage
  },
  config: templateConfig
};
