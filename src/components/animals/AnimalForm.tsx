import React, { useState, useEffect } from 'react';

interface Animal {
  id?: number | string;
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

interface AnimalFormProps {
  animal?: Animal;
  onSubmit: (animal: Animal) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function AnimalForm({ animal, onSubmit, onCancel, loading = false }: AnimalFormProps) {
  const [formData, setFormData] = useState<Animal>({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    status: 'Available',
    image_url: '',
    description: '',
    description_long: '',
    location: '',
    gender: '',
    weight: '',
    vaccinated: false,
    spayed_neutered: false,
    good_with_kids: false,
    good_with_dogs: false,
    good_with_cats: false,
    energy_level: '',
    adoption_fee: 0,
    medical_notes: ''
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (animal) {
      setFormData(animal);
    }
  }, [animal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Animal name is required');
      return;
    }

    if (!formData.species.trim()) {
      setError('Species is required');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save animal');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {animal ? 'Edit Animal' : 'Add New Animal'}
          </h2>
          <p className="text-gray-600 mt-2">
            {animal ? 'Update the animal information below.' : 'Fill in the details for the new animal.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buddy"
              />
            </div>

            <div>
              <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
                Species *
              </label>
              <select
                id="species"
                name="species"
                required
                value={formData.species}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
                Breed
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Golden Retriever"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2 years"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Weight
              </label>
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="45 lbs"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Adopted">Adopted</option>
                <option value="Foster">Foster</option>
                <option value="Medical Hold">Medical Hold</option>
              </select>
            </div>

            <div>
              <label htmlFor="adoption_fee" className="block text-sm font-medium text-gray-700 mb-2">
                Adoption Fee ($)
              </label>
              <input
                type="number"
                id="adoption_fee"
                name="adoption_fee"
                min="0"
                value={formData.adoption_fee}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="300"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="San Diego, CA"
            />
          </div>

          {/* Descriptions */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="A brief description of the animal..."
            />
          </div>

          <div>
            <label htmlFor="description_long" className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              id="description_long"
              name="description_long"
              rows={5}
              value={formData.description_long}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed information about the animal's personality, needs, etc..."
            />
          </div>

          {/* Health & Behavior Checkboxes */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Health & Behavior</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="vaccinated"
                  checked={formData.vaccinated}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Vaccinated</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="spayed_neutered"
                  checked={formData.spayed_neutered}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Spayed/Neutered</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="good_with_kids"
                  checked={formData.good_with_kids}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Good with Kids</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="good_with_dogs"
                  checked={formData.good_with_dogs}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Good with Dogs</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="good_with_cats"
                  checked={formData.good_with_cats}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Good with Cats</span>
              </label>
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <label htmlFor="energy_level" className="block text-sm font-medium text-gray-700 mb-2">
              Energy Level
            </label>
            <select
              id="energy_level"
              name="energy_level"
              value={formData.energy_level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Energy Level</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>

          {/* Medical Notes */}
          <div>
            <label htmlFor="medical_notes" className="block text-sm font-medium text-gray-700 mb-2">
              Medical Notes
            </label>
            <textarea
              id="medical_notes"
              name="medical_notes"
              rows={3}
              value={formData.medical_notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any medical conditions, medications, or special needs..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (animal ? 'Update Animal' : 'Add Animal')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
