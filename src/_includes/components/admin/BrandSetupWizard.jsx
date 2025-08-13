import { useState, useEffect } from 'react';
import { Save, Plus, X, Search, Palette, Type, Globe, Phone, Mail, Clock, Heart } from 'lucide-react';

// Import your actual xanoAPI
import { xanoAPI } from '../../../services/xanoApi';

// Popular Google Fonts with categories
const GOOGLE_FONTS = {
  serif: [
    'Playfair Display', 'Merriweather', 'Lora', 'Crimson Text', 'Libre Baskerville',
    'PT Serif', 'Vollkorn', 'Cormorant Garamond', 'Cardo', 'EB Garamond'
  ],
  'sans-serif': [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro',
    'Nunito', 'Poppins', 'Rubik', 'Work Sans', 'DM Sans', 'Plus Jakarta Sans'
  ],
  display: [
    'Oswald', 'Raleway', 'Bebas Neue', 'Righteous', 'Abril Fatface',
    'Fjalla One', 'Anton', 'Archivo Black', 'Alfa Slab One'
  ]
};

const ALL_FONTS = Object.values(GOOGLE_FONTS).flat();

function FontSelector({ label, value, onChange, category = 'all' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const fonts = category === 'all' ? ALL_FONTS : GOOGLE_FONTS[category] || ALL_FONTS;
  const filteredFonts = fonts.filter(font => 
    font.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (font) => {
    onChange(font);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span style={{ fontFamily: value }} className="truncate">{value}</span>
        <Type className="w-4 h-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search fonts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredFonts.map(font => (
              <button
                key={font}
                type="button"
                onClick={() => handleSelect(font)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ColorPicker({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function ServiceEditor({ services, onChange }) {
  const addService = () => {
    const newService = {
      id: Date.now(),
      title: '',
      description: '',
      icon: 'heart',
      is_active: true,
      order_index: services.length + 1
    };
    onChange([...services, newService]);
  };

  const updateService = (index, updates) => {
    const updated = services.map((service, i) => 
      i === index ? { ...service, ...updates } : service
    );
    onChange(updated);
  };

  const removeService = (index) => {
    onChange(services.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Services</h3>
        <button
          type="button"
          onClick={addService}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </button>
      </div>

      {services.map((service, index) => (
        <div key={service.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Service {index + 1}</span>
            </div>
            <button
              type="button"
              onClick={() => removeService(index)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={service.title}
                onChange={(e) => updateService(index, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Service title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <select
                value={service.icon}
                onChange={(e) => updateService(index, { icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="heart">Heart</option>
                <option value="home">Home</option>
                <option value="medical">Medical</option>
                <option value="training">Training</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={service.description}
                onChange={(e) => updateService(index, { description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe this service..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`active-${service.id}`}
                checked={service.is_active}
                onChange={(e) => updateService(index, { is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`active-${service.id}`} className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BrandSetupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [designSettings, setDesignSettings] = useState({});
  const [siteContent, setSiteContent] = useState({});
  const [services, setServices] = useState([]);

  const steps = [
    { id: 1, title: 'Brand Identity', icon: Palette },
    { id: 2, title: 'Typography', icon: Type },
    { id: 3, title: 'Site Information', icon: Globe },
    { id: 4, title: 'Contact & Hours', icon: Clock },
    { id: 5, title: 'Services', icon: Heart }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [design, content, servicesData] = await Promise.all([
        xanoAPI.getDesignSettings(),
        xanoAPI.getSiteContent(),
        xanoAPI.getServices()
      ]);
      
      setDesignSettings(design || {});
      setSiteContent(content || {});
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await Promise.all([
        designSettings.id 
          ? xanoAPI.updateDesignSettings(designSettings.id, designSettings)
          : xanoAPI.createDesignSettings(designSettings),
        xanoAPI.updateSiteContent(siteContent),
        xanoAPI.updateServices(services)
      ]);
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading && Object.keys(designSettings).length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Setup Wizard</h1>
        <p className="text-gray-600">Configure your rescue organization's brand and website settings</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-0.5 w-16 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Brand Identity</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorPicker
                label="Primary Color"
                value={designSettings.primary_color || '#6bb3eb'}
                onChange={(color) => setDesignSettings({...designSettings, primary_color: color})}
              />
              
              <ColorPicker
                label="Secondary Color"
                value={designSettings.secondary_color || '#02417b'}
                onChange={(color) => setDesignSettings({...designSettings, secondary_color: color})}
              />
              
              <ColorPicker
                label="Background Color"
                value={designSettings.background_color || '#FFFFFF'}
                onChange={(color) => setDesignSettings({...designSettings, background_color: color})}
              />
              
              <ColorPicker
                label="Text Color"
                value={designSettings.font_color || '#000000'}
                onChange={(color) => setDesignSettings({...designSettings, font_color: color})}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
              <select
                value={designSettings.template_name || 'BarkhausClassic'}
                onChange={(e) => setDesignSettings({...designSettings, template_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BarkhausClassic">Barkhaus Classic</option>
                <option value="ModernRescue">Modern Rescue</option>
                <option value="WarmHearts">Warm Hearts</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Typography</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FontSelector
                label="Heading Font"
                value={designSettings.heading_font_family || 'Playfair Display'}
                onChange={(font) => setDesignSettings({...designSettings, heading_font_family: font})}
                category="serif"
              />
              
              <FontSelector
                label="Body Font"
                value={designSettings.body_font_family || 'Inter'}
                onChange={(font) => setDesignSettings({...designSettings, body_font_family: font})}
                category="sans-serif"
              />
            </div>

            {/* Font Preview */}
            <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Font Preview</h3>
              <div 
                className="space-y-4"
                style={{
                  '--heading-font': designSettings.heading_font_family || 'Playfair Display',
                  '--body-font': designSettings.body_font_family || 'Inter'
                }}
              >
                <h1 
                  className="text-3xl font-bold"
                  style={{ fontFamily: 'var(--heading-font)' }}
                >
                  Welcome to Our Rescue
                </h1>
                <p 
                  className="text-lg"
                  style={{ fontFamily: 'var(--body-font)' }}
                >
                  This is how your body text will look on your website. We help animals find loving homes.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Site Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={siteContent.site_name || ''}
                  onChange={(e) => setSiteContent({...siteContent, site_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Happy Paws Rescue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={siteContent.tagline || ''}
                  onChange={(e) => setSiteContent({...siteContent, tagline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Saving lives, one pet at a time"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement</label>
              <textarea
                value={siteContent.mission_statement || ''}
                onChange={(e) => setSiteContent({...siteContent, mission_statement: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your organization's mission and values..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">EIN Number (Tax ID)</label>
              <input
                type="text"
                value={siteContent.ein_number || ''}
                onChange={(e) => setSiteContent({...siteContent, ein_number: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12-3456789"
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information & Hours</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={siteContent.email || ''}
                  onChange={(e) => setSiteContent({...siteContent, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="info@yourrescue.org"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={siteContent.phone || ''}
                  onChange={(e) => setSiteContent({...siteContent, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={siteContent.address || ''}
                onChange={(e) => setSiteContent({...siteContent, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Rescue Lane, Pet City, PC 12345"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Operating Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <div key={day}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{day}</label>
                    <input
                      type="text"
                      value={siteContent.hours?.[day] || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent, 
                        hours: { ...siteContent.hours, [day]: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="9:00 AM - 5:00 PM or Closed"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={siteContent.social_facebook || ''}
                    onChange={(e) => setSiteContent({...siteContent, social_facebook: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://facebook.com/yourrescue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={siteContent.social_instagram || ''}
                    onChange={(e) => setSiteContent({...siteContent, social_instagram: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://instagram.com/yourrescue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="url"
                    value={siteContent.social_twitter || ''}
                    onChange={(e) => setSiteContent({...siteContent, social_twitter: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://twitter.com/yourrescue"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
            <p className="text-gray-600 mb-6">Configure the services your rescue organization offers. These will be displayed on your website.</p>
            
            <ServiceEditor
              services={services}
              onChange={setServices}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Progress'}
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}