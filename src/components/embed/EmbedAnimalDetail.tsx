import React, { useState, useEffect } from 'react';
import EmbedLayout from './EmbedLayout';
import { verifyEmbedToken, type EmbedPayload } from '../../lib/embedToken';

interface Animal {
  id: number | string;
  name: string;
  litter_name?: string;
  species: string;
  breed?: string;
  age?: string;
  description?: string;
  description_long?: string;
  image_url?: string;
  images?: Array<string | { url?: string }>;
  photo?: { url?: string };
  gender?: string;
  weight?: string;
  vaccinated?: boolean;
  spayed_neutered?: boolean;
  status?: string;
  location?: string;
  medical_notes?: string;
  adoption_fee?: number;
  good_with_kids?: boolean;
  good_with_dogs?: boolean;
  good_with_cats?: boolean;
  energy_level?: string;
  size?: string;
}

interface EmbedAnimalDetailProps {
  animalId: string;
  token: string;
  primaryColor?: string;
}

export default function EmbedAnimalDetail({
  animalId,
  token,
  primaryColor = '#324b65'
}: EmbedAnimalDetailProps) {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenPayload, setTokenPayload] = useState<EmbedPayload | null>(null);

  // Verify token and get organization info
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const payload = await verifyEmbedToken(token);
        setTokenPayload(payload);
      } catch (err) {
        setError('Invalid or expired token');
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Fetch animal details when token is verified
  useEffect(() => {
    if (!tokenPayload) return;

    const fetchAnimal = async () => {
      try {
        setLoading(true);
        
        // Use your existing API endpoint - adjust this to match your actual API structure
        const response = await fetch(`/api/animals/${animalId}?tenant_id=${tokenPayload.tenant_id}`);
        
        if (response.status === 404) {
          setError('Animal not found');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch animal details');
        }
        
        const data = await response.json();
        setAnimal(data.animal || data);
      } catch (err) {
        console.error('Error fetching animal:', err);
        setError('Failed to load animal details');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [tokenPayload, animalId]);

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
      return 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&crop=faces';
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
          Loading animal details...
        </div>
      </EmbedLayout>
    );
  }

  if (!animal) {
    return (
      <EmbedLayout primaryColor={primaryColor}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Animal not found.
        </div>
      </EmbedLayout>
    );
  }

  const imageUrl = resolveImageURL(animal);
  const backUrl = `/embed/animals?token=${encodeURIComponent(token)}`;

  return (
    <EmbedLayout primaryColor={primaryColor}>
      <main>
        <a className="embed-back" href={backUrl}>
          ← Back to all animals
        </a>

        <div className="embed-detail-wrap">
          <div>
            <img
              className="embed-detail-image"
              src={imageUrl}
              alt={animal.name}
            />
          </div>
          
          <div>
            <h1 className="embed-detail-title">{animal.name}</h1>
            
            <div className="embed-muted" style={{ marginBottom: '8px' }}>
              {[
                animal.status,
                animal.species,
                animal.breed,
                animal.age
              ].filter(Boolean).join(' • ')}
            </div>

            {animal.gender && (
              <div className="embed-muted" style={{ marginBottom: '12px' }}>
                {animal.gender}
                {animal.weight && ` • ${animal.weight}`}
                {animal.size && ` • ${animal.size}`}
              </div>
            )}

            <a
              className="embed-cta-button"
              href="#"
              target="_top"
              rel="noopener"
              onClick={(e) => {
                e.preventDefault();
                // Open adoption application in parent window
                if (window.parent && window.parent !== window) {
                  window.parent.postMessage({
                    __barkhaus_action: 'open_adoption',
                    animal_id: animal.id,
                    animal_name: animal.name
                  }, '*');
                }
              }}
            >
              Apply to Adopt {animal.name}
            </a>

            {(animal.description || animal.description_long) && (
              <div className="embed-section">
                <strong>About {animal.name}</strong>
                <p className="embed-muted" style={{ marginTop: '8px', lineHeight: '1.5' }}>
                  {animal.description_long || animal.description}
                </p>
              </div>
            )}

            {/* Health & Behavior Info */}
            {(animal.vaccinated !== undefined || animal.spayed_neutered !== undefined || 
              animal.good_with_kids !== undefined || animal.good_with_dogs !== undefined || 
              animal.good_with_cats !== undefined) && (
              <div className="embed-section">
                <strong>Health & Behavior</strong>
                <div style={{ marginTop: '8px' }}>
                  {animal.vaccinated !== undefined && (
                    <div className="embed-muted">
                      Vaccinated: {animal.vaccinated ? 'Yes' : 'No'}
                    </div>
                  )}
                  {animal.spayed_neutered !== undefined && (
                    <div className="embed-muted">
                      Spayed/Neutered: {animal.spayed_neutered ? 'Yes' : 'No'}
                    </div>
                  )}
                  {animal.good_with_kids !== undefined && (
                    <div className="embed-muted">
                      Good with kids: {animal.good_with_kids ? 'Yes' : 'No'}
                    </div>
                  )}
                  {animal.good_with_dogs !== undefined && (
                    <div className="embed-muted">
                      Good with dogs: {animal.good_with_dogs ? 'Yes' : 'No'}
                    </div>
                  )}
                  {animal.good_with_cats !== undefined && (
                    <div className="embed-muted">
                      Good with cats: {animal.good_with_cats ? 'Yes' : 'No'}
                    </div>
                  )}
                  {animal.energy_level && (
                    <div className="embed-muted">
                      Energy level: {animal.energy_level}
                    </div>
                  )}
                </div>
              </div>
            )}

            {animal.adoption_fee && (
              <div className="embed-section">
                <strong>Adoption Fee</strong>
                <div className="embed-muted" style={{ marginTop: '8px' }}>
                  ${animal.adoption_fee}
                </div>
              </div>
            )}

            {animal.location && (
              <div className="embed-section">
                <strong>Location</strong>
                <div className="embed-muted" style={{ marginTop: '8px' }}>
                  {animal.location}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </EmbedLayout>
  );
}
