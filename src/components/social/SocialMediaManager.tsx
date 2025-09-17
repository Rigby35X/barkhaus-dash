import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Calendar, Send, Edit, Copy, Trash2, 
  Facebook, Instagram, Twitter, Linkedin, Wand2, Clock, 
  CheckCircle, AlertCircle, BarChart3, Settings, Link
} from 'lucide-react';
import { socialMediaService, ScheduledPost } from '../../services/socialMediaService';
import { openaiService, ContentGenerationRequest } from '../../services/openaiService';
import SocialPostCreator from './SocialPostCreator';
import SocialPostEditor from './SocialPostEditor';
import SocialAccountManager from './SocialAccountManager';

const SocialMediaManager: React.FC = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ScheduledPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'published'>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'facebook' | 'instagram' | 'twitter' | 'linkedin'>('all');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState(socialMediaService.getStats());
  const [apiKeyStatus, setApiKeyStatus] = useState(openaiService.getApiKeyStatus());

  useEffect(() => {
    loadPosts();
    socialMediaService.startScheduler();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, statusFilter, platformFilter]);

  const loadPosts = () => {
    const allPosts = socialMediaService.getPosts();
    setPosts(allPosts);
    setStats(socialMediaService.getStats());
  };

  const filterPosts = () => {
    const filtered = socialMediaService.getPosts({
      status: statusFilter === 'all' ? undefined : statusFilter,
      platform: platformFilter === 'all' ? undefined : platformFilter,
      search: searchTerm || undefined
    });
    setFilteredPosts(filtered);
  };

  const handleCreatePost = async (postData: any) => {
    try {
      await socialMediaService.createPost(postData);
      loadPosts();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleEditPost = async (postData: any) => {
    if (!selectedPost) return;
    
    try {
      await socialMediaService.updatePost(selectedPost.id, postData);
      loadPosts();
      setShowEditModal(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleSchedulePost = async (postId: string, scheduledDate: string) => {
    try {
      await socialMediaService.schedulePost(postId, scheduledDate);
      loadPosts();
    } catch (error) {
      console.error('Failed to schedule post:', error);
    }
  };

  const handlePublishNow = async (postId: string) => {
    try {
      await socialMediaService.publishNow(postId);
      loadPosts();
    } catch (error) {
      console.error('Failed to publish post:', error);
    }
  };

  const handleDuplicatePost = async (postId: string) => {
    try {
      await socialMediaService.duplicatePost(postId);
      loadPosts();
    } catch (error) {
      console.error('Failed to duplicate post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await socialMediaService.deletePost(postId);
      loadPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'instagram': return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'twitter': return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'linkedin': return <Linkedin className="h-4 w-4 text-blue-700" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded" />;
    }
  };

  const getStatusIcon = (post: ScheduledPost) => {
    if (post.error) return <AlertCircle className="h-4 w-4 text-red-500" />;
    
    switch (post.status) {
      case 'published': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Edit className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (post: ScheduledPost) => {
    if (post.error) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Failed</span>;
    }
    
    const statusColors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[post.status]}`}>
        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bebas uppercase text-gray-900">Social Media Manager</h1>
          <p className="text-gray-600 mt-2">Create, schedule, and publish AI-powered social media content</p>
          {!apiKeyStatus.hasKey && (
            <div className="mt-2 flex items-center space-x-2 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">OpenAI API key required for AI content generation</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={() => setShowAccountModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Settings className="h-5 w-5" />
            <span>Accounts</span>
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.publishedPosts}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduledPosts}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement</p>
              <p className="text-2xl font-bold text-purple-600">{stats.engagementRate}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
          
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <Wand2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">Create your first AI-powered social media post to get started.</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getPlatformIcon(post.platform)}
                      <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                      {getStatusBadge(post)}
                      {getStatusIcon(post)}
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Type: {post.postType.replace('_', ' ')}</span>
                      <span>Created: {new Date(post.createdDate).toLocaleDateString()}</span>
                      {post.scheduledDate && (
                        <span>Scheduled: {new Date(post.scheduledDate).toLocaleString()}</span>
                      )}
                      {post.publishedAt && (
                        <span>Published: {new Date(post.publishedAt).toLocaleString()}</span>
                      )}
                    </div>
                    
                    {post.error && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        Error: {post.error}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {post.status === 'draft' && (
                      <>
                        <button
                          onClick={() => handlePublishNow(post.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Publish Now"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            const now = new Date();
                            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                            const defaultDate = tomorrow.toISOString().slice(0, 16);
                            const date = prompt(`Enter scheduled date and time:\n\nFormat: YYYY-MM-DDTHH:MM\nExample: ${defaultDate}`, defaultDate);
                            if (date) {
                              try {
                                // Validate the date format
                                const scheduledDate = new Date(date);
                                if (isNaN(scheduledDate.getTime())) {
                                  alert('Invalid date format. Please use YYYY-MM-DDTHH:MM format.');
                                  return;
                                }
                                if (scheduledDate <= now) {
                                  alert('Scheduled date must be in the future.');
                                  return;
                                }
                                handleSchedulePost(post.id, date);
                              } catch (error) {
                                alert('Invalid date format. Please use YYYY-MM-DDTHH:MM format.');
                              }
                            }
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Schedule"
                        >
                          <Calendar className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    {post.status === 'scheduled' && (
                      <button
                        onClick={() => handlePublishNow(post.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Publish Now"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDuplicatePost(post.id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <SocialPostCreator
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreatePost}
        />
      )}

      {showEditModal && selectedPost && (
        <SocialPostEditor
          post={selectedPost}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPost(null);
          }}
          onSave={handleEditPost}
        />
      )}

      {showAccountModal && (
        <SocialAccountManager
          onClose={() => setShowAccountModal(false)}
        />
      )}
    </div>
  );
};

export default SocialMediaManager;
