import React, { useState, useEffect } from 'react';
import { X, Wand2, Calendar, Send, Facebook, Instagram, Twitter, Linkedin, Sparkles, Image as ImageIcon } from 'lucide-react';
import { openaiService, ContentGenerationRequest } from '../../services/openaiService';
import { useTenant } from '../../contexts/TenantContext';

interface SocialPostCreatorProps {
  onClose: () => void;
  onSave: (postData: any) => void;
}

interface AnimalData {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  description: string;
  personality: string[];
  specialNeeds?: string;
}

const SocialPostCreator: React.FC<SocialPostCreatorProps> = ({ onClose, onSave }) => {
  const { organization } = useTenant();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<'setup' | 'generate' | 'review'>('setup');
  
  // Form data
  const [postType, setPostType] = useState<'adoption_success' | 'new_arrival' | 'fundraiser' | 'volunteer_need' | 'event' | 'general'>('new_arrival');
  const [platform, setPlatform] = useState<'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'all'>('all');
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalData | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'playful' | 'urgent'>('friendly');
  
  // Generated content
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedHashtags, setEditedHashtags] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  // Mock animal data - in real app, this would come from your animals API
  const mockAnimals: AnimalData[] = [
    {
      id: '1',
      name: 'Bella',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '3 years',
      description: 'Friendly and energetic dog looking for a loving home.',
      personality: ['Friendly', 'Energetic', 'Good with kids']
    },
    {
      id: '2',
      name: 'Max',
      species: 'Dog', 
      breed: 'German Shepherd',
      age: '5 years',
      description: 'Loyal and protective companion.',
      personality: ['Loyal', 'Protective', 'Well-trained']
    },
    {
      id: '3',
      name: 'Luna',
      species: 'Cat',
      breed: 'Siamese',
      age: '2 years',
      description: 'Playful and affectionate cat.',
      personality: ['Playful', 'Affectionate', 'Independent']
    }
  ];

  const handleGenerateContent = async () => {
    if (!organization) {
      alert('Organization information not available');
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generate');

    try {
      const request: ContentGenerationRequest = {
        postType,
        platform,
        animalData: selectedAnimal || undefined,
        organizationInfo: {
          name: organization.name || 'Animal Rescue',
          mission: organization.mission || 'Saving animals and finding them loving homes',
          tone
        },
        customPrompt: customPrompt || undefined
      };

      let content;
      if (platform === 'all') {
        content = await openaiService.generateMultiPlatformPost(request);
        // For multi-platform, use Facebook version as default
        setGeneratedContent(content.facebook);
      } else {
        content = await openaiService.generateSocialMediaPost(request);
        setGeneratedContent(content);
      }

      setEditedContent(content.content || (content as any).facebook?.content || '');
      setEditedHashtags(content.hashtags || (content as any).facebook?.hashtags || []);
      setTitle(content.title || (content as any).facebook?.title || '');
      
      setCurrentStep('review');
    } catch (error) {
      console.error('Failed to generate content:', error);

      let errorMessage = 'Failed to generate content. ';
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage += 'Please check your OpenAI API key in the Account settings.';
        } else if (error.message.includes('401')) {
          errorMessage += 'Invalid API key. Please check your OpenAI API key.';
        } else if (error.message.includes('429')) {
          errorMessage += 'Rate limit exceeded. Please try again in a moment.';
        } else if (error.message.includes('insufficient_quota')) {
          errorMessage += 'Insufficient OpenAI credits. Please check your OpenAI account.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      } else {
        errorMessage += 'Unknown error occurred.';
      }

      alert(errorMessage);
      setCurrentStep('setup');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    const postData = {
      title: title || 'Untitled Post',
      content: editedContent,
      platform,
      hashtags: editedHashtags,
      postType,
      status: scheduledDate ? 'scheduled' : 'draft',
      scheduledDate: scheduledDate || undefined,
      animalId: selectedAnimal?.id,
      imagePrompt: generatedContent?.imagePrompt
    };

    onSave(postData);
  };

  const getPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'instagram': return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'twitter': return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'linkedin': return <Linkedin className="h-5 w-5 text-blue-700" />;
      default: return <Sparkles className="h-5 w-5 text-purple-600" />;
    }
  };

  const renderSetupStep = () => (
    <div className="space-y-6">
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['all', 'facebook', 'instagram', 'twitter', 'linkedin'].map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p as any)}
              className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${
                platform === p 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {getPlatformIcon(p)}
              <span className="text-sm font-medium capitalize">{p}</span>
            </button>
          ))}
        </div>
      </div>

      {(postType === 'new_arrival' || postType === 'adoption_success') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Animal</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockAnimals.map((animal) => (
              <button
                key={animal.id}
                onClick={() => setSelectedAnimal(animal)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedAnimal?.id === animal.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">{animal.name}</div>
                <div className="text-sm text-gray-600">{animal.breed} • {animal.age}</div>
                <div className="text-xs text-gray-500 mt-1">{animal.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="friendly">Friendly & Warm</option>
          <option value="professional">Professional</option>
          <option value="playful">Playful & Fun</option>
          <option value="urgent">Urgent & Direct</option>
        </select>
      </div>

      {postType === 'general' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Describe what you want the post to be about..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button 
          onClick={handleGenerateContent}
          disabled={isGenerating || (postType === 'general' && !customPrompt.trim())}
          className="btn-primary flex items-center space-x-2"
        >
          <Wand2 className="h-5 w-5" />
          <span>Generate with AI</span>
        </button>
      </div>
    </div>
  );

  const renderGenerateStep = () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Content...</h3>
      <p className="text-gray-600">AI is creating your social media post. This may take a few seconds.</p>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {editedHashtags.map((hashtag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              #{hashtag}
              <button
                onClick={() => setEditedHashtags(editedHashtags.filter((_, i) => i !== index))}
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
              const value = e.currentTarget.value.trim().replace('#', '');
              if (value && !editedHashtags.includes(value)) {
                setEditedHashtags([...editedHashtags, value]);
                e.currentTarget.value = '';
              }
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {generatedContent?.imagePrompt && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ImageIcon className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">AI Image Suggestion</span>
          </div>
          <p className="text-gray-600 text-sm">{generatedContent.imagePrompt}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Schedule (Optional)</label>
        <input
          type="datetime-local"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-between">
        <button 
          onClick={() => setCurrentStep('setup')}
          className="btn-secondary"
        >
          Back to Setup
        </button>
        <div className="space-x-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
            {scheduledDate ? <Calendar className="h-5 w-5" /> : <Send className="h-5 w-5" />}
            <span>{scheduledDate ? 'Schedule Post' : 'Save as Draft'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create Social Media Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {currentStep === 'setup' && renderSetupStep()}
          {currentStep === 'generate' && renderGenerateStep()}
          {currentStep === 'review' && renderReviewStep()}
        </div>
      </div>
    </div>
  );
};

export default SocialPostCreator;
