// src/pages/SiteEditor.tsx
import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

import presetWebpage from 'grapesjs-preset-webpage';
import pluginExport  from 'grapesjs-plugin-export';

import { useTenant } from '../contexts/TenantContext';
import { getPages, getPageBySlug, savePage } from '../services/xanoApi';
import type { Page } from '../services/xanoApi';

const AdvancedEditor: React.FC = () => {
  const { organization } = useTenant();
  const [slug, setSlug] = useState('home');
  const [pages, setPages] = useState<Page[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  // Pull slug from URL
  useEffect(() => {
    const urlSlug = new URLSearchParams(window.location.search).get('slug');
    setSlug(urlSlug || 'home');
  }, []);

  // Load page list
  const tenantId = organization ? Number(organization.id) : null;
  useEffect(() => {
    if (tenantId !== null) {
      getPages().then(setPages).catch(console.error);
    }
  }, [tenantId]);

  // Init GrapesJS when tenantId, slug *and* organization are set
  useEffect(() => {
    if (!organization || tenantId === null) return;

    editorRef.current?.destroy();

    const run = async () => {
      try {
        const page = await getPageBySlug(slug);
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
            { type: 'text', content: `<h1>${organization.name}</h1>` },
            { type: 'text', content: '<p>Edit this default page</p>' }
          ];
        }

        const initEditor: any = grapesjs.init;
        editorRef.current = initEditor({
          container: containerRef.current!,
          fromElement: false,
          components: comps,
          plugins: [presetWebpage, pluginExport],
          pluginsOpts: {
            'gjs-plugin-export': { root: true }
          }
        });

        // auto-save on changes
        let timer: any;
        editorRef.current.on('update', () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            savePage({
              id: page?.id || null,
              tenant_id: tenantId,
              slug,
              title: page?.title || slug,
              content_json: JSON.stringify(editorRef.current.getComponents())
            }).catch(console.error);
          }, 2000);
        });
      } catch (error) {
        console.error(error);
      }
    };

    run();

    return () => {
      editorRef.current?.destroy();
    };
  }, [tenantId, slug, organization]);

  if (!organization)     return <div>Loading tenant…</div>;
  if (tenantId === null) return <div>Invalid tenant</div>;

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

export default AdvancedEditor;
