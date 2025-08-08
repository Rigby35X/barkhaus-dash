import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Mail, Phone, Calendar, MapPin, Clock, Edit, Eye, Save, X } from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  hoursContributed: number;
  location: string;
  emergencyContact?: string;
  notes?: string;
}

const Volunteers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      skills: ['Dog Walking', 'Event Planning', 'Photography'],
      availability: 'Weekends',
      joinDate: '2023-06-15',
      status: 'active',
      hoursContributed: 120,
      location: 'Downtown',
      emergencyContact: '(555) 123-4568',
      notes: 'Great with large dogs, has photography equipment'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '(555) 987-6543',
      skills: ['Veterinary Care', 'Animal Training'],
      availability: 'Evenings',
      joinDate: '2023-08-22',
      status: 'active',
      hoursContributed: 85,
      location: 'North Side',
      emergencyContact: '(555) 987-6544',
      notes: 'Licensed veterinary technician'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '(555) 456-7890',
      skills: ['Foster Care', 'Social Media', 'Fundraising'],
      availability: 'Flexible',
      joinDate: '2023-09-10',
      status: 'active',
      hoursContributed: 95,
      location: 'West End',
      emergencyContact: '(555) 456-7891',
      notes: 'Experienced foster parent, social media expert'
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '(555) 321-0987',
      skills: ['Transportation', 'Maintenance'],
      availability: 'Weekdays',
      joinDate: '2024-01-05',
      status: 'pending',
      hoursContributed: 15,
      location: 'East Side',
      emergencyContact: '(555) 321-0988',
      notes: 'Has large vehicle for transport'
    }
  ]);

  const [newVolunteer, setNewVolunteer] = useState<Partial<Volunteer>>({
    name: '',
    email: '',
    phone: '',
    skills: [],
    availability: 'Weekends',
    status: 'pending',
    location: 'Downtown',
    emergencyContact: '',
    notes: ''
  });

  const availableSkills = [
    'Dog Walking', 'Cat Care', 'Animal Training', 'Veterinary Care', 'Foster Care',
    'Event Planning', 'Photography', 'Social Media', 'Fundraising', 'Transportation',
    'Maintenance', 'Administrative', 'Customer Service', 'Education'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddVolunteer = () => {
    const volunteer: Volunteer = {
      ...newVolunteer,
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0],
      hoursContributed: 0
    } as Volunteer;
    
    setVolunteers([...volunteers, volunteer]);
    setNewVolunteer({
      name: '',
      email: '',
      phone: '',
      skills: [],
      availability: 'Weekends',
      status: 'pending',
      location: 'Downtown',
      emergencyContact: '',
      notes: ''
    });
    setShowAddModal(false);
  };

  const handleEditVolunteer = () => {
    if (selectedVolunteer) {
      setVolunteers(volunteers.map(vol => vol.id === selectedVolunteer.id ? selectedVolunteer : vol));
      setShowEditModal(false);
      setSelectedVolunteer(null);
    }
  };

  const handleSkillToggle = (skill: string, isNew: boolean = false) => {
    if (isNew) {
      const currentSkills = newVolunteer.skills || [];
      if (currentSkills.includes(skill)) {
        setNewVolunteer({
          ...newVolunteer,
          skills: currentSkills.filter(s => s !== skill)
        });
      } else {
        setNewVolunteer({
          ...newVolunteer,
          skills: [...currentSkills, skill]
        });
      }
    } else if (selectedVolunteer) {
      const currentSkills = selectedVolunteer.skills || [];
      if (currentSkills.includes(skill)) {
        setSelectedVolunteer({
          ...selectedVolunteer,
          skills: currentSkills.filter(s => s !== skill)
        });
      } else {
        setSelectedVolunteer({
          ...selectedVolunteer,
          skills: [...currentSkills, skill]
        });
      }
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bebas uppercase text-gray-900">Volunteer Management</h1>
          <p className="text-gray-600 mt-2">Manage and coordinate your volunteer team</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Volunteer</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
              <p className="text-2xl font-bold text-gray-900">{volunteers.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-success-600">
                {volunteers.filter(v => v.status === 'active').length}
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
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-warning-600">
                {volunteers.filter(v => v.status === 'pending').length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-warning-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-warning-600"></div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-primary-600">
                {volunteers.reduce((sum, v) => sum + v.hoursContributed, 0)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-primary-600" />
          </div>
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
                placeholder="Search volunteers by name, email, or skills..."
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
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Volunteers List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volunteer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {volunteer.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {volunteer.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {volunteer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {volunteer.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(volunteer.status)}`}>
                      {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {volunteer.availability}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {volunteer.hoursContributed}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedVolunteer(volunteer);
                          setShowViewModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedVolunteer(volunteer);
                          setShowEditModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-error-600 hover:text-error-900">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredVolunteers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Add Volunteer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Add New Volunteer</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newVolunteer.name}
                    onChange={(e) => setNewVolunteer({...newVolunteer, name: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newVolunteer.email}
                    onChange={(e) => setNewVolunteer({...newVolunteer, email: e.target.value})}
                    className="input"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newVolunteer.phone}
                    onChange={(e) => setNewVolunteer({...newVolunteer, phone: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                  <input
                    type="tel"
                    value={newVolunteer.emergencyContact}
                    onChange={(e) => setNewVolunteer({...newVolunteer, emergencyContact: e.target.value})}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    value={newVolunteer.availability}
                    onChange={(e) => setNewVolunteer({...newVolunteer, availability: e.target.value})}
                    className="input"
                  >
                    <option value="Weekends">Weekends</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Evenings">Evenings</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={newVolunteer.location}
                    onChange={(e) => setNewVolunteer({...newVolunteer, location: e.target.value})}
                    className="input"
                  >
                    <option value="Downtown">Downtown</option>
                    <option value="North Side">North Side</option>
                    <option value="West End">West End</option>
                    <option value="East Side">East Side</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSkills.map((skill) => (
                    <label key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(newVolunteer.skills || []).includes(skill)}
                        onChange={() => handleSkillToggle(skill, true)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  value={newVolunteer.notes}
                  onChange={(e) => setNewVolunteer({...newVolunteer, notes: e.target.value})}
                  className="input"
                  placeholder="Any additional notes about the volunteer..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleAddVolunteer} className="btn-primary flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Add Volunteer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Volunteer Modal */}
      {showEditModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Edit Volunteer</h2>
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
                    value={selectedVolunteer.name}
                    onChange={(e) => setSelectedVolunteer({...selectedVolunteer, name: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedVolunteer.status}
                    onChange={(e) => setSelectedVolunteer({...selectedVolunteer, status: e.target.value as Volunteer['status']})}
                    className="input"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSkills.map((skill) => (
                    <label key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedVolunteer.skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours Contributed</label>
                <input
                  type="number"
                  value={selectedVolunteer.hoursContributed}
                  onChange={(e) => setSelectedVolunteer({...selectedVolunteer, hoursContributed: parseInt(e.target.value) || 0})}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  value={selectedVolunteer.notes}
                  onChange={(e) => setSelectedVolunteer({...selectedVolunteer, notes: e.target.value})}
                  className="input"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleEditVolunteer} className="btn-primary flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Volunteer Modal */}
      {showViewModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">{selectedVolunteer.name}</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{selectedVolunteer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-gray-900">{selectedVolunteer.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Emergency Contact</p>
                  <p className="text-gray-900">{selectedVolunteer.emergencyContact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedVolunteer.status)}`}>
                    {selectedVolunteer.status.charAt(0).toUpperCase() + selectedVolunteer.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Availability</p>
                  <p className="text-gray-900">{selectedVolunteer.availability}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-gray-900">{selectedVolunteer.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Join Date</p>
                  <p className="text-gray-900">{new Date(selectedVolunteer.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Hours Contributed</p>
                  <p className="text-gray-900">{selectedVolunteer.hoursContributed}h</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedVolunteer.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {selectedVolunteer.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                  <p className="text-gray-900">{selectedVolunteer.notes}</p>
                </div>
              )}
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
                <span>Edit Volunteer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteers;