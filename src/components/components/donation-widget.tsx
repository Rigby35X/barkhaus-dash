'use client'

import React, { useState, useEffect } from 'react'
import { Heart, DollarSign, Users, Target, ExternalLink } from 'lucide-react'

interface DonationWidgetProps {
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
  className?: string
}

interface DonationStats {
  raised: number
  goal: number
  donors: number
  percentage: number
}

export function DonationWidget({
  campaignId = 'demo-campaign',
  title = 'Help Our Animals',
  description = 'Your donation helps us provide food, shelter, and medical care for animals in need.',
  goalAmount = 10000,
  currentAmount = 6500,
  donorCount = 127,
  theme = 'primary',
  size = 'medium',
  showProgress = true,
  showDonorCount = true,
  customButton = 'Donate Now',
  className = ''
}: DonationWidgetProps) {
  const [stats, setStats] = useState<DonationStats>({
    raised: currentAmount,
    goal: goalAmount,
    donors: donorCount,
    percentage: Math.round((currentAmount / goalAmount) * 100)
  })
  const [loading, setLoading] = useState(false)

  // Load real donation stats from Givebutter API
  useEffect(() => {
    const loadStats = async () => {
      if (!campaignId || campaignId === 'demo-campaign') return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/givebutter/campaign/${campaignId}/stats`)
        if (response.ok) {
          const data = await response.json()
          setStats({
            raised: data.raised || currentAmount,
            goal: data.goal || goalAmount,
            donors: data.donors || donorCount,
            percentage: Math.round(((data.raised || currentAmount) / (data.goal || goalAmount)) * 100)
          })
        }
      } catch (error) {
        console.error('Failed to load donation stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [campaignId, currentAmount, goalAmount, donorCount])

  const handleDonate = () => {
    if (campaignId && campaignId !== 'demo-campaign') {
      // Open Givebutter donation page
      window.open(`https://givebutter.com/c/${campaignId}`, '_blank', 'noopener,noreferrer')
    } else {
      // Demo mode - show alert
      alert('This is a demo widget. In production, this would open the Givebutter donation page.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const themeClasses = {
    light: {
      container: 'bg-white border border-gray-200',
      text: 'text-gray-900',
      subtext: 'text-gray-600',
      button: 'bg-gray-900 hover:bg-gray-800 text-white',
      progress: 'bg-gray-200',
      progressBar: 'bg-gray-900'
    },
    dark: {
      container: 'bg-gray-900 border border-gray-700',
      text: 'text-white',
      subtext: 'text-gray-300',
      button: 'bg-white hover:bg-gray-100 text-gray-900',
      progress: 'bg-gray-700',
      progressBar: 'bg-white'
    },
    primary: {
      container: 'bg-white border border-gray-200',
      text: 'text-gray-900',
      subtext: 'text-gray-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      progress: 'bg-gray-200',
      progressBar: 'bg-blue-600'
    }
  }

  const sizeClasses = {
    small: {
      container: 'p-4',
      title: 'text-lg font-semibold',
      description: 'text-sm',
      stats: 'text-sm',
      button: 'px-4 py-2 text-sm'
    },
    medium: {
      container: 'p-6',
      title: 'text-xl font-semibold',
      description: 'text-base',
      stats: 'text-base',
      button: 'px-6 py-3 text-base'
    },
    large: {
      container: 'p-8',
      title: 'text-2xl font-bold',
      description: 'text-lg',
      stats: 'text-lg',
      button: 'px-8 py-4 text-lg'
    }
  }

  const currentTheme = themeClasses[theme]
  const currentSize = sizeClasses[size]

  return (
    <div className={`rounded-lg shadow-lg ${currentTheme.container} ${currentSize.container} ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <Heart className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h3 className={`${currentSize.title} ${currentTheme.text}`}>{title}</h3>
          {description && (
            <p className={`${currentSize.description} ${currentTheme.subtext} mt-1`}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className={`font-semibold ${currentSize.stats} ${currentTheme.text}`}>
              {formatCurrency(stats.raised)} raised
            </span>
          </div>
          <span className={`${currentSize.stats} ${currentTheme.subtext}`}>
            of {formatCurrency(stats.goal)} goal
          </span>
        </div>

        {showProgress && (
          <div className="space-y-2">
            <div className={`w-full h-3 ${currentTheme.progress} rounded-full overflow-hidden`}>
              <div
                className={`h-full ${currentTheme.progressBar} transition-all duration-500 ease-out`}
                style={{ width: `${Math.min(stats.percentage, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={currentTheme.subtext}>{stats.percentage}% funded</span>
              {showDonorCount && (
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span className={currentTheme.subtext}>{stats.donors} donors</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleDonate}
        disabled={loading}
        className={`w-full ${currentSize.button} ${currentTheme.button} font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50`}
      >
        <Heart className="h-4 w-4" />
        <span>{customButton}</span>
        <ExternalLink className="h-4 w-4" />
      </button>

      {/* Powered by Givebutter */}
      <div className="mt-4 text-center">
        <a
          href="https://givebutter.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs ${currentTheme.subtext} hover:underline`}
        >
          Powered by Givebutter
        </a>
      </div>
    </div>
  )
}

// Editable version for the inline editor
export function EditableDonationWidget(props: DonationWidgetProps & { elementId: string }) {
  return (
    <div className="relative group">
      <DonationWidget {...props} />
      {/* Edit overlay would be added by the inline editor */}
    </div>
  )
}
