// src/services/strapiApi.ts
// Strapi CMS integration for template content management

import { createApiClient } from '../utils/apiClient';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN;

console.log('🔧 Strapi Configuration:', {
  url: STRAPI_URL,
  hasToken: !!STRAPI_TOKEN,
  tokenLength: STRAPI_TOKEN?.length || 0
});

const strapiClient = createApiClient(STRAPI_URL);

// Add authorization header if token is available
if (STRAPI_TOKEN) {
  strapiClient['defaultHeaders'] = {
    ...strapiClient['defaultHeaders'],
    'Authorization': `Bearer ${STRAPI_TOKEN}`
  };
}

// Types for Strapi content
export interface StrapiTemplate {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description: string;
    thumbnail?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        }
      }
    };
    sections: StrapiSection[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiSection {
  id: number;
  attributes: {
    name: string;
    type: 'hero' | 'about' | 'services' | 'gallery' | 'footer' | 'custom';
    content: any; // JSON content
    order: number;
    isVisible: boolean;
  };
}

export interface StrapiOrganization {
  id: number;
  attributes: {
    name: string;
    slug: string;
    logo?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        }
      }
    };
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headingFont: string;
    bodyFont: string;
    mission: string;
    about: string;
    contactInfo: {
      email?: string;
      phone?: string;
      address?: string;
    };
    socialMedia: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
}

class StrapiAPI {
  // Templates
  async getTemplates(): Promise<StrapiTemplate[]> {
    try {
      console.log('🔍 Fetching templates from:', `${STRAPI_URL}/api/templates?populate=*`);
      const response = await strapiClient.get('/api/templates?populate=*');
      console.log('✅ Templates response:', response);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error fetching templates:', error);
      return [];
    }
  }

  async getTemplate(id: string): Promise<StrapiTemplate | null> {
    try {
      const response = await strapiClient.get(`/api/templates/${id}?populate=*`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching template:', error);
      return null;
    }
  }

  async getTemplateBySlug(slug: string): Promise<StrapiTemplate | null> {
    try {
      const response = await strapiClient.get(`/api/templates?filters[slug][$eq]=${slug}&populate=*`);
      return response.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching template by slug:', error);
      return null;
    }
  }

  // Organizations
  async getOrganizations(): Promise<StrapiOrganization[]> {
    try {
      console.log('🔍 Fetching organizations from:', `${STRAPI_URL}/api/organizations?populate=*`);
      const response = await strapiClient.get('/api/organizations?populate=*');
      console.log('✅ Organizations response:', response);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error fetching organizations:', error);
      return [];
    }
  }

  async getOrganization(id: string): Promise<StrapiOrganization | null> {
    try {
      const response = await strapiClient.get(`/api/organizations/${id}?populate=*`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching organization:', error);
      return null;
    }
  }

  async getOrganizationBySlug(slug: string): Promise<StrapiOrganization | null> {
    try {
      const response = await strapiClient.get(`/api/organizations?filters[slug][$eq]=${slug}&populate=*`);
      return response.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching organization by slug:', error);
      return null;
    }
  }

  // Template Sections
  async getTemplateSections(templateId: string): Promise<StrapiSection[]> {
    try {
      const response = await strapiClient.get(`/api/sections?filters[template][id][$eq]=${templateId}&sort=order:asc`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching template sections:', error);
      return [];
    }
  }

  // Create/Update methods
  async createTemplate(data: Partial<StrapiTemplate['attributes']>): Promise<StrapiTemplate | null> {
    try {
      const response = await strapiClient.post('/api/templates', { data });
      return response.data || null;
    } catch (error) {
      console.error('Error creating template:', error);
      return null;
    }
  }

  async updateTemplate(id: string, data: Partial<StrapiTemplate['attributes']>): Promise<StrapiTemplate | null> {
    try {
      const response = await strapiClient.put(`/api/templates/${id}`, { data });
      return response.data || null;
    } catch (error) {
      console.error('Error updating template:', error);
      return null;
    }
  }

  async updateOrganization(id: string, data: Partial<StrapiOrganization['attributes']>): Promise<StrapiOrganization | null> {
    try {
      const response = await strapiClient.put(`/api/organizations/${id}`, { data });
      return response.data || null;
    } catch (error) {
      console.error('Error updating organization:', error);
      return null;
    }
  }

  // Utility methods
  getImageUrl(imageData: any): string {
    if (!imageData?.data?.attributes?.url) return '';
    const url = imageData.data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  // Preview template with organization data
  async getTemplatePreview(templateSlug: string, organizationSlug: string) {
    try {
      const [template, organization] = await Promise.all([
        this.getTemplateBySlug(templateSlug),
        this.getOrganizationBySlug(organizationSlug)
      ]);

      return {
        template,
        organization,
        previewData: this.mergeTemplateWithOrganization(template, organization)
      };
    } catch (error) {
      console.error('Error generating template preview:', error);
      return null;
    }
  }

  private mergeTemplateWithOrganization(template: StrapiTemplate | null, organization: StrapiOrganization | null) {
    if (!template || !organization) return null;

    return {
      templateName: template.attributes.name,
      organizationName: organization.attributes.name,
      branding: {
        logo: this.getImageUrl(organization.attributes.logo),
        primaryColor: organization.attributes.primaryColor,
        secondaryColor: organization.attributes.secondaryColor,
        accentColor: organization.attributes.accentColor,
        headingFont: organization.attributes.headingFont,
        bodyFont: organization.attributes.bodyFont,
      },
      content: {
        siteName: organization.attributes.name,
        mission: organization.attributes.mission,
        about: organization.attributes.about,
        contactInfo: organization.attributes.contactInfo,
        socialMedia: organization.attributes.socialMedia,
      },
      sections: template.attributes.sections
    };
  }
}

export const strapiAPI = new StrapiAPI();
export default strapiAPI;
