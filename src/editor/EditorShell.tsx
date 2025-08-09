import React from 'react';

// Providers (editor state + org/tenant context used by the inline editor)
import { OrgProvider } from './components/org-provider';
import { EditorProvider } from './components/editor-provider';

// Actual editor UI
import InlineEditor from './components/inline-editor';
import { WebsitePreview } from './components/website-preview';

// (optional) theme mapping if you want CSS vars from design settings
// import { applyDesignToDocument } from './design-theme';

export default function EditorShell() {
  // If you later want to push design settings to CSS vars, call:
  // React.useEffect(() => { applyDesignToDocument(design) }, [design])

  return (
    <OrgProvider>
      <EditorProvider>
        <div className="flex gap-4 h-[calc(100vh-112px)] p-4">
          {/* Sidebar / controls */}
          <div className="w-[360px] shrink-0">
            <InlineEditor />
          </div>

          {/* Live site preview */}
          <div className="w-[360px] shrink-0">
            <InlineEditor />
          </div>

        </div>
      </EditorProvider>
    </OrgProvider>
  );
}
