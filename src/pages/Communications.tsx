import React, { useState } from 'react';
import { MessageSquare, Plus, Send, Search, Filter, Mail, Users, Calendar, Edit, Eye, Save, X, Share2, Wand2 } from 'lucide-react';
import SocialMediaManager from '../components/social/SocialMediaManager';

interface Message {
  id: string;
  subject: string;
  recipient: string;
  recipientType: 'volunteer' | 'adopter' | 'donor' | 'all';
  content: string;
  status: 'draft' | 'sent' | 'scheduled';
  sentDate?: string;
  scheduledDate?: string;
  openRate?: number;
  clickRate?: number;
}

const Communications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'email' | 'social'>('email');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      subject: 'Monthly Newsletter - January 2024',
      recipient: 'All Subscribers',
      recipientType: 'all',
      content: 'Thank you for your continued support. Here are the highlights from this month...',
      status: 'sent',
      sentDate: '2024-01-28',
      openRate: 68,
      clickRate: 12
    },
    {
      id: '2',
      subject: 'Volunteer Training Reminder',
      recipient: 'Active Volunteers',
      recipientType: 'volunteer',
      content: 'Don\'t forget about the upcoming training session this Saturday...',
      status: 'sent',
      sentDate: '2024-01-25',
      openRate: 85,
      clickRate: 45
    },
    {
      id: '3',
      subject: 'Thank You for Your Adoption',
      recipient: 'Recent Adopters',
      recipientType: 'adopter',
      content: 'We hope you and your new furry friend are settling in well...',
      status: 'draft',
    },
    {
      id: '4',
      subject: 'Emergency Fundraising Campaign',
      recipient: 'Donor List',
      recipientType: 'donor',
      content: 'We urgently need your help to cover unexpected medical expenses...',
      status: 'scheduled',
      scheduledDate: '2024-02-01'
    }
  ]);

  const [newMessage, setNewMessage] = useState<Partial<Message>>({
    subject: '',
    recipient: 'All Subscribers',
    recipientType: 'all',
    content: '',
    status: 'draft',
    scheduledDate: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-success-100 text-success-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecipientTypeColor = (type: string) => {
    switch (type) {
      case 'volunteer':
        return 'bg-primary-100 text-primary-800';
      case 'adopter':
        return 'bg-success-100 text-success-800';
      case 'donor':
        return 'bg-warning-100 text-warning-800';
      case 'all':
        return 'bg-secondary-100 text-secondary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddMessage = () => {
    const message: Message = {
      ...newMessage,
      id: Date.now().toString(),
    } as Message;
    
    setMessages([...messages, message]);
    setNewMessage({
      subject: '',
      recipient: 'All Subscribers',
      recipientType: 'all',
      content: '',
      status: 'draft',
      scheduledDate: ''
    });
    setShowAddModal(false);
  };

  const handleEditMessage = () => {
    if (selectedMessage) {
      setMessages(messages.map(msg => msg.id === selectedMessage.id ? selectedMessage : msg));
      setShowEditModal(false);
      setSelectedMessage(null);
    }
  };

  const handleSendMessage = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: 'sent' as const, sentDate: new Date().toISOString().split('T')[0] }
        : msg
    ));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bebas uppercase text-gray-900">Communications</h1>
          <p className="text-gray-600 mt-2">Manage email campaigns and AI-powered social media</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>{activeTab === 'email' ? 'New Message' : 'New Post'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('email')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'email'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Email Communications</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'social'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span>Social Media</span>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">AI Powered</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'email' ? (
        <>
          {/* Email Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-success-600">
                {messages.filter(m => m.status === 'sent').length}
              </p>
            </div>
            <Send className="h-8 w-8 text-success-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-600">
                {messages.filter(m => m.status === 'draft').length}
              </p>
            </div>
            <Mail className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
              <p className="text-2xl font-bold text-primary-600">
                {Math.round(messages.filter(m => m.openRate).reduce((sum, m) => sum + (m.openRate || 0), 0) / messages.filter(m => m.openRate).length) || 0}%
              </p>
            </div>
            <Users className="h-8 w-8 text-primary-600" />
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
                placeholder="Search messages by subject or recipient..."
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
              <option value="sent">Sent</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {message.subject}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                        {message.content}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{message.recipient}</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRecipientTypeColor(message.recipientType)}`}>
                        {message.recipientType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {message.sentDate && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(message.sentDate).toLocaleDateString()}
                      </div>
                    )}
                    {message.scheduledDate && (
                      <div className="flex items-center text-warning-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(message.scheduledDate).toLocaleDateString()}
                      </div>
                    )}
                    {message.status === 'draft' && (
                      <span className="text-gray-400">Not sent</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {message.openRate !== undefined && (
                      <div>
                        <div>Open: {message.openRate}%</div>
                        <div>Click: {message.clickRate}%</div>
                      </div>
                    )}
                    {message.status === 'draft' && (
                      <span className="text-gray-400">-</span>
                    )}
                    {message.status === 'scheduled' && (
                      <span className="text-warning-600">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedMessage(message);
                          setShowViewModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedMessage(message);
                          setShowEditModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {message.status === 'draft' && (
                        <button 
                          onClick={() => handleSendMessage(message.id)}
                          className="text-success-600 hover:text-success-900"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-error-600 hover:text-error-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Add Message Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Create New Message</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  className="input"
                  placeholder="Enter message subject"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Type</label>
                  <select
                    value={newMessage.recipientType}
                    onChange={(e) => setNewMessage({...newMessage, recipientType: e.target.value as Message['recipientType']})}
                    className="input"
                  >
                    <option value="all">All Subscribers</option>
                    <option value="volunteer">Volunteers</option>
                    <option value="adopter">Adopters</option>
                    <option value="donor">Donors</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newMessage.status}
                    onChange={(e) => setNewMessage({...newMessage, status: e.target.value as Message['status']})}
                    className="input"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              {newMessage.status === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                  <input
                    type="date"
                    value={newMessage.scheduledDate}
                    onChange={(e) => setNewMessage({...newMessage, scheduledDate: e.target.value})}
                    className="input"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                <textarea
                  rows={6}
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  className="input"
                  placeholder="Write your message content here..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleAddMessage} className="btn-primary flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Create Message</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Message Modal */}
      {showEditModal && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Edit Message</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={selectedMessage.subject}
                  onChange={(e) => setSelectedMessage({...selectedMessage, subject: e.target.value})}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => setSelectedMessage({...selectedMessage, status: e.target.value as Message['status']})}
                  className="input"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sent">Sent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                <textarea
                  rows={6}
                  value={selectedMessage.content}
                  onChange={(e) => setSelectedMessage({...selectedMessage, content: e.target.value})}
                  className="input"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleEditMessage} className="btn-primary flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Message Modal */}
      {showViewModal && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">{selectedMessage.subject}</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Recipient</p>
                  <p className="text-gray-900">{selectedMessage.recipient}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Type</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRecipientTypeColor(selectedMessage.recipientType)}`}>
                    {selectedMessage.recipientType}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Date</p>
                  <p className="text-gray-900">
                    {selectedMessage.sentDate && new Date(selectedMessage.sentDate).toLocaleDateString()}
                    {selectedMessage.scheduledDate && `Scheduled: ${new Date(selectedMessage.scheduledDate).toLocaleDateString()}`}
                    {selectedMessage.status === 'draft' && 'Not sent'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Content</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>

              {selectedMessage.openRate !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Open Rate</p>
                    <p className="text-gray-900">{selectedMessage.openRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Click Rate</p>
                    <p className="text-gray-900">{selectedMessage.clickRate}%</p>
                  </div>
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
                <span>Edit Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      ) : (
        /* Social Media Tab */
        <SocialMediaManager />
      )}
    </div>
  );
};

export default Communications;