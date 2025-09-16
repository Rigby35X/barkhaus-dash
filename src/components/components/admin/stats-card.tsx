'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
    period?: string
  }
  icon?: React.ComponentType<{ className?: string }>
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
  href?: string
  description?: string
  loading?: boolean
}

const colorClasses = {
  blue: {
    icon: 'text-blue-600 bg-blue-100',
    change: 'text-blue-600',
    border: 'border-blue-200'
  },
  green: {
    icon: 'text-green-600 bg-green-100',
    change: 'text-green-600',
    border: 'border-green-200'
  },
  yellow: {
    icon: 'text-yellow-600 bg-yellow-100',
    change: 'text-yellow-600',
    border: 'border-yellow-200'
  },
  red: {
    icon: 'text-red-600 bg-red-100',
    change: 'text-red-600',
    border: 'border-red-200'
  },
  purple: {
    icon: 'text-purple-600 bg-purple-100',
    change: 'text-purple-600',
    border: 'border-purple-200'
  },
  gray: {
    icon: 'text-gray-600 bg-gray-100',
    change: 'text-gray-600',
    border: 'border-gray-200'
  }
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  href,
  description,
  loading = false
}: StatsCardProps) {
  const colors = colorClasses[color]
  
  const content = (
    <div className={`relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow sm:px-6 ${
      href ? 'cursor-pointer' : ''
    }`}>
      {loading ? (
        <div className="animate-pulse">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <div className="flex-1">
              <dt className="truncate text-sm font-medium text-gray-500">
                {title}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </dd>
            </div>
            {Icon && (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors.icon}`}>
                <Icon className="h-6 w-6" />
              </div>
            )}
          </div>
          
          {(change || description) && (
            <div className="mt-4 flex items-center justify-between">
              {change && (
                <div className="flex items-center text-sm">
                  {change.type === 'increase' && (
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                  )}
                  {change.type === 'decrease' && (
                    <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  {change.type === 'neutral' && (
                    <TrendingUp className="h-4 w-4 text-gray-600 mr-1" />
                  )}
                  <span className={`font-medium ${
                    change.type === 'increase' ? 'text-green-600' :
                    change.type === 'decrease' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {change.value}
                  </span>
                  {change.period && (
                    <span className="ml-2 text-gray-500">
                      {change.period}
                    </span>
                  )}
                </div>
              )}
              
              {description && (
                <span className="text-xs text-gray-500">
                  {description}
                </span>
              )}
              
              {href && (
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

interface StatsGridProps {
  stats: StatsCardProps[]
  loading?: boolean
  className?: string
}

export function StatsGrid({ stats, loading = false, className = '' }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} loading={loading} />
      ))}
    </div>
  )
}
