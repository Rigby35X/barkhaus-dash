import React, { useState, useEffect } from 'react';
import EmbedLayout from './EmbedLayout';
import { verifyEmbedToken, type EmbedPayload } from '../../lib/embedToken';

interface Animal {
  id: number | string;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  description?: string;
  image_url?: string;
  images?: Array<string | { url?: string }>;
  photo?: { url?: string };
  status?: string;
  gender?: string;
}

interface EmbedAnimalsListProps {
  token: string;
  searchQuery?: string;
  species?: string;
  primaryColor?: string;
  showFilters?: boolean;
}

export default function EmbedAnimalsList({
  token,
  searchQuery = '',
  species = 'all',
  primaryColor = '#324b65',
  showFilters = true
}: EmbedAnimalsListProps) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenPayload, setTokenPayload] = useState<EmbedPayload | null>(null);
  const [filters, setFilters] = useState({
    q: searchQuery,
    species: species
  });

  // Verify token and get organization info
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Handle demo mode
        if (token === 'demo') {
          console.log('🧪 Demo mode - using test payload');
          setTokenPayload({
            org_id: '3',
            tenant_id: '3',
            filters: {}
          });
          return;
        }

        const payload = await verifyEmbedToken(token);
        setTokenPayload(payload);
      } catch (err) {
        console.error('Token verification failed:', err);
        setError('Invalid or expired token');
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Fetch animals when token is verified
  useEffect(() => {
    if (!tokenPayload) return;

    const fetchAnimals = async () => {
      try {
        setLoading(true);

        // Handle demo mode with mock data
        if (token === 'demo') {
          console.log('🧪 Demo mode - using mock animals');
          const mockAnimals = [
            {
              id: 1,
              name: 'Bella',
              species: 'Dog',
              breed: 'Golden Retriever',
              age: '3 years',
              status: 'Available',
              image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=faces',
              description: 'Friendly and energetic dog looking for a loving home.'
            },
            {
              id: 2,
              name: 'Max',
              species: 'Dog',
              breed: 'German Shepherd',
              age: '5 years',
              status: 'Available',
              image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop&crop=faces',
              description: 'Loyal and protective companion.'
            },
            {
              id: 3,
              name: 'Luna',
              species: 'Cat',
              breed: 'Siamese',
              age: '2 years',
              status: 'Available',
              image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&crop=faces',
              description: 'Playful and affectionate cat.'
            }
          ];

          // Apply filters to mock data
          let filteredAnimals = mockAnimals;
          if (filters.species && filters.species !== 'all') {
            filteredAnimals = filteredAnimals.filter(animal => animal.species === filters.species);
          }
          if (filters.q) {
            const query = filters.q.toLowerCase();
            filteredAnimals = filteredAnimals.filter(animal =>
              animal.name.toLowerCase().includes(query) ||
              animal.breed.toLowerCase().includes(query) ||
              animal.description.toLowerCase().includes(query)
            );
          }

          setAnimals(filteredAnimals);
          setLoading(false);
          return;
        }

        // Build query parameters
        const params = new URLSearchParams();
        if (filters.q) params.set('q', filters.q);
        if (filters.species && filters.species !== 'all') params.set('species', filters.species);

        // Use your existing API endpoint - adjust this to match your actual API structure
        const response = await fetch(`/api/animals?tenant_id=${tokenPayload.tenant_id}&${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch animals');
        }

        const data = await response.json();
        setAnimals(Array.isArray(data) ? data : data.animals || []);
      } catch (err) {
        console.error('Error fetching animals:', err);
        setError('Failed to load animals');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, [tokenPayload, filters]);

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFilters({
      q: formData.get('q') as string || '',
      species: formData.get('species') as string || 'all'
    });
  };

  const resolveImageURL = (animal: Animal): string => {
    // Get the first available image
    let imageUrl = animal.image_url;
    
    if (!imageUrl && animal.images && animal.images.length > 0) {
      const firstImage = animal.images[0];
      imageUrl = typeof firstImage === 'string' ? firstImage : firstImage?.url;
    }
    
    if (!imageUrl && animal.photo?.url) {
      imageUrl = animal.photo.url;
    }
    
    // Fallback to placeholder
    if (!imageUrl) {
      return 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=faces';
    }
    
    // Handle relative URLs
    if (imageUrl.startsWith('/')) {
      return `${window.location.origin}${imageUrl}`;
    }
    
    return imageUrl;
  };

  if (error) {
    return (
      <EmbedLayout primaryColor={primaryColor}>
        <div style={{ color: '#dc2626', padding: '20px', textAlign: 'center' }}>
          {error}
        </div>
      </EmbedLayout>
    );
  }

  if (loading) {
    return (
      <EmbedLayout primaryColor={primaryColor}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Loading animals...
        </div>
      </EmbedLayout>
    );
  }

  return (
    <EmbedLayout primaryColor={primaryColor}>
      <main>
        <div className="embed-header">
          <div>
            <h1 className="embed-title">Available Animals</h1>
            <p className="embed-subtitle">Click a pet to learn more and apply to adopt.</p>
          </div>

          {showFilters && (
            <form className="embed-filters" onSubmit={handleFilterSubmit}>
              <input
                type="hidden"
                name="token"
                value={token}
              />
              <input
                className="embed-input"
                name="q"
                defaultValue={filters.q}
                placeholder="Search by name..."
              />
              <select
                className="embed-select"
                name="species"
                defaultValue={filters.species}
              >
                <option value="all">All species</option>
                <option value="Dog">Dogs</option>
                <option value="Cat">Cats</option>
                <option value="Other">Other</option>
              </select>
              <button type="submit" className="embed-button">
                Filter
              </button>
            </form>
          )}
        </div>

        {animals.length === 0 ? (
          <div className="embed-muted" style={{ textAlign: 'center', padding: '40px' }}>
            No animals found matching your criteria.
          </div>
        ) : (
          <div className="xa-grid">
            {animals.map(animal => {
              const imageUrl = resolveImageURL(animal);
              const detailUrl = `/embed/animals/${encodeURIComponent(String(animal.id))}?token=${encodeURIComponent(token)}`;

              return (
                <article key={String(animal.id)} className="xa-card" data-id={animal.id}>
                  <a href={detailUrl}>
                    <img className="xa-img" src={imageUrl} alt={animal.name} loading="lazy" />
                    <div className="xa-body">
                      <h3 className="xa-name">{animal.name}</h3>
                      <div className="xa-meta">
                        {[animal.species, animal.breed, animal.age].filter(Boolean).join(' • ')}
                        {animal.status && ` • ${animal.status}`}
                      </div>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </EmbedLayout>
  );
}
