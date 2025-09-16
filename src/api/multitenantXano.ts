// Multitenant-aware Xano API client
import { useMultitenancy } from '../contexts/MultitenancyContext';

// Environment configuration
const XANO_ENDPOINTS = {
  auth: import.meta.env.VITE_XANO_AUTH_URL,
  pages: import.meta.env.VITE_XANO_PAGES_URL,
  animals: import.meta.env.VITE_XANO_ANIMALS_URL,
  templates: import.meta.env.VITE_XANO_TEMPLATES_URL,
  organizations: import.meta.env.VITE_XANO_ORGANIZATIONS_URL,
  live_site: import.meta.env.VITE_XANO_LIVE_SITE_URL
};

const XANO_TOKENS = {
  auth: import.meta.env.VITE_XANO_AUTH_TOKEN,
  pages: import.meta.env.VITE_XANO_PAGES_TOKEN,
  animals: import.meta.env.VITE_XANO_ANIMALS_TOKEN,
  templates: import.meta.env.VITE_XANO_TEMPLATES_TOKEN,
  organizations: import.meta.env.VITE_XANO_ORGANIZATIONS_TOKEN,
  live_site: import.meta.env.VITE_XANO_LIVE_SITE_TOKEN
};

// Tenant-aware request function
export async function multitenantXanoRequest(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: any;
    apiType: keyof typeof XANO_ENDPOINTS;
    tenantId?: string;
    requiresTenant?: boolean;
  }
) {
  const { method = 'GET', body, apiType, tenantId, requiresTenant = true } = options;

  // Get base URL and token for the API type
  const baseUrl = XANO_ENDPOINTS[apiType];
  const token = XANO_TOKENS[apiType];

  if (!baseUrl) {
    throw new Error(`No URL configured for API type: ${apiType}`);
  }

  if (!token) {
    console.warn(`No token configured for API type: ${apiType}`);
  }

  // Build URL with tenant context
  let url = `${baseUrl}${endpoint}`;
  
  // Add tenant_id parameter if required and available
  if (requiresTenant && tenantId) {
    const separator = url.includes('?') ? '&' : '?';
    url += `${separator}tenant_id=${tenantId}`;
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  if (body && (method === 'POST' || method === 'PATCH')) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    console.log(`🌐 Multitenant API Request: ${method} ${url}`);
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: '404',
          message: `Endpoint not found: ${endpoint}`
        };
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    // Handle CORS errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        success: false,
        error: 'CORS_ERROR',
        message: 'CORS error - using fallback data'
      };
    }

    console.error('Multitenant API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Tenant-aware API functions
export class MultitenantAPI {
  constructor(private tenantId: string) {}

  // Organizations
  async getOrganizations() {
    return multitenantXanoRequest('/organizations', {
      apiType: 'organizations',
      tenantId: this.tenantId,
      requiresTenant: false
    });
  }

  async getOrganization(orgId?: string) {
    const id = orgId || this.tenantId;
    return multitenantXanoRequest(`/organizations/${id}`, {
      apiType: 'organizations',
      tenantId: this.tenantId,
      requiresTenant: false
    });
  }

  // Animals
  async getAnimals() {
    return multitenantXanoRequest('/animals', {
      apiType: 'animals',
      tenantId: this.tenantId
    });
  }

  async getAnimal(animalId: string) {
    return multitenantXanoRequest(`/animals/${animalId}`, {
      apiType: 'animals',
      tenantId: this.tenantId
    });
  }

  async createAnimal(animalData: any) {
    return multitenantXanoRequest('/animals', {
      method: 'POST',
      body: { ...animalData, tenant_id: this.tenantId },
      apiType: 'animals',
      tenantId: this.tenantId
    });
  }

  // Pages
  async getPages() {
    return multitenantXanoRequest('/pages', {
      apiType: 'pages',
      tenantId: this.tenantId
    });
  }

  async getPage(pageId: string) {
    return multitenantXanoRequest(`/pages/${pageId}`, {
      apiType: 'pages',
      tenantId: this.tenantId
    });
  }

  async createPage(pageData: any) {
    return multitenantXanoRequest('/pages', {
      method: 'POST',
      body: { ...pageData, tenant_id: this.tenantId },
      apiType: 'pages',
      tenantId: this.tenantId
    });
  }

  // Templates
  async getTemplates() {
    return multitenantXanoRequest('/templates', {
      apiType: 'templates',
      tenantId: this.tenantId,
      requiresTenant: false // Templates might be global
    });
  }

  // Site data
  async getSiteData(slug: string, path: string = '/') {
    return multitenantXanoRequest(`/render-payload?slug=${slug}&path=${path}`, {
      apiType: 'live_site',
      tenantId: this.tenantId
    });
  }

  // Analytics
  async getAnalytics() {
    return multitenantXanoRequest('/analytics', {
      apiType: 'live_site',
      tenantId: this.tenantId
    });
  }

  // Site settings
  async updateSiteSettings(settings: any) {
    return multitenantXanoRequest('/site-settings', {
      method: 'PATCH',
      body: { ...settings, tenant_id: this.tenantId },
      apiType: 'live_site',
      tenantId: this.tenantId
    });
  }
}

// Hook to get tenant-aware API client
export function useMultitenantAPI() {
  const { tenantId } = useMultitenancy();
  
  if (!tenantId) {
    throw new Error('No tenant context available');
  }

  return new MultitenantAPI(tenantId);
}

// Fallback API for when no tenant context is available
export function createMultitenantAPI(tenantId: string) {
  return new MultitenantAPI(tenantId);
}

export default MultitenantAPI;
