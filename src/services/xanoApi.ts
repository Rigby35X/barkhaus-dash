// src/services/xanoApi.ts

const XANO_BASE_URL      = import.meta.env.VITE_XANO_BASE_URL!;
const XANO_AUTH_URL      = import.meta.env.VITE_XANO_AUTH_URL!;
const XANO_DOGS_URL      = import.meta.env.VITE_XANO_DOGS_URL!;
const XANO_DESIGN_URL    = import.meta.env.VITE_XANO_DESIGN_URL!;

// — TYPES —

export interface Dog {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  status: string;
  image: string;
  images?: string[];
  location: string;
  description: string;
  medical_notes?: string;
  weight?: string;
  vaccinated?: boolean;
  spayed_neutered?: boolean;
  published?: boolean;
  created_at: string;
  updated_at?: string;
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

export interface LiveSiteConfig {
  id: number;
  tenant_id: number;
  site_name: string;
  site_url: string;
  logo_url: string;
  about_us: string;
  mission_statement: string;
  contact_info: {
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
  ein_number: string;
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

// ...existing code...

export interface DesignSettings {
  id?: number;
  tenantSlug: number;
  liveSite: number;
  templateName: string;
  headingFont: string;
  fontFamily: string;
  googleHeadingFontLink: string;
  googleBodyFontLink: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  backgroundColor: string;
  textColor: string;
  borderRadius?: string;
  shadowStyle?: string;
  createdAt?: string;
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

// — HELPERS —

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem("xano_auth_token");
  const hdrs: Record<string,string> = { "Content-Type": "application/json" };
  if (token) hdrs.Authorization = `Bearer ${token}`;
  return hdrs;
}

// — API OBJECT —

export const xanoAPI = {
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

  // ===== DOGS =====
  async getDogs(): Promise<Dog[]> {
    const res = await fetch(`${XANO_DOGS_URL}/dogs`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch dogs");
    return res.json();
  },

  // ===== PAGES =====
  async getPages(tenantId: number): Promise<Page[]> {
    const res = await fetch(`${XANO_BASE_URL}/pages?tenant_id=${tenantId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch pages");
    return res.json();
  },

  async getPageBySlug(tenantId: number, slug: string): Promise<Page | null> {
    const pages = await this.getPages(tenantId);
    return pages.find(p => p.slug === slug) || null;
  },

  async savePage(page: Page): Promise<Page> {
    const method = page.id ? "PATCH" : "POST";
    const url = page.id ? `${XANO_BASE_URL}/pages/${page.id}` : `${XANO_BASE_URL}/pages`;
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify({
        tenant_id: page.tenant_id,
        slug: page.slug,
        title: page.title,
        content_json: page.content_json
      })
    });
    if (!res.ok) throw new Error("Failed to save page");
    return res.json();
  },

  // ===== LIVE SITE =====
  async getLiveSites(tenantId: number): Promise<LiveSiteConfig[]> {
    const res = await fetch(`${XANO_BASE_URL}/live_sites?tenant_id=${tenantId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch live sites");
    return res.json();
  },

  async createLiveSite(data: LiveSiteConfig): Promise<LiveSiteConfig> {
    const res = await fetch(`${XANO_BASE_URL}/live_sites`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create live site");
    return res.json();
  },

  async updateLiveSite(id: number, data: LiveSiteConfig): Promise<LiveSiteConfig> {
    const res = await fetch(`${XANO_BASE_URL}/live_sites/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update live site");
    return res.json();
  },

  // ===== DESIGN SETTINGS =====
  async getDesignSettings(tenantId: number): Promise<DesignSettings[]> {
    const res = await fetch(`${XANO_DESIGN_URL}/design_settings?tenant_slug=${tenantId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch design settings");
    const snake = await res.json();
    return (snake as any[]).map(d => ({
      id:                    d.id,
      tenantSlug:            d.tenant_slug,
      liveSite:              d.live_site,
      templateName:          d.template_name,
      headingFont:           d.heading_font_family,
      fontFamily:            d.body_font_family,
      googleHeadingFontLink: d.google_heading_font_link,
      googleBodyFontLink:    d.google_body_font_link,
      primaryColor:          d.primary_color,
      secondaryColor:        d.secondary_color,
      accentColor:           d.accent_color,
      backgroundColor:       d.background_color,
      textColor:             d.font_color,
      borderRadius:          d.border_radius,
      shadowStyle:           d.shadow_style,
      createdAt:             d.created_at
    }));
  },

  async createDesignSettings(data: Partial<DesignSettings>): Promise<DesignSettings> {
    const payload = {
      tenant_slug:            data.tenantSlug,
      live_site:              data.liveSite,
      template_name:          data.templateName,
      heading_font_family:    data.headingFont,
      body_font_family:       data.fontFamily,
      google_heading_font_link: data.googleHeadingFontLink,
      google_body_font_link:    data.googleBodyFontLink,
      primary_color:          data.primaryColor,
      secondary_color:        data.secondaryColor,
      accent_color:           data.accentColor,
      background_color:       data.backgroundColor,
      font_color:             data.textColor,
      border_radius:          data.borderRadius,
      shadow_style:           data.shadowStyle
    };
    const res = await fetch(`${XANO_DESIGN_URL}/design_settings`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create design settings");
    const d = await res.json();
    return {
      id:                    d.id,
      tenantSlug:            d.tenant_slug,
      liveSite:              d.live_site,
      templateName:          d.template_name,
      headingFont:           d.heading_font_family,
      fontFamily:            d.body_font_family,
      googleHeadingFontLink: d.google_heading_font_link,
      googleBodyFontLink:    d.google_body_font_link,
      primaryColor:          d.primary_color,
      secondaryColor:        d.secondary_color,
      accentColor:           d.accent_color,
      backgroundColor:       d.background_color,
      textColor:             d.font_color,
      borderRadius:          d.border_radius,
      shadowStyle:           d.shadow_style,
      createdAt:             d.created_at
    };
  },

  async updateDesignSettings(id: number, data: Partial<DesignSettings>): Promise<DesignSettings> {
    const payload = {
      tenant_slug:          data.tenantSlug,
      live_site:            data.liveSite,
      template_name:        data.templateName,
      heading_font_family:  data.headingFont,
      body_font_family:     data.fontFamily,
      google_heading_font_link: data.googleHeadingFontLink,
      google_body_font_link:    data.googleBodyFontLink,
      primary_color:        data.primaryColor,
      secondary_color:      data.secondaryColor,
      accent_color:         data.accentColor,
      background_color:     data.backgroundColor,
      font_color:           data.textColor,
      border_radius:        data.borderRadius,
      shadow_style:         data.shadowStyle
    };
    const res = await fetch(`${XANO_DESIGN_URL}/design_settings/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to update design settings");
    const d = await res.json();
    return {
      id:                    d.id,
      tenantSlug:            d.tenant_slug,
      liveSite:              d.live_site,
      templateName:          d.template_name,
      headingFont:           d.heading_font_family,
      fontFamily:            d.body_font_family,
      googleHeadingFontLink: d.google_heading_font_link,
      googleBodyFontLink:    d.google_body_font_link,
      primaryColor:          d.primary_color,
      secondaryColor:        d.secondary_color,
      accentColor:           d.accent_color,
      backgroundColor:       d.background_color,
      textColor:             d.font_color,
      borderRadius:          d.border_radius,
      shadowStyle:           d.shadow_style,
      createdAt:             d.created_at
    };
  }
};

export const getPages = (tenantId: number): Promise<Page[]> => {
  return xanoAPI.getPages(tenantId);
};

export const getPageBySlug = (tenantId: number, slug: string): Promise<Page | null> => {
  return xanoAPI.getPageBySlug(tenantId, slug);
};

export const savePage = (page: Page): Promise<Page> => {
  return xanoAPI.savePage(page);
};
