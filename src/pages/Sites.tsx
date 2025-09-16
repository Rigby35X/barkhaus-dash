import React from 'react'
import { SiteManagementDashboard } from '../components/admin/SiteManagementDashboard'
import { useTenant } from '../contexts/TenantContext'
import EmbedManager from '../components/admin/EmbedManager'

// Get real tenant data from context
function useTenantData() {
  const { organization, currentTenant } = useTenant()

  // Extract tenant ID from organization ID or use a default (starting from 3)
  const tenantId = organization?.id ? parseInt(organization.id) : 3

  // Create subdomain from organization name
  const subdomain = organization?.name
    ? organization.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    : 'happy-paws'

  return {
    tenantId,
    organizationName: organization?.name || "Happy Paws Rescue",
    subdomain,
    customDomain: organization?.website || "",
    isPublished: false // This could come from organization data
  }
}

export default function Sites() {
  const tenantData = useTenantData()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Website Management</h1>
        <p className="text-gray-600 mt-2">
          Generate and manage your organization's website using AI
        </p>
      </div>

      <SiteManagementDashboard
        tenantId={tenantData.tenantId}
        organizationName={tenantData.organizationName}
        subdomain={tenantData.subdomain}
        customDomain={tenantData.customDomain}
        isPublished={tenantData.isPublished}
      />

      {/* Embed Widget Manager */}
      <div className="mt-8">
        <EmbedManager />
      </div>
    </div>
  )
}
