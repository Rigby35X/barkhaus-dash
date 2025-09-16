'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { OrgProvider } from '@/components/org-provider'
import {
  Home,
  Heart,
  FileText,
  Palette,
  Settings,
  Menu,
  X,
  User,
  PlusCircle,
  Eye,
  Rocket
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dash', icon: Home },
  { name: 'Animals', href: '/dash/animals', icon: Heart },
  { name: 'Pages', href: '/dash/pages', icon: FileText },
  { name: 'Design', href: '/dash/design', icon: Palette },
  { name: 'Publish', href: '/dash/publish', icon: Rocket },
  { name: 'Settings', href: '/dash/settings', icon: Settings },
]

const quickActions = [
  { name: 'Add Animal', href: '/dash/animals/new', icon: PlusCircle },
  { name: 'New Page', href: '/dash/pages/new', icon: FileText },
  { name: 'View Site', href: '/', icon: Eye, external: true },
  { name: 'Studio Editor', href: '/studio', icon: Palette, external: true },
]

export default function DashLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <OrgProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center">
              <img src="/placeholder-logo.svg" alt="CMS" className="h-8 w-auto" />
              <span className="ml-2 text-lg font-semibold">Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions - Mobile */}
          <div className="px-4 py-4 border-t">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                    {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {action.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b">
            <img src="/placeholder-logo.svg" alt="CMS" className="h-8 w-auto" />
            <span className="ml-2 text-lg font-semibold">Admin</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions - Desktop */}
          <div className="px-4 py-4 border-t">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                    {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {action.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Profile dropdown placeholder */}
              <div className="flex items-center gap-x-2">
                <User className="h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-700">Admin User</span>
              </div>
            </div>
          </div>
        </div>

        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
    </OrgProvider>
  )
}