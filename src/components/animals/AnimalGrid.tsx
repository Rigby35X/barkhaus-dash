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
  location?: string;
}

interface AnimalGridProps {
  animals: Animal[];
  orgId: string | number;
  showEditButtons?: boolean;
  onEdit?: (animal: Animal) => void;
  onDelete?: (animalId: string | number) => void;
  className?: string;
}

export default function AnimalGrid({ 
  animals, 
  orgId, 
  showEditButtons = false,
  onEdit,
  onDelete,
  className = '' 
}: AnimalGridProps) {
  
  const normalizeImage = (imageUrl?: string): string => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=faces';
    }
    
    if (imageUrl.startsWith('//')) return 'https:' + imageUrl;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl.replace(/^http:\/\//i, 'https://');
    if (imageUrl.startsWith('/')) return imageUrl;
    return '/' + imageUrl.replace(/^\/+/, '');
  };

  if (!animals || animals.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1m16 0V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No animals</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first animal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`xa-grid ${className}`}>
      <style>{`
        .xa-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
        
        .xa-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease-in-out;
          position: relative;
        }
        
        .xa-card:hover {
          box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.1), 0 4px 6px 0 rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }
        
        .xa-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }
        
        .xa-body {
          padding: 1rem;
        }
        
        .xa-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }
        
        .xa-meta {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
        }
        
        .xa-description {
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.4;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .xa-status {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .xa-status.available {
          background-color: #d1fae5;
          color: #065f46;
        }
        
        .xa-status.pending {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .xa-status.adopted {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .xa-actions {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          display: flex;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .xa-card:hover .xa-actions {
          opacity: 1;
        }
        
        .xa-action-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 6px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        
        .xa-action-btn:hover {
          background: white;
          transform: scale(1.05);
        }
        
        .xa-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }
      `}</style>
      
      {animals.map(animal => {
        const imageUrl = normalizeImage(animal.image_url);
        const statusClass = animal.status?.toLowerCase() || 'available';
        
        return (
          <article key={String(animal.id)} className="xa-card" data-id={animal.id}>
            {showEditButtons && (
              <div className="xa-actions">
                {onEdit && (
                  <button
                    onClick={() => onEdit(animal)}
                    className="xa-action-btn"
                    title="Edit animal"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(animal.id)}
                    className="xa-action-btn"
                    title="Delete animal"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            <Link
              to={showEditButtons ? `/app/animals/${encodeURIComponent(String(animal.id))}` : `/animals/${encodeURIComponent(String(animal.id))}?orgId=${orgId}`}
              className="xa-link"
            >
              <img 
                className="xa-img" 
                src={imageUrl} 
                alt={animal.name || 'Animal'} 
                loading="lazy"
              />
              <div className="xa-body">
                <h3 className="xa-name">{animal.name || 'Unnamed'}</h3>
                <div className="xa-meta">
                  {[animal.breed, animal.age].filter(Boolean).join(' • ')}
                  {animal.location && ` • ${animal.location}`}
                </div>
                {animal.description && (
                  <p className="xa-description">{animal.description}</p>
                )}
                {animal.status && (
                  <span className={`xa-status ${statusClass}`}>
                    {animal.status}
                  </span>
                )}
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
