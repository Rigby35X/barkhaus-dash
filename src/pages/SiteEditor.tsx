// src/pages/SiteEditor.tsx
import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

// Plugins
import presetWebpage from 'grapesjs-preset-webpage';
import pluginExport from 'grapesjs-plugin-export';

import { useTenant } from '../contexts/TenantContext';
import { getPages, getPageBySlug, savePage } from '../services/xanoApi';
import type { Page } from '../services/xanoApi';

const SiteEditor: React.FC = () => {
  // 1) Hooks (in stable order)
  const { organization } = useTenant();
  const [slug, setSlug] = useState('home');
  const [pages, setPages] = useState<Page[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  // 2) Sync slug from URL
  useEffect(() => {
    const urlSlug = new URLSearchParams(window.location.search).get('slug');
    setSlug(urlSlug || 'home');
  }, []);

  // 3) Load pages list
  const tenantId = organization ? Number(organization.id) : null;
  useEffect(() => {
    if (tenantId !== null) {
      getPages(tenantId).then(setPages).catch(console.error);
    }
  }, [tenantId]);

  // 4) (Re)initialize GrapesJS when slug or tenant changes
  useEffect(() => {
    if (tenantId === null) return;
    editorRef.current?.destroy();

    getPageBySlug(tenantId, slug)
      .then(page => {
        // parse JSON or fallback
        let comps: any[] = [];
        if (page?.content_json) {
          try {
            comps = JSON.parse(page.content_json);
          } catch (e) {
            console.error('JSON parse error:', e);
          }
        }
        if (!comps.length) {
          comps = [
            { type: 'text', content: `<h1>${organization!.name}</h1>` },
            { type: 'text', content: '<p>Edit this default page</p>' }
          ];
        }

        // Cast to any so TS ignores component‐type mismatch
        editorRef.current = (grapesjs.init as any)({
          container: containerRef.current!,
          fromElement: false,
          components: comps,
          plugins: [presetWebpage, pluginExport],
          pluginsOpts: {
            'gjs-plugin-export': { root: true }
          }
        });

        // Auto-save debounce
        let timer: any;
        editorRef.current.on('update', () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            savePage(
              page?.id || null,
              tenantId,
              slug,
              page?.title || slug,
              editorRef.current.getComponents()
            ).catch(console.error);
          }, 2000);
        });
      })
      .catch(console.error);

    return () => {
      editorRef.current?.destroy();
    };
  }, [tenantId, slug, organization]);

  // 5) Loading guards
  if (!organization) return <div>Loading tenant…</div>;
  if (tenantId === null) return <div>Invalid tenant</div>;

  // 6) Render selector + canvas
  return (
    <div className="flex h-screen">
      <div className="p-4 border-r">
        <select
          className="p-2 border rounded"
          value={slug}
          onChange={e => {
            const s = e.target.value;
            setSlug(s);
            window.history.replaceState(null, '', `?slug=${s}`);
          }}
        >
          {pages.map(p => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 p-4">
        <div
          ref={containerRef}
          style={{ height: '100%', minHeight: 400 }}
        />
      </div>
    </div>
  );
};

export default SiteEditor;
