'use client'

import React, { useState } from 'react'
import { Heart, Settings, Eye, EyeOff } from 'lucide-react'
import { DonationWidget } from '../donation-widget'

interface DonationBlockProps {
  elementId: string
  data: {
    campaignId?: string
    title?: string
    description?: string
    goalAmount?: number
    currentAmount?: number
    donorCount?: number
    theme?: 'light' | 'dark' | 'primary'
    size?: 'small' | 'medium' | 'large'
    showProgress?: boolean
    showDonorCount?: boolean
    customButton?: string
  }
  isEditing: boolean
  onUpdate: (elementId: string, data: any) => void
}

export function DonationBlock({ elementId, data, isEditing, onUpdate }: DonationBlockProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [localData, setLocalData] = useState(data)

  const handleUpdate = (field: string, value: any) => {
    const newData = { ...localData, [field]: value }
    setLocalData(newData)
    onUpdate(elementId, newData)
  }

  const handleSave = () => {
    onUpdate(elementId, localData)
    setShowSettings(false)
  }

  if (!isEditing) {
    return <DonationWidget {...data} />
  }

  return (
    <div className="relative group">
      <DonationWidget {...localData} />
      
      {/* Edit Overlay */}
      <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white rounded-md shadow-md hover:bg-gray-50 transition-colors"
            title="Edit donation widget"
          >
            <Settings className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
          <Heart className="h-3 w-3 inline mr-1" />
          Donation Widget
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Donation Widget Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <EyeOff className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Campaign ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign ID
                </label>
                <input
                  type="text"
                  value={localData.campaignId || ''}
                  onChange={(e) => handleUpdate('campaignId', e.target.value)}
                  placeholder="your-campaign-id"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={localData.title || ''}
                  onChange={(e) => handleUpdate('title', e.target.value)}
                  placeholder="Help Our Animals"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Goal Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Amount ($)
                </label>
                <input
                  type="number"
                  value={localData.goalAmount || ''}
                  onChange={(e) => handleUpdate('goalAmount', parseInt(e.target.value) || 0)}
                  placeholder="10000"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Current Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Amount ($)
                </label>
                <input
                  type="number"
                  value={localData.currentAmount || ''}
                  onChange={(e) => handleUpdate('currentAmount', parseInt(e.target.value) || 0)}
                  placeholder="6500"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  value={localData.theme || 'primary'}
                  onChange={(e) => handleUpdate('theme', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="primary">Primary</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <select
                  value={localData.size || 'medium'}
                  onChange={(e) => handleUpdate('size', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={localData.description || ''}
                onChange={(e) => handleUpdate('description', e.target.value)}
                placeholder="Your donation helps us provide food, shelter, and medical care for animals in need."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Button Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={localData.customButton || ''}
                onChange={(e) => handleUpdate('customButton', e.target.value)}
                placeholder="Donate Now"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localData.showProgress !== false}
                  onChange={(e) => handleUpdate('showProgress', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show progress bar</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localData.showDonorCount !== false}
                  onChange={(e) => handleUpdate('showDonorCount', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show donor count</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
