// src/contexts/LiveSiteContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { LiveSiteConfig, DesignSettings } from "../services/xanoApi";

interface LiveSiteContextType {
  liveSiteConfig: LiveSiteConfig | null;
  setLiveSiteConfig: React.Dispatch<React.SetStateAction<LiveSiteConfig | null>>;
  designSettings: DesignSettings | null;
  setDesignSettings: React.Dispatch<React.SetStateAction<DesignSettings | null>>;
}

const LiveSiteContext = createContext<LiveSiteContextType | undefined>(undefined);

export const LiveSiteProvider: React.FC<{
  children: ReactNode;
  initialData?: LiveSiteConfig;
  initialDesign?: DesignSettings;
}> = ({ children, initialData, initialDesign }) => {
  const [liveSiteConfig, setLiveSiteConfig] = useState<LiveSiteConfig | null>(
    initialData || null
  );
  const [designSettings, setDesignSettings] = useState<DesignSettings | null>(
    initialDesign || null
  );

  return (
    <LiveSiteContext.Provider
      value={{ liveSiteConfig, setLiveSiteConfig, designSettings, setDesignSettings }}
    >
      {children}
    </LiveSiteContext.Provider>
  );
};

export const useLiveSite = (): LiveSiteContextType => {
  const ctx = useContext(LiveSiteContext);
  if (!ctx) throw new Error("useLiveSite must be used within LiveSiteProvider");
  return ctx;
};
