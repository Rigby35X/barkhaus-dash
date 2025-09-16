'use client'

import { ReactNode, CSSProperties } from 'react'
import { useEditor } from './editor-provider'
import { Edit3, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditableElementProps {
  id: string
  type: 'text' | 'button' | 'image' | 'section'
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function EditableElement({ 
  id, 
  type, 
  children, 
  className,
  style 
}: EditableElementProps) {
  const { state, dispatch } = useEditor()

  const handleClick = (e: React.MouseEvent) => {
    if (!state.isEditing || state.isPreviewMode) return
    
    e.preventDefault()
    e.stopPropagation()
    
    dispatch({ type: 'SET_ACTIVE_ELEMENT', elementId: id })
  }

  const isActive = state.activeElement === id
  const isEditing = state.isEditing && !state.isPreviewMode

  return (
    <div
      className={cn(
        className,
        isEditing && "editable-element",
        isActive && "active"
      )}
      style={style}
      onClick={handleClick}
      data-element-id={id}
      data-element-type={type}
    >
      {children}
      
      {isEditing && (
        <div className="edit-indicator">
          {isActive ? (
            <Edit className="h-3 w-3" />
          ) : (
            <Edit3 className="h-3 w-3" />
          )}
        </div>
      )}
    </div>
  )
}
