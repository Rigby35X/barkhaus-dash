'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Plus,
  Search,
  Edit,
  Globe,
  Calendar,
  MoreVertical,
  ExternalLink
} from 'lucide-react'
import { Page } from '@/lib/xanoClient'

// Mock data for now - will be replaced with Xano API calls
const mockPages: Page[] = [
  {
    id: 1,
    tenant_id: 1,
    slug: 'home',
    title: 'Home Page',
    content_json: '{}',
    seo_title: 'Welcome to Our Animal Shelter',
    seo_description: 'Find your perfect companion at our animal shelter',
    published: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    tenant_id: 1,
    slug: 'about',
    title: 'About Us',
    content_json: '{}',
    seo_title: 'About Our Mission',
    seo_description: 'Learn about our mission to help animals find loving homes',
    published: true,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z'
  },
  {
    id: 3,
    tenant_id: 1,
    slug: 'contact',
    title: 'Contact Us',
    content_json: '{}',
    seo_title: 'Get in Touch',
    seo_description: 'Contact us to learn more about adoption or volunteering',
    published: false,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  }
]

export default function PagesAdmin() {
  const [pages] = useState<Page[]>(mockPages)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter pages based on search
  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (published: boolean) => {
    if (published) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Globe className="h-3 w-3 mr-1" />
          Published
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Edit className="h-3 w-3 mr-1" />
          Draft
        </span>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your website pages and content
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            href="/studio"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Studio Editor
          </Link>
          <Link
            href="/dash/pages/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              {filteredPages.length} pages
            </span>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {filteredPages.map((page) => (
              <div key={page.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{page.title}</h3>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                      </div>
                    </div>
                    {page.seo_description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {page.seo_description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center space-x-4">
                      {getStatusBadge(page.published || false)}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Updated {new Date(page.updated_at || '').toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {page.published && (
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="View page"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/studio?pageId=${page.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit page"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPages.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search terms.'
                  : 'Get started by creating your first page.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Link
                    href="/studio"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Page
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
