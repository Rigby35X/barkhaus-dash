'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Globe, Eye, Settings, BarChart3, ExternalLink, Copy, Check } from 'lucide-react'
import { AIGenerationPanel } from './AIGenerationPanel'

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

  const siteUrl = customDomain ? `https://${customDomain}` : `https://yourapp.com/${subdomain}`

  useEffect(() => {
    fetchAnalytics()
  }, [tenantId])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/${tenantId}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const updateSiteSettings = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/sites/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          custom_domain: customDomain,
          is_published: isPublished
        })
      })

      const result = await response.json()
      if (result.success) {
        // Success feedback
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
    } finally {
      setIsUpdating(false)
    }
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate">AI Generate</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* AI Generation Tab */}
        <TabsContent value="generate" className="space-y-4">
          <AIGenerationPanel
            tenantId={tenantId}
            organizationName={organizationName}
            onSiteGenerated={fetchAnalytics}
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
                  Your site will be available at: yourapp.com/{subdomain}
                </div>
              </div>

              <Button 
                onClick={updateSiteSettings}
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
                onClick={updateSiteSettings}
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
                      {analytics.pageViews || 0}
                    </div>
                    <div className="text-sm text-blue-700">Page Views</div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.uniqueVisitors || 0}
                    </div>
                    <div className="text-sm text-green-700">Unique Visitors</div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {analytics.adoptionInquiries || 0}
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
      </Tabs>
    </div>
  )
}
