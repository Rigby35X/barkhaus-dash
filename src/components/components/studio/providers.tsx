// components/studio/providers.tsx
'use client';
import React from 'react';

type StudioContextValue = {
  design?: any;
  templates?: any;
};

export const StudioContext = React.createContext<StudioContextValue>({});

export function StudioProviders({
  children,
  design,
  templates,
}: {
  children: React.ReactNode;
  design?: any;
  templates?: any;
}) {
  return (
    <StudioContext.Provider value={{ design, templates }}>
      {children}
    </StudioContext.Provider>
  );
}

// optional hook
export function useStudio() {
  const ctx = React.useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within StudioProviders');
  return ctx;
}
