// src/contexts/StrapiTemplateContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { strapiAPI, StrapiTemplate, StrapiOrganization } from '../services/strapiApi';

interface StrapiTemplateContextType {
  templates: StrapiTemplate[];
  organizations: StrapiOrganization[];
  selectedTemplate: StrapiTemplate | null;
  selectedOrganization: StrapiOrganization | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadTemplates: () => Promise<void>;
  loadOrganizations: () => Promise<void>;
  selectTemplate: (template: StrapiTemplate) => void;
  selectOrganization: (organization: StrapiOrganization) => void;
  getTemplatePreview: (templateSlug: string, organizationSlug: string) => Promise<any>;
  refreshData: () => Promise<void>;
}

const StrapiTemplateContext = createContext<StrapiTemplateContextType | undefined>(undefined);

export const StrapiTemplateProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [templates, setTemplates] = useState<StrapiTemplate[]>([]);
  const [organizations, setOrganizations] = useState<StrapiOrganization[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<StrapiTemplate | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<StrapiOrganization | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      console.log('🔄 Loading templates...');
      setLoading(true);
      setError(null);
      const templatesData = await strapiAPI.getTemplates();
      console.log('✅ Templates loaded:', templatesData);
      setTemplates(templatesData);
    } catch (err) {
      // Don't set error for connection issues - just use empty array
      console.warn('❌ Strapi not available, using fallback data:', err);
      setTemplates([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizations = async () => {
    try {
      console.log('🔄 Loading organizations...');
      setLoading(true);
      setError(null);
      const organizationsData = await strapiAPI.getOrganizations();
      console.log('✅ Organizations loaded:', organizationsData);
      setOrganizations(organizationsData);
    } catch (err) {
      // Don't set error for connection issues - just use empty array
      console.warn('❌ Strapi not available, using fallback data:', err);
      setOrganizations([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const selectTemplate = (template: StrapiTemplate) => {
    setSelectedTemplate(template);
  };

  const selectOrganization = (organization: StrapiOrganization) => {
    setSelectedOrganization(organization);
  };

  const getTemplatePreview = async (templateSlug: string, organizationSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const previewData = await strapiAPI.getTemplatePreview(templateSlug, organizationSlug);
      return previewData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
      console.error('Error generating preview:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([loadTemplates(), loadOrganizations()]);
  };

  // Load initial data
  useEffect(() => {
    console.log('🚀 StrapiTemplateProvider initializing...');
    refreshData();
  }, []);

  const value: StrapiTemplateContextType = {
    templates,
    organizations,
    selectedTemplate,
    selectedOrganization,
    loading,
    error,
    loadTemplates,
    loadOrganizations,
    selectTemplate,
    selectOrganization,
    getTemplatePreview,
    refreshData,
  };

  return (
    <StrapiTemplateContext.Provider value={value}>
      {children}
    </StrapiTemplateContext.Provider>
  );
};

export const useStrapiTemplate = (): StrapiTemplateContextType => {
  const context = useContext(StrapiTemplateContext);
  if (!context) {
    throw new Error('useStrapiTemplate must be used within StrapiTemplateProvider');
  }
  return context;
};

export default StrapiTemplateContext;
