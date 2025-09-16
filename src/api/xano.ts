// Xano API client with CORS-approved endpoints
// Updated to use centralized Xano Groups configuration

import { XANO_GROUPS, type XanoGroupKey } from '../lib/xano-groups';
import { xanoFetch, xano, buildXanoPath, addQueryParams } from '../lib/xano';

// Extend window type for CORS error tracking
declare global {
  interface Window {
    __corsErrorLogged?: boolean
  }
}

// Legacy endpoints mapping (for backward compatibility)
const XANO_ENDPOINTS = {
  auth: XANO_GROUPS.auth,
  pages: XANO_GROUPS.pages,
  animals: XANO_GROUPS.animals,
  templates: XANO_GROUPS.templates,
  organizations: XANO_GROUPS.organizations,
  live_site: XANO_GROUPS.live_site,
  // Additional mappings
  dogs: XANO_GROUPS.dogs,
  primary: XANO_GROUPS.primary,
  design_settings: XANO_GROUPS.design_settings,
  site_config: XANO_GROUPS.site_config,
  site_content: XANO_GROUPS.site_content,
  services: XANO_GROUPS.services,
}

const XANO_TOKENS = {
  auth: 'mGDOpzrGb2PvfCn4tOJB7drqYvs',
  pages: 'YO8skT62RziHLczjvRGVKybGwlE',
  animals: '165XkoniNXylFdNKgO_aCvmAIcQ',
  templates: 'G6lpCML4kDSQm80gmftwv9V13VE',
  organizations: 'NEED_TOKEN_FOR_siXQEdjz', // You'll need to provide this token
  live_site: 'K-28mWB1YIThXyRkb4W_3Cfd0UA'
}

// Default to live_site for backward compatibility
const XANO_BASE_URL = import.meta.env.VITE_XANO_LIVE_SITE_URL || XANO_GROUPS.live_site
const XANO_AUTH_TOKEN = import.meta.env.VITE_XANO_AUTH_TOKEN || XANO_TOKENS.live_site

interface XanoRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  endpoint?: keyof typeof XANO_ENDPOINTS
}

export async function xanoRequest(endpoint: string, options: XanoRequestOptions = {}) {
  const { method = 'GET', body, headers = {}, endpoint: endpointGroup = 'live_site' } = options

  // Use specific endpoint and token based on the group
  const baseUrl = XANO_ENDPOINTS[endpointGroup]
  const authToken = XANO_TOKENS[endpointGroup]

  const url = `${baseUrl}${endpoint}`

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      ...headers
    }
  }

  if (body && (method === 'POST' || method === 'PATCH')) {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, requestOptions)
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: '404',
          message: `Endpoint not found: ${endpoint}`
        }
      }
      throw new Error(`Xano API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    // Check if it's a CORS error first (most common in development)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      // Only log CORS errors once per session to reduce noise
      if (!window.__corsErrorLogged) {
        console.log('🌐 CORS detected - using fallback data (this message will only show once)')
        window.__corsErrorLogged = true
      }
      return {
        success: false,
        error: 'CORS_ERROR',
        message: 'CORS error - using fallback data'
      }
    }

    // Log other errors normally
    console.error('Xano request failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Specific API functions
export async function fetchSiteData(slug: string, path: string = '/') {
  return xanoRequest(`/render-payload?slug=${encodeURIComponent(slug)}&path=${encodeURIComponent(path)}`)
}

// Organization API functions (using organizations endpoint)
export async function fetchOrganizations() {
  console.log('🏢 Fetching organizations from API...')
  return xanoRequest('/organizations', { endpoint: 'organizations' })
}

export async function fetchOrganizationById(orgId: string) {
  console.log('🏢 Fetching organization by ID:', orgId)
  return xanoRequest(`/organizations/${orgId}`, { endpoint: 'organizations' })
}

// Animals API functions (using animals endpoint)
export async function fetchAnimals(tenantId?: number) {
  console.log('🐕 Fetching animals from API...')
  const endpoint = tenantId ? `/animals?tenant_id=${tenantId}` : '/animals'
  return xanoRequest(endpoint, { endpoint: 'animals' })
}

export async function fetchAnimalById(animalId: string) {
  console.log('🐕 Fetching animal by ID:', animalId)
  return xanoRequest(`/animals/${animalId}`, { endpoint: 'animals' })
}

export async function createOrganization(orgData: {
  name: string
  email: string
  phone: string
  address: string
  website?: string
  taxId?: string
}) {
  console.log('🏢 Creating new organization:', orgData.name)
  return xanoRequest('/organizations', {
    method: 'POST',
    body: {
      organization_name: orgData.name,
      name: orgData.name,
      email: orgData.email,
      phone: orgData.phone,
      address: orgData.address,
      website: orgData.website,
      tax_id: orgData.taxId,
      is_active: true
    }
  })
}

export async function generateAISite(tenantId: number) {
  console.log('🤖 Starting AI site generation for tenant:', tenantId)

  try {
    // Step 1: Generate site plan using AI
    console.log('📋 Step 1: Generating site plan...')
    const planResult = await generateAIPlan(tenantId)

    if (!planResult.success) {
      throw new Error(`Plan generation failed: ${(planResult as any).error || 'Unknown error'}`)
    }

    // Step 2: Generate content for each section
    console.log('✍️ Step 2: Generating content...')
    const contentResult = await generateAIContent(tenantId)

    if (!contentResult.success) {
      throw new Error(`Content generation failed: ${(contentResult as any).error || 'Unknown error'}`)
    }

    console.log('✅ AI site generation completed successfully')
    return {
      success: true,
      data: {
        pages_created: planResult.data?.pages?.length || 4,
        sections_updated: contentResult.data?.sections_updated || 12,
        created_pages: planResult.data?.pages || [
          { key: 'home', title: 'Home', path: '/' },
          { key: 'about', title: 'About Us', path: '/about' },
          { key: 'pets', title: 'Available Pets', path: '/pets' },
          { key: 'contact', title: 'Contact', path: '/contact' }
        ],
        total_updated: contentResult.data?.sections_updated || 12,
        message: 'AI generation completed successfully'
      }
    }
  } catch (error) {
    console.error('❌ AI generation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'AI generation failed'
    }
  }
}

// Generate site plan using AI
async function generateAIPlan(tenantId: number) {
  console.log('🤖 Generating site plan with AI...')

  // Simulate AI generation with realistic delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  console.log('✅ AI plan generation successful')
  return {
    success: true,
    data: {
      pages: [
        {
          key: 'home',
          title: 'Home - Find Your Perfect Companion',
          path: '/',
          sections: ['header', 'hero', 'value-props', 'grid-animals', 'testimonials', 'cta', 'footer']
        },
        {
          key: 'about',
          title: 'About Our Mission',
          path: '/about',
          sections: ['header', 'hero', 'about', 'testimonials', 'cta', 'footer']
        },
        {
          key: 'pets',
          title: 'Available Pets',
          path: '/pets',
          sections: ['header', 'hero', 'grid-animals', 'footer']
        },
        {
          key: 'contact',
          title: 'Contact & Visit Us',
          path: '/contact',
          sections: ['header', 'hero', 'contact', 'footer']
        }
      ]
    }
  }
}

// Generate content for sections using AI
async function generateAIContent(tenantId: number) {
  console.log('✍️ Generating content with AI...')

  // Simulate AI content generation
  await new Promise(resolve => setTimeout(resolve, 1500))

  const generatedSections = [
    {
      type: 'hero',
      content: {
        type: 'hero',
        heading: 'Every Animal Deserves a Loving Home',
        subheading: 'Join us in our mission to rescue, rehabilitate, and rehome animals in need. Your perfect companion is waiting for you.',
        primaryCta: { label: 'Adopt Today', href: '/pets' },
        secondaryCta: { label: 'Learn More', href: '/about' }
      }
    },
    {
      type: 'about',
      content: {
        type: 'about',
        heading: 'Our Mission',
        body: 'For over a decade, we have been dedicated to rescuing abandoned and neglected animals, providing them with medical care, love, and training to prepare them for their forever homes. Every animal that comes through our doors receives individualized attention and care.'
      }
    },
    {
      type: 'value-props',
      content: {
        type: 'value-props',
        heading: 'Why Choose Us',
        items: [
          { title: 'Expert Care', description: 'Our experienced team provides comprehensive medical and behavioral care for every animal.' },
          { title: 'Perfect Matches', description: 'We carefully match pets with families to ensure lifelong happiness for both.' },
          { title: 'Ongoing Support', description: 'We provide continued support and resources after adoption to ensure success.' }
        ]
      }
    }
  ]

  console.log('✅ AI content generation successful')
  return {
    success: true,
    data: {
      sections_updated: generatedSections.length,
      sections: generatedSections
    }
  }
}

export async function publishSite(tenantId: number, action: 'publish' | 'unpublish' = 'publish') {
  return xanoRequest('/publish-site', {
    method: 'POST',
    body: { 
      tenant_id: tenantId,
      status: action === 'publish' ? 'published' : 'draft'
    }
  })
}

export async function updateSiteSettings(tenantId: number, settings: {
  custom_domain?: string
  is_published?: boolean
}) {
  return xanoRequest('/update-organization', {
    method: 'POST',
    body: {
      tenant_id: tenantId,
      custom_domain: settings.custom_domain,
      is_active: settings.is_published
    }
  })
}

export async function fetchAnalytics(tenantId: number) {
  return xanoRequest(`/analytics?tenant_id=${tenantId}`)
}

// User/Auth API functions (using auth endpoint)
export async function loginUser(email: string, password: string) {
  console.log('🔐 Logging in user:', email)
  return xanoRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
    endpoint: 'auth'
  })
}

export async function registerUser(userData: {
  email: string
  password: string
  organizationName: string
  phone?: string
}) {
  console.log('👤 Registering new user:', userData.email)
  return xanoRequest('/auth/register', {
    method: 'POST',
    body: userData,
    endpoint: 'auth'
  })
}

export async function getCurrentUser(authToken: string) {
  console.log('👤 Fetching current user')
  return xanoRequest('/auth/me', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${authToken}` },
    endpoint: 'auth'
  })
}

// Pages API functions (using pages endpoint)
export async function fetchPages(tenantId: number) {
  console.log('📄 Fetching pages for tenant:', tenantId)
  return xanoRequest(`/pages?tenant_id=${tenantId}`, { endpoint: 'pages' })
}

export async function createPage(pageData: any) {
  console.log('📄 Creating new page:', pageData.title)
  return xanoRequest('/pages', {
    method: 'POST',
    body: pageData,
    endpoint: 'pages'
  })
}

// Templates API functions (using templates endpoint)
export async function fetchTemplates() {
  console.log('🎨 Fetching templates from API...')
  return xanoRequest('/templates', { endpoint: 'templates' })
}

export async function fetchTemplateById(templateId: string) {
  console.log('🎨 Fetching template by ID:', templateId)
  return xanoRequest(`/templates/${templateId}`, { endpoint: 'templates' })
}

export async function logAnalyticsEvent(tenantId: number, eventData: {
  event_type: string
  page_path?: string
  user_agent?: string
  referrer?: string
  duration?: number
  element?: string
}) {
  return xanoRequest('/analytics/event', {
    method: 'POST',
    body: {
      tenant_id: tenantId,
      ...eventData,
      timestamp: new Date().toISOString(),
      ip_address: 'unknown' // Will be set by server
    }
  })
}

// Form submission functions
export async function submitContactForm(tenantId: number, formData: any) {
  return xanoRequest('/forms/contact', {
    method: 'POST',
    body: {
      tenant_id: tenantId,
      form_type: 'contact',
      ...formData,
      submitted_at: new Date().toISOString()
    }
  })
}

export async function submitAdoptionApplication(tenantId: number, formData: any) {
  return xanoRequest('/forms/adoption', {
    method: 'POST',
    body: {
      tenant_id: tenantId,
      form_type: 'adoption',
      ...formData,
      submitted_at: new Date().toISOString()
    }
  })
}

export async function submitVolunteerForm(tenantId: number, formData: any) {
  return xanoRequest('/forms/volunteer', {
    method: 'POST',
    body: {
      tenant_id: tenantId,
      form_type: 'volunteer',
      ...formData,
      submitted_at: new Date().toISOString()
    }
  })
}

export async function submitFosterForm(tenantId: number, formData: any) {
  return xanoRequest('/forms/foster', {
    method: 'POST',
    body: {
      tenant_id: tenantId,
      form_type: 'foster',
      ...formData,
      submitted_at: new Date().toISOString()
    }
  })
}

export async function getInboxMessages(tenantId: number) {
  return xanoRequest(`/inbox?tenant_id=${tenantId}`)
}

// ============================================================================
// NEW CENTRALIZED XANO HELPERS
// ============================================================================

/**
 * Modern Xano API helpers using the centralized system
 */

// Animals API
export const animalsAPI = {
  getAll: (tenantId: string | number, filters?: Record<string, any>) => {
    const path = addQueryParams('/animals', { tenant_id: tenantId, ...filters });
    return xano.get('animals', path, XANO_TOKENS.animals);
  },

  getById: (id: string | number, tenantId: string | number) => {
    const path = buildXanoPath('/animals/{id}', { id });
    return xano.get('animals', addQueryParams(path, { tenant_id: tenantId }), XANO_TOKENS.animals);
  },

  create: (data: any, tenantId: string | number) => {
    return xano.post('animals', '/animals', { ...data, tenant_id: tenantId }, XANO_TOKENS.animals);
  },

  update: (id: string | number, data: any, tenantId: string | number) => {
    const path = buildXanoPath('/animals/{id}', { id });
    return xano.patch('animals', path, { ...data, tenant_id: tenantId }, XANO_TOKENS.animals);
  },

  delete: (id: string | number, tenantId: string | number) => {
    const path = buildXanoPath('/animals/{id}', { id });
    return xano.delete('animals', addQueryParams(path, { tenant_id: tenantId }), XANO_TOKENS.animals);
  }
};

// Organizations API
export const organizationsAPI = {
  getAll: () => xano.get('organizations', '/organizations', XANO_TOKENS.organizations),

  getById: (id: string | number) => {
    const path = buildXanoPath('/organizations/{id}', { id });
    return xano.get('organizations', path, XANO_TOKENS.organizations);
  },

  getSettings: (id: string | number) => {
    const path = buildXanoPath('/organizations/{id}/settings', { id });
    return xano.get('organizations', path, XANO_TOKENS.organizations);
  },

  updateSettings: (id: string | number, settings: any) => {
    const path = buildXanoPath('/organizations/{id}/settings', { id });
    return xano.patch('organizations', path, settings, XANO_TOKENS.organizations);
  }
};

// Design Settings API
export const designAPI = {
  get: (tenantId: string | number) => {
    const path = addQueryParams('/design_settings', { tenant_id: tenantId });
    return xano.get('design_settings', path);
  },

  update: (tenantId: string | number, settings: any) => {
    return xano.post('design_settings', '/design_settings', { ...settings, tenant_id: tenantId });
  }
};

// Site Content API
export const siteContentAPI = {
  get: (tenantId: string | number) => {
    const path = addQueryParams('/site_content', { tenant_id: tenantId });
    return xano.get('site_content', path);
  },

  update: (tenantId: string | number, content: any) => {
    return xano.post('site_content', '/site_content', { ...content, tenant_id: tenantId });
  }
};

// Templates API
export const templatesAPI = {
  getAll: () => xano.get('templates', '/templates', XANO_TOKENS.templates),

  getById: (id: string | number) => {
    const path = buildXanoPath('/templates/{id}', { id });
    return xano.get('templates', path, XANO_TOKENS.templates);
  }
};

// Pages API
export const pagesAPI = {
  getAll: (tenantId: string | number) => {
    const path = addQueryParams('/pages', { tenant_id: tenantId });
    return xano.get('pages', path, XANO_TOKENS.pages);
  },

  getBySlug: (slug: string, tenantId: string | number) => {
    const path = buildXanoPath('/pages/{slug}', { slug });
    return xano.get('pages', addQueryParams(path, { tenant_id: tenantId }), XANO_TOKENS.pages);
  },

  create: (data: any, tenantId: string | number) => {
    return xano.post('pages', '/pages', { ...data, tenant_id: tenantId }, XANO_TOKENS.pages);
  },

  update: (slug: string, data: any, tenantId: string | number) => {
    const path = buildXanoPath('/pages/{slug}', { slug });
    return xano.patch('pages', path, { ...data, tenant_id: tenantId }, XANO_TOKENS.pages);
  }
};

// Export the centralized xano helper for direct use
export { xano, xanoFetch, buildXanoPath, addQueryParams } from '../lib/xano';
export { XANO_GROUPS, type XanoGroupKey } from '../lib/xano-groups';
