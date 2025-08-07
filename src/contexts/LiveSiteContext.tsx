import React, { createContext, useContext, ReactNode } from 'react';

interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  headingFont: string;
  backgroundColor: string;
  textColor: string;
}

interface SiteContent {
  siteName: string;
  logo: string;
  tagline: string;
  aboutUs: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
  pages: {
    home: {
      heroSection: {
        title: string;
        subtitle: string;
        backgroundImage?: string;
        ctaText: string;
        ctaLink: string;
      };
    };
    about: {
      aboutSection: {
        title: string;
        content: string;
        image?: string;
      };
    };
    successStories: {
      headerSection: {
        title: string;
        content: string;
      };
    };
  };
}

interface LiveSiteContextType {
  designSettings: DesignSettings;
  siteContent: SiteContent;
  updateDesignSettings: (settings: Partial<DesignSettings>) => void;
  updateSiteContent: (content: Partial<SiteContent>) => void;
}

const defaultDesignSettings: DesignSettings = {
  primaryColor: '#009688',
  secondaryColor: '#4db6ac',
  accentColor: '#ff5722',
  fontFamily: 'Inter, system-ui, sans-serif',
  headingFont: 'Bebas Neue, cursive',
  backgroundColor: '#ffffff',
  textColor: '#111827',
};

const defaultSiteContent: SiteContent = {
  siteName: 'Happy Paws Rescue',
  logo: '/Duggy.png',
  tagline: 'Saving lives, one paw at a time',
  aboutUs: 'We are dedicated to rescuing and rehoming animals in need, providing them with love, care, and a second chance at happiness.',
  contactInfo: {
    address: '123 Main St, Anytown, ST 12345',
    phone: '(555) 123-4567',
    email: 'info@happypawsrescue.org',
    website: 'https://happypawsrescue.org',
  },
  pages: {
    home: {
      heroSection: {
        title: 'Find Your Perfect Companion',
        subtitle: 'Every animal deserves a loving home. Help us make that happen.',
        ctaText: 'View Available Pets',
        ctaLink: '#pets',
      },
    },
    about: {
      aboutSection: {
        title: 'Our Mission',
        content: 'We believe every animal deserves love, care, and a forever home. Our dedicated team works tirelessly to rescue, rehabilitate, and rehome animals in need.',
      },
    },
    successStories: {
      headerSection: {
        title: 'Success Stories',
        content: 'See the amazing transformations and happy endings made possible by our community.',
      },
    },
  },
};

const LiveSiteContext = createContext<LiveSiteContextType | undefined>(undefined);

export const useLiveSite = () => {
  const context = useContext(LiveSiteContext);
  if (context === undefined) {
    throw new Error('useLiveSite must be used within a LiveSiteProvider');
  }
  return context;
};

interface LiveSiteProviderProps {
  children: ReactNode;
}

export const LiveSiteProvider: React.FC<LiveSiteProviderProps> = ({ children }) => {
  const [designSettings, setDesignSettings] = React.useState<DesignSettings>(defaultDesignSettings);
  const [siteContent, setSiteContent] = React.useState<SiteContent>(defaultSiteContent);

  const updateDesignSettings = (settings: Partial<DesignSettings>) => {
    setDesignSettings(prev => ({ ...prev, ...settings }));
  };

  const updateSiteContent = (content: Partial<SiteContent>) => {
    setSiteContent(prev => ({ ...prev, ...content }));
  };

  const value = {
    designSettings,
    siteContent,
    updateDesignSettings,
    updateSiteContent,
  };

  return (
    <LiveSiteContext.Provider value={value}>
      {children}
    </LiveSiteContext.Provider>
  );
};