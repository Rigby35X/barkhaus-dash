import React, { useState, useEffect } from 'react';
import { Heart, Plus, Search, Filter, Edit, Eye, MapPin, Calendar, Save, X, Grid, List, Upload, Trash2, ArrowUpDown } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  status: 'available' | 'adopted' | 'pending' | 'medical';
  image: string;
  images?: string[];
  location: string;
  dateAdded: string;
  description: string;
  medicalNotes?: string;
  weight?: string;
  vaccinated?: boolean;
  spayedNeutered?: boolean;
  published?: boolean;
}

type SortField = 'name' | 'breed' | 'age' | 'status' | 'dateAdded';
type SortDirection = 'asc' | 'desc';

// FIXED: Working stock pet images with proper URLs
const stockPetImages = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1570018144715-43110363d70a?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400&h=400&fit=crop&crop=face'
];

const getRandomStockImage = () => {
  return stockPetImages[Math.floor(Math.random() * stockPetImages.length)];
};

const Pets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [pets, setPets] = useState<Pet[]>([]);

  const [newPet, setNewPet] = useState<Partial<Pet>>({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    status: 'available',
    location: 'Main Shelter',
    description: '',
    weight: '',
    vaccinated: false,
    spayedNeutered: false,
    published: false,
    images: []
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      
      // Create mock pets with working stock images
      const mockPets: Pet[] = [
        {
          id: '1',
          name: 'Bella',
          species: 'Dog',
          breed: 'Golden Retriever',
          age: '3 years',
          gender: 'Female',
          status: 'available',
          image: stockPetImages[0],
          images: [stockPetImages[0]],
          location: 'Main Shelter',
          dateAdded: '2024-01-15',
          description: 'Friendly and energetic dog, great with kids.',
          weight: '65 lbs',
          vaccinated: true,
          spayedNeutered: true,
          published: true
        },
        {
          id: '2',
          name: 'Max',
          species: 'Dog',
          breed: 'German Shepherd',
          age: '5 years',
          gender: 'Male',
          status: 'adopted',
          image: stockPetImages[1],
          images: [stockPetImages[1]],
          location: 'Foster Home',
          dateAdded: '2024-01-10',
          description: 'Loyal and protective, perfect for active families.',
          weight: '80 lbs',
          vaccinated: true,
          spayedNeutered: true,
          published: true
        },
        {
          id: '3',
          name: 'Luna',
          species: 'Cat',
          breed: 'Siamese',
          age: '2 years',
          gender: 'Female',
          status: 'available',
          image: stockPetImages[2],
          images: [stockPetImages[2]],
          location: 'Main Shelter',
          dateAdded: '2024-01-20',
          description: 'Gentle and affectionate, loves to cuddle.',
          weight: '8 lbs',
          vaccinated: true,
          spayedNeutered: true,
          published: true
        },
        {
          id: '4',
          name: 'Charlie',
          species: 'Dog',
          breed: 'Labrador Mix',
          age: '4 years',
          gender: 'Male',
          status: 'available',
          image: stockPetImages[3],
          images: [stockPetImages[3]],
          location: 'Main Shelter',
          dateAdded: '2024-01-18',
          description: 'Playful and loving, great with other dogs.',
          weight: '70 lbs',
          vaccinated: true,
          spayedNeutered: false,
          published: true
        },
        {
          id: '5',
          name: 'Daisy',
          species: 'Dog',
          breed: 'Border Collie',
          age: '6 years',
          gender: 'Female',
          status: 'pending',
          image: stockPetImages[4],
          images: [stockPetImages[4]],
          location: 'Foster Home',
          dateAdded: '2024-01-12',
          description: 'Intelligent and active, needs mental stimulation.',
          weight: '45 lbs',
          vaccinated: true,
          spayedNeutered: true,
          published: true
        },
        {
          id: '6',
          name: 'Rocky',
          species: 'Dog',
          breed: 'Bulldog',
          age: '7 years',
          gender: 'Male',
          status: 'available',
          image: stockPetImages[5],
          images: [stockPetImages[5]],
          location: 'Main Shelter',
          dateAdded: '2024-01-22',
          description: 'Calm and gentle, perfect for seniors.',
          weight: '55 lbs',
          vaccinated: true,
          spayedNeutered: true,
          published: false
        },
        {
          id: '7',
          name: 'Mia',
          species: 'Cat',
          breed: 'Persian',
          age: '3 years',
          gender: 'Female',
          status: 'available',
          image: stockPetImages[6],
          images: [stockPetImages[6]],
          location: 'Main Shelter',
          dateAdded: '2024-01-25',
          description: 'Quiet and elegant, loves peaceful environments.',
          weight: '10 lbs',
          vaccinated: true,
          spayedNeutered: true,
          published: true
        },
        {
          id: '8',
          name: 'Buddy',
          species: 'Dog',
          breed: 'Beagle',
          age: '4 years',
          gender: 'Male',
          status: 'medical',
          image: stockPetImages[7],
          images: [stockPetImages[7]],
          location: 'Veterinary Clinic',
          dateAdded: '2024-01-28',
          description: 'Recovering from surgery, will be ready for adoption soon.',
          weight: '30 lbs',
          vaccinated: true,
          spayedNeutered: true,
          published: false,
          medicalNotes: 'Recovering from leg surgery, expected full recovery in 2 weeks.'
        },
        {
          id: '9',
          name: 'Sophie',
          species: 'Cat',
          breed: 'Maine Coon',
          age: '5 years',
          gender: 'Female',
          status: 'available',
          image: stockPetImages[8],
          images: [stockPetImages[8]],
          location: 'Main Shelter',
          dateAdded: '2024-01-26',
          description: 'Large and fluffy, very social and friendly.',
          weight: '15 lbs',
          vaccinated: true,
          spayedNeutered: true,
          published: true
        },
        {
          id: '10',
          name: 'Zeus',
          species: 'Dog',
          breed: 'Great Dane',
          age: '2 years',
          gender: 'Male',
          status: 'available',
          image: stockPetImages[9],
          images: [stockPetImages[9]],
          location: 'Foster Home',
          dateAdded: '2024-01-24',
          description: 'Gentle giant, great with children despite his size.',
          weight: '120 lbs',
          vaccinated: true,
          spayedNeutered: true,
          published: true
        }
      ];

      setPets(mockPets);
    } catch (error) {
      console.error('Failed to load pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPets = [...pets].sort((a, b) => {
    let aValue: string | number = a[sortField];
    let bValue: string | number = b[sortField];

    if (sortField === 'dateAdded') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleImageUpload = async (file: File, isNewPet: boolean = false) => {
    try {
      setUploading(true);
      // For demo purposes, use a random stock image
      const imageUrl = getRandomStockImage();
      
      if (isNewPet) {
        setNewPet(prev => ({
          ...prev,
          image: imageUrl,
          images: [...(prev.images || []), imageUrl]
        }));
      } else if (selectedPet) {
        setSelectedPet(prev => prev ? ({
          ...prev,
          image: imageUrl,
          images: [...(prev.images || []), imageUrl]
        }) : null);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (imageUrl: string, isNewPet: boolean = false) => {
    if (isNewPet) {
      setNewPet(prev => ({
        ...prev,
        images: (prev.images || []).filter(img => img !== imageUrl),
        image: (prev.images || []).filter(img => img !== imageUrl)[0] || ''
      }));
    } else if (selectedPet) {
      setSelectedPet(prev => prev ? ({
        ...prev,
        images: (prev.images || []).filter(img => img !== imageUrl),
        image: (prev.images || []).filter(img => img !== imageUrl)[0] || prev.image
      }) : null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success-100 text-success-800';
      case 'adopted':
        return 'bg-primary-100 text-primary-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'medical':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddPet = async () => {
    try {
      const pet: Pet = {
        ...newPet,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString().split('T')[0],
        image: newPet.image || getRandomStockImage(),
        images: newPet.images?.length ? newPet.images : [getRandomStockImage()]
      } as Pet;

      setPets([pet, ...pets]);
      
      setNewPet({
        name: '',
        species: 'Dog',
        breed: '',
        age: '',
        gender: 'Male',
        status: 'available',
        location: 'Main Shelter',
        description: '',
        weight: '',
        vaccinated: false,
        spayedNeutered: false,
        published: false,
        images: []
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add pet:', error);
      alert('Failed to add pet. Please try again.');
    }
  };

  const handleEditPet = async () => {
    if (selectedPet) {
      try {
        setPets(pets.map(pet => pet.id === selectedPet.id ? selectedPet : pet));
        setShowEditModal(false);
        setSelectedPet(null);
      } catch (error) {
        console.error('Failed to update pet:', error);
        alert('Failed to update pet. Please try again.');
      }
    }
  };

  const handleTogglePublish = async (petId: string) => {
    try {
      setPets(pets.map(pet => 
        pet.id === petId ? { ...pet, published: !pet.published } : pet
      ));
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      alert('Failed to update publish status. Please try again.');
    }
  };

  const filteredPets = sortedPets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pet.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bebas uppercase text-gray-900">Pet Management</h1>
          <p className="text-gray-600 mt-2">Manage all pets in your rescue organization</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Pet</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search pets by name or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="adopted">Adopted</option>
              <option value="medical">Medical Care</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pets</p>
              <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
            </div>
            <Heart className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-success-600">
                {pets.filter(p => p.status === 'available').length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-success-600"></div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-primary-600">
                {pets.filter(p => p.published).length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-primary-600"></div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Adopted</p>
              <p className="text-2xl font-bold text-warning-600">
                {pets.filter(p => p.status === 'adopted').length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-warning-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-warning-600"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'grid' ? (
        /* Pet Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    // Fallback to a different stock image if one fails
                    e.currentTarget.src = getRandomStockImage();
                  }}
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pet.status)}`}>
                    {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                  </span>
                </div>
                {pet.published && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Published
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedPet(pet);
                        setShowViewModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-primary-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedPet(pet);
                        setShowEditModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-primary-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{pet.breed} • {pet.age} • {pet.gender}</p>
                <p className="text-sm text-gray-500 mt-2">{pet.description}</p>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {pet.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(pet.dateAdded).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => handleTogglePublish(pet.id)}
                    className={`w-full ${pet.published ? 'btn-warning' : 'btn-primary'}`}
                  >
                    {pet.published ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Pet Table */
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Pet</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPets.map((pet) => (
                  <tr key={pet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="h-12 w-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = getRandomStockImage();
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                          <div className="text-sm text-gray-500">{pet.breed}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pet.age} • {pet.gender}</div>
                      <div className="text-sm text-gray-500">{pet.weight}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pet.status)}`}>
                        {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pet.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pet.published ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pet.published ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedPet(pet);
                            setShowViewModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedPet(pet);
                            setShowEditModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(pet.id)}
                          className={`${pet.published ? 'text-warning-600 hover:text-warning-900' : 'text-success-600 hover:text-success-900'}`}
                        >
                          {pet.published ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredPets.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Add Pet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Add New Pet</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, true);
                        }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  
                  {newPet.images && newPet.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {newPet.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img src={image} alt={`Pet ${index + 1}`} className="w-full h-20 object-cover rounded" />
                          <button
                            onClick={() => handleRemoveImage(image, true)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newPet.name}
                    onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                  <select
                    value={newPet.species}
                    onChange={(e) => setNewPet({...newPet, species: e.target.value})}
                    className="input"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                  <input
                    type="text"
                    value={newPet.breed}
                    onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="text"
                    value={newPet.age}
                    onChange={(e) => setNewPet({...newPet, age: e.target.value})}
                    className="input"
                    placeholder="e.g., 2 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={newPet.gender}
                    onChange={(e) => setNewPet({...newPet, gender: e.target.value})}
                    className="input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                  <input
                    type="text"
                    value={newPet.weight}
                    onChange={(e) => setNewPet({...newPet, weight: e.target.value})}
                    className="input"
                    placeholder="e.g., 65 lbs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={newPet.location}
                    onChange={(e) => setNewPet({...newPet, location: e.target.value})}
                    className="input"
                  >
                    <option value="Main Shelter">Main Shelter</option>
                    <option value="Foster Home">Foster Home</option>
                    <option value="Veterinary Clinic">Veterinary Clinic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={newPet.description}
                  onChange={(e) => setNewPet({...newPet, description: e.target.value})}
                  className="input"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newPet.vaccinated}
                    onChange={(e) => setNewPet({...newPet, vaccinated: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Vaccinated</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newPet.spayedNeutered}
                    onChange={(e) => setNewPet({...newPet, spayedNeutered: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Spayed/Neutered</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleAddPet} 
                disabled={uploading}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{uploading ? 'Uploading...' : 'Add Pet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pet Modal */}
      {showEditModal && selectedPet && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Edit Pet</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={selectedPet.name}
                    onChange={(e) => setSelectedPet({...selectedPet, name: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedPet.status}
                    onChange={(e) => setSelectedPet({...selectedPet, status: e.target.value as Pet['status']})}
                    className="input"
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="adopted">Adopted</option>
                    <option value="medical">Medical Care</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={selectedPet.description}
                  onChange={(e) => setSelectedPet({...selectedPet, description: e.target.value})}
                  className="input"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPet.published}
                    onChange={(e) => setSelectedPet({...selectedPet, published: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Published to Live Site</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleEditPet} 
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Pet Modal */}
      {showViewModal && selectedPet && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">{selectedPet.name}</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <img
                src={selectedPet.image}
                alt={selectedPet.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = getRandomStockImage();
                }}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Species</p>
                  <p className="text-gray-900">{selectedPet.species}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Breed</p>
                  <p className="text-gray-900">{selectedPet.breed}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Age</p>
                  <p className="text-gray-900">{selectedPet.age}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Gender</p>
                  <p className="text-gray-900">{selectedPet.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Weight</p>
                  <p className="text-gray-900">{selectedPet.weight}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPet.status)}`}>
                    {selectedPet.status.charAt(0).toUpperCase() + selectedPet.status.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                <p className="text-gray-900">{selectedPet.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Vaccinated</p>
                  <p className="text-gray-900">{selectedPet.vaccinated ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Spayed/Neutered</p>
                  <p className="text-gray-900">{selectedPet.spayedNeutered ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Published</p>
                  <p className="text-gray-900">{selectedPet.published ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-gray-900">{selectedPet.location}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowViewModal(false)} className="btn-secondary">
                Close
              </button>
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Pet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pets;