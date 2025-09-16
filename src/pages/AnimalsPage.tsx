import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { animalsAPI } from '../api/xano';
import AnimalGrid from '../components/animals/AnimalGrid';

export default function AnimalsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    species: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchAnimals();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [animals, filters]);

  const fetchAnimals = async () => {
    if (!user?.organizationId) return;

    try {
      setLoading(true);
      const data = await animalsAPI.getAll(user.organizationId);
      setAnimals(data);
    } catch (err) {
      console.error('Error fetching animals:', err);
      setError('Failed to load animals');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...animals];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((animal: any) =>
        animal.name?.toLowerCase().includes(searchLower) ||
        animal.breed?.toLowerCase().includes(searchLower) ||
        animal.description?.toLowerCase().includes(searchLower)
      );
    }

    // Species filter
    if (filters.species !== 'all') {
      filtered = filtered.filter((animal: any) => animal.species === filters.species);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((animal: any) => animal.status === filters.status);
    }

    setFilteredAnimals(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleEdit = (animal: any) => {
    navigate(`/app/animals/${animal.id}/edit`);
  };

  const handleDelete = async (animalId: string | number) => {
    if (!confirm('Are you sure you want to delete this animal? This action cannot be undone.')) {
      return;
    }

    try {
      await animalsAPI.delete(animalId, user?.organizationId || '');
      await fetchAnimals(); // Refresh the list
    } catch (err) {
      console.error('Error deleting animal:', err);
      alert('Failed to delete animal. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading animals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🐾 Animals
              </h1>
              <p className="text-gray-600">
                Manage your rescue animals
              </p>
            </div>
            <Link
              to="/app/animals/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Animal
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by name, breed, or description..."
                />
              </div>

              {/* Species */}
              <div>
                <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
                  Species
                </label>
                <select
                  id="species"
                  value={filters.species}
                  onChange={(e) => handleFilterChange('species', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Species</option>
                  <option value="Dog">Dogs</option>
                  <option value="Cat">Cats</option>
                  <option value="Rabbit">Rabbits</option>
                  <option value="Bird">Birds</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Adopted">Adopted</option>
                  <option value="Foster">Foster</option>
                  <option value="Medical Hold">Medical Hold</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{animals.length}</p>
              <p className="text-sm text-gray-600">Total Animals</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {animals.filter((a: any) => a.status === 'Available').length}
              </p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {animals.filter((a: any) => a.status === 'Pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {animals.filter((a: any) => a.status === 'Adopted').length}
              </p>
              <p className="text-sm text-gray-600">Adopted</p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Animals ({filteredAnimals.length})
              </h2>
              <div className="text-sm text-gray-600">
                {filters.search || filters.species !== 'all' || filters.status !== 'all' ? (
                  <button
                    onClick={() => setFilters({ search: '', species: 'all', status: 'all' })}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Clear Filters
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="p-6">
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchAnimals}
                  className="mt-2 text-blue-600 hover:text-blue-500"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <AnimalGrid
                animals={filteredAnimals}
                orgId={user?.organizationId || ''}
                showEditButtons={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
