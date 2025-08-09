'use client'

import { CSSProperties } from 'react'
import { useEditor } from './editor-provider'
import { cn } from '../../lib/utils'

interface EditableImageProps {
  id: string
  alt?: string
  className?: string
  style?: CSSProperties
  width?: number
  height?: number
  defaultSrc?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

export function EditableImage({
  id,
  alt = '',
  className,
  style,
  width,
  height,
  defaultSrc = '/placeholder.svg?height=320&width=480',
  objectFit = 'cover',
}: EditableImageProps) {
  const { state, dispatch } = useEditor()
  const data = state.elements[id] || {}
  const src = data.src ?? defaultSrc
  const opacity = data.opacity ?? 1
  const blur = data.blur ?? 0
  const grayscale = data.grayscale ?? 0

  const isActive = state.activeElement === id
  const isEditing = state.isEditing && !state.isPreviewMode

  return (
    <div
      className={cn('relative', isEditing && 'editable-element', isActive && 'active')}
      onClick={(e) => {
        if (!state.isEditing || state.isPreviewMode) return
        e.preventDefault()
        e.stopPropagation()
        dispatch({ type: 'SET_ACTIVE_ELEMENT', elementId: id })
      }}
      data-element-id={id}
      data-element-type="image"
      style={{ ...style }}
    >
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn('w-full rounded-lg border', className)}
        style={{
          objectFit,
          opacity,
          filter: `blur(${blur}px) grayscale(${grayscale}%)`,
        }}
      />
      {isEditing && <div className="edit-indicator" />}
    </div>
  )
}
