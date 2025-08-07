import React from 'react';
import { useLiveSite } from '../../../../contexts/LiveSiteContext';
import SectionWrapper from '../../../../components/sections/SectionWrapper';
import SectionTitle from '../../../../components/sections/SectionTitle';
import Button from '../../../../components/sections/Button';
import { MapPin, Heart } from 'lucide-react';

const AvailablePets = () => {
  const { siteContent } = useLiveSite();

  // Mock pet data - in a real app, this would come from props or API
  const mockPets = [
    {
      id: '1',
      name: 'Buddy',
      breed: 'Labrador Mix',
      age: '2 years',
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=face',
      description: '2-year-old Labrador mix looking for a loving home.',
      location: 'Main Shelter'
    },
    {
      id: '2',
      name: 'Luna',
      breed: 'Husky Mix',
      age: '3 years',
      gender: 'Female',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face',
      description: 'Sweet husky mix who loves cuddles and walks.',
      location: 'Foster Home'
    },
    {
      id: '3',
      name: 'Max',
      breed: 'Terrier Mix',
      age: '1 year',
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop&crop=face',
      description: 'Playful terrier ready to bring joy to your home.',
      location: 'Main Shelter'
    }
  ];

  return (
    <SectionWrapper id="pets" backgroundColor="gray" padding="lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionTitle
            title="Find Your Perfect Companion"
            subtitle="Meet our wonderful animals who are looking for their forever homes"
            alignment="center"
            size="lg"
            className="mb-8"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gray-700">{pet.age}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pet.name}</h3>
                <p className="text-gray-600 mb-3">{pet.breed} • {pet.gender}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pet.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {pet.location}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Meet {pet.name}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button
            variant="primary"
            size="lg"
            href="#contact"
          >
            View All Available Pets
          </Button>
        </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AvailablePets;

