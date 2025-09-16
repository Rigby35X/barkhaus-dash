import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Multitenancy Types
export interface Tenant {
  id: string;
  organizationName: string;
  subdomain: string;
  customDomain?: string;
  isActive: boolean;
  settings: TenantSettings;
  branding: TenantBranding;
}

export interface TenantSettings {
  allowPublicRegistration: boolean;
  enableCustomDomain: boolean;
  maxUsers: number;
  features: string[];
}

export interface TenantBranding {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
  customCSS?: string;
}

export interface MultitenancyContextType {
  // Current tenant
  currentTenant: Tenant | null;
  tenantId: string | null;
  subdomain: string | null;
  
  // Tenant management
  switchTenant: (tenantId: string) => Promise<void>;
  loadTenant: (identifier: string) => Promise<Tenant | null>;
  
  // Tenant detection
  detectTenantFromUrl: () => string | null;
  isAdminDomain: () => boolean;
  
  // Tenant isolation
  isTenantIsolated: boolean;
  canAccessTenant: (tenantId: string) => boolean;
  
  // Loading states
  loading: boolean;
  error: string | null;
}

const MultitenancyContext = createContext<MultitenancyContextType | undefined>(undefined);

export const MultitenancyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configuration from environment
  const multitenancyMode = import.meta.env.VITE_MULTITENANCY_MODE || 'subdomain';
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN || 'localhost:5173';
  const adminSubdomain = import.meta.env.VITE_ADMIN_SUBDOMAIN || 'app';
  const isTenantIsolated = import.meta.env.VITE_ENABLE_TENANT_ISOLATION === 'true';

  // Detect tenant from URL
  const detectTenantFromUrl = (): string | null => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    switch (multitenancyMode) {
      case 'subdomain':
        // Extract subdomain (e.g., happy-paws.localhost:5173)
        if (hostname.includes('.')) {
          const subdomain = hostname.split('.')[0];
          return subdomain !== adminSubdomain ? subdomain : null;
        }
        // For localhost development, check for path-based routing
        const pathMatch = pathname.match(/^\/([^\/]+)/);
        if (pathMatch && pathMatch[1] !== 'app') {
          return pathMatch[1];
        }
        return null;

      case 'path':
        // Extract from path (e.g., /happy-paws/...)
        const match = pathname.match(/^\/([^\/]+)/);
        return match && match[1] !== 'app' ? match[1] : null;

      case 'domain':
        // Each tenant has its own domain
        return hostname !== baseDomain ? hostname : null;

      default:
        return null;
    }
  };

  // Check if current domain is admin domain
  const isAdminDomain = (): boolean => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    if (multitenancyMode === 'subdomain') {
      return hostname.startsWith(`${adminSubdomain}.`) || pathname.startsWith('/app');
    }
    
    return pathname.startsWith('/app');
  };

  // Load tenant data
  const loadTenant = async (identifier: string): Promise<Tenant | null> => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch tenant from API
      // For now, use mock data - replace with actual API call
      const mockTenant: Tenant = {
        id: '3',
        organizationName: identifier === 'happy-paws' || identifier === 'happy-paws-rescue' 
          ? 'Happy Paws Rescue' 
          : `${identifier.charAt(0).toUpperCase() + identifier.slice(1)} Organization`,
        subdomain: identifier,
        isActive: true,
        settings: {
          allowPublicRegistration: false,
          enableCustomDomain: true,
          maxUsers: 50,
          features: ['animals', 'adoptions', 'donations', 'events']
        },
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF',
          logo: undefined,
          favicon: undefined,
          customCSS: undefined
        }
      };

      return mockTenant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenant');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Switch to a different tenant
  const switchTenant = async (tenantId: string): Promise<void> => {
    const tenant = await loadTenant(tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      // Optionally redirect to tenant domain/subdomain
      if (multitenancyMode === 'subdomain' && !isAdminDomain()) {
        window.location.href = `http://${tenant.subdomain}.${baseDomain}`;
      }
    }
  };

  // Check if user can access a specific tenant
  const canAccessTenant = (tenantId: string): boolean => {
    if (!isTenantIsolated) return true;
    if (!user) return false;
    
    // Admin users can access any tenant
    if (user.role === 'admin') return true;
    
    // Regular users can only access their own tenant
    return user.organizationId === tenantId;
  };

  // Initialize tenant on mount
  useEffect(() => {
    const initializeTenant = async () => {
      const detectedTenant = detectTenantFromUrl();
      
      if (detectedTenant) {
        const tenant = await loadTenant(detectedTenant);
        if (tenant && canAccessTenant(tenant.id)) {
          setCurrentTenant(tenant);
        } else if (isTenantIsolated) {
          setError('Access denied to this tenant');
        }
      } else if (user?.organizationId) {
        // Load user's default tenant
        const tenant = await loadTenant(user.organizationId);
        if (tenant) {
          setCurrentTenant(tenant);
        }
      }
      
      setLoading(false);
    };

    initializeTenant();
  }, [user]);

  const value: MultitenancyContextType = {
    currentTenant,
    tenantId: currentTenant?.id || null,
    subdomain: currentTenant?.subdomain || null,
    switchTenant,
    loadTenant,
    detectTenantFromUrl,
    isAdminDomain,
    isTenantIsolated,
    canAccessTenant,
    loading,
    error
  };

  return (
    <MultitenancyContext.Provider value={value}>
      {children}
    </MultitenancyContext.Provider>
  );
};

export const useMultitenancy = (): MultitenancyContextType => {
  const context = useContext(MultitenancyContext);
  if (!context) {
    throw new Error('useMultitenancy must be used within MultitenancyProvider');
  }
  return context;
};

export default MultitenancyContext;
