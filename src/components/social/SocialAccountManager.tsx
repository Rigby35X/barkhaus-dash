import React, { useState, useEffect } from 'react';
import { X, Plus, Link, Unlink, CheckCircle, AlertCircle, Settings, Refresh, Facebook, Instagram, Twitter, Linkedin, Zap } from 'lucide-react';
import { socialMediaService, SocialMediaAccount } from '../../services/socialMediaService';
import { openaiService } from '../../services/openaiService';

interface SocialAccountManagerProps {
  onClose: () => void;
}

const SocialAccountManager: React.FC<SocialAccountManagerProps> = ({ onClose }) => {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem('openai_api_key') || '',
    facebook: localStorage.getItem('facebook_api_key') || '',
    instagram: localStorage.getItem('instagram_api_key') || '',
    twitter: localStorage.getItem('twitter_api_key') || '',
    linkedin: localStorage.getItem('linkedin_api_key') || ''
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const allAccounts = socialMediaService.getAccounts();
    setAccounts(allAccounts);
  };

  const handleConnect = async (platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin') => {
    setIsConnecting(platform);
    
    try {
      // In a real implementation, this would initiate OAuth flow
      await socialMediaService.connectAccount(platform);
      loadAccounts();
    } catch (error) {
      console.error('Failed to connect account:', error);
      alert('Failed to connect account. Please try again.');
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Are you sure you want to disconnect this account?')) return;
    
    try {
      await socialMediaService.disconnectAccount(accountId);
      loadAccounts();
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      alert('Failed to disconnect account. Please try again.');
    }
  };

  const handleSaveApiKeys = () => {
    Object.entries(apiKeys).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(`${key}_api_key`, value);
      } else {
        localStorage.removeItem(`${key}_api_key`);
      }
    });

    // Update OpenAI service with new key
    if (apiKeys.openai) {
      openaiService.updateApiKey(apiKeys.openai);
    }

    setShowApiKeyModal(false);
    setApiTestResult(null);
    alert('API keys saved successfully!');
  };

  const handleTestOpenAI = async () => {
    if (!apiKeys.openai) {
      setApiTestResult({ success: false, message: 'Please enter an OpenAI API key first' });
      return;
    }

    setIsTestingApi(true);
    setApiTestResult(null);

    try {
      // Temporarily update the service with the test key
      const originalKey = openaiService['apiKey'];
      openaiService.updateApiKey(apiKeys.openai);

      const success = await openaiService.testConnection();

      if (success) {
        setApiTestResult({ success: true, message: 'OpenAI API key is valid and working!' });
      } else {
        setApiTestResult({ success: false, message: 'OpenAI API key test failed. Please check your key.' });
        // Restore original key if test failed
        openaiService.updateApiKey(originalKey);
      }
    } catch (error) {
      console.error('API test error:', error);
      setApiTestResult({
        success: false,
        message: `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-6 w-6 text-blue-600" />;
      case 'instagram': return <Instagram className="h-6 w-6 text-pink-600" />;
      case 'twitter': return <Twitter className="h-6 w-6 text-blue-400" />;
      case 'linkedin': return <Linkedin className="h-6 w-6 text-blue-700" />;
      default: return <div className="h-6 w-6 bg-gray-400 rounded" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'border-blue-200 bg-blue-50';
      case 'instagram': return 'border-pink-200 bg-pink-50';
      case 'twitter': return 'border-blue-200 bg-blue-50';
      case 'linkedin': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const availablePlatforms = [
    { id: 'facebook', name: 'Facebook', description: 'Connect your Facebook Page' },
    { id: 'instagram', name: 'Instagram', description: 'Connect your Instagram Business account' },
    { id: 'twitter', name: 'Twitter', description: 'Connect your Twitter account' },
    { id: 'linkedin', name: 'LinkedIn', description: 'Connect your LinkedIn Page' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Social Media Accounts</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Settings className="h-4 w-4" />
              <span>API Keys</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Connected Accounts */}
          {accounts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Accounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className={`p-4 border rounded-lg ${getPlatformColor(account.platform)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getPlatformIcon(account.platform)}
                        <div>
                          <h4 className="font-medium text-gray-900">{account.accountName}</h4>
                          <p className="text-sm text-gray-600 capitalize">{account.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {account.isConnected ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <button
                          onClick={() => handleDisconnect(account.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Disconnect"
                        >
                          <Unlink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {account.lastSync && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last synced: {new Date(account.lastSync).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Platforms */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Connect New Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availablePlatforms
                .filter(platform => !accounts.some(acc => acc.platform === platform.id))
                .map((platform) => (
                  <div
                    key={platform.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getPlatformIcon(platform.id)}
                        <div>
                          <h4 className="font-medium text-gray-900">{platform.name}</h4>
                          <p className="text-sm text-gray-600">{platform.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleConnect(platform.id as any)}
                        disabled={isConnecting === platform.id}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isConnecting === platform.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Link className="h-4 w-4" />
                        )}
                        <span>{isConnecting === platform.id ? 'Connecting...' : 'Connect'}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How Social Media Integration Works</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Connect your social media accounts to publish posts directly</li>
              <li>• Schedule posts to be published automatically</li>
              <li>• Track engagement and performance metrics</li>
              <li>• Use AI to generate platform-optimized content</li>
            </ul>
            <p className="text-xs text-blue-700 mt-3">
              Note: This is a demo implementation. In production, you would need to set up OAuth flows and API integrations for each platform.
            </p>
          </div>
        </div>
      </div>

      {/* API Keys Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">API Configuration</h3>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key (Required for AI content generation)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value={apiKeys.openai}
                    onChange={(e) => {
                      setApiKeys({ ...apiKeys, openai: e.target.value });
                      setApiTestResult(null);
                    }}
                    placeholder="sk-..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleTestOpenAI}
                    disabled={isTestingApi || !apiKeys.openai}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isTestingApi ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    <span>{isTestingApi ? 'Testing...' : 'Test'}</span>
                  </button>
                </div>

                {apiTestResult && (
                  <div className={`mt-2 p-3 rounded-lg text-sm ${
                    apiTestResult.success
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {apiTestResult.success ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <span>{apiTestResult.message}</span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKeys.facebook}
                  onChange={(e) => setApiKeys({ ...apiKeys, facebook: e.target.value })}
                  placeholder="Facebook App Access Token"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKeys.instagram}
                  onChange={(e) => setApiKeys({ ...apiKeys, instagram: e.target.value })}
                  placeholder="Instagram Basic Display API Token"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKeys.twitter}
                  onChange={(e) => setApiKeys({ ...apiKeys, twitter: e.target.value })}
                  placeholder="Twitter Bearer Token"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKeys.linkedin}
                  onChange={(e) => setApiKeys({ ...apiKeys, linkedin: e.target.value })}
                  placeholder="LinkedIn Access Token"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Security Note:</strong> API keys are stored locally in your browser. 
                  For production use, implement secure server-side key management.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKeys}
                className="btn-primary"
              >
                Save API Keys
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialAccountManager;
