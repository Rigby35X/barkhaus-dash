'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { usePathname, useSearchParams } from '@/editor/router-shims'
import { useOrg } from '@/editor/components/org-provider'
import { withXanoAuth } from '@/editor/components/xano-auth-client'

interface EditorState {
  isEditing: boolean
  mode: 'content' | 'style'
  activeElement: string | null
  hasUnsavedChanges: boolean
  isPreviewMode: boolean
  sessionId: string | null
  userId: string
  elements: Record<string, any>
  pageSlug: string
}

type EditorAction = 
  | { type: 'TOGGLE_EDITING' }
  | { type: 'SET_MODE'; mode: 'content' | 'style' }
  | { type: 'SET_ACTIVE_ELEMENT'; elementId: string | null }
  | { type: 'UPDATE_ELEMENT'; elementId: string; data: any }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SAVE_CHANGES' }
  | { type: 'SET_SESSION'; sessionId: string }
  | { type: 'SET_PAGE_SLUG'; slug: string }
  | { type: 'HYDRATE_ELEMENTS'; elements: Record<string, any> }

const initialState: EditorState = {
  isEditing: false,
  mode: 'content',
  activeElement: null,
  hasUnsavedChanges: false,
  isPreviewMode: false,
  sessionId: null,
  userId: 'user-1',
  elements: {},
  pageSlug: 'home',
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'TOGGLE_EDITING':
      return { ...state, isEditing: !state.isEditing }
    case 'SET_MODE':
      return { ...state, mode: action.mode }
    case 'SET_ACTIVE_ELEMENT':
      return { ...state, activeElement: action.elementId }
    case 'UPDATE_ELEMENT':
      return {
        ...state,
        elements: {
          ...state.elements,
          [action.elementId]: { ...state.elements[action.elementId], ...action.data }
        },
        hasUnsavedChanges: true
      }
    case 'TOGGLE_PREVIEW':
      return { ...state, isPreviewMode: !state.isPreviewMode }
    case 'SAVE_CHANGES':
      return { ...state, hasUnsavedChanges: false }
    case 'SET_SESSION':
      return { ...state, sessionId: action.sessionId }
    case 'SET_PAGE_SLUG':
      return { ...state, pageSlug: action.slug }
    case 'HYDRATE_ELEMENTS':
      return { ...state, elements: { ...action.elements } }
    default:
      return state
  }
}

const EditorContext = createContext<{
  state: EditorState
  dispatch: React.Dispatch<EditorAction>
} | null>(null)

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { orgId } = useOrg()

  useEffect(() => {
    const slug = pathname === '/' ? 'home' : pathname.replace(/^\/|\/$/g, '')
    if (slug !== state.pageSlug) {
      dispatch({ type: 'SET_PAGE_SLUG', slug })
    }
  }, [pathname, state.pageSlug])

  useEffect(() => {
    const load = async () => {
      if (!orgId || !state.pageSlug) return
      try {
        const res = await fetch(`/api/org/${orgId}/pages/${state.pageSlug}/elements`, withXanoAuth())
        if (res.ok) {
          const data = await res.json()
          dispatch({ type: 'HYDRATE_ELEMENTS', elements: data.elements || {} })
        }
      } catch {}
    }
    load()
  }, [orgId, state.pageSlug])

  useEffect(() => {
    const editParam = searchParams.get('edit')
    if (editParam === 'true' && !state.isEditing) {
      dispatch({ type: 'TOGGLE_EDITING' })
      dispatch({ type: 'SET_SESSION', sessionId: `session-${Date.now()}` })
    }
  }, [searchParams, state.isEditing])

  useEffect(() => {
    const handle = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handle)
    return () => window.removeEventListener('beforeunload', handle)
  }, [state.hasUnsavedChanges])

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditor() {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error('useEditor must be used within EditorProvider')
  return ctx
}
