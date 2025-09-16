'use client'

import { useEffect } from 'react'
import { useEditor } from './editor-provider'

export function DesignSettingsProvider({ children }: { children: React.ReactNode }) {
  const { state } = useEditor()

  useEffect(() => {
    if (!state.designSettings) return

    const settings = state.designSettings

    // Apply design settings to CSS custom properties
    const root = document.documentElement

    // Typography
    if (settings.heading_font_family) {
      root.style.setProperty('--font-heading', settings.heading_font_family)
    }
    if (settings.body_font_family) {
      root.style.setProperty('--font-body', settings.body_font_family)
    }

    // Colors
    if (settings.primary_color) {
      root.style.setProperty('--color-primary', settings.primary_color)
    }
    if (settings.secondary_color) {
      root.style.setProperty('--color-secondary', settings.secondary_color)
    }
    if (settings.background_color) {
      root.style.setProperty('--color-background', settings.background_color)
    }
    if (settings.font_color) {
      root.style.setProperty('--color-text', settings.font_color)
    }

    // Apply Google Fonts if specified
    if (settings.google_heading_font_link && settings.google_heading_font_link !== settings.google_body_font_link) {
      const headingLink = document.getElementById('google-font-heading')
      if (headingLink) {
        headingLink.setAttribute('href', settings.google_heading_font_link)
      } else {
        const link = document.createElement('link')
        link.id = 'google-font-heading'
        link.rel = 'stylesheet'
        link.href = settings.google_heading_font_link
        document.head.appendChild(link)
      }
    }

    if (settings.google_body_font_link) {
      const bodyLink = document.getElementById('google-font-body')
      if (bodyLink) {
        bodyLink.setAttribute('href', settings.google_body_font_link)
      } else {
        const link = document.createElement('link')
        link.id = 'google-font-body'
        link.rel = 'stylesheet'
        link.href = settings.google_body_font_link
        document.head.appendChild(link)
      }
    }

    // Apply template-specific styles
    root.setAttribute('data-template', settings.template_name || 'modern')

    return () => {
      // Cleanup function to reset styles if needed
      // This is optional - you might want to keep styles applied
    }
  }, [state.designSettings])

  return (
    <>
      {children}
      <style jsx global>{`
        :root {
          --font-heading: ${state.designSettings?.heading_font_family || 'Inter'};
          --font-body: ${state.designSettings?.body_font_family || 'Inter'};
          --color-primary: ${state.designSettings?.primary_color || '#3B82F6'};
          --color-secondary: ${state.designSettings?.secondary_color || '#10B981'};
          --color-background: ${state.designSettings?.background_color || '#FFFFFF'};
          --color-text: ${state.designSettings?.font_color || '#1F2937'};
        }

        /* Apply design settings to common elements */
        body {
          font-family: var(--font-body);
          background-color: var(--color-background);
          color: var(--color-text);
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-heading);
        }

        /* Template-specific styles */
        [data-template="modern"] {
          --border-radius: 0.5rem;
          --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        }

        [data-template="classic"] {
          --border-radius: 0.25rem;
          --shadow: 0 2px 4px 0 rgb(0 0 0 / 0.1);
        }

        [data-template="minimal"] {
          --border-radius: 0;
          --shadow: none;
        }

        [data-template="bold"] {
          --border-radius: 1rem;
          --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        /* Apply template styles to buttons and cards */
        .btn-primary {
          background-color: var(--color-primary);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
        }

        .btn-secondary {
          background-color: var(--color-secondary);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
        }

        .card {
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          background-color: var(--color-background);
        }

        /* Editable elements inherit design settings */
        .editable-element[data-element-type="text"] {
          color: var(--color-text);
          font-family: var(--font-body);
        }

        .editable-element[data-element-type="heading"] {
          color: var(--color-text);
          font-family: var(--font-heading);
        }

        .editable-element[data-element-type="button"] {
          background-color: var(--color-primary);
          color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
        }

        .editable-element[data-element-type="button"].secondary {
          background-color: var(--color-secondary);
        }

        /* Preview mode adjustments */
        .editor-preview-mode {
          /* Add any preview-specific styles here */
        }
      `}</style>
    </>
  )
}
