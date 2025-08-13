// src/services/xanoApi.ts

// const XANO_BASE_URL = import.meta.env.VITE_XANO_BASE_URL || "https://x8ki-letl-twmt.n7.xano.io/api:wPrzs4Mr"
const XANO_AUTH_URL = import.meta.env.VITE_XANO_AUTH_URL || "https://x8ki-letl-twmt.n7.xano.io/api:XqEb_TVK"
const XANO_ANIMALS_URL = import.meta.env.VITE_XANO_ANIMALS_URL || "https://x8ki-letl-twmt.n7.xano.io/api:Od874PbA"
const XANO_DESIGN_URL = import.meta.env.VITE_XANO_DESIGN_URL || "https://x8ki-letl-twmt.n7.xano.io/api:0BQDG239"
const XANO_SITE_CONTENT_URL = import.meta.env.VITE_XANO_SITE_CONTENT_URL || "https://x8ki-letl-twmt.n7.xano.io/api:GMSb9gZv"
const XANO_PAGES_URL = import.meta.env.VITE_XANO_PAGES_URL || "https://x8ki-letl-twmt.n7.xano.io/api:mlssTgVM"
const XANO_SERVICES_URL = import.meta.env.VITE_XANO_SERVICES_URL || "https://x8ki-letl-twmt.n7.xano.io/api:kPow7KJL"

// — TYPES —

export interface Animal {
  id: number;
  tenant_id: number;
  name: string;
  species: 'Dog' | 'Cat' | 'Other';
  breed?: string;
  age?: string;
  gender?: 'Male' | 'Female';
  size?: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  status: 'Available' | 'Pending' | 'Adopted' | 'Foster' | 'Hold' | 'Not Available';
  image_url?: string;
  images?: ImageData[] | string;
  description?: string;
  medical_notes?: string;
  weight?: string;
  is_vaccinated?: boolean;
  is_spayed_neutered?: boolean;
  is_house_trained?: boolean;
  good_with_kids?: boolean;
  good_with_dogs?: boolean;
  good_with_cats?: boolean;
  energy_level?: 'Low' | 'Medium' | 'High';
  special_needs?: string;
  adoption_fee?: number;
  is_featured?: boolean;
  location?: string;
  created_at: string;
  updated_at?: string;
}

export interface ImageData {
  url: string;
  alt?: string;
}

export interface Page {
  id: number | null;
  tenant_id: number;
  slug: string;
  title: string;
  content_json: string;
  created_at?: string;
  updated_at?: string;
}

export interface SiteContent {
  id?: number;
  tenant_id: number;
  site_name: string;
  tagline?: string;
  mission_statement?: string;
  email?: string;
  phone?: string;
  address?: string;
  hours_json?: string;
  hours?: Record<string, string>;
  social_facebook?: string;
  social_instagram?: string;
  social_twitter?: string;
  social_linkedin?: string;
  ein_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DesignSettings {
  id?: number;
  tenantSlug?: string;
  liveSite?: number;
  templateName?: string;
  tenant_id?: number;
  template_name?: string;
  headingFont?: string;
  bodyFont?: string;
  heading_font_family?: string;
  body_font_family?: string;
  google_heading_font_link?: string;
  google_body_font_link?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  fontColor?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  font_color?: string;
  border_radius?: string;
  shadow_style?: string;
  enabled_sections?: string[] | string;
  created_at?: string;
  updated_at?: string;
}

export interface LiveSiteConfig {
  id?: number;
  tenant_id: number;
  site_name?: string;
  site_url?: string;
  logo_url?: string;
  about_us?: string;
  mission_statement?: string;
  contact_info?: {
    address?: string;
    phone?: string;
    email?: string;
    hours?: string;
  };
  ein_number?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  domain?: string;
  subdomain?: string;
  is_published?: boolean;
  seo_title?: string;
  seo_description?: string;
  favicon_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id?: number;
  tenant_id: number;
  title: string;
  description: string;
  icon?: string;
  is_active: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  authToken: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    organization_id: number;
    role: string;
  };
}

export interface AnimalSearchParams {
  species?: string;
  size?: string;
  age?: string;
  good_with_kids?: boolean;
  good_with_dogs?: boolean;
  good_with_cats?: boolean;
  energy_level?: string;
  search_text?: string;
  status?: string;
  is_featured?: boolean;
  limit?: number;
}

// — HELPERS —

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem("xano_auth_token");
  const hdrs: Record<string,string> = { "Content-Type": "application/json" };
  if (token) hdrs.Authorization = `Bearer ${token}`;
  return hdrs;
}

function parseJSON<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

function processAnimal(animal: any): Animal {
  return {
    ...animal,
    images: parseJSON(animal.images, []),
    image_url: animal.image_url || animal.images?.[0]?.url || '/placeholder-dog.jpg'
  };
}

function generateGoogleFontLink(fontFamily?: string): string {
  if (!fontFamily) return '';
  const encodedFont = encodeURIComponent(fontFamily.replace(/ /g, '+'));
  return `https://fonts.googleapis.com/css2?family=${encodedFont}:wght@300;400;500;600;700&display=swap`;
}

// — API OBJECT —

export const xanoAPI = {
  // Current tenant ID (you'll want to make this dynamic)
  tenantId: 1,

  setTenantId(tenantId: number): void {
    this.tenantId = tenantId;
  },

  // ===== AUTH =====
  async signup(email: string, password: string, firstName: string, lastName: string, organizationName: string): Promise<AuthResponse> {
    const res = await fetch(`${XANO_AUTH_URL}/auth/signup`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName, organization_name: organizationName })
    });
    if (!res.ok) throw new Error("Signup failed");
    const data = await res.json() as AuthResponse;
    localStorage.setItem("xano_auth_token", data.authToken);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${XANO_AUTH_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json() as AuthResponse;
    localStorage.setItem("xano_auth_token", data.authToken);
    return data;
  },

  async getMe(): Promise<AuthResponse["user"]> {
    const res = await fetch(`${XANO_AUTH_URL}/auth/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Not authorized");
    return res.json();
  },

  logout(): void {
    localStorage.removeItem("xano_auth_token");
  },

  // ===== ANIMALS =====
  async getAnimals(filters: AnimalSearchParams = {}): Promise<Animal[]> {
    const params = new URLSearchParams({
      tenant_id: this.tenantId.toString(),
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, value?.toString() || ''])
      )
    });

    const res = await fetch(`${XANO_ANIMALS_URL}/animals?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch animals");
    
    const animals = await res.json();
    return Array.isArray(animals) ? animals.map(processAnimal) : [];
  },

  async getAnimalById(animalId: number): Promise<Animal | null> {
    const res = await fetch(`${XANO_ANIMALS_URL}/animals/${animalId}?tenant_id=${this.tenantId}`, { headers: getHeaders() });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch animal");
    }
    
    const animal = await res.json();
    return processAnimal(animal);
  },

  async getFeaturedAnimals(limit: number = 6): Promise<Animal[]> {
    return this.getAnimals({
      is_featured: true,
      status: 'Available',
      limit
    });
  },

  async getAnimalsByStatus(status: string, limit?: number): Promise<Animal[]> {
    return this.getAnimals({
      status,
      limit
    });
  },

  async createAnimal(animalData: Omit<Animal, 'id' | 'created_at' | 'updated_at'>): Promise<Animal> {
    const payload = {
      ...animalData,
      tenant_id: this.tenantId,
      images: Array.isArray(animalData.images) ? JSON.stringify(animalData.images) : animalData.images
    };

    const res = await fetch(`${XANO_ANIMALS_URL}/animals`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create animal");
    
    const animal = await res.json();
    return processAnimal(animal);
  },

  async updateAnimal(animalId: number, animalData: Partial<Animal>): Promise<Animal> {
    const payload = {
      ...animalData,
      images: Array.isArray(animalData.images) ? JSON.stringify(animalData.images) : animalData.images
    };

    const res = await fetch(`${XANO_ANIMALS_URL}/animals/${animalId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to update animal");
    
    const animal = await res.json();
    return processAnimal(animal);
  },

  async deleteAnimal(animalId: number): Promise<void> {
    const res = await fetch(`${XANO_ANIMALS_URL}/animals/${animalId}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete animal");
  },

  // ===== SITE CONTENT =====
  async getSiteContent(): Promise<SiteContent> {
    const res = await fetch(`${XANO_SITE_CONTENT_URL}/site_content?tenant_id=${this.tenantId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch site content");
    
    const result = await res.json();
    const content = Array.isArray(result) ? result[0] : result;
    
    if (content?.hours_json) {
      content.hours = parseJSON(content.hours_json, {});
    }
    
    return content || {
      tenant_id: this.tenantId,
      site_name: 'My Rescue',
      tagline: 'Saving lives, one pet at a time',
      mission_statement: '',
      email: '',
      phone: '',
      hours: {}
    };
  },

  async updateSiteContent(data: Partial<SiteContent>): Promise<SiteContent> {
    const payload = { ...data };
    
    // Convert hours object to JSON string if present
    if (data.hours && typeof data.hours === 'object') {
      payload.hours_json = JSON.stringify(data.hours);
      delete payload.hours;
    }

    const method = data.id ? "PATCH" : "POST";
    const url = data.id 
      ? `${XANO_SITE_CONTENT_URL}/site_content/${data.id}`
      : `${XANO_SITE_CONTENT_URL}/site_content`;

    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify({
        tenant_id: this.tenantId,
        ...payload
      })
    });
    if (!res.ok) throw new Error("Failed to update site content");
    return res.json();
  },

  // ===== SERVICES =====
  async getServices(): Promise<Service[]> {
    const res = await fetch(`${XANO_SERVICES_URL}/services?tenant_id=${this.tenantId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch services");
    
    const result = await res.json();
    return Array.isArray(result) ? result : [];
  },

  async createService(serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
    const res = await fetch(`${XANO_SERVICES_URL}/services`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        ...serviceData,
        tenant_id: this.tenantId
      })
    });
    if (!res.ok) throw new Error("Failed to create service");
    return res.json();
  },

  async updateService(serviceId: number, serviceData: Partial<Service>): Promise<Service> {
    const res = await fetch(`${XANO_SERVICES_URL}/services/${serviceId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(serviceData)
    });
    if (!res.ok) throw new Error("Failed to update service");
    return res.json();
  },

  async deleteService(serviceId: number): Promise<void> {
    const res = await fetch(`${XANO_SERVICES_URL}/services/${serviceId}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete service");
  },

  async updateServices(services: Service[]): Promise<Service[]> {
    // Bulk update services - you might need to implement this endpoint in Xano
    const res = await fetch(`${XANO_SERVICES_URL}/services/bulk_update`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        tenant_id: this.tenantId,
        services
      })
    });
    if (!res.ok) {
      // Fallback: update services individually
      const updatedServices = [];
      for (const service of services) {
        if (service.id) {
          const updated = await this.updateService(service.id, service);
          updatedServices.push(updated);
        } else {
          const created = await this.createService(service);
          updatedServices.push(created);
        }
      }
      return updatedServices;
    }
    return res.json();
  },

  // ===== DESIGN SETTINGS =====
  async getDesignSettings(): Promise<DesignSettings | null> {
    const res = await fetch(`${XANO_DESIGN_URL}/design_settings?tenant_id=${this.tenantId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch design settings");
    
    const result = await res.json();
    const settings = Array.isArray(result) ? result[0] : result;
    
    if (!settings) {
      return {
        tenant_id: this.tenantId,
        template_name: 'BarkhausClassic',
        heading_font_family: 'Playfair Display',
        body_font_family: 'Inter',
        primary_color: '#6bb3eb',
        secondary_color: '#02417b',
        background_color: '#FFFFFF',
        font_color: '#000000',
        enabled_sections: ['hero', 'about', 'animals', 'contact']
      };
    }

    // Process enabled_sections if it's a JSON string
    if (typeof settings.enabled_sections === 'string') {
      settings.enabled_sections = parseJSON(settings.enabled_sections, []);
    }
    
    return settings;
  },

  async createDesignSettings(data: Omit<DesignSettings, 'id' | 'created_at' | 'updated_at'>): Promise<DesignSettings> {
    const payload = {
      ...data,
      tenant_id: this.tenantId,
      google_heading_font_link: generateGoogleFontLink(data.heading_font_family),
      google_body_font_link: generateGoogleFontLink(data.body_font_family),
      enabled_sections: Array.isArray(data.enabled_sections) 
        ? JSON.stringify(data.enabled_sections) 
        : data.enabled_sections
    };

    const res = await fetch(`${XANO_DESIGN_URL}/design_settings`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create design settings");
    
    const result = await res.json();
    if (typeof result.enabled_sections === 'string') {
      result.enabled_sections = parseJSON(result.enabled_sections, []);
    }
    return result;
  },

  async updateDesignSettings(id: number, data: Partial<DesignSettings>): Promise<DesignSettings> {
    const payload = {
      ...data,
      enabled_sections: Array.isArray(data.enabled_sections) 
        ? JSON.stringify(data.enabled_sections) 
        : data.enabled_sections
    };

    // Auto-generate Google Font links if fonts are being updated
    if (data.heading_font_family) {
      payload.google_heading_font_link = generateGoogleFontLink(data.heading_font_family);
    }
    if (data.body_font_family) {
      payload.google_body_font_link = generateGoogleFontLink(data.body_font_family);
    }

    const res = await fetch(`${XANO_DESIGN_URL}/design_settings/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to update design settings");
    
    const result = await res.json();
    if (typeof result.enabled_sections === 'string') {
      result.enabled_sections = parseJSON(result.enabled_sections, []);
    }
    return result;
  },

  // ===== PAGES =====
  async getPages(): Promise<Page[]> {
    const res = await fetch(`${XANO_PAGES_URL}/pages?tenant_id=${this.tenantId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch pages");
    return res.json();
  },

  async getPageBySlug(slug: string): Promise<Page | null> {
    const pages = await this.getPages();
    return pages.find(p => p.slug === slug) || null;
  },

  async savePage(page: Page): Promise<Page> {
    const method = page.id ? "PATCH" : "POST";
    const url = page.id ? `${XANO_PAGES_URL}/pages/${page.id}` : `${XANO_PAGES_URL}/pages`;
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify({
        tenant_id: this.tenantId,
        slug: page.slug,
        title: page.title,
        content_json: page.content_json
      })
    });
    if (!res.ok) throw new Error("Failed to save page");
    return res.json();
  },

  // ===== BULK DATA =====
  async getAllData(): Promise<{
    branding: DesignSettings | null;
    content: SiteContent;
    animals: Animal[];
    services: Service[];
  }> {
    const [branding, content, animals, services] = await Promise.all([
      this.getDesignSettings(),
      this.getSiteContent(),
      this.getAnimals(),
      this.getServices()
    ]);

    return {
      branding,
      content,
      animals,
      services
    };
  }
};

// Legacy exports for backward compatibility
export const getPages = (): Promise<Page[]> => {
  return xanoAPI.getPages();
};

export const getPageBySlug = (slug: string): Promise<Page | null> => {
  return xanoAPI.getPageBySlug(slug);
};

export const savePage = (page: Page): Promise<Page> => {
  return xanoAPI.savePage(page);
};