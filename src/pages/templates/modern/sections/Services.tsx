// src/pages/templates/modern/sections/Services.tsx

import { Heart, Home, Stethoscope, Users } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Heart,
      title: "Pet Adoption",
      description: "Find your perfect companion from our loving animals waiting for forever homes."
    },
    {
      icon: Stethoscope,
      title: "Medical Care",
      description: "Comprehensive veterinary care ensuring all our animals are healthy and ready for adoption."
    },
    {
      icon: Home,
      title: "Foster Program",
      description: "Temporary homes for animals who need extra care before they're ready for adoption."
    },
    {
      icon: Users,
      title: "Community Outreach",
      description: "Educational programs and community events to promote responsible pet ownership."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive care and support for animals and families in our community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
