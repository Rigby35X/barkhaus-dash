'use client'

import Link from 'next/link'
import { CSSProperties, ReactNode } from 'react'
import { useEditor } from './editor-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EditableButtonProps {
  id: string
  hrefFallback?: string
  className?: string
  style?: CSSProperties
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?: 'default' | 'destructive' | 'ghost' | 'link' | 'outline' | 'secondary'
}

export function EditableButton({
  id,
  hrefFallback = '#',
  className,
  style,
  size = 'default',
  variant = 'default',
}: EditableButtonProps) {
  const { state, dispatch } = useEditor()
  const data = state.elements[id] || {}
  const label = data.content ?? 'Click'
  const link = data.link ?? hrefFallback

  const isActive = state.activeElement === id
  const isEditing = state.isEditing && !state.isPreviewMode

  const buttonNode: ReactNode = (
    <Button size={size} variant={variant} className={className} style={style}>
      {label}
    </Button>
  )

  return (
    <div
      className={cn(isEditing && 'editable-element inline-block', isActive && 'active')}
      onClick={(e) => {
        if (!state.isEditing || state.isPreviewMode) return
        e.preventDefault()
        e.stopPropagation()
        dispatch({ type: 'SET_ACTIVE_ELEMENT', elementId: id })
      }}
      data-element-id={id}
      data-element-type="button"
    >
      <Link href={link} onClick={(e) => (isEditing ? e.preventDefault() : undefined)}>
        {buttonNode}
      </Link>
      {isEditing && <div className="edit-indicator" />}
    </div>
  )
}
