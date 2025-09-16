// app/(site)/animals/[id]/components/AnimalDetailPageClient.tsx
'use client';

import React, { useState } from 'react';
import { Check, Heart, Share2, MapPin, Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Your Dog type (should match the server component)
type Dog = {
  id: number | string;
  name: string;
  litter_name?: string;
  species: string;
  age?: string;
  description?: string;
  description_long?: string;
  image?: string | { url?: string };
  image_url?: string;
  images?: Array<string | { url?: string }>;
  photo?: { url?: string };
  breed?: string;
  gender?: string;
  weight?: string;
  vaccinated?: boolean;
  spayed_neutered?: boolean;
  status?: string;
  location?: string;
  medical_notes?: string;
  color?: string;
  size?: string;
  intake_date?: string;
  adoption_fee?: number | string;
  microchip?: boolean | string;
  house_trained?: boolean;
  energy_level?: string;
  good_with_kids?: boolean;
  good_with_dogs?: boolean;
  good_with_cats?: boolean;
  special_needs?: string;
  training_notes?: string;
  playgroup_notes?: string;
  org_description?: string;
  org_details?: string;
};

// ImageGallery Component
const ImageGallery: React.FC<{ images: string[]; altText: string }> = ({ images, altText }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  if (images.length === 0) return null;

  return (
    <div className="w-full">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
        <img
          src={images[selectedImage]}
          alt={`${altText} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === selectedImage ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={image} alt={`${altText} - Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Accordion Component
const Accordion: React.FC<{ items: Array<{ id: string; title: string; content: React.ReactNode }> }> = ({ items }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="font-medium text-gray-900">{item.title}</span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${openItems.has(item.id) ? 'rotate-180' : ''}`} />
          </button>
          
          {openItems.has(item.id) && (
            <div className="p-4 bg-white border-t border-gray-200">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// EditableTag Component (for display only in this context)
const DisplayTag: React.FC<{ label: string; value: boolean }> = ({ label, value }) => {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
      value ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-600 border border-gray-300'
    }`}>
      {value ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      {label}
    </div>
  );
};

// RelatedAnimals Component
const RelatedAnimals: React.FC<{ currentAnimalId: number | string; orgId: string }> = ({ 
  currentAnimalId, 
  orgId 
}) => {
  const [animals, setAnimals] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchRelatedAnimals = async () => {
      try {
        // Fetch from your animals API endpoint
        const response = await fetch(`/api/orgs/${orgId}/animals`);
        if (response.ok) {
          const data = await response.json();
          // Filter out current animal and limit to 4
          const filteredAnimals = (Array.isArray(data) ? data : data.animals || [])
            .filter((animal: Dog) => animal.id !== currentAnimalId)
            .slice(0, 4);
          setAnimals(filteredAnimals);
        } else {
          // Fallback to sample data if API fails
          const sampleAnimals: Dog[] = [
            {
              id: 2,
              name: "Max",
              species: "Dog",
              breed: "Labrador Mix",
              age: "2 years",
              gender: "Male",
              location: "San Francisco, CA",
              description: "Max is a playful and energetic dog who loves fetch and swimming.",
              image_url: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg",
              status: "Available for Adoption"
            },
            {
              id: 3,
              name: "Bella",
              species: "Dog",
              breed: "German Shepherd",
              age: "4 years",
              gender: "Female",
              location: "Oakland, CA",
              description: "Bella is a loyal and intelligent companion looking for an active family.",
              image_url: "https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg",
              status: "Available for Adoption"
            },
            {
              id: 4,
              name: "Charlie",
              species: "Dog",
              breed: "Beagle Mix",
              age: "1 year",
              gender: "Male",
              location: "San Jose, CA",
              description: "Charlie is a sweet young pup who loves treats and belly rubs.",
              image_url: "https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg",
              status: "Available for Adoption"
            },
            {
              id: 5,
              name: "Daisy",
              species: "Dog",
              breed: "Border Collie",
              age: "3 years",
              gender: "Female",
              location: "Berkeley, CA",
              description: "Daisy is incredibly smart and would love a family who enjoys outdoor activities.",
              image_url: "https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg",
              status: "Available for Adoption"
            }
          ];
          setAnimals(sampleAnimals);
        }
      } catch (error) {
        console.error('Error fetching related animals:', error);
        // Set empty array on error
        setAnimals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedAnimals();
  }, [currentAnimalId, orgId]);

  const handleAnimalClick = (animalId: number | string) => {
    router.push(`/animals/${animalId}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (animals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No other animals available at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {animals.map((animal) => (
        <div
          key={animal.id}
          onClick={() => handleAnimalClick(animal.id)}
          className="group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
        >
          <div className="relative">
            <img
              src={
                animal.image_url
                  ? animal.image_url
                  : typeof animal.image === 'string'
                  ? animal.image
                  : typeof animal.image === 'object' && animal.image?.url
                  ? animal.image.url
                  : 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'
              }
              alt={animal.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
              Available
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {animal.name}
            </h3>
            
            <div className="space-y-1 mb-3">
              {animal.breed && (
                <p className="text-sm text-gray-600">
                  {animal.breed}
                </p>
              )}
              
              {animal.age && (
                <p className="text-sm text-gray-600">
                  {animal.age}
                </p>
              )}
              
              {animal.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500">
                    {animal.location}
                  </p>
                </div>
              )}
            </div>
            
            {animal.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {animal.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

interface AnimalDetailPageClientProps {
  animal: Dog;
  animalId: string;
  orgId: string;
}

export const AnimalDetailPageClient: React.FC<AnimalDetailPageClientProps> = ({ 
  animal, 
  animalId, 
  orgId 
}) => {
  const router = useRouter();

  // Extract images from the animal data
  const getImages = (): string[] => {
    const images: string[] = [];
    
    if (animal.image_url) images.push(animal.image_url);
    if (animal.image && typeof animal.image === 'string') images.push(animal.image);
    if (animal.image && typeof animal.image === 'object' && animal.image.url) images.push(animal.image.url);
    if (animal.photo?.url) images.push(animal.photo.url);
    
    if (animal.images) {
      animal.images.forEach(img => {
        if (typeof img === 'string') {
          images.push(img);
        } else if (typeof img === 'object' && img.url) {
          images.push(img.url);
        }
      });
    }
    
    // Remove duplicates and fallback
    const uniqueImages = [...new Set(images)];
    return uniqueImages.length > 0 ? uniqueImages : ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'];
  };

  const handleApplyToAdopt = () => {
    router.push(`/apply?animalId=${encodeURIComponent(String(animal.id))}`);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Adopt ${animal.name}`,
      text: `Meet ${animal.name}, a ${animal.breed} looking for a loving home!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

  const accordionItems = [
    {
      id: 'description',
      title: 'Full Description',
      content: (
        <div className="prose prose-gray max-w-none">
          <p>{animal.description_long || animal.description || 'No detailed description available.'}</p>
          {animal.medical_notes && (
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-sm"><strong>Medical Notes:</strong> {animal.medical_notes}</p>
            </div>
          )}
          {animal.special_needs && (
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
              <p className="text-sm"><strong>Special Needs:</strong> {animal.special_needs}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'adoption_fee',
      title: 'Adoption Information',
      content: (
        <div className="space-y-3">
          {animal.adoption_fee !== undefined ? (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Adoption Fee:</span>
              <span className="font-semibold text-lg text-green-600">
                ${typeof animal.adoption_fee === 'number' ? animal.adoption_fee : animal.adoption_fee}
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Adoption Fee:</span>
              <span className="font-semibold text-lg text-green-600">$350</span>
            </div>
          )}
          {animal.intake_date && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Since:</span>
              <span className="font-medium">{animal.intake_date}</span>
            </div>
          )}
          {animal.microchip !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Microchipped:</span>
              <span className="font-medium">{animal.microchip ? 'Yes' : 'No'}</span>
            </div>
          )}
          {animal.vaccinated !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Vaccinated:</span>
              <span className="font-medium">{animal.vaccinated ? 'Up to date' : 'Needs vaccines'}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'organization',
      title: 'Organization Details',
      content: (
        <div className="prose prose-gray max-w-none">
          <p>{animal.org_details || 'We are a dedicated rescue organization committed to finding loving homes for animals in need. Founded in 2015, we have successfully placed over 2,000 animals in loving homes. All of our animals receive comprehensive veterinary care, behavioral assessment, and lots of love from our volunteers. We provide post-adoption support and have a 98% success rate. All adoption fees help support our ongoing rescue efforts and include spay/neuter, vaccinations, and microchipping. Contact us for more information about our organization and adoption process.'}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="order-1">
          <ImageGallery images={getImages()} altText={animal.name} />
        </div>

        {/* Animal Details */}
        <div className="order-2 space-y-6">
          {/* Header - Added top padding */}
          <div className="pt-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {animal.name}
            </h1>
            
            {/* Key Details with Check Icons */}
            <div className="space-y-2">
              {animal.status && (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Status: <span className="font-medium">{animal.status}</span>
                  </span>
                </div>
              )}
              
              {animal.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Location: <span className="font-medium">{animal.location}</span>
                  </span>
                </div>
              )}
              
              {animal.species && (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Species: <span className="font-medium">{animal.species}</span>
                  </span>
                </div>
              )}
              
              {animal.breed && (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Breed: <span className="font-medium">{animal.breed}</span>
                  </span>
                </div>
              )}

              {animal.age && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Age: <span className="font-medium">{animal.age}</span>
                  </span>
                </div>
              )}

              {animal.weight && (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Weight: <span className="font-medium">{animal.weight}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Organization Description */}
          {animal.org_description && (
            <div>
              <p className="text-gray-600 leading-relaxed">
                {animal.org_description}
              </p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleApplyToAdopt}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply to Adopt
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          {/* Accordion Section */}
          <div className="mt-8">
            <Accordion items={accordionItems} />
          </div>

          {/* Animal Characteristics */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Animal Characteristics
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <DisplayTag 
                label="Good with Dogs" 
                value={animal.good_with_dogs ?? true} 
              />
              <DisplayTag 
                label="Good with Cats" 
                value={animal.good_with_cats ?? false} 
              />
              <DisplayTag 
                label="Good with Kids" 
                value={animal.good_with_kids ?? true} 
              />
              <DisplayTag 
                label="Potty-Trained" 
                value={animal.house_trained ?? true} 
              />
              <DisplayTag 
                label="Crate-Trained" 
                value={true} 
              />
              <DisplayTag 
                label="Spayed/Neutered" 
                value={animal.spayed_neutered ?? true} 
              />
            </div>
          </div>

          {/* Additional Info from Xano */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {animal.color && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-medium">{animal.color}</span>
                </div>
              )}
              {animal.size && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{animal.size}</span>
                </div>
              )}
              {animal.energy_level && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Energy Level:</span>
                  <span className="font-medium">{animal.energy_level}</span>
                </div>
              )}
              {animal.training_notes && (
                <div className="col-span-2">
                  <span className="text-gray-600">Training Notes:</span>
                  <p className="text-sm mt-1">{animal.training_notes}</p>
                </div>
              )}
              {animal.playgroup_notes && (
                <div className="col-span-2">
                  <span className="text-gray-600">Playgroup Notes:</span>
                  <p className="text-sm mt-1">{animal.playgroup_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Divider */}
      <div className="mt-16 border-t border-gray-200"></div>

      {/* Related Animals Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Other Animals Looking for Homes
        </h2>
        
        <RelatedAnimals currentAnimalId={animal.id} orgId={orgId} />
      </div>
    </div>
  );
};