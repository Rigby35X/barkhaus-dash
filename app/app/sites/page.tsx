import React from 'react'
import { SiteManagementDashboard } from '../../../components/admin/SiteManagementDashboard'

// This would typically come from your auth/session
async function getCurrentOrganization() {
  // Mock data - replace with actual data fetching
  return {
    tenantId: 1,
    organizationName: "Happy Paws Rescue",
    subdomain: "happy-paws",
    customDomain: "",
    isPublished: false
  }
}

export default async function SitesPage() {
  const org = await getCurrentOrganization()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Website Management</h1>
        <p className="text-gray-600 mt-2">
          Generate and manage your organization's website using AI
        </p>
      </div>

      <SiteManagementDashboard
        tenantId={org.tenantId}
        organizationName={org.organizationName}
        subdomain={org.subdomain}
        customDomain={org.customDomain}
        isPublished={org.isPublished}
      />
    </div>
  )
}
