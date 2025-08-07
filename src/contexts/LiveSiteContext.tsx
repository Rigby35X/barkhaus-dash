import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  ctaText: string;
  ctaLink: string;
}

interface AboutSection {
  title: string;
  content: string;
  image?: string;
}

interface SuccessStory {
  title: string;
  description: string;
  image: string;
}

interface LiveSiteData {
  site_name: string;
  tagline?: string;
  mission?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  background_color?: string;
  heading_font_family?: string;
  body_font_family?: string;
  pages?: {
    home?: {
      heroSection?: HeroSection;
      featuredPets?: any[];
    };
    about?: AboutSection;
    successStories?: SuccessStory[];
  };
}

interface LiveSiteContextType {
  liveSiteData: LiveSiteData | null;
  loading: boolean;
  error: string | null;
}

const LiveSiteContext = createContext<LiveSiteContextType>({
  liveSiteData: null,
  loading: true,
  error: null,
});

export const useLiveSite = () => useContext(LiveSiteContext);

export const LiveSiteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { tenantSlug } = useParams();
  const [liveSiteData, setLiveSiteData] = useState<LiveSiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedSlug = tenantSlug ?? import.meta.env.VITE_DEFAULT_TENANT_SLUG ?? "demo-org";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR/get-live-site-config?tenant_slug=${resolvedSlug}`
        );
        setLiveSiteData(res.data);
      } catch (err: any) {
        console.error("Failed to fetch live site config", err);
        setError("Unable to load site config.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedSlug]);

  return (
    <LiveSiteContext.Provider value={{ liveSiteData, loading, error }}>
      {children}
    </LiveSiteContext.Provider>
  );
};
