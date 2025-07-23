// src/services/xanoApi.ts

const XANO_BASE_URL  = import.meta.env.VITE_XANO_BASE_URL  || 'https://x8ki-letl-twmt.n7.xano.io/api:mlssTgVM';
const XANO_AUTH_URL  = import.meta.env.VITE_XANO_AUTH_URL  || 'https://x8ki-letl-twmt.n7.xano.io/api:XqEb_TVK';
const XANO_DOGS_URL  = import.meta.env.VITE_XANO_DOGS_URL  || 'https://x8ki-letl-twmt.n7.xano.io/api:Od874PbA';

interface AuthResponse {
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

interface Dog {
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
  updated_at: string;
}

interface Page {
  id: number;
  tenant_id: number;
  slug: string;
  title: string;
  content_json: string;
  created_at?: string;
  updated_at?: string;
}

interface ContentJSON {
  [key: string]: unknown;
}

class XanoAPI {
  private authToken: string | null = null;

  constructor() {
    this.authToken = localStorage.getItem('xano_auth_token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    organizationName: string
  ): Promise<AuthResponse> {
    const res = await fetch(`${XANO_AUTH_URL}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        organization_name: organizationName,
      }),
    });
    if (!res.ok) throw new Error('Signup failed');
    const data: AuthResponse = await res.json();
    this.authToken = data.authToken;
    localStorage.setItem('xano_auth_token', this.authToken);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${XANO_AUTH_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data: AuthResponse = await res.json();
    this.authToken = data.authToken;
    localStorage.setItem('xano_auth_token', this.authToken);
    return data;
  }

  async getMe(): Promise<AuthResponse['user']> {
    if (!this.authToken) throw new Error('No auth token');
    const res = await fetch(`${XANO_AUTH_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to get user info');
    return res.json();
  }

  logout(): void {
    this.authToken = null;
    localStorage.removeItem('xano_auth_token');
  }

  async getDogs(): Promise<Dog[]> {
    const res = await fetch(`${XANO_DOGS_URL}/dogs`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dogs');
    return res.json();
  }

  async getDog(id: number): Promise<Dog> {
    const res = await fetch(`${XANO_DOGS_URL}/dogs/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dog');
    return res.json();
  }

  async createDog(dogData: Partial<Dog>): Promise<Dog> {
    const res = await fetch(`${XANO_DOGS_URL}/dogs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(dogData),
    });
    if (!res.ok) throw new Error('Failed to create dog');
    return res.json();
  }

  async updateDog(id: number, dogData: Partial<Dog>): Promise<Dog> {
    const res = await fetch(`${XANO_DOGS_URL}/dogs/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(dogData),
    });
    if (!res.ok) throw new Error('Failed to update dog');
    return res.json();
  }

  async deleteDog(id: number): Promise<void> {
    const res = await fetch(`${XANO_DOGS_URL}/dogs/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete dog');
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${XANO_DOGS_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload image');
    const data = await res.json();
    return data.url;
  }

  async getPages(tenantId: number, slug?: string): Promise<Page[]> {
    const url = new URL(`${XANO_BASE_URL}/pages`);
    url.searchParams.append('tenant_id', tenantId.toString());
    if (slug) url.searchParams.append('slug', slug);
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch pages');
    return res.json();
  }

  async getPageBySlug(tenantId: number, slug: string): Promise<Page | null> {
    const pages = await this.getPages(tenantId, slug);
    return pages.length ? pages[0] : null;
  }

  async savePage(
    pageId: number | null,
    tenantId: number,
    slug: string,
    title: string,
    contentJson: ContentJSON
  ): Promise<Page> {
    const method = pageId ? 'PATCH' : 'POST';
    const url = pageId
      ? `${XANO_BASE_URL}/pages/${pageId}`
      : `${XANO_BASE_URL}/pages`;
    const body = {
      tenant_id: tenantId,
      slug,
      title,
      content_json: JSON.stringify(contentJson),
    };
    const res = await fetch(url, {
      method,
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to save page');
    return res.json();
  }
}

export const xanoAPI = new XanoAPI();

// Export types only
export type { Dog, AuthResponse, Page };

// ❌ Removed conflicting function re-exports
// If you need helpers like `getPages`, use them like: `xanoAPI.getPages(...)`
