// Template Registry System
export interface TemplateConfig {
  name: string;
  id: string;
  version: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  license: string;
  preview: {
    thumbnail: string;
    demo_url?: string;
    screenshots: string[];
  };
  features: string[];
  customization: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
    layout: Record<string, string>;
  };
  pages: Array<{
    name: string;
    path: string;
    component: string;
    sections: string[];
  }>;
  components: string[];
  dependencies: {
    required: string[];
    optional: string[];
  };
}

export class TemplateRegistry {
  private templates: Map<string, TemplateConfig> = new Map();

  // Load template configuration
  async loadTemplate(templateId: string): Promise<TemplateConfig | null> {
    try {
      // Try to load from cache first
      if (this.templates.has(templateId)) {
        return this.templates.get(templateId)!;
      }

      // Load from file system
      const configPath = `/templates/${templateId}/config.json`;
      const response = await fetch(configPath);
      
      if (!response.ok) {
        console.warn(`Template config not found: ${templateId}`);
        return null;
      }

      const config: TemplateConfig = await response.json();
      this.templates.set(templateId, config);
      return config;
    } catch (error) {
      console.error(`Failed to load template ${templateId}:`, error);
      return null;
    }
  }

  // Get all available templates
  async getAllTemplates(): Promise<TemplateConfig[]> {
    // In a real implementation, this would scan the templates directory
    // For now, return known templates
    const knownTemplates = ['animal-rescue'];
    const templates: TemplateConfig[] = [];

    for (const templateId of knownTemplates) {
      const config = await this.loadTemplate(templateId);
      if (config) {
        templates.push(config);
      }
    }

    return templates;
  }

  // Filter templates by category
  async getTemplatesByCategory(category: string): Promise<TemplateConfig[]> {
    const allTemplates = await this.getAllTemplates();
    return allTemplates.filter(template => template.category === category);
  }

  // Search templates by tags
  async searchTemplates(query: string): Promise<TemplateConfig[]> {
    const allTemplates = await this.getAllTemplates();
    const lowerQuery = query.toLowerCase();

    return allTemplates.filter(template => 
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get template component
  async loadTemplateComponent(templateId: string, componentName: string) {
    try {
      // Dynamic import of template component
      const module = await import(`../../templates/${templateId}/components/${componentName}.tsx`);
      return module.default;
    } catch (error) {
      console.error(`Failed to load component ${componentName} from template ${templateId}:`, error);
      return null;
    }
  }

  // Get template page
  async loadTemplatePage(templateId: string, pageName: string) {
    try {
      // Dynamic import of template page
      const module = await import(`../../templates/${templateId}/pages/${pageName}.tsx`);
      return module.default;
    } catch (error) {
      console.error(`Failed to load page ${pageName} from template ${templateId}:`, error);
      return null;
    }
  }

  // Install template (copy files to active project)
  async installTemplate(templateId: string, targetPath: string = 'src'): Promise<boolean> {
    try {
      const config = await this.loadTemplate(templateId);
      if (!config) {
        throw new Error(`Template ${templateId} not found`);
      }

      // In a real implementation, this would copy files
      // For now, just log the installation
      console.log(`Installing template ${templateId} to ${targetPath}`);
      console.log('Template config:', config);

      return true;
    } catch (error) {
      console.error(`Failed to install template ${templateId}:`, error);
      return false;
    }
  }

  // Validate template structure
  async validateTemplate(templateId: string): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      const config = await this.loadTemplate(templateId);
      if (!config) {
        errors.push('Template configuration not found');
        return { valid: false, errors };
      }

      // Validate required fields
      if (!config.name) errors.push('Template name is required');
      if (!config.id) errors.push('Template ID is required');
      if (!config.version) errors.push('Template version is required');

      // Validate pages
      if (!config.pages || config.pages.length === 0) {
        errors.push('Template must have at least one page');
      }

      // Validate components
      if (!config.components || config.components.length === 0) {
        errors.push('Template must have at least one component');
      }

      return { valid: errors.length === 0, errors };
    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
      return { valid: false, errors };
    }
  }
}

// Singleton instance
export const templateRegistry = new TemplateRegistry();

// React hook for template management
export function useTemplateRegistry() {
  return {
    loadTemplate: (id: string) => templateRegistry.loadTemplate(id),
    getAllTemplates: () => templateRegistry.getAllTemplates(),
    getTemplatesByCategory: (category: string) => templateRegistry.getTemplatesByCategory(category),
    searchTemplates: (query: string) => templateRegistry.searchTemplates(query),
    installTemplate: (id: string, path?: string) => templateRegistry.installTemplate(id, path),
    validateTemplate: (id: string) => templateRegistry.validateTemplate(id)
  };
}

export default TemplateRegistry;
