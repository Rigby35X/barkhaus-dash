import React, { useEffect } from 'react';

interface EmbedLayoutProps {
  children: React.ReactNode;
  title?: string;
  primaryColor?: string;
}

export default function EmbedLayout({ 
  children, 
  title = 'Adoptable Animals',
  primaryColor = '#324b65'
}: EmbedLayoutProps) {
  
  // Auto-resize functionality for iframe
  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          __barkhaus_embed_height: height
        }, '*');
      }
    };

    // Send initial height
    sendHeight();

    // Set up ResizeObserver for dynamic content
    const resizeObserver = new ResizeObserver(() => {
      sendHeight();
    });

    resizeObserver.observe(document.body);

    // Also listen for window resize
    window.addEventListener('resize', sendHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', sendHeight);
    };
  }, []);

  return (
    <div className="embed-container">
      <style>{`
        :root { 
          --primary: ${primaryColor}; 
          --bg: #fff; 
          --text: #222;
          --border: #e5e7eb;
          --muted: #667085;
        }
        
        * { 
          box-sizing: border-box; 
        }
        
        body { 
          margin: 0; 
          background: var(--bg); 
          color: var(--text); 
          font: 14px/1.45 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }
        
        .embed-container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 16px;
        }

        /* Xano Site Kit Styles - matching xano-site-kit.js */
        .xa-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }

        .xa-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease-in-out;
        }

        .xa-card:hover {
          box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.1), 0 4px 6px 0 rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .xa-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .xa-body {
          padding: 1rem;
        }

        .xa-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .xa-meta {
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* Common embed styles */
        .embed-header {
          display: flex;
          gap: 12px;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .embed-title { 
          font-weight: 800; 
          font-size: 28px; 
          margin: 0;
        }
        
        .embed-subtitle { 
          color: var(--muted); 
          font-size: 13px; 
          margin: 4px 0 0 0;
        }
        
        .embed-filters { 
          display: flex; 
          gap: 8px; 
          flex-wrap: wrap;
        }
        
        .embed-input, .embed-select, .embed-button { 
          padding: 8px 10px; 
          border: 1px solid var(--border); 
          border-radius: 8px; 
          font-size: 14px;
          background: white;
        }
        
        .embed-button { 
          background: var(--primary); 
          color: white; 
          cursor: pointer;
          border-color: var(--primary);
        }
        
        .embed-button:hover { 
          opacity: 0.9;
        }
        
        .embed-grid { 
          display: grid; 
          gap: 16px; 
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        }
        
        .embed-card { 
          overflow: hidden; 
          border: 1px solid var(--border); 
          border-radius: 12px; 
          background: #fff; 
          transition: box-shadow 0.2s;
          text-decoration: none;
          color: inherit;
        }
        
        .embed-card:hover { 
          box-shadow: 0 6px 24px rgba(0,0,0,0.06);
        }
        
        .embed-image { 
          width: 100%; 
          height: 192px; 
          object-fit: cover; 
          display: block;
        }
        
        .embed-card-content {
          padding: 12px;
        }
        
        .embed-name { 
          font-weight: 700; 
          margin: 0 0 4px 0;
          font-size: 16px;
        }
        
        .embed-meta { 
          color: var(--muted); 
          font-size: 12px; 
          margin: 0;
        }
        
        .embed-link { 
          color: var(--primary); 
          text-decoration: none;
        }
        
        .embed-link:hover {
          text-decoration: underline;
        }

        .embed-back {
          display: inline-block;
          margin: 8px 0 12px;
          color: var(--primary);
          text-decoration: none;
          font-size: 14px;
        }

        .embed-back:hover {
          text-decoration: underline;
        }

        .embed-detail-wrap {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 900px) {
          .embed-detail-wrap {
            grid-template-columns: 1.1fr 0.9fr;
          }
        }

        .embed-detail-image {
          width: 100%;
          border-radius: 12px;
          object-fit: cover;
          max-height: 400px;
        }

        .embed-detail-title {
          font-weight: 800;
          font-size: 28px;
          margin: 8px 0;
        }

        .embed-cta-button {
          display: inline-block;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--primary);
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          margin: 12px 0;
        }

        .embed-cta-button:hover {
          opacity: 0.9;
        }

        .embed-section {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px;
          background: #fff;
          margin: 12px 0;
        }

        .embed-muted {
          color: var(--muted);
          font-size: 14px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .embed-container {
            padding: 12px;
          }
          
          .embed-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .embed-title {
            font-size: 24px;
          }
          
          .embed-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
      `}</style>
      
      {children}
    </div>
  );
}
