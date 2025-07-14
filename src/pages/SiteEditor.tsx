import React, { useEffect, useRef, useState } from 'react';
import { useTenant } from '../contexts/TenantContext';

const SiteEditor: React.FC = () => {
  const { organization } = useTenant();
  const editorRef = useRef<HTMLDivElement>(null);
  const sdkRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeEditor = async () => {
      if (!editorRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Try different import methods for GrapesJS Studio SDK
        let createStudio;
        try {
          // Method 1: Try default import
          const module = await import('@grapesjs/studio-sdk');
          createStudio = module.default || module.createStudio || module;
        } catch (importError) {
          console.error('Failed to import GrapesJS Studio SDK:', importError);
          throw new Error('GrapesJS Studio SDK not found. Please install it with: npm install @grapesjs/studio-sdk');
        }

        if (typeof createStudio !== 'function') {
          throw new Error('GrapesJS Studio SDK createStudio function not found');
        }

        // Clear the container
        editorRef.current.innerHTML = '';

        // Initialize GrapesJS Studio SDK with minimal configuration
        const studioInstance = await createStudio({
          root: editorRef.current,
          container: editorRef.current,
          licenseKey: '', // Free for localhost development
          template: {
            type: 'webpage',
            components: [
              {
                type: 'text',
                content: `<h1>Welcome to ${organization?.name || 'Your Organization'}</h1><p>Start editing your website by dragging components from the panel on the left.</p>`,
                style: {
                  'text-align': 'center',
                  'padding': '50px 20px',
                  'font-family': 'Arial, sans-serif'
                }
              }
            ],
            style: [
              {
                selectors: ['body'],
                style: {
                  'margin': '0',
                  'padding': '0',
                  'font-family': 'Arial, sans-serif'
                }
              }
            ]
          },
          onSave: async (pageData: any) => {
            try {
              console.log('Saving page data:', pageData);
              // Here you would save to your backend
              alert('Page saved successfully!');
            } catch (saveError) {
              console.error('Failed to save page:', saveError);
              alert('Failed to save page. Please try again.');
            }
          }
        });

        sdkRef.current = studioInstance;

        // Wait a bit for the editor to fully initialize
        setTimeout(() => {
          try {
            // Try to access the editor to verify it's working
            if (studioInstance && studioInstance.editor) {
              const blockManager = studioInstance.editor.BlockManager;
              
              if (blockManager && blockManager.add) {
                // Add custom blocks for animal rescue websites
                blockManager.add('pet-card', {
                  label: 'Pet Card',
                  category: 'Animal Rescue',
                  content: `
                    <div class="pet-card" style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin: 16px; max-width: 300px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop" 
                           style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;" alt="Pet photo" />
                      <h3 style="margin: 12px 0 8px 0; color: #333; font-size: 18px;">Pet Name</h3>
                      <p style="color: #666; margin: 4px 0; font-size: 14px;">Breed • Age • Gender</p>
                      <p style="color: #888; font-size: 14px; margin: 8px 0; line-height: 1.4;">Description of the pet and their personality...</p>
                      <button style="background: #009688; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                        Learn More
                      </button>
                    </div>
                  `,
                });

                blockManager.add('donation-button', {
                  label: 'Donation Button',
                  category: 'Animal Rescue',
                  content: `
                    <div style="text-align: center; padding: 20px;">
                      <button style="background: linear-gradient(45deg, #f59e0b, #d97706); color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;">
                        🐾 Donate Now
                      </button>
                    </div>
                  `,
                });

                blockManager.add('success-story', {
                  label: 'Success Story',
                  category: 'Animal Rescue',
                  content: `
                    <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-left: 4px solid #22c55e; border-radius: 8px; padding: 20px; margin: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                      <h4 style="color: #15803d; margin: 0 0 12px 0; font-size: 18px;">🎉 Success Story</h4>
                      <p style="color: #166534; font-style: italic; margin: 0 0 12px 0; font-size: 16px; line-height: 1.5;">
                        "Thanks to this amazing organization, our beloved pet found the perfect forever home! The staff was incredibly caring and made sure we were the right match."
                      </p>
                      <p style="color: #15803d; font-size: 14px; margin: 0; font-weight: bold;">
                        - Happy Adopter Family
                      </p>
                    </div>
                  `,
                });

                blockManager.add('volunteer-cta', {
                  label: 'Volunteer Call-to-Action',
                  category: 'Animal Rescue',
                  content: `
                    <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1px solid #3b82f6; border-radius: 12px; padding: 30px; margin: 20px; text-align: center;">
                      <h3 style="color: #1d4ed8; margin: 0 0 16px 0; font-size: 24px;">🤝 Join Our Volunteer Team</h3>
                      <p style="color: #1e40af; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                        Make a difference in the lives of animals in need. Whether you can spare a few hours a week or just an hour a month, every bit helps!
                      </p>
                      <button style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        Become a Volunteer
                      </button>
                    </div>
                  `,
                });
              }
            }
            setIsLoading(false);
          } catch (blockError) {
            console.warn('Could not add custom blocks:', blockError);
            setIsLoading(false);
          }
        }, 1000);

      } catch (error) {
        console.error('Failed to initialize GrapesJS Studio:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        setIsLoading(false);
        
        if (editorRef.current) {
          editorRef.current.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #666; font-family: Arial, sans-serif;">
              <h3 style="color: #dc2626; margin-bottom: 16px;">⚠️ Site Editor Unavailable</h3>
              <p style="margin-bottom: 16px;">The visual site editor could not be loaded.</p>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto;">
                <p style="margin: 0 0 8px 0; font-weight: bold; color: #991b1b;">Error Details:</p>
                <p style="margin: 0; font-family: monospace; font-size: 14px; color: #7f1d1d;">${error instanceof Error ? error.message : 'Unknown error'}</p>
              </div>
              <p style="margin-top: 20px; font-size: 14px;">
                Please try refreshing the page or contact support if the issue persists.
              </p>
            </div>
          `;
        }
      }
    };

    initializeEditor();

    return () => {
      if (sdkRef.current && typeof sdkRef.current.destroy === 'function') {
        try {
          sdkRef.current.destroy();
        } catch (destroyError) {
          console.warn('Error destroying editor:', destroyError);
        }
      }
    };
  }, [organization]);

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organization data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bebas uppercase text-gray-900">Site Editor</h1>
            <p className="text-gray-600">Design and customize your organization's website</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.open('/app/live-site', '_blank')}
              className="btn-secondary"
              disabled={isLoading || !!error}
            >
              Preview Site
            </button>
            <button 
              onClick={() => {
                if (sdkRef.current && sdkRef.current.editor && sdkRef.current.editor.runCommand) {
                  sdkRef.current.editor.runCommand('core:canvas-clear');
                }
              }}
              className="btn-secondary"
              disabled={isLoading || !!error}
            >
              Clear Canvas
            </button>
            {isLoading && (
              <div className="flex items-center text-primary-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                <span className="text-sm">Loading editor...</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <div 
          id="gjs-editor"
          ref={editorRef} 
          className="w-full h-full"
          style={{ minHeight: 'calc(100vh - 120px)' }}
        />
      </div>
    </div>
  );
};

export default SiteEditor;