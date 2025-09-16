'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Settings, 
  Edit, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  Building,
  ExternalLink,
  Palette,
  FileText,
  Heart
} from 'lucide-react'
import { useOrg } from './org-provider'
import { useEditor } from './editor-provider'

export function AdminBar() {
  const { orgId, orgName, organizations, setOrgId, isMultiTenant } = useOrg()
  const { state, dispatch } = useEditor()
  const pathname = usePathname()
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)

  // Don't show admin bar on admin pages
  if (pathname.startsWith('/dash') || pathname.startsWith('/studio')) {
    return null
  }

  const currentPageSlug = pathname === '/' ? 'home' : pathname.slice(1)

  const quickActions = [
    {
      name: 'Edit Page',
      href: `/studio?pageId=${currentPageSlug}`,
      icon: Edit,
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      name: 'Admin Dashboard',
      href: '/dash',
      icon: Settings,
      color: 'text-gray-600 hover:text-gray-700'
    },
    {
      name: 'Design Settings',
      href: '/dash/design',
      icon: Palette,
      color: 'text-purple-600 hover:text-purple-700'
    },
    {
      name: 'Manage Animals',
      href: '/dash/animals',
      icon: Heart,
      color: 'text-red-600 hover:text-red-700'
    },
    {
      name: 'All Pages',
      href: '/dash/pages',
      icon: FileText,
      color: 'text-green-600 hover:text-green-700'
    }
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Left side - Org info and switcher */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-gray-300" />
              {isMultiTenant ? (
                <div className="relative">
                  <button
                    onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                    className="flex items-center space-x-1 text-sm font-medium text-white hover:text-gray-300 transition-colors"
                  >
                    <span>{orgName}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  
                  {showOrgDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                      {organizations.map((org) => (
                        <button
                          key={org.id}
                          onClick={() => {
                            setOrgId(org.id)
                            setShowOrgDropdown(false)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            org.id === orgId
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="font-medium">{org.name}</div>
                          {org.domain && (
                            <div className="text-xs text-gray-500">{org.domain}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-sm font-medium">{orgName}</span>
              )}
            </div>

            {/* Edit mode toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_EDITING' })}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                  state.isEditing
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {state.isEditing ? (
                  <>
                    <EyeOff className="h-3 w-3" />
                    <span>Exit Edit</span>
                  </>
                ) : (
                  <>
                    <Edit className="h-3 w-3" />
                    <span>Edit Page</span>
                  </>
                )}
              </button>

              {state.isEditing && (
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_PREVIEW' })}
                  className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                    state.isPreviewMode
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  <span>{state.isPreviewMode ? 'Editing' : 'Preview'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right side - Quick actions */}
          <div className="flex items-center space-x-1">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  title={action.name}
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{action.name}</span>
                </Link>
              )
            })}
            
            {/* External link to live site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              title="View Live Site"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">Live Site</span>
            </a>
          </div>
        </div>
      </div>

      {/* Unsaved changes indicator */}
      {state.hasUnsavedChanges && (
        <div className="bg-yellow-600 text-yellow-100 text-center py-1 text-xs">
          You have unsaved changes
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showOrgDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowOrgDropdown(false)}
        />
      )}
    </div>
  )
}
