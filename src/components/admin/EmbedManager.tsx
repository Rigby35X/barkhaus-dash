import React, { useState } from 'react';
import { createEmbedToken, generateEmbedCode } from '../../lib/embedToken';
import { useTenant } from '../../contexts/TenantContext';

interface EmbedManagerProps {
  className?: string;
}

export default function EmbedManager({ className = '' }: EmbedManagerProps) {
  const { organization } = useTenant();
  const [embedCode, setEmbedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [settings, setSettings] = useState({
    showFilters: true,
    primaryColor: '#324b65',
    ttl: 24, // hours
    species: 'all',
    baseUrl: import.meta.env.VITE_PRODUCTION_URL || window.location.origin
  });

  const generateEmbed = async () => {
    console.log('🔧 Generating embed...', { organization });

    if (!organization?.id) {
      console.error('❌ Organization not found:', organization);
      setError('Organization not found. Please make sure you are logged in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔧 Creating embed token...', {
        orgId: organization.id,
        species: settings.species,
        ttl: settings.ttl
      });

      // Create the embed token
      const token = await createEmbedToken(
        organization.id,
        organization.id, // Using org ID as tenant ID
        {
          species: settings.species !== 'all' ? [settings.species] : undefined
        },
        settings.ttl * 3600 // Convert hours to seconds
      );

      console.log('✅ Token created successfully:', token.substring(0, 20) + '...');

      // Generate the embed code
      const code = generateEmbedCode(token, {
        baseUrl: settings.baseUrl,
        showFilters: settings.showFilters,
        primaryColor: settings.primaryColor,
        width: '100%',
        height: '600'
      });

      console.log('✅ Embed code generated successfully');
      setEmbedCode(code);
    } catch (err) {
      console.error('❌ Error generating embed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate embed code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const previewUrl = embedCode ? 
    embedCode.match(/src="([^"]+)"/)?.[1] : '';

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Animal Embed Widget
        </h3>
        <p className="text-sm text-gray-600">
          Generate an embed code to display your adoptable animals on external websites.
        </p>
      </div>

      {/* Settings */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token Expires (hours)
            </label>
            <select
              value={settings.ttl}
              onChange={(e) => setSettings(prev => ({ ...prev, ttl: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 hour</option>
              <option value={6}>6 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Species Filter
            </label>
            <select
              value={settings.species}
              onChange={(e) => setSettings(prev => ({ ...prev, species: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Animals</option>
              <option value="Dog">Dogs Only</option>
              <option value="Cat">Cats Only</option>
              <option value="Other">Other Animals</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showFilters"
              checked={settings.showFilters}
              onChange={(e) => setSettings(prev => ({ ...prev, showFilters: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showFilters" className="ml-2 block text-sm text-gray-700">
              Show search filters
            </label>
          </div>
        </div>

        {/* Base URL Setting */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base URL (Production Domain)
          </label>
          <input
            type="url"
            value={settings.baseUrl}
            onChange={(e) => setSettings(prev => ({ ...prev, baseUrl: e.target.value }))}
            placeholder="https://your-domain.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            The domain where your Barkhaus dashboard is hosted. Change this for production use.
          </p>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mb-6">
        <button
          onClick={generateEmbed}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Embed Code'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Embed Code Display */}
      {embedCode && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Embed Code
              </label>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1 text-xs rounded-md ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              value={embedCode}
              readOnly
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
            />
          </div>

          {/* Preview Link */}
          {previewUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Open Preview
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Usage Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Usage Instructions</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Copy the embed code above</li>
              <li>• Paste it into any website where you want to display your animals</li>
              <li>• The widget will automatically resize to fit the content</li>
              <li>• Tokens expire after {settings.ttl} hour{settings.ttl !== 1 ? 's' : ''} for security</li>
              <li>• Generate a new embed code when the token expires</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
