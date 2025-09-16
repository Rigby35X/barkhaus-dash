// src/pages/TemplatesPage.tsx
import React, { useState } from 'react';
import { templates } from '../data/templates';
import { Eye, ExternalLink, Palette } from 'lucide-react';

const TemplatesPage = () => {
  console.log('🎯 TemplatesPage component rendering...');

  // Mock data instead of Strapi
  const strapiTemplates = []
  const organizations = []
  const _loading = false
  const _error = null
  const getTemplatePreview = async () => null

  // Enhanced debug logging
  console.log('📊 Templates Debug:', {
    strapiTemplatesCount: strapiTemplates.length,
    organizationsCount: organizations.length,
    loading: _loading,
    error: _error,
    localTemplatesCount: templates.length
  });

  // Test Strapi connection directly
  const testStrapiConnection = async () => {
    try {
      console.log('🧪 Testing direct Strapi connection...');
      const response = await fetch('http://localhost:1337/api/templates');
      const data = await response.json();
      console.log('✅ Direct fetch result:', data);
    } catch (err) {
      console.error('❌ Direct fetch failed:', err);
    }
  };

  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Mock organizations for development (when Strapi isn't running)
  const mockOrganizations = [
    {
      id: 1,
      attributes: {
        name: "Happy Paws Rescue",
        slug: "happy-paws",
        primaryColor: "#2563eb",
        secondaryColor: "#3b82f6",
        accentColor: "#f59e0b",
        headingFont: "Poppins",
        bodyFont: "Inter",
        mission: "Saving lives, one paw at a time",
        about: "We are dedicated to rescuing and rehoming animals in need."
      }
    },
    {
      id: 2,
      attributes: {
        name: "Furry Friends Shelter",
        slug: "furry-friends",
        primaryColor: "#059669",
        secondaryColor: "#10b981",
        accentColor: "#f97316",
        headingFont: "Inter",
        bodyFont: "Inter",
        mission: "Finding forever homes for every animal",
        about: "A community-focused shelter providing care and love."
      }
    }
  ];

  // Always show organizations (Strapi + mock as fallback)
  const displayOrganizations = [...organizations, ...mockOrganizations];

  console.log('🔍 Organization Debug:', {
    strapiOrgsLength: organizations.length,
    mockOrgsLength: mockOrganizations.length,
    displayOrgsLength: displayOrganizations.length,
    strapiOrganizations: organizations,
    displayOrganizations: displayOrganizations
  });

  // Combine static templates with Strapi templates
  const allTemplates = [
    ...templates.map((template: any) => ({ ...template, isStrapi: false })),
    ...strapiTemplates
      .filter((template: any) => template && template.attributes) // Add safety check
      .map((template: any) => ({
        id: template.attributes.slug,
        name: template.attributes.name,
        description: template.attributes.description,
        image: template.attributes.thumbnail?.data?.attributes?.url || '/template-thumbnails/default.jpg',
        previewUrl: `/preview?template=${template.attributes.slug}`,
        isStrapi: true,
        strapiData: template
      }))
  ];

  const handlePreview = async (templateId: string) => {
    if (!selectedOrg) {
      alert('Please select an organization first');
      return;
    }

    console.log('🎬 Starting preview for:', { templateId, selectedOrg });
    setPreviewLoading(true);
    try {
      // Skip Strapi getTemplatePreview for now and create preview data directly
      let preview = null;

      // Always create preview data directly since we have the organization data
      console.log('� Creating preview data directly...');
        console.log('🔄 Creating mock preview data...');
        console.log('🔍 displayOrganizations:', displayOrganizations);
        console.log('🔍 selectedOrg:', selectedOrg);
        console.log('🔍 templateId:', templateId);

        const selectedOrgData = displayOrganizations.find((org: any) =>
          org.attributes?.slug === selectedOrg || org.slug === selectedOrg
        );
        const selectedTemplate = allTemplates.find(t => t.id === templateId);

        console.log('📊 Mock data inputs:', { selectedOrgData, selectedTemplate, selectedOrg, templateId });

        // Use direct properties if available, fallback to attributes
        const orgData = selectedOrgData?.attributes || selectedOrgData;

        preview = {
          templateName: selectedTemplate?.name || templateId,
          organizationName: (orgData as any)?.name || 'Mock Organization',
          branding: {
            primaryColor: (orgData as any)?.primaryColor || '#2563eb',
            secondaryColor: (orgData as any)?.secondaryColor || '#3b82f6',
            accentColor: (orgData as any)?.accentColor || '#f59e0b',
            headingFont: (orgData as any)?.headingFont || 'Inter',
            bodyFont: (orgData as any)?.bodyFont || 'Inter',
          },
          content: {
            siteName: (orgData as any)?.name || 'Mock Organization',
            mission: (orgData as any)?.mission || 'Our mission statement',
            about: (orgData as any)?.about || 'About our organization',
          },
          sections: []
        };

      console.log('✅ Final preview data:', preview);
      setPreviewData(preview);
    } catch (err) {
      console.error('❌ Preview error:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Website Templates</h1>
        <p className="text-gray-600 mt-2">Choose a template and see how it looks with your organization's branding.</p>

        {/* Debug Button */}
        <button
          onClick={testStrapiConnection}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded text-sm"
        >
          🧪 Test Strapi Connection
        </button>
      </div>

      {/* Organization Selector */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Select An Organization For A Preview</h2>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
            Using Mock Data
          </span>
        </div>
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 max-w-xs"
          >
            <option value="">Select an organization...</option>
            {/* Temporary hardcoded options for testing */}
            <option value="happy-paws">Happy Paws (Test)</option>
            <option value="test-org">Test Organization</option>
            {/* Original dynamic options */}
            {displayOrganizations
              .filter((org: any) => org && org.attributes) // Add safety check
              .map((org: any) => (
                <option key={org.id} value={org.attributes.slug}>
                  {org.attributes.name}
                </option>
              ))}
          </select>
          {selectedOrg && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              <Palette className="h-4 w-4 mr-1" />
              Preview Ready
            </span>
          )}
        </div>
      </div>

      {/* Error Display */}
      {_error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading templates: {_error}</p>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <div className="relative">
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              {template.isStrapi && (
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  CMS
                </span>
              )}
            </div>

            <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{template.description}</p>

            <div className="flex gap-2">
              <button
                onClick={() => handlePreview(template.id)}
                disabled={!selectedOrg || previewLoading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewLoading ? 'Loading...' : 'Live Preview'}
              </button>

              <a
                href={`/preview?template=${template.id}&org=${selectedOrg || 'happy-paws'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Modal */}
      {console.log('🎭 Modal render check:', { previewData })}
      {previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {previewData.templateName} - {previewData.organizationName}
              </h3>
              <button
                onClick={() => setPreviewData(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Preview content would go here */}
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <h4 className="text-2xl font-bold mb-4" style={{ color: previewData?.branding?.primaryColor || '#2563eb' }}>
                  {previewData?.content?.siteName || previewData?.organizationName || 'Organization'}
                </h4>
                <p className="text-gray-600 mb-4">{previewData?.content?.mission || 'Mission statement'}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Primary Color:</strong> {previewData?.branding?.primaryColor || '#2563eb'}
                  </div>
                  <div>
                    <strong>Heading Font:</strong> {previewData?.branding?.headingFont || 'Inter'}
                  </div>
                  <div>
                    <strong>Body Font:</strong> {previewData?.branding?.bodyFont || 'Inter'}
                  </div>
                  <div>
                    <strong>Sections:</strong> {previewData?.sections?.length || 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setPreviewData(null)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Template "${previewData.templateName}" selected for ${previewData.organizationName}! This would normally save the template selection to your organization settings.`);
                  setPreviewData(null);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
