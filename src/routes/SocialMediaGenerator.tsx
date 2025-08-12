import React, { useState } from 'react';
import { Share2, Plus, Search, Filter, Edit, Eye, Save, X, Copy, Calendar, Wand2, Hash, Image as ImageIcon, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface SocialPost {
  id: string;
  title: string;
  type: 'new_arrival' | 'adoption_update' | 'fundraiser' | 'volunteer_need' | 'success_story' | 'event';
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'all';
  content: string;
  hashtags: string[];
  image?: string;
  petId?: string;
  petName?: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate?: string;
  createdDate: string;
}

interface PostTemplate {
  id: string;
  name: string;
  type: string;
  template: string;
  hashtags: string[];
  platforms: string[];
}

const SocialMediaGenerator: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: '1',
      title: 'New Arrival - Bella',
      type: 'new_arrival',
      platform: 'all',
      content: '🐕 Meet Bella! This sweet 3-year-old Golden Retriever just arrived at our shelter and is looking for her forever home. She\'s great with kids and loves to play fetch! Could you be the family she\'s been waiting for? 💕',
      hashtags: ['AdoptDontShop', 'GoldenRetrieverLove', 'RescueDog', 'ForeverHome', 'HappyPawsRescue'],
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
      petId: '1',
      petName: 'Bella',
      status: 'draft',
      createdDate: '2024-01-29'
    },
    {
      id: '2',
      title: 'Adoption Success - Max',
      type: 'adoption_update',
      platform: 'facebook',
      content: '🎉 ADOPTED! We\'re thrilled to share that Max has found his forever family! The Garcia family fell in love with this gentle giant, and we couldn\'t be happier. Thank you to everyone who shared his story! ❤️',
      hashtags: ['AdoptionSuccess', 'HappyEnding', 'ForeverHome', 'RescueSuccess'],
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop',
      petId: '2',
      petName: 'Max',
      status: 'published',
      createdDate: '2024-01-28'
    },
    {
      id: '3',
      title: 'Volunteer Appreciation',
      type: 'volunteer_need',
      platform: 'instagram',
      content: '🙌 Shoutout to our amazing volunteers! This week alone, our volunteers walked 50+ dogs, helped with 12 adoptions, and spread so much love. Want to join our volunteer family? Link in bio! 🐾',
      hashtags: ['VolunteerLove', 'CommunitySupport', 'MakeADifference', 'AnimalRescue'],
      status: 'scheduled',
      scheduledDate: '2024-01-30T10:00:00',
      createdDate: '2024-01-29'
    }
  ]);

  const [newPost, setNewPost] = useState<Partial<SocialPost>>({
    title: '',
    type: 'new_arrival',
    platform: 'all',
    content: '',
    hashtags: [],
    status: 'draft'
  });

  const postTemplates: PostTemplate[] = [
    {
      id: '1',
      name: 'New Arrival',
      type: 'new_arrival',
      template: '🐕 Meet {petName}! This {age} {breed} just arrived at our shelter and is looking for their forever home. {description} Could you be the family they\'ve been waiting for? 💕',
      hashtags: ['AdoptDontShop', 'RescueDog', 'ForeverHome'],
      platforms: ['facebook', 'instagram', 'twitter']
    },
    {
      id: '2',
      name: 'Adoption Success',
      type: 'adoption_update',
      template: '🎉 ADOPTED! We\'re thrilled to share that {petName} has found their forever family! {adopter} fell in love with this amazing pet. Thank you to everyone who shared their story! ❤️',
      hashtags: ['AdoptionSuccess', 'HappyEnding', 'ForeverHome'],
      platforms: ['facebook', 'instagram']
    },
    {
      id: '3',
      name: 'Fundraiser Push',
      type: 'fundraiser',
      template: '🚨 We need your help! Our {campaignName} campaign is at {percentage}% of our goal. Every donation, no matter the size, makes a difference in the lives of animals in need. Link in bio to donate! 🙏',
      hashtags: ['Donate', 'AnimalRescue', 'MakeADifference', 'CommunitySupport'],
      platforms: ['facebook', 'instagram', 'twitter']
    },
    {
      id: '4',
      name: 'Volunteer Need',
      type: 'volunteer_need',
      template: '🙌 We\'re looking for amazing volunteers like YOU! Whether you can walk dogs, help with events, or lend a hand with admin tasks, every bit helps. Join our volunteer family today! 🐾',
      hashtags: ['Volunteer', 'CommunitySupport', 'MakeADifference', 'AnimalRescue'],
      platforms: ['facebook', 'instagram', 'linkedin']
    },
    {
      id: '5',
      name: 'Success Story',
      type: 'success_story',
      template: '💕 Success Story Alert! {petName} is living their best life with the {adopter} family! "{story}" Thank you for choosing adoption and giving {petName} the love they deserve! 🏠',
      hashtags: ['SuccessStory', 'AdoptionSuccess', 'HappyEnding', 'RescueLife'],
      platforms: ['facebook', 'instagram']
    },
    {
      id: '6',
      name: 'Event Promotion',
      type: 'event',
      template: '📅 Mark your calendars! Join us for {eventName} on {date} at {location}. Come meet our amazing animals and learn how you can help! See you there! 🎉',
      hashtags: ['Event', 'CommunityEvent', 'AdoptionEvent', 'AnimalRescue'],
      platforms: ['facebook', 'instagram', 'twitter']
    }
  ];

  const availablePets = [
    { id: '1', name: 'Bella', breed: 'Golden Retriever', age: '3 years', description: 'Friendly and energetic, great with kids' },
    { id: '2', name: 'Max', breed: 'German Shepherd', age: '5 years', description: 'Loyal and protective, perfect for active families' },
    { id: '3', name: 'Luna', breed: 'Siamese Cat', age: '2 years', description: 'Gentle and affectionate, loves to cuddle' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_arrival':
        return 'bg-blue-100 text-blue-800';
      case 'adoption_update':
        return 'bg-green-100 text-green-800';
      case 'fundraiser':
        return 'bg-yellow-100 text-yellow-800';
      case 'volunteer_need':
        return 'bg-purple-100 text-purple-800';
      case 'success_story':
        return 'bg-pink-100 text-pink-800';
      case 'event':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-warning-100 text-warning-800';
      case 'published':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  const generateAIContent = async (template: PostTemplate, petData?: any) => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let content = template.template;
    
    if (petData) {
      content = content
        .replace('{petName}', petData.name)
        .replace('{age}', petData.age)
        .replace('{breed}', petData.breed)
        .replace('{description}', petData.description);
    }
    
    // Add some AI-generated variations
    const variations = [
      '✨ Amazing news! ',
      '🌟 We\'re excited to share that ',
      '💫 Here\'s some wonderful news: ',
      '🎊 We have great news! '
    ];
    
    if (template.type === 'new_arrival') {
      content = variations[Math.floor(Math.random() * variations.length)] + content;
    }
    
    setNewPost(prev => ({
      ...prev,
      content,
      hashtags: [...template.hashtags]
    }));
    
    setIsGenerating(false);
  };

  const handleCreatePost = () => {
    const post: SocialPost = {
      ...newPost,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0]
    } as SocialPost;
    
    setPosts([post, ...posts]);
    setNewPost({
      title: '',
      type: 'new_arrival',
      platform: 'all',
      content: '',
      hashtags: [],
      status: 'draft'
    });
    setShowCreateModal(false);
  };

  const handleEditPost = () => {
    if (selectedPost) {
      setPosts(posts.map(post => post.id === selectedPost.id ? selectedPost : post));
      setShowEditModal(false);
      setSelectedPost(null);
    }
  };

  const handleCopyContent = (content: string, hashtags: string[]) => {
    const fullContent = `${content}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`;
    navigator.clipboard.writeText(fullContent);
    alert('Content copied to clipboard!');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || post.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bebas uppercase text-gray-900">Social Media Post Generator</h1>
          <p className="text-gray-600 mt-2">Create engaging social media content for your rescue</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
            <Share2 className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-success-600">
                {posts.filter(p => p.status === 'published').length}
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
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-warning-600">
                {posts.filter(p => p.status === 'scheduled').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-warning-600" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-600">
                {posts.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <Edit className="h-8 w-8 text-gray-600" />
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
                placeholder="Search posts..."
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
              <option value="new_arrival">New Arrival</option>
              <option value="adoption_update">Adoption Update</option>
              <option value="fundraiser">Fundraiser</option>
              <option value="volunteer_need">Volunteer Need</option>
              <option value="success_story">Success Story</option>
              <option value="event">Event</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(post.type)}`}>
                    {post.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                  <div className="flex items-center space-x-1">
                    {getPlatformIcon(post.platform)}
                    <span className="text-xs text-gray-500 capitalize">{post.platform}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{post.content}</p>
                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.hashtags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-flex items-center text-xs text-primary-600">
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {post.hashtags.length > 3 && (
                      <span className="text-xs text-gray-500">+{post.hashtags.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
              {post.image && (
                <img src={post.image} alt="Post" className="w-16 h-16 rounded-lg object-cover ml-4" />
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Created: {new Date(post.createdDate).toLocaleDateString()}</span>
              {post.scheduledDate && (
                <span>Scheduled: {new Date(post.scheduledDate).toLocaleDateString()}</span>
              )}
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={() => handleCopyContent(post.content, post.hashtags)}
                className="btn-secondary flex items-center space-x-1 text-sm"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
              <button 
                onClick={() => {
                  setSelectedPost(post);
                  setShowEditModal(true);
                }}
                className="btn-secondary flex items-center space-x-1 text-sm"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button className="btn-primary flex items-center space-x-1 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Schedule</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Create Social Media Post</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Templates & Settings */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Post Templates</h3>
                  <div className="space-y-2">
                    {postTemplates.map((template) => (
                      <div key={template.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                           onClick={() => generateAIContent(template, availablePets[0])}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            <p className="text-sm text-gray-600 truncate">{template.template.substring(0, 60)}...</p>
                          </div>
                          <Wand2 className="h-4 w-4 text-primary-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Post Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
                      <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        className="input"
                        placeholder="Enter post title"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
                        <select
                          value={newPost.type}
                          onChange={(e) => setNewPost({...newPost, type: e.target.value as any})}
                          className="input"
                        >
                          <option value="new_arrival">New Arrival</option>
                          <option value="adoption_update">Adoption Update</option>
                          <option value="fundraiser">Fundraiser</option>
                          <option value="volunteer_need">Volunteer Need</option>
                          <option value="success_story">Success Story</option>
                          <option value="event">Event</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                        <select
                          value={newPost.platform}
                          onChange={(e) => setNewPost({...newPost, platform: e.target.value as any})}
                          className="input"
                        >
                          <option value="all">All Platforms</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter</option>
                          <option value="linkedin">LinkedIn</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Pet (Optional)</label>
                      <select
                        value={newPost.petId || ''}
                        onChange={(e) => {
                          const pet = availablePets.find(p => p.id === e.target.value);
                          setNewPost({...newPost, petId: e.target.value, petName: pet?.name});
                        }}
                        className="input"
                      >
                        <option value="">No specific pet</option>
                        {availablePets.map((pet) => (
                          <option key={pet.id} value={pet.id}>{pet.name} - {pet.breed}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Content Editor */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bebas uppercase text-gray-900">Post Content</h3>
                    {isGenerating && (
                      <div className="flex items-center text-primary-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                        <span className="text-sm">Generating...</span>
                      </div>
                    )}
                  </div>
                  <textarea
                    rows={8}
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="input"
                    placeholder="Write your post content here or use a template..."
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    Character count: {newPost.content?.length || 0}
                    {newPost.platform === 'twitter' && (
                      <span className={newPost.content && newPost.content.length > 280 ? 'text-red-500' : ''}>
                        {' '}/ 280 (Twitter limit)
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newPost.hashtags?.map((tag, index) => (
                      <span key={index} className="inline-flex items-center bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
                        #{tag}
                        <button
                          onClick={() => setNewPost({
                            ...newPost,
                            hashtags: newPost.hashtags?.filter((_, i) => i !== index)
                          })}
                          className="ml-1 text-primary-600 hover:text-primary-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add hashtag and press Enter"
                    className="input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = e.currentTarget.value.trim().replace('#', '');
                        if (value && !newPost.hashtags?.includes(value)) {
                          setNewPost({
                            ...newPost,
                            hashtags: [...(newPost.hashtags || []), value]
                          });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload an image or select from pet photos</p>
                    <button className="btn-secondary mt-2">Choose Image</button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Preview</h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">HP</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Happy Paws Rescue</p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{newPost.content}</p>
                    {newPost.hashtags && newPost.hashtags.length > 0 && (
                      <p className="text-sm text-primary-600">
                        {newPost.hashtags.map(tag => `#${tag}`).join(' ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreatePost} className="btn-primary flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Post</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditModal && selectedPost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Edit Post</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
                <input
                  type="text"
                  value={selectedPost.title}
                  onChange={(e) => setSelectedPost({...selectedPost, title: e.target.value})}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows={6}
                  value={selectedPost.content}
                  onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedPost.status}
                  onChange={(e) => setSelectedPost({...selectedPost, status: e.target.value as any})}
                  className="input"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleEditPost} className="btn-primary flex items-center space-x-2">
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

export default SocialMediaGenerator;