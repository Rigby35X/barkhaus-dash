'use client'

import React, { useState, useEffect } from 'react'
import { 
  Globe, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Eye,
  History,
  Rocket
} from 'lucide-react'
import { useOrg } from '@/components/org-provider'
import { withXanoAuth } from '@/components/xano-auth-client'

interface LiveSiteVersion {
  id: number
  version: number
  published_at: string
  snapshot_data: string
}

interface PublishStatus {
  isPublished: boolean
  lastPublished?: string
  currentVersion?: number
  pendingChanges: boolean
}

export default function PublishPage() {
  const { orgId } = useOrg()
  const [publishStatus, setPublishStatus] = useState<PublishStatus>({
    isPublished: false,
    pendingChanges: false
  })
  const [versions, setVersions] = useState<LiveSiteVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load publish status and version history
  useEffect(() => {
    const loadData = async () => {
      if (!orgId || typeof window === 'undefined') return

      try {
        setLoading(true)
        setError(null)

        // Get current live site status
        const liveSiteRes = await fetch(`/api/orgs/${orgId}/live-site`, withXanoAuth())
        if (liveSiteRes.ok) {
          const liveSite = await liveSiteRes.json()
          setPublishStatus({
            isPublished: true,
            lastPublished: liveSite.published_at,
            currentVersion: liveSite.version,
            pendingChanges: false // TODO: Calculate based on page changes
          })
        }

        // Get version history
        const historyRes = await fetch(`/api/orgs/${orgId}/live-site/history`, withXanoAuth())
        if (historyRes.ok) {
          const history = await historyRes.json()
          setVersions(history)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load publish data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [orgId])

  const handlePublishSite = async () => {
    if (!orgId || typeof window === 'undefined') return

    setPublishing(true)
    setError(null)

    try {
      const response = await fetch(`/api/orgs/${orgId}/publish`, withXanoAuth({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageSlug: 'home' }) // Publish entire site
      }))

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to publish site')
      }

      const result = await response.json()
      
      // Update status
      setPublishStatus({
        isPublished: true,
        lastPublished: new Date().toISOString(),
        currentVersion: result.liveSite.version,
        pendingChanges: false
      })

      // Refresh version history
      const historyRes = await fetch(`/api/orgs/${orgId}/live-site/history`, withXanoAuth())
      if (historyRes.ok) {
        const history = await historyRes.json()
        setVersions(history)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish site')
    } finally {
      setPublishing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading publish status...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Publish Site</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your live site deployment and version history
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Current Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              publishStatus.isPublished ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {publishStatus.isPublished ? (
                <Globe className="h-6 w-6 text-green-600" />
              ) : (
                <Clock className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {publishStatus.isPublished ? 'Site is Live' : 'Site Not Published'}
              </h3>
              {publishStatus.lastPublished && (
                <p className="text-sm text-gray-500">
                  Last published: {formatDate(publishStatus.lastPublished)}
                </p>
              )}
              {publishStatus.currentVersion && (
                <p className="text-sm text-gray-500">
                  Version: {publishStatus.currentVersion}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {publishStatus.isPublished && (
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Live Site
              </a>
            )}
            <button
              onClick={handlePublishSite}
              disabled={publishing}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Rocket className="h-4 w-4 mr-2" />
              {publishing ? 'Publishing...' : 'Publish Site'}
            </button>
          </div>
        </div>

        {publishStatus.pendingChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You have unpublished changes. Publish to make them live.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Version History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <History className="h-5 w-5 mr-2" />
            Version History
          </h3>
          
          {versions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No versions yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Publish your site to create the first version.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <div key={version.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-gray-900">
                          Version {version.version}
                        </span>
                        {version.version === publishStatus.currentVersion && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Published {formatDate(version.published_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        View Details
                      </button>
                      {version.version !== publishStatus.currentVersion && (
                        <button className="text-sm text-gray-600 hover:text-gray-800">
                          Rollback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
