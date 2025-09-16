'use client'

import React from 'react'
import Link from 'next/link'
import { Heart, Users, DollarSign, Calendar, TrendingUp, AlertCircle, ArrowUpRight, FileText } from 'lucide-react'
import { StatsGrid } from '@/components/admin/stats-card'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Animals',
      value: '127',
      change: {
        value: '+12%',
        type: 'increase' as const,
        period: 'from last month'
      },
      icon: Heart,
      color: 'blue' as const,
      href: '/dash/animals'
    },
    {
      title: 'Active Pages',
      value: '24',
      change: {
        value: '+3%',
        type: 'increase' as const,
        period: 'from last month'
      },
      icon: FileText,
      color: 'green' as const,
      href: '/dash/pages'
    },
    {
      title: 'Monthly Visitors',
      value: '12,450',
      change: {
        value: '+23%',
        type: 'increase' as const,
        period: 'from last month'
      },
      icon: TrendingUp,
      color: 'yellow' as const,
      href: '/dash/analytics'
    },
    {
      title: 'Published Content',
      value: '18',
      change: {
        value: '+5%',
        type: 'increase' as const,
        period: 'from last month'
      },
      icon: Calendar,
      color: 'purple' as const,
      href: '/dash/pages'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'animal',
      message: 'Bella (Golden Retriever) profile was updated',
      time: '2 hours ago',
      icon: Heart,
      color: 'text-green-600',
      href: '/dash/animals'
    },
    {
      id: 2,
      type: 'page',
      message: 'About Us page was published',
      time: '4 hours ago',
      icon: DollarSign,
      color: 'text-yellow-600',
      href: '/dash/pages'
    },
    {
      id: 3,
      type: 'design',
      message: 'Site theme colors were updated',
      time: '6 hours ago',
      icon: Users,
      color: 'text-blue-600',
      href: '/dash/design'
    },
    {
      id: 4,
      type: 'settings',
      message: 'Contact information was updated',
      time: '1 day ago',
      icon: AlertCircle,
      color: 'text-purple-600',
      href: '/dash/settings'
    }
  ]

  const quickActions = [
    {
      id: 1,
      title: 'Add New Animal',
      description: 'Create a new animal profile',
      href: '/dash/animals/new',
      icon: Heart,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Create Page',
      description: 'Build a new page with the editor',
      href: '/studio',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Customize Design',
      description: 'Update site colors and fonts',
      href: '/dash/design',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's what's happening with your site.
        </p>
      </div>

      {/* Stats */}
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <Link
                    key={activity.id}
                    href={activity.href}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.id}
                    href={action.href}
                    className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Site Status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Site Status</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Site Online</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Database Connected</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600">2 Pending Updates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
