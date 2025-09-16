"use client"

import { useRouter } from 'next/navigation'
import { createContext, useContext, ReactNode } from 'react'

// React Router compatibility layer for Next.js
// This allows imported dash components to work without modification

interface RouterContextType {
  navigate: (path: string) => void
  location: {
    pathname: string
  }
}

const RouterContext = createContext<RouterContextType | null>(null)

export function ReactRouterProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  
  const navigate = (path: string) => {
    // Convert React Router paths to Next.js admin paths
    if (path.startsWith('/')) {
      router.push(`/admin${path}`)
    } else {
      router.push(`/admin/${path}`)
    }
  }

  const contextValue: RouterContextType = {
    navigate,
    location: {
      pathname: '/admin' // Default admin path
    }
  }

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  )
}

// Hook to replace useNavigate from react-router-dom
export function useNavigate() {
  const context = useContext(RouterContext)
  if (!context) {
    // Fallback for when used outside provider
    const router = useRouter()
    return (path: string) => {
      if (path.startsWith('/')) {
        router.push(`/admin${path}`)
      } else {
        router.push(`/admin/${path}`)
      }
    }
  }
  return context.navigate
}

// Hook to replace useLocation from react-router-dom
export function useLocation() {
  const context = useContext(RouterContext)
  if (!context) {
    return { pathname: '/admin' }
  }
  return context.location
}
