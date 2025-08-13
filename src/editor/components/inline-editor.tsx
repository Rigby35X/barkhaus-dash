'use client'

import React from 'react'
import { useEditor } from './editor-provider'
import { useOrg } from './org-provider'
import { withXanoAuth } from './xano-auth-client'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { X, Save, Eye, EyeOff, Type, Palette, Undo, Redo } from 'lucide-react'
import { ElementEditor } from './element-editor'
type InlineEditorProps = {
  design?: any;
  pages?: any[];
  onSaveAction?: (payload: any) => Promise<any> | void;
  onPublishAction?: (pageSlug?: string) => Promise<any> | void;
};


export default function InlineEditor({
  design: _design,
  pages: _pages,
  onSaveAction: _onSaveAction = async () => {},
  onPublishAction: _onPublishAction = async () => {},
}: InlineEditorProps) {
  const { state, dispatch } = useEditor();
  const { orgId } = useOrg();

  if (!orgId) {
    return (
      <div className="text-sm text-muted-foreground">
        Editor unavailable: no org selected.
      </div>
    );
  }

  if (!state.isEditing) return null

  const handleSave = async () => {
    try {
      const res = await fetch(
        `/api/org/${orgId}/pages/${state.pageSlug}/elements`,
        withXanoAuth({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elements: state.elements, userId: state.userId }),
        })
      )
      if (!res.ok) throw new Error('Failed to save')
      dispatch({ type: 'SAVE_CHANGES' })
    } catch (e) {
      alert('Failed to save changes. Please try again.')
    }
  }

  const handleExit = () => {
    if (state.hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to exit?')) {
        dispatch({ type: 'TOGGLE_EDITING' })
        window.history.replaceState({}, '', window.location.pathname)
      }
    } else {
      dispatch({ type: 'TOGGLE_EDITING' })
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Editing {state.pageSlug}</Badge>
              <Badge variant="outline">Org: {orgId}</Badge>
              {state.hasUnsavedChanges && <Badge variant="destructive">Unsaved Changes</Badge>}
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Button
                variant={state.mode === 'content' ? 'default' : 'outline'}
                size="sm"
                onClick={() => dispatch({ type: 'SET_MODE', mode: 'content' })}
              >
                <Type className="mr-2 h-4 w-4" />
                Edit Content
              </Button>
              <Button
                variant={state.mode === 'style' ? 'default' : 'outline'}
                size="sm"
                onClick={() => dispatch({ type: 'SET_MODE', mode: 'style' })}
              >
                <Palette className="mr-2 h-4 w-4" />
                Edit Style
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm" onClick={() => dispatch({ type: 'TOGGLE_PREVIEW' })}>
              {state.isPreviewMode ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Exit Preview
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!state.hasUnsavedChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button variant="outline" size="sm" onClick={handleExit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {state.activeElement && !state.isPreviewMode && <ElementEditor />}

      <style>{`
        .editor-overlay { position: relative; }
        .editor-overlay::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,.1); pointer-events: none; z-index: 10; }
        .editable-element { position: relative; cursor: pointer; transition: all .2s ease; }
        .editable-element:hover { outline: 2px dashed #3b82f6; outline-offset: 2px; }
        .editable-element.active { outline: 2px solid #3b82f6; outline-offset: 2px; background: rgba(59,130,246,.1); }
        .edit-indicator { position: absolute; top: -8px; right: -8px; background: #3b82f6; color: #fff; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px; z-index: 20; }
      `}</style>
    </>
  )
}
