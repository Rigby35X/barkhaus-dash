import React, { useState } from 'react';
import { Globe, Eye, Settings, Palette, Upload, Save, ExternalLink, Check, Edit, X, Monitor, Tablet, Smartphone, Cloud, Server, Code, Share2, Link as LinkIcon, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LiveSiteTemplate from '../components/LiveSiteTemplate';

interface LiveSiteConfig {
  siteName: string;
  logo: string;
  aboutUs: string;
  missionStatement: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  theme: 'modern' | 'classic' | 'warm';
  primaryColor: string;
  isPublished: boolean;
  siteUrl?: string;
  pages: {
    home: {
      heroSection: {
        title: string;
        subtitle: string;
        backgroundImage: string;
      };
    };
    about: {
      aboutSection: {
        title: string;
        content: string;
      };
    };
    successStories: {
      headerSection: {
        title: string;
        content: string;
      };
      submissionForm: {
        enabled: boolean;
        fields: string[];
      };
    };
    applications: {
      petApplication: {
        enabled: boolean;
        fields: string[];
      };
      fosterApplication: {
        enabled: boolean;
        fields: string[];
      };
      volunteerApplication: {
        enabled: boolean;
        fields: string[];
      };
    };
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  integrations: {
    petfinder: {
      enabled: boolean;
      apiKey: string;
    };
    adoptAPet: {
      enabled: boolean;
      apiKey: string;
    };
    fundraising: {
      bloomerang: { enabled: boolean; apiKey: string; };
      giveButter: { enabled: boolean; apiKey: string; };
      goFundMe: { enabled: boolean; apiKey: string; };
      donorbox: { enabled: boolean; apiKey: string; };
      petfundr: { enabled: boolean; apiKey: string; };
      cuddly: { enabled: boolean; apiKey: string; };
    };
  };
}

const LiveSite: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configSection, setConfigSection] = useState('');
  const [showHostingModal, setShowHostingModal] = useState(false);
  
  const [config, setConfig] = useState<LiveSiteConfig>({
    siteName: 'Happy Paws Rescue',
    logo: '/Duggy.png',
    aboutUs: 'We are dedicated to rescuing and rehoming animals in need. Our mission is to provide loving care and find forever homes for every animal that comes through our doors.',
    missionStatement: 'To rescue, rehabilitate, and rehome animals while educating the community about responsible pet ownership.',
    contactInfo: {
      address: '123 Main St, Anytown, ST 12345',
      phone: '(555) 123-4567',
      email: 'info@happypawsrescue.org'
    },
    theme: 'modern',
    primaryColor: '#00796B',
    isPublished: true,
    siteUrl: 'https://happy-paws-rescue.barkhaus.live',
    pages: {
      home: {
        heroSection: {
          title: 'Find Your Perfect Companion Today',
          subtitle: 'Discover loving animals waiting for their forever homes',
          backgroundImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop'
        }
      },
      about: {
        aboutSection: {
          title: 'About Our Mission',
          content: 'We are dedicated to rescuing and rehoming animals in need. Our mission is to provide loving care and find forever homes for every animal that comes through our doors.'
        }
      },
      successStories: {
        headerSection: {
          title: 'Success Stories',
          content: 'Read heartwarming stories from families who found their perfect companions through our rescue.'
        },
        submissionForm: {
          enabled: true,
          fields: ['firstName', 'lastName', 'email', 'petName', 'story', 'images']
        }
      },
      applications: {
        petApplication: {
          enabled: true,
          fields: ['name', 'email', 'phone', 'address', 'housingType', 'hasYard', 'otherPets', 'experience', 'references']
        },
        fosterApplication: {
          enabled: true,
          fields: ['name', 'email', 'phone', 'address', 'housingType', 'hasYard', 'otherPets', 'experience', 'availability', 'references']
        },
        volunteerApplication: {
          enabled: true,
          fields: ['name', 'email', 'phone', 'skills', 'availability', 'experience', 'references']
        }
      }
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    integrations: {
      petfinder: {
        enabled: false,
        apiKey: ''
      },
      adoptAPet: {
        enabled: false,
        apiKey: ''
      },
      fundraising: {
        bloomerang: { enabled: false, apiKey: '' },
        giveButter: { enabled: false, apiKey: '' },
        goFundMe: { enabled: false, apiKey: '' },
        donorbox: { enabled: false, apiKey: '' },
        petfundr: { enabled: false, apiKey: '' },
        cuddly: { enabled: false, apiKey: '' }
      }
    }
  });

  // Mock data for pets and success stories
  const mockPets = [
    {
      id: '1',
      name: 'Bella',
      breed: 'Golden Retriever',
      age: '3 years',
      gender: 'Female',
      status: 'available',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=face',
      location: 'Main Shelter',
      description: 'Friendly and energetic dog, great with kids.',
      published: true
    },
    {
      id: '2',
      name: 'Max',
      breed: 'German Shepherd',
      age: '5 years',
      gender: 'Male',
      status: 'adopted',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face',
      location: 'Foster Home',
      description: 'Loyal and protective, perfect for active families.',
      published: true
    },
    {
      id: '3',
      name: 'Luna',
      breed: 'Siamese Cat',
      age: '2 years',
      gender: 'Female',
      status: 'available',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop&crop=face',
      location: 'Main Shelter',
      description: 'Gentle and affectionate, loves to cuddle.',
      published: true
    }
  ];

  const mockSuccessStories = [
    {
      petName: 'Charlie',
      adopter: 'The Garcia Family',
      story: 'Charlie has brought so much joy to our family. He loves playing with our kids and has become the perfect companion.',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=face'
    }
  ];

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('contactInfo.')) {
      const contactField = field.split('.')[1];
      setConfig(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [contactField]: value
        }
      }));
    } else if (field.startsWith('socialMedia.')) {
      const socialField = field.split('.')[1];
      setConfig(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const siteUrl = `https://${config.siteName.toLowerCase().replace(/\s+/g, '-')}.barkhaus.live`;
    setConfig(prev => ({
      ...prev,
      isPublished: true,
      siteUrl
    }));
    
    setIsPublishing(false);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  const handleViewLiveSite = () => {
    // Open the live site in a new tab
    if (config.siteUrl) {
      window.open(config.siteUrl, '_blank');
    } else {
      // Show preview in current tab
      setActiveTab('preview');
    }
  };

  const openConfigModal = (section: string) => {
    setConfigSection(section);
    setShowConfigModal(true);
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'max-w-6xl mx-auto';
    }
  };

  const tabs = [
    { id: 'content', name: 'Content', icon: Settings },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'social', name: 'Social & Integrations', icon: Share2 },
    { id: 'events', name: 'Event Promotion', icon: Calendar },
    { id: 'preview', name: 'Preview', icon: Eye }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bebas uppercase text-gray-900">Live Site Builder</h1>
          <p className="text-gray-600 mt-2">Create and manage your public-facing website</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowHostingModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Cloud className="h-4 w-4" />
            <span>Hosting Info</span>
          </button>
          <button
            onClick={handleViewLiveSite}
            className="btn-secondary flex items-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Preview Site</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`btn-primary flex items-center space-x-2 ${publishSuccess ? 'bg-success-600 hover:bg-success-700' : ''}`}
          >
            {isPublishing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Publishing...</span>
              </>
            ) : publishSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Published!</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4" />
                <span>{config.isPublished ? 'Update Site' : 'Publish Site'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Card */}
      {config.isPublished && (
        <div className="card bg-success-50 border-success-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-success-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-success-800">Site is Live</p>
                <p className="text-sm text-success-600">Your public website is accessible at: {config.siteUrl}</p>
              </div>
            </div>
            <Globe className="h-8 w-8 text-success-600" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bebas uppercase text-gray-900">Site Content</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={config.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>
                    <div className="flex items-center space-x-3">
                      <img src={config.logo} alt="Logo" className="h-12 w-12 object-contain" />
                      <button className="btn-secondary flex items-center space-x-2">
                        <Upload className="h-4 w-4" />
                        <span>Upload New</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Pages</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Home Page</h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => openConfigModal('home.heroSection')}
                          className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Hero Section</span>
                            <Edit className="h-4 w-4 text-gray-400" />
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">About Us Page</h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => openConfigModal('about.aboutSection')}
                          className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">About Us Section</span>
                            <Edit className="h-4 w-4 text-gray-400" />
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Available Animals</h4>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          Automatically pulls published pets from your Pets database
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Success Stories Page</h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => openConfigModal('successStories.headerSection')}
                          className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Header Section</span>
                            <Edit className="h-4 w-4 text-gray-400" />
                          </div>
                        </button>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            Shows adopted pets and success story submissions
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Applications Page</h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => openConfigModal('applications.petApplication')}
                          className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Pet Adoption Form</span>
                            <Edit className="h-4 w-4 text-gray-400" />
                          </div>
                        </button>
                        <button
                          onClick={() => openConfigModal('applications.fosterApplication')}
                          className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Foster Application Form</span>
                            <Edit className="h-4 w-4 text-gray-400" />
                          </div>
                        </button>
                        <button
                          onClick={() => openConfigModal('applications.volunteerApplication')}
                          className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Volunteer Application Form</span>
                            <Edit className="h-4 w-4 text-gray-400" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bebas uppercase text-gray-900">Design Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Theme
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['modern', 'classic', 'warm'].map((theme) => (
                      <div
                        key={theme}
                        onClick={() => handleInputChange('theme', theme)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          config.theme === theme
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`h-16 w-full rounded mb-2 ${
                            theme === 'modern' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                            theme === 'classic' ? 'bg-gradient-to-r from-gray-700 to-gray-900' :
                            'bg-gradient-to-r from-orange-400 to-red-500'
                          }`}></div>
                          <p className="font-medium capitalize">{theme}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="h-10 w-20 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="input flex-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bebas uppercase text-gray-900">Social Media & Integrations</h2>
                
                {/* Social Media Section */}
                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Social Media</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Page URL</label>
                      <input
                        type="url"
                        value={config.socialMedia.facebook}
                        onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                        className="input"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Profile URL</label>
                      <input
                        type="url"
                        value={config.socialMedia.instagram}
                        onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                        className="input"
                        placeholder="https://instagram.com/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Profile URL</label>
                      <input
                        type="url"
                        value={config.socialMedia.twitter}
                        onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                        className="input"
                        placeholder="https://twitter.com/yourprofile"
                      />
                    </div>
                  </div>
                </div>

                {/* Pet Listing Integrations */}
                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Pet Listing Integrations</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">PetFinder</h4>
                          <p className="text-sm text-gray-600">Sync your pets to PetFinder.com</p>
                        </div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={config.integrations.petfinder.enabled}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              integrations: {
                                ...prev.integrations,
                                petfinder: { ...prev.integrations.petfinder, enabled: e.target.checked }
                              }
                            }))}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Enable</span>
                        </label>
                      </div>
                      {config.integrations.petfinder.enabled && (
                        <input
                          type="text"
                          placeholder="PetFinder API Key"
                          value={config.integrations.petfinder.apiKey}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              petfinder: { ...prev.integrations.petfinder, apiKey: e.target.value }
                            }
                          }))}
                          className="input"
                        />
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">Adopt-a-Pet</h4>
                          <p className="text-sm text-gray-600">Sync your pets to Adopt-a-Pet.com</p>
                        </div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={config.integrations.adoptAPet.enabled}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              integrations: {
                                ...prev.integrations,
                                adoptAPet: { ...prev.integrations.adoptAPet, enabled: e.target.checked }
                              }
                            }))}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Enable</span>
                        </label>
                      </div>
                      {config.integrations.adoptAPet.enabled && (
                        <input
                          type="text"
                          placeholder="Adopt-a-Pet API Key"
                          value={config.integrations.adoptAPet.apiKey}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              adoptAPet: { ...prev.integrations.adoptAPet, apiKey: e.target.value }
                            }
                          }))}
                          className="input"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Fundraising Integrations */}
                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Fundraising Platform Integrations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(config.integrations.fundraising).map(([platform, settings]) => (
                      <div key={platform} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 capitalize">{platform.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <p className="text-sm text-gray-600">Pull donation data</p>
                          </div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.enabled}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                integrations: {
                                  ...prev.integrations,
                                  fundraising: {
                                    ...prev.integrations.fundraising,
                                    [platform]: { ...settings, enabled: e.target.checked }
                                  }
                                }
                              }))}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Enable</span>
                          </label>
                        </div>
                        {settings.enabled && (
                          <input
                            type="text"
                            placeholder={`${platform} API Key`}
                            value={settings.apiKey}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              integrations: {
                                ...prev.integrations,
                                fundraising: {
                                  ...prev.integrations.fundraising,
                                  [platform]: { ...settings, apiKey: e.target.value }
                                }
                              }
                            }))}
                            className="input"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bebas uppercase text-gray-900">Event Promotion Tools</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Create & Promote Events</h3>
                      <p className="text-blue-800 text-sm">
                        Build event landing pages, generate social media assets, and track RSVPs for adoption events and fundraisers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bebas uppercase text-gray-900">Event Builder</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                      <input
                        type="text"
                        placeholder="Adoption Event at Central Park"
                        className="input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input type="date" className="input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input type="time" className="input" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        placeholder="Central Park, Main Pavilion"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        rows={3}
                        placeholder="Join us for our monthly adoption event..."
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bebas uppercase text-gray-900">Event Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Auto-Generated Landing Page</h4>
                          <p className="text-sm text-gray-600">Create a dedicated event page with RSVP form</p>
                        </div>
                        <button className="btn-primary text-sm">Create</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Social Media Assets</h4>
                          <p className="text-sm text-gray-600">Generate Instagram stories, Facebook banners</p>
                        </div>
                        <button className="btn-secondary text-sm">Generate</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">QR Code</h4>
                          <p className="text-sm text-gray-600">For flyers and posters</p>
                        </div>
                        <button className="btn-secondary text-sm">Create QR</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Email Campaign</h4>
                          <p className="text-sm text-gray-600">Send to your mailing list</p>
                        </div>
                        <button className="btn-secondary text-sm">Send</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bebas uppercase text-gray-900 mb-4">Upcoming Events</h3>
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Adoption Event at Central Park</h4>
                          <p className="text-sm text-gray-600">Saturday, Feb 10, 2024 • 10:00 AM - 4:00 PM</p>
                          <p className="text-sm text-gray-500">25 RSVPs • 12 volunteers signed up</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn-secondary text-sm">Edit</button>
                          <button className="btn-primary text-sm">View Page</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Fundraising Gala</h4>
                          <p className="text-sm text-gray-600">Saturday, Mar 15, 2024 • 6:00 PM - 11:00 PM</p>
                          <p className="text-sm text-gray-500">45 RSVPs • $2,500 raised so far</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn-secondary text-sm">Edit</button>
                          <button className="btn-primary text-sm">View Page</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bebas uppercase text-gray-900">Site Preview</h2>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-2 rounded transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <Monitor className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('tablet')}
                      className={`p-2 rounded transition-colors ${previewMode === 'tablet' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <Tablet className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-2 rounded transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className={`border-2 border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${getPreviewWidth()}`}>
                    <div className="bg-white">
                      {/* Preview Header */}
                      <div className="bg-gray-100 px-4 py-2 border-b">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                            <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                            {config.siteUrl || `${config.siteName.toLowerCase().replace(/\s+/g, '-')}.barkhaus.live`}
                          </div>
                        </div>
                      </div>
                      
                      {/* Live Site Template Preview - Increased Height */}
                      <div className="h-[600px] overflow-y-auto">
                        <LiveSiteTemplate 
                          config={config} 
                          pets={mockPets} 
                          successStories={mockSuccessStories} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hosting Information Modal */}
      {showHostingModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Live Site Hosting Strategy</h2>
              <button onClick={() => setShowHostingModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Cloud className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">How Client Sites Are Hosted</h3>
                    <p className="text-blue-800 text-sm">
                      BarkHaus provides a complete hosting solution for your rescue organization's public website.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                    <Server className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Managed Hosting</h4>
                    <p className="text-gray-600 text-sm">
                      We host your site on our secure, fast servers with automatic backups and 99.9% uptime guarantee.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Custom Domain</h4>
                    <p className="text-gray-600 text-sm">
                      Your site gets a professional URL like "yourrescue.barkhaus.live" or you can use your own domain.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                    <Code className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Template System</h4>
                    <p className="text-gray-600 text-sm">
                      Sites are built from our responsive templates and automatically updated with your pet data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Publishing Process:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Customize your site content and design in the builder</li>
                  <li>Click "Publish Site" to deploy your changes</li>
                  <li>Your site goes live instantly at your custom URL</li>
                  <li>Pet data automatically syncs from your admin dashboard</li>
                  <li>Form submissions flow directly to your Inbox</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Features Included:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                  <li>Mobile-responsive design</li>
                  <li>SEO optimization</li>
                  <li>SSL security certificate</li>
                  <li>Contact form integration</li>
                  <li>Social media integration</li>
                  <li>Analytics tracking</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={() => setShowHostingModal(false)} className="btn-primary">
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bebas uppercase text-gray-900">Configure Section</h2>
              <button onClick={() => setShowConfigModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {configSection === 'home.heroSection' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                    <input
                      type="text"
                      value={config.pages.home.heroSection.title}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        pages: {
                          ...prev.pages,
                          home: {
                            ...prev.pages.home,
                            heroSection: {
                              ...prev.pages.home.heroSection,
                              title: e.target.value
                            }
                          }
                        }
                      }))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                    <input
                      type="text"
                      value={config.pages.home.heroSection.subtitle}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        pages: {
                          ...prev.pages,
                          home: {
                            ...prev.pages.home,
                            heroSection: {
                              ...prev.pages.home.heroSection,
                              subtitle: e.target.value
                            }
                          }
                        }
                      }))}
                      className="input"
                    />
                  </div>
                </>
              )}

              {configSection === 'about.aboutSection' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                    <input
                      type="text"
                      value={config.pages.about.aboutSection.title}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        pages: {
                          ...prev.pages,
                          about: {
                            ...prev.pages.about,
                            aboutSection: {
                              ...prev.pages.about.aboutSection,
                              title: e.target.value
                            }
                          }
                        }
                      }))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      rows={4}
                      value={config.pages.about.aboutSection.content}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        pages: {
                          ...prev.pages,
                          about: {
                            ...prev.pages.about,
                            aboutSection: {
                              ...prev.pages.about.aboutSection,
                              content: e.target.value
                            }
                          }
                        }
                      }))}
                      className="input"
                    />
                  </div>
                </>
              )}

              {configSection === 'successStories.headerSection' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                    <input
                      type="text"
                      value={config.pages.successStories.headerSection.title}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        pages: {
                          ...prev.pages,
                          successStories: {
                            ...prev.pages.successStories,
                            headerSection: {
                              ...prev.pages.successStories.headerSection,
                              title: e.target.value
                            }
                          }
                        }
                      }))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Description</label>
                    <textarea
                      rows={3}
                      value={config.pages.successStories.headerSection.content}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        pages: {
                          ...prev.pages,
                          successStories: {
                            ...prev.pages.successStories,
                            headerSection: {
                              ...prev.pages.successStories.headerSection,
                              content: e.target.value
                            }
                          }
                        }
                      }))}
                      className="input"
                    />
                  </div>
                </>
              )}

              {configSection.startsWith('applications.') && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure the form fields for this application type. All submissions will be sent to your Inbox.
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Name (Required)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Email (Required)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Phone</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Address</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Experience</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">References</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowConfigModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => setShowConfigModal(false)} className="btn-primary flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSite;