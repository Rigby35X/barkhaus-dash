import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Send, Wand2, Image as ImageIcon } from 'lucide-react';
import { ScheduledPost } from '../../services/socialMediaService';
import { openaiService, ContentGenerationRequest } from '../../services/openaiService';
import { useTenant } from '../../contexts/TenantContext';

interface SocialPostEditorProps {
  post: ScheduledPost;
  onClose: () => void;
  onSave: (postData: any) => void;
}

const SocialPostEditor: React.FC<SocialPostEditorProps> = ({ post, onClose, onSave }) => {
  const { organization } = useTenant();
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [hashtags, setHashtags] = useState<string[]>(post.hashtags || []);
  const [scheduledDate, setScheduledDate] = useState(post.scheduledDate || '');
  const [platform, setPlatform] = useState(post.platform);
  const [postType, setPostType] = useState(post.postType);

  const handleSave = () => {
    const updatedPost = {
      title,
      content,
      hashtags,
      platform,
      postType,
      status: scheduledDate ? 'scheduled' : post.status,
      scheduledDate: scheduledDate || undefined
    };

    onSave(updatedPost);
  };

  const handleRegenerate = async () => {
    if (!organization) {
      alert('Organization information not available');
      return;
    }

    setIsRegenerating(true);

    try {
      const request: ContentGenerationRequest = {
        postType,
        platform,
        organizationInfo: {
          name: organization.name || 'Animal Rescue',
          mission: organization.mission || 'Saving animals and finding them loving homes',
          tone: 'friendly'
        },
        customPrompt: `Regenerate content similar to: ${content}`
      };

      const newContent = await openaiService.generateSocialMediaPost(request);
      
      setContent(newContent.content);
      setHashtags(newContent.hashtags);
      if (newContent.title) {
        setTitle(newContent.title);
      }
    } catch (error) {
      console.error('Failed to regenerate content:', error);
      alert('Failed to regenerate content. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const addHashtag = (hashtag: string) => {
    const cleanHashtag = hashtag.trim().replace('#', '');
    if (cleanHashtag && !hashtags.includes(cleanHashtag)) {
      setHashtags([...hashtags, cleanHashtag]);
    }
  };

  const removeHashtag = (index: number) => {
    setHashtags(hashtags.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Social Media Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4" />
                <span>{isRegenerating ? 'Regenerating...' : 'Regenerate with AI'}</span>
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your social media post content..."
            />
            <div className="mt-2 text-sm text-gray-500">
              Character count: {content.length}
              {platform === 'twitter' && content.length > 280 && (
                <span className="text-red-500 ml-2">Exceeds Twitter limit (280 characters)</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {hashtags.map((hashtag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{hashtag}
                  <button
                    onClick={() => removeHashtag(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add hashtag and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addHashtag(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="new_arrival">New Animal Arrival</option>
              <option value="adoption_success">Adoption Success Story</option>
              <option value="fundraiser">Fundraising Campaign</option>
              <option value="volunteer_need">Volunteer Recruitment</option>
              <option value="event">Event Promotion</option>
              <option value="general">General Post</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule (Optional)</label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {scheduledDate && (
              <p className="mt-2 text-sm text-gray-600">
                Will be published on {new Date(scheduledDate).toLocaleString()}
              </p>
            )}
          </div>

          {post.imagePrompt && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ImageIcon className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">AI Image Suggestion</span>
              </div>
              <p className="text-gray-600 text-sm">{post.imagePrompt}</p>
            </div>
          )}

          {post.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-1">Publishing Error</h4>
              <p className="text-red-700 text-sm">{post.error}</p>
              <p className="text-red-600 text-xs mt-1">Retry count: {post.retryCount || 0}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPostEditor;
