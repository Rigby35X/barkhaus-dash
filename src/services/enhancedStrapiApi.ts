// Enhanced Strapi API for Complete Template System
import { createApiClient } from '../utils/apiClient';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN;

console.log('🔧 Enhanced Strapi Configuration:', {
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

// Enhanced Types for Complete Template System
export interface StrapiOrganization {
  id: number;
  documentId: string;
  attributes: {
    name: string;
    slug: string;
    domain?: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    heading_font: string;
    body_font: string;
    mission?: string;
    about?: string;
    custom_css?: string;
    contact_info?: {
      email?: string;
      phone?: string;
      address?: string;
    };
    social_media?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
    brand_settings?: any;
    logo?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    favicon?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    is_active: boolean;
    active_template?: {
      data?: StrapiTemplate;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface StrapiTemplate {
  id: number;
  documentId: string;
  attributes: {
    name: string;
    slug: string;
    description?: string;
    category: 'modern' | 'classic' | 'minimal' | 'creative' | 'business' | 'nonprofit' | 'portfolio';
    demo_url?: string;
    version?: string;
    price?: number;
    sort_order?: number;
    is_active?: boolean;
    is_premium?: boolean;
    is_featured?: boolean;
    preview_image?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    thumbnail?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    configuration?: any;
    tags?: string[];
    responsive_breakpoints?: any;
    color_schemes?: any;
    sections?: {
      data: StrapiSection[];
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface StrapiSection {
  id: number;
  documentId: string;
  attributes: {
    name: string;
    type: 'hero' | 'about' | 'services' | 'contact' | 'gallery' | 'testimonials' | 'team' | 'pricing' | 'blog' | 'footer' | 'header' | 'cta' | 'features' | 'stats' | 'faq';
    css_classes?: string;
    component_name?: string;
    custom_css?: string;
    order: number;
    is_active: boolean;
    is_required: boolean;
    is_customizable: boolean;
    default_content?: any;
    settings?: any;
    animation?: any;
    schema?: any;
    template?: {
      data?: StrapiTemplate;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface StrapiPage {
  id: number;
  documentId: string;
  attributes: {
    title: string;
    slug: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    is_home: boolean;
    is_published: boolean;
    show_in_nav: boolean;
    nav_order: number;
    content?: any;
    custom_sections?: any;
    page_settings?: any;
    organization?: {
      data?: StrapiOrganization;
    };
    template?: {
      data?: StrapiTemplate;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface StrapiSectionContent {
  id: number;
  documentId: string;
  attributes: {
    section_id: string;
    organization_slug: string;
    page_slug: string;
    last_modified_by?: string;
    version: number;
    is_published: boolean;
    scheduled_publish?: string;
    content: any;
    metadata?: any;
    organization?: {
      data?: StrapiOrganization;
    };
    section?: {
      data?: StrapiSection;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface StrapiAsset {
  id: number;
  documentId: string;
  attributes: {
    name: string;
    description?: string;
    category: 'image' | 'video' | 'document' | 'audio' | 'icon' | 'logo' | 'background' | 'hero';
    alt_text?: string;
    usage_count: number;
    file_size?: number;
    is_public: boolean;
    is_optimized: boolean;
    file?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
          mime: string;
          size: number;
        };
      };
    };
    tags?: string[];
    dimensions?: {
      width?: number;
      height?: number;
    };
    optimization_settings?: any;
    organization?: {
      data?: StrapiOrganization;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// Enhanced API Service Class
class EnhancedStrapiAPI {
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

  async getOrganization(slug: string): Promise<StrapiOrganization | null> {
    try {
      const response = await strapiClient.get(`/api/organizations?filters[slug][$eq]=${slug}&populate=*`);
      return response.data?.[0] || null;
    } catch (error) {
      console.error('❌ Error fetching organization:', error);
      return null;
    }
  }

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

  async getTemplate(slug: string): Promise<StrapiTemplate | null> {
    try {
      const response = await strapiClient.get(`/api/templates?filters[slug][$eq]=${slug}&populate=*`);
      return response.data?.[0] || null;
    } catch (error) {
      console.error('❌ Error fetching template:', error);
      return null;
    }
  }

  // Sections
  async getSections(templateSlug?: string): Promise<StrapiSection[]> {
    try {
      let url = '/api/sections?populate=*&sort=order:asc';
      if (templateSlug) {
        url += `&filters[template][slug][$eq]=${templateSlug}`;
      }
      const response = await strapiClient.get(url);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error fetching sections:', error);
      return [];
    }
  }

  // Section Content
  async getSectionContent(organizationSlug: string, pageSlug: string = 'home'): Promise<StrapiSectionContent[]> {
    try {
      const response = await strapiClient.get(
        `/api/section-contents?filters[organization_slug][$eq]=${organizationSlug}&filters[page_slug][$eq]=${pageSlug}&populate=*`
      );
      return response.data || [];
    } catch (error) {
      console.error('❌ Error fetching section content:', error);
      return [];
    }
  }

  async updateSectionContent(
    organizationSlug: string, 
    sectionId: string, 
    content: any, 
    pageSlug: string = 'home'
  ): Promise<StrapiSectionContent | null> {
    try {
      // First, try to find existing content
      const existing = await strapiClient.get(
        `/api/section-contents?filters[organization_slug][$eq]=${organizationSlug}&filters[section_id][$eq]=${sectionId}&filters[page_slug][$eq]=${pageSlug}`
      );

      const data = {
        section_id: sectionId,
        organization_slug: organizationSlug,
        page_slug: pageSlug,
        content,
        is_published: true,
        version: (existing.data?.[0]?.attributes?.version || 0) + 1
      };

      if (existing.data?.[0]) {
        // Update existing
        const response = await strapiClient.put(`/api/section-contents/${existing.data[0].id}`, { data });
        return response.data;
      } else {
        // Create new
        const response = await strapiClient.post('/api/section-contents', { data });
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error updating section content:', error);
      return null;
    }
  }

  // Template Preview Generation
  async getTemplatePreview(templateSlug: string, organizationSlug: string): Promise<any> {
    try {
      console.log('🎨 Generating template preview:', { templateSlug, organizationSlug });
      
      // Get organization data
      const organization = await this.getOrganization(organizationSlug);
      if (!organization) {
        throw new Error('Organization not found');
      }

      // Get template data
      const template = await this.getTemplate(templateSlug);
      if (!template) {
        throw new Error('Template not found');
      }

      // Get sections for this template
      const sections = await this.getSections(templateSlug);

      // Get customized content for this organization
      const sectionContent = await this.getSectionContent(organizationSlug);

      return {
        organization: organization.attributes,
        template: template.attributes,
        sections: sections.map(section => ({
          ...section.attributes,
          customContent: sectionContent.find(
            content => content.attributes.section_id === section.id.toString()
          )?.attributes.content
        }))
      };
    } catch (error) {
      console.error('❌ Error generating template preview:', error);
      return null;
    }
  }
}

// Export singleton instance
export const enhancedStrapiAPI = new EnhancedStrapiAPI();
export default enhancedStrapiAPI;
