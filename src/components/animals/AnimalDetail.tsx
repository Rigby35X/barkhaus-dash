import React from 'react';
import { Link } from 'react-router-dom';

interface Animal {
  id: number | string;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  status?: string;
  image_url?: string;
  description?: string;
  description_long?: string;
  location?: string;
  gender?: string;
  weight?: string;
  vaccinated?: boolean;
  spayed_neutered?: boolean;
  good_with_kids?: boolean;
  good_with_dogs?: boolean;
  good_with_cats?: boolean;
  energy_level?: string;
  adoption_fee?: number;
  medical_notes?: string;
}

interface AnimalDetailProps {
  animal: Animal;
  orgId: string | number;
  showAdminActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function AnimalDetail({ 
  animal, 
  orgId, 
  showAdminActions = false,
  onEdit,
  onDelete,
  className = '' 
}: AnimalDetailProps) {
  
  const normalizeImage = (imageUrl?: string): string => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&crop=faces';
    }
    
    if (imageUrl.startsWith('//')) return 'https:' + imageUrl;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl.replace(/^http:\/\//i, 'https://');
    if (imageUrl.startsWith('/')) return imageUrl;
    return '/' + imageUrl.replace(/^\/+/, '');
  };

  const imageUrl = normalizeImage(animal.image_url);

  return (
    <div className={`xad ${className}`}>
      <style>{`
        .xad {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .xad-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .xad-back {
          display: inline-flex;
          align-items: center;
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        
        .xad-back:hover {
          color: #374151;
        }
        
        .xad-actions {
          display: flex;
          gap: 0.75rem;
        }
        
        .xad-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        @media (min-width: 768px) {
          .xad-content {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }
        
        .xad-media img {
          width: 100%;
          height: auto;
          max-height: 500px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.1);
        }
        
        .xad-info {
          padding: 1rem 0;
        }
        
        .xad-name {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }
        
        .xad-meta {
          color: #6b7280;
          font-size: 1.125rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .xad-status {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
        }
        
        .xad-status.available {
          background-color: #d1fae5;
          color: #065f46;
        }
        
        .xad-status.pending {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .xad-status.adopted {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .xad-desc {
          color: #374151;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .xad-long {
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        
        .xad-details {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .xad-details h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }
        
        .xad-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .xad-detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .xad-detail-label {
          font-weight: 500;
          color: #6b7280;
        }
        
        .xad-detail-value {
          color: #1f2937;
        }
        
        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        
        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #2563eb;
        }
        
        .btn-secondary {
          background-color: #6b7280;
          color: white;
        }
        
        .btn-secondary:hover {
          background-color: #4b5563;
        }
        
        .btn-danger {
          background-color: #ef4444;
          color: white;
        }
        
        .btn-danger:hover {
          background-color: #dc2626;
        }
      `}</style>

      <div className="xad-header">
        <Link to={showAdminActions ? "/app/animals" : `/animals?orgId=${orgId}`} className="xad-back">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Animals
        </Link>
        
        {showAdminActions && (
          <div className="xad-actions">
            {onEdit && (
              <button onClick={onEdit} className="btn btn-secondary">
                Edit Animal
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="btn btn-danger">
                Delete Animal
              </button>
            )}
          </div>
        )}
      </div>

      <article className="xad-content">
        <div className="xad-media">
          <img src={imageUrl} alt={animal.name || 'Animal'} />
        </div>
        
        <div className="xad-info">
          <h1 className="xad-name">{animal.name || 'Unnamed'}</h1>
          
          <div className="xad-meta">
            {[animal.breed, animal.age, animal.gender].filter(Boolean).join(' • ')}
            {animal.location && ` • ${animal.location}`}
          </div>
          
          {animal.status && (
            <div className={`xad-status ${animal.status.toLowerCase()}`}>
              {animal.status}
            </div>
          )}
          
          {animal.description && (
            <p className="xad-desc">{animal.description}</p>
          )}
          
          {animal.description_long && (
            <div className="xad-long" dangerouslySetInnerHTML={{ __html: animal.description_long }} />
          )}
          
          {!showAdminActions && (
            <Link 
              to={`/applications?type=adoption&animalId=${encodeURIComponent(String(animal.id))}&orgId=${orgId}`}
              className="btn btn-primary"
            >
              Apply to Adopt {animal.name}
            </Link>
          )}
          
          <div className="xad-details">
            <h3>Details</h3>
            <div className="xad-detail-grid">
              <div className="xad-detail-item">
                <span className="xad-detail-label">Species</span>
                <span className="xad-detail-value">{animal.species}</span>
              </div>
              {animal.weight && (
                <div className="xad-detail-item">
                  <span className="xad-detail-label">Weight</span>
                  <span className="xad-detail-value">{animal.weight}</span>
                </div>
              )}
              {animal.vaccinated !== undefined && (
                <div className="xad-detail-item">
                  <span className="xad-detail-label">Vaccinated</span>
                  <span className="xad-detail-value">{animal.vaccinated ? 'Yes' : 'No'}</span>
                </div>
              )}
              {animal.spayed_neutered !== undefined && (
                <div className="xad-detail-item">
                  <span className="xad-detail-label">Spayed/Neutered</span>
                  <span className="xad-detail-value">{animal.spayed_neutered ? 'Yes' : 'No'}</span>
                </div>
              )}
              {animal.good_with_kids !== undefined && (
                <div className="xad-detail-item">
                  <span className="xad-detail-label">Good with Kids</span>
                  <span className="xad-detail-value">{animal.good_with_kids ? 'Yes' : 'No'}</span>
                </div>
              )}
              {animal.good_with_dogs !== undefined && (
                <div className="xad-detail-item">
                  <span className="xad-detail-label">Good with Dogs</span>
                  <span className="xad-detail-value">{animal.good_with_dogs ? 'Yes' : 'No'}</span>
                </div>
              )}
              {animal.good_with_cats !== undefined && (
                <div className="xad-detail-item">
                  <span className="xad-detail-label">Good with Cats</span>
                  <span className="xad-detail-value">{animal.good_with_cats ? 'Yes' : 'No'}</span>
                </div>
              )}
              {animal.energy_level && (
                <div className="xad-detail-item">
                  <span className="xad-detail-label">Energy Level</span>
                  <span className="xad-detail-value">{animal.energy_level}</span>
                </div>
              )}
              {animal.adoption_fee && (
                <div className="xad-detail-item">
                  <span className="xad-detail-label">Adoption Fee</span>
                  <span className="xad-detail-value">${animal.adoption_fee}</span>
                </div>
              )}
            </div>
          </div>
          
          {animal.medical_notes && (
            <div className="xad-details">
              <h3>Medical Notes</h3>
              <p className="xad-desc">{animal.medical_notes}</p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
