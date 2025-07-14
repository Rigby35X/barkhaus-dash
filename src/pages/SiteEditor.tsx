import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { useTenant } from '../contexts/TenantContext';
import { getPageBySlug, savePage } from '../services/xanoApi';

const SiteEditor: React.FC = () => {
  const { organization: tenant } = useTenant();
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  if (!tenant) {
    return <div>Loading site editor…</div>;
  }

  // Convert tenant.id (string) to number once
  const tenantId = Number(tenant.id);

  useEffect(() => {
    getPageBySlug(tenantId, 'home').then(page => {
      editorRef.current = grapesjs.init({
        container: containerRef.current!,
        fromElement: false,
        components: page?.content_json ? JSON.parse(page.content_json) : [],
        plugins: ['gjs-basic-blocks'],
      });

      let timer: any;
      editorRef.current.on('update', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          savePage(
            page?.id || null,
            tenantId,
            'home',
            'Home',
            editorRef.current.getComponents()
          );
        }, 2000);
      });
    });

    return () => editorRef.current?.destroy();
  }, [tenantId]);

  return <div ref={containerRef} style={{ height: '100vh' }} />;
};

export default SiteEditor;
