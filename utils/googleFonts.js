// utils/googleFonts.js - For React admin dashboard

/**
 * Google Fonts API Helper
 * Fetches available fonts and generates font links
 */

class GoogleFontsHelper {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/webfonts/v1/webfonts';
    this.cache = new Map();
  }

  /**
   * Fetch all available Google Fonts
   * @returns {Promise<Array>} Array of font objects
   */
  async getAllFonts() {
    if (this.cache.has('allFonts')) {
      return this.cache.get('allFonts');
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}&sort=popularity`);
      if (!response.ok) throw new Error('Failed to fetch fonts');
      
      const data = await response.json();
      const fonts = data.items.map(font => ({
        family: font.family,
        category: font.category,
        variants: font.variants,
        subsets: font.subsets,
        popularity: font.popularity || 999
      }));

      this.cache.set('allFonts', fonts);
      return fonts;
      
    } catch (error) {
      console.error('Error fetching Google Fonts:', error);
      return this.getFallbackFonts();
    }
  }

  /**
   * Get popular fonts for dropdowns
   * @param {number} limit - Number of fonts to return
   * @returns {Promise<Array>} Popular fonts array
   */
  async getPopularFonts(limit = 50) {
    const allFonts = await this.getAllFonts();
    return allFonts.slice(0, limit);
  }

  /**
   * Search fonts by name
   * @param {string} query - Search query
   * @returns {Promise<Array>} Filtered fonts array
   */
  async searchFonts(query) {
    const allFonts = await this.getAllFonts();
    const lowercaseQuery = query.toLowerCase();
    
    return allFonts.filter(font => 
      font.family.toLowerCase().includes(lowercaseQuery)
    ).slice(0, 20); // Limit results
  }

  /**
   * Generate Google Fonts URL for selected fonts
   * @param {Array} fontFamilies - Array of font family names
   * @param {Object} options - Font options (weights, subsets, display)
   * @returns {string} Google Fonts URL
   */
  generateFontUrl(fontFamilies, options = {}) {
    if (!fontFamilies || fontFamilies.length === 0) {
      return '';
    }

    const {
      weights = ['400', '700'],
      subsets = ['latin'],
      display = 'swap'
    } = options;

    // Format font families with weights
    const formattedFonts = fontFamilies.map(family => {
      const encodedFamily = encodeURIComponent(family);
      const weightString = weights.join(',');
      return `${encodedFamily}:wght@${weightString}`;
    });

    const url = new URL('https://fonts.googleapis.com/css2');
    url.searchParams.set('family', formattedFonts.join('&family='));
    url.searchParams.set('display', display);

    return url.toString();
  }

  /**
   * Get font categories for filtering
   * @returns {Array} Array of font categories
   */
  getFontCategories() {
    return [
      { value: 'serif', label: 'Serif' },
      { value: 'sans-serif', label: 'Sans Serif' },
      { value: 'display', label: 'Display' },
      { value: 'handwriting', label: 'Handwriting' },
      { value: 'monospace', label: 'Monospace' }
    ];
  }

  /**
   * Get fallback fonts when API is unavailable
   * @returns {Array} Fallback fonts array
   */
  getFallbackFonts() {
    return [
      { family: 'Inter', category: 'sans-serif', variants: ['400', '700'] },
      { family: 'Roboto', category: 'sans-serif', variants: ['400', '700'] },
      { family: 'Open Sans', category: 'sans-serif', variants: ['400', '700'] },
      { family: 'Lato', category: 'sans-serif', variants: ['400', '700'] },
      { family: 'Montserrat', category: 'sans-serif', variants: ['400', '700'] },
      { family: 'Playfair Display', category: 'serif', variants: ['400', '700'] },
      { family: 'Merriweather', category: 'serif', variants: ['400', '700'] },
      { family: 'Georgia', category: 'serif', variants: ['400', '700'] },
      { family: 'Times New Roman', category: 'serif', variants: ['400', '700'] },
      { family: 'Arial', category: 'sans-serif', variants: ['400', '700'] }
    ];
  }

  /**
   * Get recommended font pairings
   * @returns {Array} Array of font pair objects
   */
  getRecommendedPairings() {
    return [
      {
        name: 'Classic Elegance',
        heading: 'Playfair Display',
        body: 'Source Sans Pro'
      },
      {
        name: 'Modern Clean',
        heading: 'Montserrat',
        body: 'Open Sans'
      },
      {
        name: 'Friendly & Warm',
        heading: 'Nunito',
        body: 'Lato'
      },
      {
        name: 'Professional',
        heading: 'Roboto Slab',
        body: 'Roboto'
      },
      {
        name: 'Creative Bold',
        heading: 'Oswald',
        body: 'Source Sans Pro'
      }
    ];
  }

  /**
   * Validate if font exists in Google Fonts
   * @param {string} fontFamily - Font family name
   * @returns {Promise<boolean>} True if font exists
   */
  async validateFont(fontFamily) {
    const allFonts = await this.getAllFonts();
    return allFonts.some(font => font.family === fontFamily);
  }
}

// Export for React components
export default GoogleFontsHelper;

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoogleFontsHelper;
}
