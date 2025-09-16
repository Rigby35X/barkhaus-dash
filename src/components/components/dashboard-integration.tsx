'use client'

import { useEffect } from 'react'
import { useDashboardIntegration } from '@/lib/utils/dashboard-integration'
import { useOrg } from '@/components/org-provider'
import { useEditor } from '@/components/editor-provider'

export function DashboardIntegration() {
  const { orgId, orgName, editMode } = useDashboardIntegration()
  const { setOrgId } = useOrg()
  const { dispatch } = useEditor()

  useEffect(() => {
    if (orgId) {
      console.log(`🔗 Loaded from Barkhaus Dashboard for org: ${orgName} (${orgId})`)
      setOrgId(orgId)
    }

    if (editMode) {
      console.log('✏️ Edit mode enabled from dashboard')
      dispatch({ type: 'TOGGLE_EDITING' })
      dispatch({ type: 'SET_SESSION', sessionId: `dashboard-session-${Date.now()}` })
    }
  }, [orgId, orgName, editMode, setOrgId, dispatch])

  // This component doesn't render anything, it just handles the integration
  return null
}
