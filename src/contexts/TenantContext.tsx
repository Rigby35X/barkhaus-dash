import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface Organization {
  id: string;
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
}

interface Tenant {
  id: string;
  name: string;
  // Add other tenant properties as needed
}

export interface TenantContextType {
  organization: Organization | null;
  updateOrganization: (org: Partial<Organization>) => void;
  tenants: Tenant[];
  currentTenant: Tenant | null;
  selectTenant: (t: Tenant) => void;
}

export const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [tenants, _setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    if (user) {
      // Mock organization data
      const mockOrg: Organization = {
        id: user.organizationId,
        name: 'Happy Paws Rescue',
        address: '123 Main St, Anytown, ST 12345',
        phone: '(555) 123-4567',
        email: 'info@happypawsrescue.org',
        website: 'https://happypawsrescue.org',
        taxId: '12-3456789'
      };
      setOrganization(mockOrg);
    } else {
      setOrganization(null);
    }
  }, [user]);

  const updateOrganization = (updates: Partial<Organization>) => {
    if (organization) {
      setOrganization({ ...organization, ...updates });
    }
  };

  const selectTenant = (tenant: Tenant) => {
    setCurrentTenant(tenant);
  };

  const value = {
    organization,
    updateOrganization,
    tenants,
    currentTenant,
    selectTenant
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};