import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import EmbedAnimalDetail from '../components/embed/EmbedAnimalDetail';

export default function EmbedAnimalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token') || '';
  const primaryColor = searchParams.get('primary') || '#324b65';

  if (!token) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#dc2626',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Missing embed token. Please check your embed code.
      </div>
    );
  }

  if (!id) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#dc2626',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Animal ID not found.
      </div>
    );
  }

  return (
    <EmbedAnimalDetail
      animalId={id}
      token={token}
      primaryColor={primaryColor}
    />
  );
}
