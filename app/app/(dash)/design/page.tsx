'use client'

import React, { useState } from 'react'
import { Palette, Type, Eye, Save, RotateCcw } from 'lucide-react'
import { DesignSettings } from '@/lib/xanoClient'
import { useDesignSettings } from '@/hooks/use-design-settings'
import { useOrg } from '@/components/org-provider'

export default function DesignPage() {
  const { orgId } = useOrg()
  const {
    settings,
    loading,
    error,
    updateSettings,
    saveSettings,
    hasUnsavedChanges
  } = useDesignSettings(orgId)

  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Default settings if none are loaded
  const currentSettings = settings || {
    template_name: 'modern',
    heading_font_family: 'Inter',
    body_font_family: 'Inter',
    primary_color: '#3B82F6',
    secondary_color: '#10B981',
    background_color: '#FFFFFF',
    font_color: '#1F2937',
  }

  const handleColorChange = (field: keyof DesignSettings, value: string) => {
    updateSettings({ [field]: value })
  }

  const handleFontChange = (field: keyof DesignSettings, value: string) => {
    updateSettings({ [field]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveSettings()
    } catch (error) {
      console.error('Failed to save design settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    updateSettings({
      template_name: 'modern',
      heading_font_family: 'Inter',
      body_font_family: 'Inter',
      primary_color: '#3B82F6',
      secondary_color: '#10B981',
      background_color: '#FFFFFF',
      font_color: '#1F2937',
    })
  }

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Merriweather', label: 'Merriweather' },
  ]

  const templateOptions = [
    { value: 'modern', label: 'Modern' },
    { value: 'classic', label: 'Classic' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'bold', label: 'Bold' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Design Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Customize your site's appearance and branding
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading || !hasUnsavedChanges}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Template Selection */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Template</h3>
            <div className="grid grid-cols-2 gap-3">
              {templateOptions.map((template) => (
                <button
                  key={template.value}
                  onClick={() => handleFontChange('template_name', template.value)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    currentSettings.template_name === template.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{template.label}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {template.value === 'modern' && 'Clean and contemporary'}
                    {template.value === 'classic' && 'Traditional and elegant'}
                    {template.value === 'minimal' && 'Simple and focused'}
                    {template.value === 'bold' && 'Eye-catching and vibrant'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Type className="h-5 w-5 mr-2" />
              Typography
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading Font
                </label>
                <select
                  value={currentSettings.heading_font_family}
                  onChange={(e) => handleFontChange('heading_font_family', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body Font
                </label>
                <select
                  value={currentSettings.body_font_family}
                  onChange={(e) => handleFontChange('body_font_family', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Colors
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={currentSettings.primary_color}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={currentSettings.primary_color}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={currentSettings.secondary_color}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={currentSettings.secondary_color}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={currentSettings.background_color}
                    onChange={(e) => handleColorChange('background_color', e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={currentSettings.background_color}
                    onChange={(e) => handleColorChange('background_color', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={currentSettings.font_color}
                    onChange={(e) => handleColorChange('font_color', e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={currentSettings.font_color}
                    onChange={(e) => handleColorChange('font_color', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          <div
            className="border rounded-lg p-6 min-h-96"
            style={{
              backgroundColor: currentSettings.background_color,
              color: currentSettings.font_color,
              fontFamily: currentSettings.body_font_family,
            }}
          >
            <h1
              className="text-3xl font-bold mb-4"
              style={{
                color: currentSettings.primary_color,
                fontFamily: currentSettings.heading_font_family,
              }}
            >
              Sample Heading
            </h1>
            <h2
              className="text-xl font-semibold mb-3"
              style={{
                color: currentSettings.secondary_color,
                fontFamily: currentSettings.heading_font_family,
              }}
            >
              Secondary Heading
            </h2>
            <p className="mb-4">
              This is a sample paragraph to show how your body text will look with the selected font and colors.
              You can see how readable the text is against the background color.
            </p>
            <button
              className="px-4 py-2 rounded-md text-white font-medium"
              style={{ backgroundColor: currentSettings.primary_color }}
            >
              Primary Button
            </button>
            <button
              className="ml-3 px-4 py-2 rounded-md text-white font-medium"
              style={{ backgroundColor: currentSettings.secondary_color }}
            >
              Secondary Button
            </button>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-4">
              <div className="text-sm text-gray-500">Loading design settings...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}