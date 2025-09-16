// app/(studio)/layout.tsx
import { Xano } from '@/lib/xanoClient';
import { StudioProviders } from '@/components/studio/providers';

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const orgId = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID as string;
  const [design, templates] = await Promise.all([
    Xano.getDesignSettings(orgId),
    Xano.getTemplates(orgId),
  ]);

  // Pass via context/provider your editor uses
  return <StudioProviders design={design} templates={templates}>{children}</StudioProviders>;
}
