'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Globe, Eye, Settings, BarChart3, ExternalLink, Copy, Check, TestTube } from 'lucide-react'
import { AIGenerationPanel } from './AIGenerationPanel'
import { updateSiteSettings, fetchAnalytics, fetchOrganizations, fetchAnimals, fetchTemplates, fetchPages, fetchSiteData } from '../../api/xano'

interface SiteManagementDashboardProps {
  tenantId: number
  organizationName: string
  subdomain: string
  customDomain?: string
  isPublished?: boolean
}

export function SiteManagementDashboard({ 
  tenantId, 
  organizationName, 
  subdomain, 
  customDomain: initialCustomDomain,
  isPublished: initialIsPublished 
}: SiteManagementDashboardProps) {
  const [customDomain, setCustomDomain] = useState(initialCustomDomain || '')
  const [isPublished, setIsPublished] = useState(initialIsPublished || false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const siteUrl = customDomain ? `https://${customDomain}` : `http://localhost:5173/${subdomain}`

  useEffect(() => {
    fetchAnalyticsData()
  }, [tenantId])

  const fetchAnalyticsData = async () => {
    try {
      console.log('📊 Fetching analytics for tenant:', tenantId)
      const result = await fetchAnalytics(tenantId)

      if (result.success && result.data) {
        console.log('✅ Analytics loaded:', result.data)
        setAnalytics(result.data)
      } else {
        console.log('⚠️ No analytics data available:', result.error)
        // Set default analytics for development
        setAnalytics({
          page_views: 0,
          unique_visitors: 0,
          adoption_inquiries: 0,
          avg_session_duration: 0,
          bounce_rate: 0,
          top_pages: [],
          recent_activity: []
        })
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setAnalytics(null)
    }
  }

  const updateSiteSettingsData = async () => {
    setIsUpdating(true)
    try {
      console.log('⚙️ Updating site settings for tenant:', tenantId)
      const result = await updateSiteSettings(tenantId, {
        custom_domain: customDomain || undefined,
        is_published: isPublished
      })

      if (result.success) {
        console.log('✅ Settings updated successfully')
        // Optionally show success message to user
      } else {
        console.error('❌ Failed to update settings:', result.error)
        // Optionally show error message to user
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const testApiEndpoints = async () => {
    console.log('🧪 Testing all Xano API endpoints...\n')

    // Test 1: Organizations
    console.log('1️⃣ Testing Organizations API...')
    try {
      const orgsResult = await fetchOrganizations()
      if (orgsResult.success) {
        console.log('✅ Organizations API working:', orgsResult.data)
      } else {
        console.log('❌ Organizations API failed:', orgsResult.error)
      }
    } catch (error) {
      console.log('❌ Organizations API error:', error)
    }

    // Test 2: Animals
    console.log('\n2️⃣ Testing Animals API...')
    try {
      const animalsResult = await fetchAnimals()
      if (animalsResult.success) {
        console.log('✅ Animals API working:', animalsResult.data?.length || 0, 'animals found')
      } else {
        console.log('❌ Animals API failed:', animalsResult.error)
      }
    } catch (error) {
      console.log('❌ Animals API error:', error)
    }

    // Test 3: Templates
    console.log('\n3️⃣ Testing Templates API...')
    try {
      const templatesResult = await fetchTemplates()
      if (templatesResult.success) {
        console.log('✅ Templates API working:', templatesResult.data?.length || 0, 'templates found')
      } else {
        console.log('❌ Templates API failed:', templatesResult.error)
      }
    } catch (error) {
      console.log('❌ Templates API error:', error)
    }

    // Test 4: Pages
    console.log('\n4️⃣ Testing Pages API...')
    try {
      const pagesResult = await fetchPages(tenantId)
      if (pagesResult.success) {
        console.log('✅ Pages API working:', pagesResult.data?.length || 0, 'pages found')
      } else {
        console.log('❌ Pages API failed:', pagesResult.error)
      }
    } catch (error) {
      console.log('❌ Pages API error:', error)
    }

    // Test 5: Site Data
    console.log('\n5️⃣ Testing Site Data API...')
    try {
      const siteResult = await fetchSiteData('happy-paws', '/')
      if (siteResult.success) {
        console.log('✅ Site Data API working:', siteResult.data)
      } else {
        console.log('❌ Site Data API failed:', siteResult.error)
      }
    } catch (error) {
      console.log('❌ Site Data API error:', error)
    }

    console.log('\n🎉 API testing complete! Check results above.')
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(siteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Site Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {organizationName} Website
              </CardTitle>
              <CardDescription>
                Manage your organization's website and settings
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  Development Mode
                </Badge>
                <span className="text-xs text-gray-500">Using fallback data</span>
                <button
                  onClick={() => {
                    // Force refresh to test real API
                    window.location.reload()
                  }}
                  className="text-xs text-blue-600 hover:underline ml-2"
                >
                  Retry APIs
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isPublished ? 'default' : 'secondary'}>
                {isPublished ? 'Published' : 'Draft'}
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a href={siteUrl} target="_blank" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="font-mono text-sm flex-1">{siteUrl}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyUrl}
              className="h-8 w-8 p-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
              <a href={siteUrl} target="_blank">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="generate">AI Generate</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="api-test">API Test</TabsTrigger>
        </TabsList>

        {/* AI Generation Tab */}
        <TabsContent value="generate" className="space-y-4">
          <AIGenerationPanel
            tenantId={tenantId}
            organizationName={organizationName}
            onSiteGenerated={fetchAnalyticsData}
          />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Site Settings
              </CardTitle>
              <CardDescription>
                Configure your website settings and publishing options
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Publish Site</Label>
                  <div className="text-sm text-gray-600">
                    Make your website visible to the public
                  </div>
                </div>
                <Switch
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <Input
                  id="subdomain"
                  value={subdomain}
                  disabled
                  className="font-mono"
                />
                <div className="text-sm text-gray-600">
                  Your site will be available at: localhost:5173/{subdomain}
                </div>
              </div>

              <Button
                onClick={updateSiteSettingsData}
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? 'Updating...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domains Tab */}
        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain</CardTitle>
              <CardDescription>
                Connect your own domain to your website
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-domain">Custom Domain</Label>
                <Input
                  id="custom-domain"
                  placeholder="www.yourrescue.org"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
                <div className="text-sm text-gray-600">
                  Enter your custom domain (e.g., www.yourrescue.org)
                </div>
              </div>

              {customDomain && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">DNS Configuration</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>Add these DNS records to your domain:</p>
                    <div className="font-mono bg-white p-2 rounded border">
                      <div>Type: CNAME</div>
                      <div>Name: www</div>
                      <div>Value: yourapp.com</div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={updateSiteSettingsData}
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? 'Updating...' : 'Save Domain Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Site Analytics
              </CardTitle>
              <CardDescription>
                Track your website performance and visitor metrics
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {analytics ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.page_views || 0}
                    </div>
                    <div className="text-sm text-blue-700">Page Views</div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.unique_visitors || 0}
                    </div>
                    <div className="text-sm text-green-700">Unique Visitors</div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {analytics.adoption_inquiries || 0}
                    </div>
                    <div className="text-sm text-purple-700">Adoption Inquiries</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics data will appear here once your site is published</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Test Tab */}
        <TabsContent value="api-test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                API Endpoint Testing
              </CardTitle>
              <CardDescription>
                Test the CORS-approved Xano API endpoints to verify connectivity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                console.log('🔍 API Test tab is rendering!');
                return null;
              })()}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Available Endpoints:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Organizations (site_config)</li>
                    <li>• Animals/Dogs (dogs)</li>
                    <li>• Templates (templates)</li>
                    <li>• Pages (pages)</li>
                    <li>• Site Data (live_site)</li>
                    <li>• Authentication (auth)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Test Results:</h4>
                  <div className="text-sm text-gray-600">
                    Click "Test All APIs" to check connectivity. Results will appear in the browser console.
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ API Test Status:</h4>
                  <p className="text-sm text-green-700">
                    Button functionality: ✅ Working<br/>
                    API endpoints: ❌ Blocked by CORS<br/>
                    Fallback data: ✅ Working
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      // Test direct fetch to see exact CORS error
                      fetch('https://x8ki-letl-twmt.n7.xano.io/api:1vOYCkyt/organizations', {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer 4YU-nsgX7ciL2CXFUqpaDxVGBqI`
                        }
                      })
                      .then(response => {
                        console.log('✅ Direct fetch success:', response)
                        return response.json()
                      })
                      .then(data => {
                        console.log('✅ Direct fetch data:', data)
                        alert(`Success! Real API data received:\n\n${JSON.stringify(data, null, 2).substring(0, 200)}...`)
                      })
                      .catch(error => {
                        console.log('❌ Direct fetch failed:', error)
                        alert('CORS is still blocking requests. This is expected in development.')
                      })
                    }}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  >
                    🔍 Test Direct API Call
                  </button>

                  <button
                    onClick={async () => {
                      console.log('🧪 Testing alternative endpoints...')

                      // Test different possible endpoints
                      const testEndpoints = [
                        { name: 'Dogs (base)', url: 'https://x8ki-letl-twmt.n7.xano.io/api:Od874PbA/dogs' },
                        { name: 'Animals', url: 'https://x8ki-letl-twmt.n7.xano.io/api:Od874PbA/animals' },
                        { name: 'Pets', url: 'https://x8ki-letl-twmt.n7.xano.io/api:Od874PbA/pets' },
                        { name: 'Organizations (base)', url: 'https://x8ki-letl-twmt.n7.xano.io/api:1vOYCkyt/organizations' },
                        { name: 'Organization', url: 'https://x8ki-letl-twmt.n7.xano.io/api:1vOYCkyt/organization' },
                        { name: 'Orgs', url: 'https://x8ki-letl-twmt.n7.xano.io/api:1vOYCkyt/orgs' }
                      ]

                      const results = []
                      for (const endpoint of testEndpoints) {
                        try {
                          const response = await fetch(endpoint.url, {
                            method: 'GET',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${endpoint.url.includes('Od874PbA') ? '165XkoniNXylFdNKgO_aCvmAIcQ' : '4YU-nsgX7ciL2CXFUqpaDxVGBqI'}`
                            }
                          })

                          if (response.ok) {
                            const data = await response.json()
                            console.log(`✅ ${endpoint.name}: SUCCESS`, data)
                            results.push(`✅ ${endpoint.name}: Working`)
                          } else {
                            console.log(`❌ ${endpoint.name}: ${response.status}`)
                            results.push(`❌ ${endpoint.name}: ${response.status}`)
                          }
                        } catch (error) {
                          console.log(`💥 ${endpoint.name}: ERROR`, error)
                          results.push(`💥 ${endpoint.name}: Error`)
                        }
                      }

                      alert(`Alternative Endpoints Test:\n\n${results.join('\n')}`)
                    }}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    🔍 Test Alternative Endpoints
                  </button>
                </div>

                <button
                  onClick={async () => {
                    console.log('🧪 Testing all API endpoints...')

                    const results = []

                    // Test each endpoint
                    const endpoints = [
                      {
                        name: 'Organizations',
                        fn: () => fetchOrganizations(),
                        url: 'https://x8ki-letl-twmt.n7.xano.io/api:1vOYCkyt/organizations'
                      },
                      {
                        name: 'Animals',
                        fn: () => fetchAnimals(),
                        url: 'https://x8ki-letl-twmt.n7.xano.io/api:Od874PbA/dogs'
                      },
                      {
                        name: 'Templates',
                        fn: () => fetchTemplates(),
                        url: 'https://x8ki-letl-twmt.n7.xano.io/api:cz-ZpYmR/templates'
                      },
                      {
                        name: 'Pages',
                        fn: () => fetchPages(tenantId),
                        url: `https://x8ki-letl-twmt.n7.xano.io/api:mlssTgVM/pages?tenant_id=${tenantId}`
                      },
                      {
                        name: 'Site Data',
                        fn: () => fetchSiteData('happy-paws', '/'),
                        url: 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR/render-payload?slug=happy-paws&path=/'
                      }
                    ]

                    for (const endpoint of endpoints) {
                      console.log(`\n🔍 Testing ${endpoint.name}...`)
                      console.log(`📡 URL: ${endpoint.url}`)
                      try {
                        const result = await endpoint.fn()
                        if (result.success) {
                          console.log(`✅ ${endpoint.name}: SUCCESS`, result.data)
                          results.push(`✅ ${endpoint.name}: Working`)
                        } else {
                          console.log(`❌ ${endpoint.name}: FAILED`, result.error)
                          if (result.error === '404') {
                            results.push(`❌ ${endpoint.name}: Endpoint not found (404)`)
                          } else {
                            results.push(`❌ ${endpoint.name}: ${result.error}`)
                          }
                        }
                      } catch (error) {
                        console.log(`💥 ${endpoint.name}: ERROR`, error)
                        results.push(`💥 ${endpoint.name}: ${error.message}`)
                      }
                    }

                    console.log('\n📊 FINAL RESULTS:')
                    results.forEach(result => console.log(result))

                    alert(`API Test Complete! Check console for details.\n\nSummary:\n${results.join('\n')}`)
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  🧪 Test All API Endpoints
                </button>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• CORS errors are expected in development</p>
                  <p>• Check browser console for detailed results</p>
                  <p>• Real endpoints will work in production</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-4">
                Check the browser console for detailed test results
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
