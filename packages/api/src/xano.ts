// Base URLs for Xano API groups
export const XANO_GROUPS = {
  primary: "https://x8ki-letl-twmt.n7.xano.io/api:wPrzs4Mr",
  design_settings: "https://x8ki-letl-twmt.n7.xano.io/api:0BQDG239", 
  dogs: "https://x8ki-letl-twmt.n7.xano.io/api:Od874PbA",
  live_site: "https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR",
  pages: "https://x8ki-letl-twmt.n7.xano.io/api:mlssTgVM",
  site_config: "https://x8ki-letl-twmt.n7.xano.io/api:1vOYCkyt",
  templates: "https://x8ki-letl-twmt.n7.xano.io/api:cz-ZpYmR",
} as const

export type XanoGroupKey = keyof typeof XANO_GROUPS

export function baseFor(group: XanoGroupKey): string {
  return XANO_GROUPS[group]
}

// Server-side auth headers (never expose XANO_AUTH_TOKEN to client)
export function serverAuthHeaders(): HeadersInit {
  const token = process.env.XANO_AUTH_TOKEN
  if (!token) {
    console.warn('⚠️ XANO_AUTH_TOKEN not found in environment')
    return {}
  }
  return {
    'Authorization': `Bearer ${token}`,
  }
}

// Generic HTTP client
export class XanoClient {
  constructor(private group: XanoGroupKey) {}

  private get baseUrl(): string {
    return baseFor(this.group)
  }

  async get<T = any>(path: string, headers?: HeadersInit): Promise<T> {
    return this.makeRequest('GET', path, undefined, headers)
  }

  async post<T = any>(path: string, data?: any, headers?: HeadersInit): Promise<T> {
    return this.makeRequest('POST', path, data, headers)
  }

  async patch<T = any>(path: string, data?: any, headers?: HeadersInit): Promise<T> {
    return this.makeRequest('PATCH', path, data, headers)
  }

  async delete<T = any>(path: string, headers?: HeadersInit): Promise<T> {
    return this.makeRequest('DELETE', path, undefined, headers)
  }

  private async makeRequest<T>(
    method: string,
    path: string,
    data?: any,
    headers?: HeadersInit
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`
    
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    }

    const init: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (data && (method === 'POST' || method === 'PATCH')) {
      init.body = JSON.stringify(data)
    }

    console.log(`🌐 Xano ${method} ${url}`)

    try {
      const response = await fetch(url, init)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Xano ${method} ${path} failed: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      console.log(`✅ Xano ${method} ${path} success`)
      return result
    } catch (error) {
      console.error(`❌ Xano ${method} ${path} error:`, error)
      throw error
    }
  }
}

// Convenience clients for each group
export const xanoClients = {
  primary: new XanoClient('primary'),
  designSettings: new XanoClient('design_settings'),
  dogs: new XanoClient('dogs'),
  liveSite: new XanoClient('live_site'),
  pages: new XanoClient('pages'),
  siteConfig: new XanoClient('site_config'),
  templates: new XanoClient('templates'),
} as const
