'use client'

import { useEditor } from './editor-provider'
import { EditableElement } from './editable-element'
import { Button } from './ui/button'
import { cn } from '../../lib/utils'

export function WebsitePreview() {
  const { state } = useEditor()

  return (
    <div className={cn(
      "min-h-screen",
      state.isEditing && "pt-16", // Account for editor toolbar
      state.isPreviewMode && "editor-overlay"
    )}>
      {/* Hero Section */}
      <EditableElement
        id="hero-section"
        type="section"
        className={cn(
          "py-20 px-4",
          !state.elements['hero-section']?.visible && state.isEditing && "opacity-50"
        )}
        style={{
          backgroundColor: state.elements['hero-section']?.background || '#f8fafc',
          opacity: state.elements['hero-section']?.opacity || 1,
          display: !state.elements['hero-section']?.visible && !state.isEditing ? 'none' : 'block'
        }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <EditableElement
            id="hero-title"
            type="text"
            className="text-5xl font-bold"
            style={{
              color: state.elements['hero-title']?.textColor || '#1f2937'
            }}
          >
            {state.elements['hero-title']?.content || 'Welcome to Barkhaus'}
          </EditableElement>
          
          <EditableElement
            id="hero-subtitle"
            type="text"
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            style={{
              color: state.elements['hero-subtitle']?.textColor || '#6b7280'
            }}
          >
            {state.elements['hero-subtitle']?.content || 'Your premier pet care destination'}
          </EditableElement>
          
          <EditableElement
            id="hero-cta"
            type="button"
            className="inline-block"
          >
            <Button size="lg" className="text-lg px-8 py-3">
              {state.elements['hero-cta']?.content || 'Book Now'}
            </Button>
          </EditableElement>
        </div>
      </EditableElement>

      {/* About Section */}
      <EditableElement
        id="about-section"
        type="section"
        className={cn(
          "py-20 px-4",
          !state.elements['about-section']?.visible && state.isEditing && "opacity-50"
        )}
        style={{
          backgroundColor: state.elements['about-section']?.background || '#ffffff',
          opacity: state.elements['about-section']?.opacity || 1,
          display: !state.elements['about-section']?.visible && !state.isEditing ? 'none' : 'block'
        }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <EditableElement
            id="about-title"
            type="text"
            className="text-4xl font-bold"
            style={{
              color: state.elements['about-title']?.textColor || '#1f2937'
            }}
          >
            {state.elements['about-title']?.content || 'About Our Services'}
          </EditableElement>
          
          <EditableElement
            id="about-text"
            type="text"
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            style={{
              color: state.elements['about-text']?.textColor || '#6b7280'
            }}
          >
            {state.elements['about-text']?.content || 'We provide exceptional care for your beloved pets with our experienced team and state-of-the-art facilities.'}
          </EditableElement>
        </div>
      </EditableElement>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-4">Grooming</h3>
              <p className="text-gray-600">Professional grooming services to keep your pet looking and feeling their best.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-4">Boarding</h3>
              <p className="text-gray-600">Safe and comfortable boarding facilities for when you're away.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-4">Training</h3>
              <p className="text-gray-600">Expert training programs to help your pet learn and grow.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
