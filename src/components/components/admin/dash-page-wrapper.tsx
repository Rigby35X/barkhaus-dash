"use client"

import { ReactNode } from "react"
import { ReactRouterProvider } from "./react-router-compat"
// Import env adapter to polyfill import.meta.env for imported dash components
import "@/lib/env-adapter"

interface DashPageWrapperProps {
  children: ReactNode
  className?: string
}

/**
 * Wrapper component to adapt imported dash pages to work in Next.js admin structure
 * Provides consistent styling and layout for imported components
 */
export function DashPageWrapper({ children, className = "" }: DashPageWrapperProps) {
  return (
    <ReactRouterProvider>
      <div className={`dash-page-wrapper ${className}`}>
      <style jsx global>{`
        /* Adapt imported dash styles to work with our admin layout */
        .dash-page-wrapper {
          width: 100%;
          height: 100%;
        }
        
        /* Override any conflicting styles from imported components */
        .dash-page-wrapper .card {
          @apply bg-white rounded-lg border border-gray-200 shadow-sm;
        }
        
        .dash-page-wrapper .btn-primary {
          @apply bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors;
        }
        
        .dash-page-wrapper .btn-secondary {
          @apply bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium transition-colors;
        }
        
        .dash-page-wrapper .input {
          @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
        }
        
        .dash-page-wrapper .stat-card {
          @apply bg-white rounded-lg border border-gray-200 p-6 shadow-sm;
        }
        
        /* Ensure proper spacing and layout */
        .dash-page-wrapper > * {
          max-width: 100%;
        }
      `}</style>
        {children}
      </div>
    </ReactRouterProvider>
  )
}
