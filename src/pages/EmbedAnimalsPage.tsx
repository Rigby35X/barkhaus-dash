import React from 'react';
import { useSearchParams } from 'react-router-dom';
import EmbedAnimalsList from '../components/embed/EmbedAnimalsList';

export default function EmbedAnimalsPage() {
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token') || '';
  const searchQuery = searchParams.get('q') || '';
  const species = searchParams.get('species') || 'all';
  const primaryColor = searchParams.get('primary') || '#324b65';
  const showFilters = searchParams.get('show_filters') === '1';

  // Allow demo mode for testing
  if (!token) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#dc2626',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Missing embed token. Please check your embed code.
        <br />
        <small style={{ color: '#666', marginTop: '10px', display: 'block' }}>
          For testing, you can use: ?token=demo
        </small>
      </div>
    );
  }

  return (
    <EmbedAnimalsList
      token={token}
      searchQuery={searchQuery}
      species={species}
      primaryColor={primaryColor}
      showFilters={showFilters}
    />
  );
}
