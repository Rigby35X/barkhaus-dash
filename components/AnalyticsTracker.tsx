'use client'

import { useEffect } from 'react'

interface AnalyticsTrackerProps {
  tenantId: number
  pagePath: string
  userAgent: string
  referrer: string
}

export function AnalyticsTracker({ tenantId, pagePath, userAgent, referrer }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        await fetch(`/api/analytics/${tenantId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'page_view',
            page_path: pagePath,
            user_agent: userAgent,
            referrer: referrer
          })
        })
      } catch (error) {
        console.error('Analytics tracking failed:', error)
      }
    }

    trackPageView()

    // Track time on page
    const startTime = Date.now()
    
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - startTime
      
      // Use sendBeacon for reliable tracking on page unload
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          event_type: 'time_on_page',
          page_path: pagePath,
          duration: timeOnPage
        })
        
        navigator.sendBeacon(`/api/analytics/${tenantId}`, data)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [tenantId, pagePath, userAgent, referrer])

  // Track adoption inquiries
  useEffect(() => {
    const trackAdoptionClicks = () => {
      const adoptionButtons = document.querySelectorAll('[data-track="adoption-inquiry"]')
      
      adoptionButtons.forEach(button => {
        button.addEventListener('click', async () => {
          try {
            await fetch(`/api/analytics/${tenantId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                event_type: 'adoption_inquiry',
                page_path: pagePath,
                element: button.textContent || 'Unknown'
              })
            })
          } catch (error) {
            console.error('Adoption tracking failed:', error)
          }
        })
      })
    }

    // Track after a short delay to ensure DOM is ready
    setTimeout(trackAdoptionClicks, 1000)
  }, [tenantId, pagePath])

  return null // This component doesn't render anything
}
