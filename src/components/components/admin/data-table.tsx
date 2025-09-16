'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  width?: string
}

interface Action<T> {
  label: string
  onClick: (item: T) => void
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'danger'
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  actions?: Action<T>[]
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  loading?: boolean
  emptyMessage?: string
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  onSort,
  loading = false,
  emptyMessage = 'No data available',
  className = ''
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [openActionMenus, setOpenActionMenus] = useState<Set<string>>(new Set())

  const handleSort = (key: string) => {
    if (!onSort) return
    
    let newDirection: 'asc' | 'desc' = 'asc'
    if (sortKey === key && sortDirection === 'asc') {
      newDirection = 'desc'
    }
    
    setSortKey(key)
    setSortDirection(newDirection)
    onSort(key, newDirection)
  }

  const toggleActionMenu = (itemId: string) => {
    const newOpenMenus = new Set(openActionMenus)
    if (newOpenMenus.has(itemId)) {
      newOpenMenus.delete(itemId)
    } else {
      newOpenMenus.add(itemId)
    }
    setOpenActionMenus(newOpenMenus)
  }

  const getValue = (item: T, key: string): any => {
    if (key.includes('.')) {
      return key.split('.').reduce((obj, k) => obj?.[k], item)
    }
    return item[key]
  }

  if (loading) {
    return (
      <div className={`bg-white shadow rounded-lg ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white shadow rounded-lg ${className}`}>
        <div className="p-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.width ? column.width : ''}`}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${
                            sortKey === column.key && sortDirection === 'asc' 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${
                            sortKey === column.key && sortDirection === 'desc' 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const itemId = item.id || index
              return (
                <tr key={itemId} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap">
                      {column.render 
                        ? column.render(item)
                        : (
                          <div className="text-sm text-gray-900">
                            {getValue(item, String(column.key))}
                          </div>
                        )
                      }
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => toggleActionMenu(String(itemId))}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {openActionMenus.has(String(itemId)) && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => toggleActionMenu(String(itemId))}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                              <div className="py-1">
                                {actions.map((action, actionIndex) => {
                                  const Icon = action.icon
                                  return (
                                    <button
                                      key={actionIndex}
                                      onClick={() => {
                                        action.onClick(item)
                                        toggleActionMenu(String(itemId))
                                      }}
                                      className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                                        action.variant === 'danger' 
                                          ? 'text-red-600 hover:bg-red-50' 
                                          : 'text-gray-700'
                                      }`}
                                    >
                                      {Icon && <Icon className="h-4 w-4 mr-3" />}
                                      {action.label}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
