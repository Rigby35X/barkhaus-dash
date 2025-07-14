import React, { useEffect, useRef, useContext } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { useTenant } from '../contexts/TenantContext';
import { getPageBySlug, savePage } from '../services/xanoApi';

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * A site editor component which uses grapesjs to allow the user to edit the home page.
 *
 * It fetches the home page content from the server and initializes the grapesjs editor
 * with it. It also sets up a timer to auto-save the changes every 2 seconds.
 *
 * The component will return an empty string if the tenant is not ready or if the page
 * content could not be fetched from the server.
 *
 * @returns A JSX element which renders the site editor.
 */

/*******  b5a04b06-9cd0-4613-a4ac-35b4af2ad0db  *******/
const SiteEditor: React.FC = () => {
  const { organization: tenant } = useTenant();
  if (!tenant || !tenant.id) {
    return <div>Loading...</div>;
  }
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!tenant?.id || !containerRef.current) return;
    getPageBySlug(tenant.id, 'home').then(page => {
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
            tenant.id,
            'home',
            'Home',
            editorRef.current.getComponents()
          );
        }, 2000);
      });
    });
    return () => editorRef.current?.destroy();
  }, [tenant]);

  return <div ref={containerRef} style={{ height: '100vh' }} />;
};

export default SiteEditor;
