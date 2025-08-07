import React, { createContext, useContext, useState } from "react";
import type { LiveSiteConfig } from "../services/xanoApi";

interface LiveSiteContextType {
  liveSiteConfig: LiveSiteConfig | null;
  setLiveSiteConfig: React.Dispatch<React.SetStateAction<LiveSiteConfig | null>>;
}

const LiveSiteContext = createContext<LiveSiteContextType | undefined>(undefined);

export const LiveSiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [liveSiteConfig, setLiveSiteConfig] = useState<LiveSiteConfig | null>(null);
  return (
    <LiveSiteContext.Provider value={{ liveSiteConfig, setLiveSiteConfig }}>
      {children}
    </LiveSiteContext.Provider>
  );
};

export function useLiveSite(): LiveSiteContextType {
  const ctx = useContext(LiveSiteContext);
  if (!ctx) throw new Error("useLiveSite must be used within LiveSiteProvider");
  return ctx;
}

const LiveSite: React.FC = () => {
  return (
    <div>
      <h1>Live Site</h1>
      {/* Your live site content here */}
    </div>
  );
};

export default LiveSite;