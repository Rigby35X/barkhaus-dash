'use client'

import { CSSProperties } from 'react'
import { useEditor } from './editor-provider'
import { cn } from '../../lib/utils'

interface EditableTextProps {
  id: string
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  style?: CSSProperties
  defaultText?: string
}

export function EditableText({
  id,
  as = 'div',
  className,
  style,
  defaultText,
}: EditableTextProps) {
  const { state, dispatch } = useEditor()
  const Comp = as
  const content = state.elements[id]?.content ?? defaultText ?? ''

  const isActive = state.activeElement === id
  const isEditing = state.isEditing && !state.isPreviewMode

  return (
    <Comp
      className={cn(className, isEditing && 'editable-element', isActive && 'active')}
      style={style}
      onClick={(e) => {
        if (!state.isEditing || state.isPreviewMode) return
        e.preventDefault()
        e.stopPropagation()
        dispatch({ type: 'SET_ACTIVE_ELEMENT', elementId: id })
      }}
      data-element-id={id}
      data-element-type="text"
    >
      {content}
      {isEditing && <div className="edit-indicator" />}
    </Comp>
  )
}
