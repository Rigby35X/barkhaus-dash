import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { animalsAPI } from '../api/xano';
import AnimalGrid from '../components/animals/AnimalGrid';
import EmbedManager from '../components/admin/EmbedManager';

interface DashboardStats {
  totalAnimals: number;
  availableAnimals: number;
  adoptedAnimals: number;
  pendingAnimals: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalAnimals: 0,
    availableAnimals: 0,
    adoptedAnimals: 0,
    pendingAnimals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnimals();
  }, [user]);

  const fetchAnimals = async () => {
    if (!user?.organizationId) return;

    try {
      setLoading(true);
      const data = await animalsAPI.getAll(user.organizationId);
      setAnimals(data);

      // Calculate stats
      const totalAnimals = data.length;
      const availableAnimals = data.filter((a: any) => a.status === 'Available').length;
      const adoptedAnimals = data.filter((a: any) => a.status === 'Adopted').length;
      const pendingAnimals = data.filter((a: any) => a.status === 'Pending').length;

      setStats({
        totalAnimals,
        availableAnimals,
        adoptedAnimals,
        pendingAnimals
      });
    } catch (err) {
      console.error('Error fetching animals:', err);
      setError('Failed to load animals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
                🐾 Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {user?.name}!
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{stats.totalAnimals}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Animals</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAnimals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">{stats.availableAnimals}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.availableAnimals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">{stats.pendingAnimals}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingAnimals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">{stats.adoptedAnimals}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Adopted</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.adoptedAnimals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/app/animals"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Manage Animals</p>
                  <p className="text-sm text-gray-500">View and edit all animals</p>
                </div>
              </Link>

              <Link
                to="/app/animals/new"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Add Animal</p>
                  <p className="text-sm text-gray-500">Add a new animal to your rescue</p>
                </div>
              </Link>

              <Link
                to="/app/embed"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Embed Widget</p>
                  <p className="text-sm text-gray-500">Generate iframe for your website</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Animals */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Animals</h2>
            <Link
              to="/app/animals"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View All
            </Link>
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
                animals={animals.slice(0, 6)} // Show only first 6
                orgId={user?.organizationId || ''}
                showEditButtons={true}
                onEdit={(animal) => {
                  // Navigate to edit page
                  window.location.href = `/app/animals/${animal.id}/edit`;
                }}
                onDelete={async (animalId) => {
                  if (confirm('Are you sure you want to delete this animal?')) {
                    try {
                      await animalsAPI.delete(animalId, user?.organizationId || '');
                      fetchAnimals(); // Refresh the list
                    } catch (err) {
                      alert('Failed to delete animal');
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Embed Widget Section */}
        <div className="mt-8">
          <EmbedManager />
        </div>
      </div>
    </div>
  );
}
