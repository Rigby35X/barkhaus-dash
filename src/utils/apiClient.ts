// src/utils/apiClient.ts
// Enhanced API client with CORS handling and error management

interface ApiClientOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    this.timeout = options.timeout || 10000;
  }

  private async makeRequest(
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        
        // Handle CORS errors
        if (error.message.includes('CORS') || error.message.includes('fetch')) {
          console.warn('CORS error detected. Consider using the development proxy or updating CORS settings.');
          throw new Error('Network error: Please check your connection or try again later.');
        }
      }
      
      throw error;
    }
  }

  async get(url: string, options: RequestInit = {}): Promise<any> {
    const response = await this.makeRequest(url, {
      ...options,
      method: 'GET'
    });
    return response.json();
  }

  async post(url: string, data?: any, options: RequestInit = {}): Promise<any> {
    const response = await this.makeRequest(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
    return response.json();
  }

  async put(url: string, data?: any, options: RequestInit = {}): Promise<any> {
    const response = await this.makeRequest(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
    return response.json();
  }

  async patch(url: string, data?: any, options: RequestInit = {}): Promise<any> {
    const response = await this.makeRequest(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
    return response.json();
  }

  async delete(url: string, options: RequestInit = {}): Promise<any> {
    const response = await this.makeRequest(url, {
      ...options,
      method: 'DELETE'
    });
    return response.json();
  }
}

// Create instances for different environments
export const createApiClient = (baseURL?: string) => {
  return new ApiClient({
    baseURL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
};

// Default client
export const apiClient = createApiClient();

export default ApiClient;
