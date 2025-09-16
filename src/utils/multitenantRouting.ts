// Multitenant routing utilities
export interface TenantRoute {
  tenantId: string;
  subdomain: string;
  path: string;
  isAdmin: boolean;
}

export class MultitenantRouter {
  private baseDomain: string;
  private adminSubdomain: string;
  private mode: 'subdomain' | 'path' | 'domain';

  constructor() {
    this.baseDomain = import.meta.env.VITE_BASE_DOMAIN || 'localhost:5173';
    this.adminSubdomain = import.meta.env.VITE_ADMIN_SUBDOMAIN || 'app';
    this.mode = import.meta.env.VITE_MULTITENANCY_MODE || 'subdomain';
  }

  // Parse current URL to extract tenant information
  parseCurrentRoute(): TenantRoute | null {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const port = window.location.port;

    switch (this.mode) {
      case 'subdomain':
        return this.parseSubdomainRoute(hostname, pathname, port);
      case 'path':
        return this.parsePathRoute(pathname);
      case 'domain':
        return this.parseDomainRoute(hostname, pathname);
      default:
        return null;
    }
  }

  private parseSubdomainRoute(hostname: string, pathname: string, port: string): TenantRoute | null {
    // Handle localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Check for path-based routing in development
      const pathMatch = pathname.match(/^\/([^\/]+)/);
      if (pathMatch) {
        const segment = pathMatch[1];
        return {
          tenantId: segment === 'app' ? 'admin' : segment,
          subdomain: segment,
          path: pathname.replace(`/${segment}`, '') || '/',
          isAdmin: segment === 'app'
        };
      }
      return null;
    }

    // Production subdomain parsing
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const subdomain = parts[0];
      return {
        tenantId: subdomain === this.adminSubdomain ? 'admin' : subdomain,
        subdomain,
        path: pathname,
        isAdmin: subdomain === this.adminSubdomain
      };
    }

    return null;
  }

  private parsePathRoute(pathname: string): TenantRoute | null {
    const match = pathname.match(/^\/([^\/]+)(.*)/);
    if (match) {
      const segment = match[1];
      const remainingPath = match[2] || '/';
      
      return {
        tenantId: segment === 'app' ? 'admin' : segment,
        subdomain: segment,
        path: remainingPath,
        isAdmin: segment === 'app'
      };
    }
    return null;
  }

  private parseDomainRoute(hostname: string, pathname: string): TenantRoute | null {
    // Each tenant has their own domain
    const isAdminDomain = hostname === this.baseDomain;
    
    return {
      tenantId: isAdminDomain ? 'admin' : hostname,
      subdomain: isAdminDomain ? 'admin' : hostname,
      path: pathname,
      isAdmin: isAdminDomain
    };
  }

  // Generate URLs for different tenants
  generateTenantUrl(tenantId: string, path: string = '/', isAdmin: boolean = false): string {
    const protocol = window.location.protocol;
    
    switch (this.mode) {
      case 'subdomain':
        if (this.baseDomain.includes('localhost')) {
          // Development: use path-based routing
          const segment = isAdmin ? 'app' : tenantId;
          return `${protocol}//${this.baseDomain}/${segment}${path}`;
        } else {
          // Production: use subdomain
          const subdomain = isAdmin ? this.adminSubdomain : tenantId;
          return `${protocol}//${subdomain}.${this.baseDomain}${path}`;
        }

      case 'path':
        const segment = isAdmin ? 'app' : tenantId;
        return `${protocol}//${this.baseDomain}/${segment}${path}`;

      case 'domain':
        const domain = isAdmin ? this.baseDomain : tenantId;
        return `${protocol}//${domain}${path}`;

      default:
        return `${protocol}//${this.baseDomain}${path}`;
    }
  }

  // Navigate to tenant
  navigateToTenant(tenantId: string, path: string = '/', isAdmin: boolean = false): void {
    const url = this.generateTenantUrl(tenantId, path, isAdmin);
    window.location.href = url;
  }

  // Check if current route is admin
  isCurrentRouteAdmin(): boolean {
    const route = this.parseCurrentRoute();
    return route?.isAdmin || false;
  }

  // Get current tenant ID
  getCurrentTenantId(): string | null {
    const route = this.parseCurrentRoute();
    return route?.tenantId || null;
  }

  // Get tenant-aware navigation paths
  getTenantPaths(tenantId: string) {
    const isAdmin = tenantId === 'admin';
    
    if (isAdmin) {
      return {
        dashboard: this.generateTenantUrl('admin', '/dashboard', true),
        sites: this.generateTenantUrl('admin', '/sites', true),
        templates: this.generateTenantUrl('admin', '/templates', true),
        settings: this.generateTenantUrl('admin', '/settings', true)
      };
    }

    return {
      home: this.generateTenantUrl(tenantId, '/'),
      animals: this.generateTenantUrl(tenantId, '/animals'),
      about: this.generateTenantUrl(tenantId, '/about'),
      contact: this.generateTenantUrl(tenantId, '/contact'),
      adopt: this.generateTenantUrl(tenantId, '/adopt')
    };
  }
}

// Singleton instance
export const multitenantRouter = new MultitenantRouter();

// React hook for multitenant routing
export function useMultitenantRouter() {
  return {
    router: multitenantRouter,
    currentRoute: multitenantRouter.parseCurrentRoute(),
    isAdmin: multitenantRouter.isCurrentRouteAdmin(),
    tenantId: multitenantRouter.getCurrentTenantId(),
    generateUrl: (tenantId: string, path: string, isAdmin?: boolean) => 
      multitenantRouter.generateTenantUrl(tenantId, path, isAdmin),
    navigateTo: (tenantId: string, path: string, isAdmin?: boolean) => 
      multitenantRouter.navigateToTenant(tenantId, path, isAdmin)
  };
}

export default MultitenantRouter;
