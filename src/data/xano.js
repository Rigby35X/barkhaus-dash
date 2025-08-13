// src/_data/xano.js
import XanoAPI from '../utils/xanoAPI.js';

export default async function() {
  const xanoAPI = new XanoAPI();
  
  // TODO: Make this dynamic based on subdomain/domain
  // For now, using tenant_id = 1
  xanoAPI.setTenantId(1);
  
  try {
    console.log('🔄 Fetching all Xano data...');
    
    // Fetch all data in parallel
    const [designSettings, siteContent, animalsData, services] = await Promise.all([
      xanoAPI.getDesignSettings(),
      xanoAPI.getSiteContent(),
      xanoAPI.getAnimals(), // Changed from getDogsData to getAnimals
      xanoAPI.getServices(),
      xanoAPI.getPageSections(),
      xanoAPI.getOrganizations()
    ]);

    // Process and enhance the data for your existing xano-colors.js
    const processedData = {
      // Design & Styling (formatted for your XanoColorSystem)
      branding: {
        // Your existing color fields
        primaryColor: designSettings.primary_color,
        secondaryColor: designSettings.secondary_color, 
        backgroundColor: designSettings.background_color,
        fontColor: designSettings.font_color,
        
        // Font fields
        headingFontFamily: designSettings.heading_font_family,
        bodyFontFamily: designSettings.body_font_family,
        googleHeadingFontLink: designSettings.google_heading_font_link,
        googleBodyFontLink: designSettings.google_body_font_link,
        
        // Additional colors for enhanced system
        accentColor: designSettings.accent_color,
        buttonColor: designSettings.button_color,
        linkColor: designSettings.link_color,
        successColor: designSettings.success_color,
        warningColor: designSettings.warning_color,
        errorColor: designSettings.error_color,
        
        // Assets
        logoUrl: designSettings.logo_url,
        faviconUrl: designSettings.favicon_url,
        heroImageUrl: designSettings.hero_image_url,
        
        // Layout
        templateName: designSettings.template_name,
        enabledSections: designSettings.enabled_sections || [],
        headerStyle: designSettings.header_style,
        footerStyle: designSettings.footer_style,
        
        // Custom CSS/JS
        customCss: designSettings.custom_css,
        customJs: designSettings.custom_js,
        
        // Computed values for CSS variables
        cssVariables: generateCSSVariables(designSettings),
        fontLinks: generateFontLinks(designSettings)
      },
      
      // Site Content 
      content: {
        siteName: siteContent.site_name,
        tagline: siteContent.tagline,
        missionStatement: siteContent.mission_statement,
        
        // Contact info
        email: siteContent.email,
        phone: siteContent.phone,
        addressLine1: siteContent.address_line1,
        addressLine2: siteContent.address_line2,
        hours: siteContent.hours || {},
        
        // Social media
        facebookUrl: siteContent.facebook_url,
        instagramUrl: siteContent.instagram_url,
        twitterUrl: siteContent.twitter_url,
        
        // Donation platforms
        donations: {
          givebutter: {
            enabled: siteContent.givebutter_enabled,
            url: siteContent.givebutter_url
          },
          donorbox: {
            enabled: siteContent.donorbox_enabled,
            url: siteContent.donorbox_url
          },
          gofundme: {
            enabled: siteContent.gofundme_enabled,
            url: siteContent.gofundme_url
          }
        },
        
        // Third-party integrations
        integrations: {
          petfinder: siteContent.petfinder_enabled,
          adoptapet: siteContent.adoptapet_enabled
        }
      },
      
      // Animals data (enhanced structure)
      animals: animalsData,
      dogs: animalsData, // Keep for backward compatibility
      
      // Services
      services: services,
      
      // Layout configuration
      layout: {
        enabledSections: designSettings.enabled_sections || [],
        templateName: designSettings.template_name || 'BarkhausClassic'
      }
    };

    console.log('✅ Xano data processed successfully');
    console.log('📊 Data summary:', {
      branding: Object.keys(processedData.branding).length + ' properties',
      content: Object.keys(processedData.content).length + ' properties', 
      animals: processedData.animals.length + ' animals',
      services: processedData.services.length + ' services'
    });
    
    return processedData;

  } catch (error) {
    console.error('❌ Error fetching Xano data:', error);
    
    // Return safe defaults to prevent site crashes
    return {
      branding: {
        primaryColor: '#6bb3eb',
        secondaryColor: '#02417b',
        backgroundColor: '#FFFFFF', 
        fontColor: '#000000',
        headingFontFamily: 'Playfair Display',
        bodyFontFamily: 'Inter',
        templateName: 'BarkhausClassic',
        enabledSections: [],
        cssVariables: {
          '--primary': '#6bb3eb',
          '--secondary': '#02417b',
          '--bodyTextColorWhite': '#FFFFFF',
          '--bodyTextColor': '#000000'
        },
        fontLinks: []
      },
      content: {
        siteName: 'My Rescue Site',
        tagline: 'Saving lives, one pet at a time',
        hours: {},
        donations: {},
        integrations: {}
      },
      animals: [],
      dogs: [], // Keep for backward compatibility
      services: [],
      layout: { enabledSections: [], templateName: 'BarkhausClassic' }
    };
  }
};

// Helper function to generate CSS custom properties
function generateCSSVariables(designSettings) {
  const variables = {
    // Your existing variables from xano-colors.js
    '--primary': designSettings.primary_color || '#6bb3eb',
    '--secondary': designSettings.secondary_color || '#02417b',
    '--bodyTextColorWhite': designSettings.background_color || '#FFFFFF',
    '--bodyTextColor': designSettings.font_color || '#000000',
    
    // Additional CSS variables
    '--cs-primary': designSettings.primary_color || '#6bb3eb',
    '--cs-secondary': designSettings.secondary_color || '#02417b',
    '--cs-background': designSettings.background_color || '#FFFFFF',
    '--cs-text': designSettings.font_color || '#000000',
    '--cs-heading-font': designSettings.heading_font_family ? `"${designSettings.heading_font_family}", serif` : 'serif',
    '--cs-body-font': designSettings.body_font_family ? `"${designSettings.body_font_family}", sans-serif` : 'sans-serif',
    
    // Additional theme colors
    '--accent': designSettings.accent_color || '#f59e0b',
    '--success': designSettings.success_color || '#10b981',
    '--warning': designSettings.warning_color || '#f59e0b',
    '--error': designSettings.error_color || '#ef4444'
  };
  
  return variables;
}

// Helper function to generate Google Font links
function generateFontLinks(designSettings) {
  const links = [];
  
  if (designSettings.google_heading_font_link) {
    links.push(designSettings.google_heading_font_link);
  }
  
  if (designSettings.google_body_font_link && 
      designSettings.google_body_font_link !== designSettings.google_heading_font_link) {
    links.push(designSettings.google_body_font_link);
  }
  
  return links;
}