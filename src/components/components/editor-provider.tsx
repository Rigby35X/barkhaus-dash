'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useOrg } from '@/components/org-provider'
import { withXanoAuth } from '@/components/xano-auth-client'
import { DesignSettings } from '@/lib/xanoClient'

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
  designSettings: DesignSettings | null
  designSettingsLoading: boolean
  designSettingsError: string | null
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
  | { type: 'SET_DESIGN_SETTINGS'; settings: DesignSettings }
  | { type: 'SET_DESIGN_SETTINGS_LOADING'; loading: boolean }
  | { type: 'SET_DESIGN_SETTINGS_ERROR'; error: string | null }

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
  designSettings: null,
  designSettingsLoading: false,
  designSettingsError: null,
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
    case 'SET_DESIGN_SETTINGS':
      return { ...state, designSettings: action.settings }
    case 'SET_DESIGN_SETTINGS_LOADING':
      return { ...state, designSettingsLoading: action.loading }
    case 'SET_DESIGN_SETTINGS_ERROR':
      return { ...state, designSettingsError: action.error }
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
      if (!orgId || !state.pageSlug || typeof window === 'undefined') return
      try {
        const res = await fetch(`/api/orgs/${orgId}/pages/${state.pageSlug}/elements`, withXanoAuth())
        if (res.ok) {
          const data = await res.json()
          dispatch({ type: 'HYDRATE_ELEMENTS', elements: data.elements || {} })
        }
      } catch {}
    }
    load()
  }, [orgId, state.pageSlug])

  // Load design settings
  useEffect(() => {
    const loadDesignSettings = async () => {
      if (!orgId || typeof window === 'undefined') return

      dispatch({ type: 'SET_DESIGN_SETTINGS_LOADING', loading: true })
      dispatch({ type: 'SET_DESIGN_SETTINGS_ERROR', error: null })

      try {
        const res = await fetch(`/api/orgs/${orgId}/design-settings`, withXanoAuth())
        if (res.ok) {
          const settings = await res.json()
          dispatch({ type: 'SET_DESIGN_SETTINGS', settings })
        } else {
          throw new Error('Failed to load design settings')
        }
      } catch (error) {
        dispatch({
          type: 'SET_DESIGN_SETTINGS_ERROR',
          error: error instanceof Error ? error.message : 'Failed to load design settings'
        })
      } finally {
        dispatch({ type: 'SET_DESIGN_SETTINGS_LOADING', loading: false })
      }
    }

    loadDesignSettings()
  }, [orgId])

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
