'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Heart,
  Plus,
  Search,
  Edit,
  Eye,
  MapPin,
  Calendar,
  Grid,
  List,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { DataTable } from '@/components/admin/data-table'

// Temporary local Animal type to avoid Xano client import issues
interface Animal {
  id: number
  name: string
  species: string
  breed: string
  age: string
  gender: string
  status: 'available' | 'adopted' | 'pending' | 'medical'
  image: string
  images: string[]
  location: string
  description: string
  medical_notes?: string
  weight: string
  vaccinated: boolean
  spayed_neutered: boolean
  published: boolean
  created_at: string
  updated_at: string
}

type SortField = 'name' | 'breed' | 'age' | 'status' | 'created_at'
type SortDirection = 'asc' | 'desc'
type ViewMode = 'grid' | 'table'

// Enhanced mock data based on barkhaus-dash
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
  'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=400&fit=crop&crop=face'
]

const mockAnimals: Animal[] = [
  {
    id: 1,
    name: 'Bella',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '3 years',
    gender: 'Female',
    status: 'available',
    image: stockPetImages[0],
    images: [stockPetImages[0]],
    location: 'Main Shelter',
    description: 'Bella is a friendly and energetic Golden Retriever who loves playing fetch and swimming. She\'s great with kids and other dogs, making her the perfect family companion. Bella is house-trained and knows basic commands.',
    medical_notes: 'Up to date on all vaccinations, spayed, microchipped',
    weight: '65 lbs',
    vaccinated: true,
    spayed_neutered: true,
    published: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    name: 'Max',
    species: 'Dog',
    breed: 'German Shepherd',
    age: '5 years',
    gender: 'Male',
    status: 'adopted',
    image: stockPetImages[1],
    images: [stockPetImages[1]],
    location: 'Foster Home',
    description: 'Max is a loyal and protective German Shepherd who would make an excellent guard dog. He\'s well-trained and responds well to commands. Max needs an experienced owner who can provide structure and exercise.',
    medical_notes: 'Recent dental cleaning, all vaccinations current',
    weight: '80 lbs',
    vaccinated: true,
    spayed_neutered: true,
    published: true,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 3,
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    age: '2 years',
    gender: 'Female',
    status: 'available',
    image: stockPetImages[2],
    images: [stockPetImages[2]],
    location: 'Main Shelter',
    description: 'Luna is a gentle and affectionate Siamese cat who loves to cuddle and purr. She\'s very social and enjoys being around people. Luna would do well in a quiet home where she can be the center of attention.',
    medical_notes: 'Spayed, vaccinated, tested negative for FIV/FeLV',
    weight: '8 lbs',
    vaccinated: true,
    spayed_neutered: true,
    published: true,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 4,
    name: 'Charlie',
    species: 'Dog',
    breed: 'Labrador Mix',
    age: '1 year',
    gender: 'Male',
    status: 'pending',
    image: stockPetImages[3],
    images: [stockPetImages[3]],
    location: 'Main Shelter',
    description: 'Charlie is a young, energetic Lab mix who loves to play and learn new tricks. He\'s very food motivated and eager to please, making training a breeze.',
    medical_notes: 'Recently neutered, recovering well',
    weight: '45 lbs',
    vaccinated: true,
    spayed_neutered: true,
    published: true,
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z'
  },
  {
    id: 5,
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Domestic Shorthair',
    age: '4 years',
    gender: 'Male',
    status: 'medical',
    image: stockPetImages[4],
    images: [stockPetImages[4]],
    location: 'Veterinary Clinic',
    description: 'Whiskers is a sweet tabby cat who is currently receiving treatment for a minor respiratory infection. He\'ll be ready for adoption once he\'s fully recovered.',
    medical_notes: 'Under treatment for URI, expected recovery in 1-2 weeks',
    weight: '12 lbs',
    vaccinated: true,
    spayed_neutered: true,
    published: false,
    created_at: '2024-01-22T00:00:00Z',
    updated_at: '2024-01-28T00:00:00Z'
  }
]

export default function AnimalsPage() {
  const [animals] = useState<Animal[]>(mockAnimals)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Filter and sort animals
  const filteredAnimals = animals
    .filter(animal => {
      const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || animal.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: string | number = a[sortField]
      let bValue: string | number = b[sortField]

      if (sortField === 'created_at') {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'adopted':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'medical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />
      case 'adopted':
        return <Heart className="h-4 w-4" />
      case 'pending':
        return <Calendar className="h-4 w-4" />
      case 'medical':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Animals</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your animal profiles and adoption listings
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dash/animals/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Animal
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search animals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="adopted">Adopted</option>
              <option value="pending">Pending</option>
              <option value="medical">Medical</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-')
                setSortField(field as SortField)
                setSortDirection(direction as SortDirection)
              }}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="breed-asc">Breed A-Z</option>
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'grid'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'table'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {filteredAnimals.length} Animals
            </h3>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAnimals.map((animal) => (
                <div key={animal.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={animal.image}
                      alt={animal.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{animal.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(animal.status)}`}>
                        {getStatusIcon(animal.status)}
                        <span className="ml-1 capitalize">{animal.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{animal.breed} • {animal.age}</p>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{animal.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {animal.location}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DataTable
              data={filteredAnimals}
              columns={[
                {
                  key: 'name',
                  label: 'Animal',
                  sortable: true,
                  render: (animal) => (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={animal.image} alt={animal.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{animal.name}</div>
                        <div className="text-sm text-gray-500">{animal.breed} • {animal.age}</div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: true,
                  render: (animal) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(animal.status)}`}>
                      {getStatusIcon(animal.status)}
                      <span className="ml-1 capitalize">{animal.status}</span>
                    </span>
                  )
                },
                {
                  key: 'location',
                  label: 'Location',
                  sortable: true,
                  render: (animal) => (
                    <div className="text-sm text-gray-500">{animal.location}</div>
                  )
                },
                {
                  key: 'created_at',
                  label: 'Added',
                  sortable: true,
                  render: (animal) => (
                    <div className="text-sm text-gray-500">
                      {new Date(animal.created_at).toLocaleDateString()}
                    </div>
                  )
                }
              ]}
              actions={[
                {
                  label: 'View Details',
                  icon: Eye,
                  onClick: (animal) => console.log('View', animal.name)
                },
                {
                  label: 'Edit',
                  icon: Edit,
                  onClick: (animal) => console.log('Edit', animal.name)
                },
                {
                  label: 'Delete',
                  icon: Trash2,
                  variant: 'danger',
                  onClick: (animal) => console.log('Delete', animal.name)
                }
              ]}
              onSort={(key, direction) => {
                setSortField(key as SortField)
                setSortDirection(direction)
              }}
            />
          )}

          {filteredAnimals.length === 0 && (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No animals found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by adding your first animal.'}
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <div className="mt-6">
                  <Link
                    href="/dash/animals/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Animal
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
