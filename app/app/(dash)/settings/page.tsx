'use client'

import React, { useState } from 'react'
import {
  Settings,
  Globe,
  Mail,
  MapPin,
  Save,
  ExternalLink
} from 'lucide-react'
import { SiteConfig } from '@/lib/xanoClient'

export default function SettingsPage() {
  const [config, setConfig] = useState<Partial<SiteConfig>>({
    site_name: 'Animal Shelter CMS',
    site_url: 'https://example.com',
    logo_url: '/placeholder-logo.svg',
    about_us: 'We are dedicated to helping animals find loving homes.',
    mission_statement: 'To rescue, rehabilitate, and rehome animals in need.',
    contact_info: {
      address: '123 Main St, City, State 12345',
      phone: '(555) 123-4567',
      email: 'info@animalshelter.com',
      hours: 'Mon-Fri 9AM-6PM, Sat-Sun 10AM-4PM'
    },
    ein_number: '12-3456789',
    social_media: {
      facebook: 'https://facebook.com/animalshelter',
      instagram: 'https://instagram.com/animalshelter',
      twitter: 'https://twitter.com/animalshelter',
      linkedin: ''
    },
    integrations: {
      petfinder: {
        enabled: false,
        api_key: '',
        organization_id: ''
      },
      givebutter: {
        enabled: false,
        api_key: '',
        campaign_id: ''
      }
    },
    contact_form_content: 'Get in touch with us about adoption, volunteering, or donations.',
    donate_form_content: 'Your donation helps us care for animals in need.',
    is_published: true
  })

  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Implement Xano API call
      // await Xano.saveSiteConfig(config)
      console.log('Saving site config:', config)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock delay
    } catch (error) {
      console.error('Failed to save site config:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (field: keyof SiteConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const updateNestedConfig = (parent: keyof SiteConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }))
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'contact', name: 'Contact Info', icon: Mail },
    { id: 'social', name: 'Social Media', icon: Globe },
    { id: 'integrations', name: 'Integrations', icon: ExternalLink },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Configure your site settings and integrations
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={config.site_name}
                    onChange={(e) => updateConfig('site_name', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site URL
                  </label>
                  <input
                    type="url"
                    value={config.site_url}
                    onChange={(e) => updateConfig('site_url', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={config.logo_url}
                  onChange={(e) => updateConfig('logo_url', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Us
                </label>
                <textarea
                  rows={4}
                  value={config.about_us}
                  onChange={(e) => updateConfig('about_us', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mission Statement
                </label>
                <textarea
                  rows={3}
                  value={config.mission_statement}
                  onChange={(e) => updateConfig('mission_statement', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EIN Number
                </label>
                <input
                  type="text"
                  value={config.ein_number}
                  onChange={(e) => updateConfig('ein_number', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="12-3456789"
                />
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={config.contact_info?.email}
                    onChange={(e) => updateNestedConfig('contact_info', 'email', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={config.contact_info?.phone}
                    onChange={(e) => updateNestedConfig('contact_info', 'phone', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Address
                </label>
                <textarea
                  rows={3}
                  value={config.contact_info?.address}
                  onChange={(e) => updateNestedConfig('contact_info', 'address', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours of Operation
                </label>
                <input
                  type="text"
                  value={config.contact_info?.hours}
                  onChange={(e) => updateNestedConfig('contact_info', 'hours', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Mon-Fri 9AM-6PM, Sat-Sun 10AM-4PM"
                />
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={config.social_media?.facebook}
                    onChange={(e) => updateNestedConfig('social_media', 'facebook', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={config.social_media?.instagram}
                    onChange={(e) => updateNestedConfig('social_media', 'instagram', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={config.social_media?.twitter}
                    onChange={(e) => updateNestedConfig('social_media', 'twitter', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={config.social_media?.linkedin}
                    onChange={(e) => updateNestedConfig('social_media', 'linkedin', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://linkedin.com/company/yourpage"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-8">
              {/* Givebutter Integration */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Givebutter</h3>
                    <p className="text-sm text-gray-500">Donation and fundraising platform</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.integrations?.givebutter?.enabled}
                      onChange={(e) => updateNestedConfig('integrations', 'givebutter', {
                        ...config.integrations?.givebutter,
                        enabled: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {config.integrations?.givebutter?.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={config.integrations?.givebutter?.api_key}
                        onChange={(e) => updateNestedConfig('integrations', 'givebutter', {
                          ...config.integrations?.givebutter,
                          api_key: e.target.value
                        })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campaign ID
                      </label>
                      <input
                        type="text"
                        value={config.integrations?.givebutter?.campaign_id}
                        onChange={(e) => updateNestedConfig('integrations', 'givebutter', {
                          ...config.integrations?.givebutter,
                          campaign_id: e.target.value
                        })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}