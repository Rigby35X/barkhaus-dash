import { useState, useEffect } from 'react';
import { useLiveSite } from '../../../../contexts/LiveSiteContext';

interface Pet {
  id: number;
  name: string;
  breed?: string;
  age?: string;
  image_url?: string;
  description?: string;
  status: string;
}

const AvailablePets = () => {
  const { liveSiteConfig } = useLiveSite();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        if (liveSiteConfig?.tenant_id) {
          // Fetch pets from API
          const response = await fetch(`${import.meta.env.VITE_XANO_ANIMALS_URL}/animals?tenant_id=${liveSiteConfig.tenant_id}&status=Available&limit=6`);
          if (response.ok) {
            const petsData = await response.json();
            setPets(petsData);
          }
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [liveSiteConfig?.tenant_id]);

  // Mock data for preview/fallback
  const mockPets = [
    {
      id: 1,
      name: "Buddy",
      breed: "Labrador Mix",
      age: "2 years",
      image_url: "/images/sample-dog.jpg",
      description: "A friendly and energetic dog looking for a loving home.",
      status: "Available"
    },
    {
      id: 2,
      name: "Luna",
      breed: "Golden Retriever",
      age: "3 years",
      image_url: "/images/sample-dog.jpg",
      description: "Sweet and gentle, perfect for families with children.",
      status: "Available"
    },
    {
      id: 3,
      name: "Max",
      breed: "German Shepherd",
      age: "4 years",
      image_url: "/images/sample-dog.jpg",
      description: "Loyal and protective, needs an experienced owner.",
      status: "Available"
    }
  ];

  const displayPets = pets.length > 0 ? pets : mockPets;

  return (
    <section id="available-pets" className="bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Available Pets</h2>

        {loading ? (
          <div className="text-center">
            <p className="text-gray-600">Loading pets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayPets.slice(0, 6).map((pet) => (
              <div key={pet.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4">
                <img
                  src={pet.image_url || "/images/sample-dog.jpg"}
                  alt={pet.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
                {pet.breed && (
                  <p className="text-gray-600 text-sm mb-1">{pet.breed}</p>
                )}
                {pet.age && (
                  <p className="text-gray-600 text-sm mb-2">{pet.age}</p>
                )}
                <p className="text-gray-600 text-sm mb-4">
                  {pet.description || "Looking for a loving home."}
                </p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            View All Pets
          </button>
        </div>
      </div>
    </section>
  );
};

export default AvailablePets;

