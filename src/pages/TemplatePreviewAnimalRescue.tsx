import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Import template pages
import HomePage from '../../templates/animal-rescue/pages/HomePage.jsx';
import AboutPage from '../../templates/animal-rescue/pages/AboutPage.jsx';
import AnimalsPage from '../../templates/animal-rescue/pages/AnimalsPage.jsx';
import AnimalDetailPage from '../../templates/animal-rescue/pages/AnimalDetailPage.jsx';
import AdoptionProcessPage from '../../templates/animal-rescue/pages/AdoptionProcessPage.jsx';
import DonatePage from '../../templates/animal-rescue/pages/DonatePage.jsx';
import ContactPage from '../../templates/animal-rescue/pages/ContactPage.jsx';

const TemplatePreviewAnimalRescue = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 'home';

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'animals':
        return <AnimalsPage />;
      case 'animal-detail':
        return <AnimalDetailPage />;
      case 'adoption-process':
        return <AdoptionProcessPage />;
      case 'donate':
        return <DonatePage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Template Navigation */}
      <div className="bg-gray-100 border-b border-gray-200 p-4">
        <div className="container mx-auto">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">
            Animal Rescue Template Preview
          </h1>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'home', label: 'Home' },
              { key: 'about', label: 'About Us' },
              { key: 'animals', label: 'Available Animals' },
              { key: 'animal-detail', label: 'Animal Detail' },
              { key: 'adoption-process', label: 'Adoption Process' },
              { key: 'donate', label: 'Donate' },
              { key: 'contact', label: 'Contact' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', item.key);
                  window.history.pushState({}, '', `?${newParams.toString()}`);
                  window.location.reload();
                }}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  page === item.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Template Content */}
      <div className="template-content">
        {renderPage()}
      </div>
    </div>
  );
};

export default TemplatePreviewAnimalRescue;
