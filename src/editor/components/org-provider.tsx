import React, { createContext, useContext, useMemo } from "react";
// ⬇️ add this line so we can read the selected org from the dash
import { useTenant } from "../../contexts/TenantContext";

type OrgContextValue = {
  orgId: string;
  // add other fields you already expose here if needed (orgSlug, etc.)
};

const OrgContext = createContext<OrgContextValue | undefined>(undefined);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { organization } = useTenant(); // ✅ from the dashboard
  const envDefault = import.meta.env.VITE_DEFAULT_ORG_ID as string | undefined;

  const orgId = useMemo(
    () => (organization?.id ? String(organization.id) : envDefault ?? ""),
    [organization?.id, envDefault]
  );

  if (!orgId) {
    // Show a friendly message instead of rendering nothing
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Editor unavailable: no organization selected. Choose one in the dashboard
        or set <code>VITE_DEFAULT_ORG_ID</code> in <code>.env.local</code>.
      </div>
    );
  }

  const value: OrgContextValue = { orgId };
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}
