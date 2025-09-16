'use client'

import { useEffect, useState } from 'react'

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/diagnostics')
      .then(res => res.json())
      .then(data => {
        setDiagnostics(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Diagnostics error:', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8">Loading diagnostics...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Xano Groups Configuration</h2>
          <div className="space-y-2">
            {diagnostics?.groups && Object.entries(diagnostics.groups).map(([key, value]: [string, any]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="font-medium">{key}:</span>
                <span className={`px-2 py-1 rounded text-sm ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {value || 'Not configured'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <div className="flex justify-between items-center">
            <span className="font-medium">Token Detected:</span>
            <span className={`px-2 py-1 rounded text-sm ${diagnostics?.tokenDetected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {diagnostics?.tokenDetected ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">NEXT_PUBLIC_DEFAULT_ORG_ID:</span>
              <span className="text-sm">{diagnostics?.env?.defaultOrgId || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">XANO_ORG_PREFIX:</span>
              <span className="text-sm">{diagnostics?.env?.orgPrefix || '/orgs (default)'}</span>
            </div>
          </div>
        </div>

        {diagnostics?.error && (
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-red-800">Error</h2>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">{diagnostics.error}</pre>
          </div>
        )}
      </div>
    </div>
  )
}