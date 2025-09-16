import React, { useState, useEffect } from 'react';
import { Mail, Search, Filter, Archive, Trash2, Reply, Star, Clock, User, MessageSquare, X, Send } from 'lucide-react';
import { getInboxMessages } from '../api/xano';
import { useTenant } from '../contexts/TenantContext';

interface InboxMessage {
  id: string;
  from: string;
  email: string;
  subject: string;
  message: string;
  type: 'contact' | 'success_story' | 'general' | 'adoption' | 'volunteer' | 'foster';
  status: 'unread' | 'read' | 'archived';
  priority: 'low' | 'normal' | 'high';
  receivedDate: string;
  attachments?: string[];
  petName?: string;
  storyImages?: string[];
}

const Inbox: React.FC = () => {
  const { organization } = useTenant()
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  const tenantId = organization?.id ? parseInt(organization.id) : 1;

  const loadMessages = async () => {
    try {
      setLoading(true)
      const result = await getInboxMessages(tenantId)

      if (result.success && result.data) {
        // Transform Xano data to match our interface
        const transformedMessages = result.data.map((msg: any) => ({
          id: msg.id.toString(),
          from: msg.name || msg.applicantName || 'Unknown',
          email: msg.email,
          subject: msg.subject || `${msg.form_type} inquiry`,
          message: msg.message || msg.whyAdopt || 'No message content',
          type: msg.form_type,
          status: msg.status === 'new' ? 'unread' : 'read',
          priority: 'normal',
          receivedDate: msg.submitted_at,
          petName: msg.specificAnimal
        }))
        setMessages(transformedMessages)
      } else {
        // Keep existing mock data and add form submission examples
        setMessages(mockMessages)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      setMessages(mockMessages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [tenantId])

  const mockMessages: InboxMessage[] = [
    {
      id: '1',
      from: 'John Smith',
      email: 'john.smith@email.com',
      subject: 'Interested in adopting Bella',
      message: 'Hi, I saw Bella on your website and I\'m very interested in adopting her. I have experience with Golden Retrievers and would love to provide her with a loving home. Could we schedule a meet and greet?',
      type: 'contact',
      status: 'unread',
      priority: 'normal',
      receivedDate: '2024-01-29T10:30:00Z',
      petName: 'Bella'
    },
    {
      id: '4',
      from: 'Sarah Johnson',
      email: 'sarah@email.com',
      subject: 'Adoption Application - Buddy',
      message: 'I would love to adopt Buddy. I have a fenced yard and experience with Golden Retrievers. I work from home so I can provide lots of attention.',
      type: 'adoption',
      status: 'unread',
      priority: 'high',
      receivedDate: '2024-01-29T09:15:00Z',
      petName: 'Buddy'
    },
    {
      id: '5',
      from: 'Mike Chen',
      email: 'mike@email.com',
      subject: 'Volunteer Application',
      message: 'I\'d like to volunteer on weekends. I have experience with dogs and can help with walking, feeding, and basic care.',
      type: 'volunteer',
      status: 'unread',
      priority: 'normal',
      receivedDate: '2024-01-29T08:30:00Z'
    },
    {
      id: '6',
      from: 'Emily Rodriguez',
      email: 'emily@email.com',
      subject: 'Foster Application',
      message: 'I\'m interested in fostering puppies. I have a quiet home environment and previous fostering experience.',
      type: 'foster',
      status: 'read',
      priority: 'normal',
      receivedDate: '2024-01-28T16:45:00Z'
    },
    {
      id: '2',
      from: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      subject: 'Success Story - Charlie is doing amazing!',
      message: 'I wanted to share how wonderful Charlie has been since we adopted him 6 months ago. He\'s brought so much joy to our family and has become best friends with our daughter. Thank you for all you do!',
      type: 'success_story',
      status: 'read',
      priority: 'normal',
      receivedDate: '2024-01-28T14:15:00Z',
      petName: 'Charlie',
      storyImages: ['image1.jpg', 'image2.jpg']
    },
    {
      id: '3',
      from: 'David Johnson',
      email: 'david.j@email.com',
      subject: 'Volunteer Application Follow-up',
      message: 'I submitted a volunteer application last week and wanted to follow up. I\'m particularly interested in helping with dog walking and training. Please let me know if you need any additional information.',
      type: 'contact',
      status: 'unread',
      priority: 'high',
      receivedDate: '2024-01-27T09:45:00Z'
    },
    {
      id: '4',
      from: 'Sarah Wilson',
      email: 'sarah.w@email.com',
      subject: 'Question about fostering requirements',
      message: 'Hello, I\'m interested in becoming a foster family for your organization. Could you please send me information about the requirements and application process? I have a fenced yard and previous experience with rescue dogs.',
      type: 'contact',
      status: 'read',
      priority: 'normal',
      receivedDate: '2024-01-26T16:20:00Z'
    },
    {
      id: '5',
      from: 'Anonymous Donor',
      email: 'donor@email.com',
      subject: 'Thank you for your work',
      message: 'I just wanted to say thank you for all the amazing work you do for animals in need. I made a donation today and hope it helps with your mission. Keep up the great work!',
      type: 'general',
      status: 'read',
      priority: 'low',
      receivedDate: '2024-01-25T11:10:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-primary-100 text-primary-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-secondary-100 text-secondary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contact':
        return 'bg-blue-100 text-blue-800';
      case 'success_story':
        return 'bg-green-100 text-green-800';
      case 'general':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-error-600';
      case 'normal':
        return 'text-gray-600';
      case 'low':
        return 'text-gray-400';
      default:
        return 'text-gray-600';
    }
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' as const } : msg
    ));
  };

  const handleArchive = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'archived' as const } : msg
    ));
  };

  const handleDelete = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
  };

  const handlePublishStory = (messageId: string) => {
    // This would publish the success story to the live site
    alert('Success story published to live site!');
  };

  const handleSendReply = () => {
    if (selectedMessage && replyContent.trim()) {
      // In a real app, this would send the email via API
      alert(`Reply sent to ${selectedMessage.email}!`);
      setReplyContent('');
      setShowReplyModal(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
    const matchesType = typeFilter === 'all' || msg.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bebas uppercase text-gray-900">Inbox</h1>
        <p className="text-gray-600 mt-2">Manage messages from your website contact forms</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <Mail className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-primary-600">
                {messages.filter(m => m.status === 'unread').length}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Stories</p>
              <p className="text-2xl font-bold text-green-600">
                {messages.filter(m => m.type === 'success_story').length}
              </p>
            </div>
            <Star className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-error-600">
                {messages.filter(m => m.priority === 'high').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-error-600" />
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
                placeholder="Search messages..."
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
              <option value="contact">Contact</option>
              <option value="adoption">Adoption Applications</option>
              <option value="volunteer">Volunteer Applications</option>
              <option value="foster">Foster Applications</option>
              <option value="success_story">Success Stories</option>
              <option value="general">General</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="card">
        <div className="divide-y divide-gray-200">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                message.status === 'unread' ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                setSelectedMessage(message);
                setShowViewModal(true);
                if (message.status === 'unread') {
                  handleMarkAsRead(message.id);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className={`text-sm font-medium ${
                        message.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {message.from}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(message.type)}`}>
                      {message.type.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                    {message.priority === 'high' && (
                      <Star className="h-4 w-4 text-error-600" />
                    )}
                  </div>
                  <h3 className={`text-sm font-medium mb-1 ${
                    message.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {message.subject}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {message.message}
                  </p>
                  {message.petName && (
                    <p className="text-xs text-primary-600 mt-1">
                      Related to: {message.petName}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-xs text-gray-500">
                    {new Date(message.receivedDate).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(message.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                      className="p-1 text-gray-400 hover:text-error-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
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
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{selectedMessage.from}</p>
                  <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedMessage.receivedDate).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedMessage.type)}`}>
                    {selectedMessage.type.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                </div>
              </div>

              {selectedMessage.petName && (
                <div className="p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm font-medium text-primary-800">
                    Related to pet: {selectedMessage.petName}
                  </p>
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {selectedMessage.storyImages && selectedMessage.storyImages.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Attached Images</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMessage.storyImages.map((image, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">{image}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3 mt-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleArchive(selectedMessage.id)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Archive className="h-4 w-4" />
                  <span>Archive</span>
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="btn-error flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
              <div className="flex space-x-2">
                {selectedMessage.type === 'success_story' && (
                  <button
                    onClick={() => handlePublishStory(selectedMessage.id)}
                    className="btn-success flex items-center space-x-2"
                  >
                    <Star className="h-4 w-4" />
                    <span>Publish Story</span>
                  </button>
                )}
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    setShowReplyModal(true);
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Reply className="h-4 w-4" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Reply to {selectedMessage.from}</h2>
              <button onClick={() => setShowReplyModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">To: {selectedMessage.email}</p>
                <p className="text-sm text-gray-600">Subject: Re: {selectedMessage.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                <textarea
                  rows={8}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="input"
                  placeholder="Type your reply here..."
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Original Message:</p>
                <p className="text-sm text-gray-600">{selectedMessage.message}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowReplyModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleSendReply}
                disabled={!replyContent.trim()}
                className="btn-primary flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send Reply</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;