'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() })
      })

      if (response.ok) {
        // Token saved successfully
        router.push('/studio/home')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save token')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Login to Barkhaus
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Paste your Xano bearer token to get started
          </p>
        </div>

        <form onSubmit={handleTokenSubmit} className="space-y-6">
          <div>
            <Label htmlFor="token">Xano Bearer Token</Label>
            <Input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Xano token..."
              className="mt-1"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !token.trim()}
          >
            {loading ? 'Saving...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Available Tokens:</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Auth:</strong> mGDOpzrGb2PvfCn4tOJB7drqYvs
            </div>
            <div>
              <strong>Pages:</strong> YO8skT62RziHLczjvRGVKybGwlE
            </div>
            <div>
              <strong>Dogs:</strong> 165XkoniNXylFdNKgO_aCvmAIcQ
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}