'use client'

import { type ReactNode } from 'react'
import { OrgProvider } from '@/components/org-provider'
import { StudioShell } from '@/components/studio/studio-shell'
import { EditorProvider } from '@/components/editor-provider'

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <OrgProvider>
      <EditorProvider>
        <StudioShell>{children}</StudioShell>
      </EditorProvider>
    </OrgProvider>
  )
}
