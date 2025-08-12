import React, { useState } from 'react';
import { FileText, Search, Filter, Eye, Check, X, Clock, User, Phone, Mail, Edit, Save, Heart, Users, Home, ArrowUpDown } from 'lucide-react';

interface Application {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  type: 'adoption' | 'foster' | 'volunteer';
  petName?: string;
  petId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'interview';
  submittedDate: string;
  experience: string;
  housingType: string;
  hasYard: boolean;
  otherPets: boolean;
  references?: string;
  notes?: string;
  skills?: string[];
  availability?: string;
}

type SortField = 'applicantName' | 'type' | 'status' | 'submittedDate';
type SortDirection = 'asc' | 'desc';

const Applications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [sortField, setSortField] = useState<SortField>('submittedDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      applicantName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      type: 'adoption',
      petName: 'Bella',
      petId: '1',
      status: 'pending',
      submittedDate: '2024-01-28',
      experience: 'First-time pet owner',
      housingType: 'House',
      hasYard: true,
      otherPets: false,
      references: 'Dr. Smith - Veterinarian, (555) 111-2222',
      notes: 'Very enthusiastic about adoption'
    },
    {
      id: '2',
      applicantName: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '(555) 987-6543',
      type: 'foster',
      petName: 'Max',
      petId: '2',
      status: 'interview',
      submittedDate: '2024-01-25',
      experience: 'Previous dog owner',
      housingType: 'Apartment',
      hasYard: false,
      otherPets: true,
      references: 'Jane Doe - Previous landlord, (555) 333-4444',
      notes: 'Has experience with large dogs'
    },
    {
      id: '3',
      applicantName: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '(555) 456-7890',
      type: 'volunteer',
      status: 'approved',
      submittedDate: '2024-01-22',
      experience: 'Volunteer at other shelters',
      housingType: 'Condo',
      hasYard: false,
      otherPets: true,
      skills: ['Dog Walking', 'Event Planning', 'Photography'],
      availability: 'Weekends',
      references: 'Dr. Brown - Veterinarian, (555) 555-6666',
      notes: 'Excellent references, approved for volunteering'
    },
    {
      id: '4',
      applicantName: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '(555) 321-0987',
      type: 'adoption',
      petName: 'Charlie',
      petId: '4',
      status: 'rejected',
      submittedDate: '2024-01-20',
      experience: 'No previous experience',
      housingType: 'Apartment',
      hasYard: false,
      otherPets: false,
      references: 'None provided',
      notes: 'Insufficient experience and no references'
    }
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedApplications = [...applications].sort((a, b) => {
    let aValue: string | number = a[sortField];
    let bValue: string | number = b[sortField];

    if (sortField === 'submittedDate') {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'approved':
        return 'bg-success-100 text-success-800';
      case 'rejected':
        return 'bg-error-100 text-error-800';
      case 'interview':
        return 'bg-primary-100 text-primary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'adoption':
        return 'bg-blue-100 text-blue-800';
      case 'foster':
        return 'bg-green-100 text-green-800';
      case 'volunteer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'adoption':
        return <Heart className="h-4 w-4" />;
      case 'foster':
        return <Home className="h-4 w-4" />;
      case 'volunteer':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      case 'interview':
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: Application['status']) => {
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

  const handleEditApplication = () => {
    if (selectedApplication) {
      setApplications(applications.map(app => 
        app.id === selectedApplication.id ? selectedApplication : app
      ));
      setShowEditModal(false);
      setSelectedApplication(null);
    }
  };

  const filteredApplications = sortedApplications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (app.petName && app.petName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bebas uppercase text-gray-900">Applications Management</h1>
        <p className="text-gray-600 mt-2">Manage adoption, foster, and volunteer applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
            <FileText className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Adoption Apps</p>
              <p className="text-2xl font-bold text-blue-600">
                {applications.filter(a => a.type === 'adoption').length}
              </p>
            </div>
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Foster Apps</p>
              <p className="text-2xl font-bold text-green-600">
                {applications.filter(a => a.type === 'foster').length}
              </p>
            </div>
            <Home className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Volunteer Apps</p>
              <p className="text-2xl font-bold text-purple-600">
                {applications.filter(a => a.type === 'volunteer').length}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
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
                placeholder="Search by applicant name or pet name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="adoption">Adoption</option>
              <option value="foster">Foster</option>
              <option value="volunteer">Volunteer</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('applicantName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Applicant</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Type</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pet/Details
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
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('submittedDate')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Submitted</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.applicantName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {application.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {application.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(application.type)}`}>
                      {getTypeIcon(application.type)}
                      <span className="ml-1">{application.type.charAt(0).toUpperCase() + application.type.slice(1)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.petName ? (
                      <div className="text-sm font-medium text-gray-900">{application.petName}</div>
                    ) : application.type === 'volunteer' ? (
                      <div className="text-sm text-gray-900">
                        {application.skills?.join(', ') || 'General volunteer'}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">General application</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1">{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowViewModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowEditModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {application.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(application.id, 'approved')}
                            className="text-success-600 hover:text-success-900"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            className="text-error-600 hover:text-error-900"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(application.id, 'interview')}
                            className="text-primary-600 hover:text-primary-900"
                            title="Schedule Interview"
                          >
                            <User className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* View Application Modal */}
      {showViewModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Application Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Applicant Name</p>
                  <p className="text-gray-900">{selectedApplication.applicantName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Application Type</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedApplication.type)}`}>
                    {selectedApplication.type.charAt(0).toUpperCase() + selectedApplication.type.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-gray-900">{selectedApplication.phone}</p>
                </div>
                {selectedApplication.petName && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pet Interested In</p>
                    <p className="text-gray-900">{selectedApplication.petName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-700">Housing Type</p>
                  <p className="text-gray-900">{selectedApplication.housingType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Has Yard</p>
                  <p className="text-gray-900">{selectedApplication.hasYard ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Other Pets</p>
                  <p className="text-gray-900">{selectedApplication.otherPets ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Experience</p>
                  <p className="text-gray-900">{selectedApplication.experience}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Submitted Date</p>
                  <p className="text-gray-900">{new Date(selectedApplication.submittedDate).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedApplication.skills && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApplication.availability && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Availability</p>
                  <p className="text-gray-900">{selectedApplication.availability}</p>
                </div>
              )}

              {selectedApplication.references && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">References</p>
                  <p className="text-gray-900">{selectedApplication.references}</p>
                </div>
              )}

              {selectedApplication.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                  <p className="text-gray-900">{selectedApplication.notes}</p>
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
                <span>Edit Application</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Application Modal */}
      {showEditModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Edit Application</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedApplication.status}
                  onChange={(e) => setSelectedApplication({...selectedApplication, status: e.target.value as Application['status']})}
                  className="input"
                >
                  <option value="pending">Pending</option>
                  <option value="interview">Interview</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">References</label>
                <textarea
                  rows={2}
                  value={selectedApplication.references}
                  onChange={(e) => setSelectedApplication({...selectedApplication, references: e.target.value})}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  value={selectedApplication.notes}
                  onChange={(e) => setSelectedApplication({...selectedApplication, notes: e.target.value})}
                  className="input"
                  placeholder="Add notes about this application..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleEditApplication} className="btn-primary flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;