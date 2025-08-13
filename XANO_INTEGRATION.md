# Xano API Integration Documentation

This document provides comprehensive information about integrating Xano API endpoints to customize colors, logos, information, and section data in your templated website.

## Table of Contents

1. [Overview](#overview)
2. [Setup and Configuration](#setup-and-configuration)
3. [API Endpoints](#api-endpoints)
4. [Dynamic Features](#dynamic-features)
5. [Configuration Options](#configuration-options)
6. [Error Handling](#error-handling)
7. [Examples](#examples)
8. [Troubleshooting](#troubleshooting)

## Overview

The Xano integration system allows you to dynamically customize your website's appearance and content through API endpoints. It supports:

- **Dynamic Colors**: Automatically update CSS color variables
- **Logo Management**: Dynamic logo loading and favicon updates
- **Content Management**: Real-time content updates for sections
- **Table Data Integration**: Populate sections with data from Xano tables
- **Caching & Performance**: Intelligent caching with fallback mechanisms
- **Error Handling**: Graceful degradation when API is unavailable

## Setup and Configuration

### 1. Environment Variables

Create a `.env` file in your project root:

```env
# Xano Group Configuration
XANO_GROUP_PRIMARY=https://x8ki-letl-twmt.n7.xano.io/api:wPrzs4Mr
XANO_GROUP_DOGS=https://x8ki-letl-twmt.n7.xano.io/api:Od874PbA
XANO_GROUP_PAGES=https://x8ki-letl-twmt.n7.xano.io/api:mlssTgVM
XANO_GROUP_SITE_CONFIG=https://x8ki-letl-twmt.n7.xano.io/api:1vOYCkyt
XANO_GROUP_DESIGN_SETTINGS=https://x8ki-letl-twmt.n7.xano.io/api:0BQDG239

# Optional
XANO_CACHE_TTL=3600
XANO_API_TIMEOUT=5000
XANO_DYNAMIC_COLORS=true
XANO_DYNAMIC_LOGOS=true
XANO_DYNAMIC_CONTENT=true
```

### 2. Install Dependencies

The integration requires these npm packages (already installed):

```bash
npm install axios node-cache dotenv
```

### 3. File Structure

The integration adds these files to your project:

```
src/
├── _data/
│   ├── xabo.js              # Main API integration
│   └── xabo-config.js       # Configuration management
├── _includes/
│   └── components/
│       ├── xabo-hero.html   # Dynamic hero component
│       └── xabo-services.html # Dynamic services component
└── assets/
    ├── js/
    │   ├── xabo-colors.js   # Color management
    │   ├── xabo-logos.js    # Logo management
    │   ├── xabo-content.js  # Content management
    │   └── xabo-error-handler.js # Error handling
    └── less/
        └── xabo-colors.less # Dynamic color styles
```

## API Endpoints

### Branding Endpoint (`/branding`)

Returns branding information including colors, logos, and company details.

**Expected Response:**
```json
{
  "primary_color": "#ff6a3e",
  "secondary_color": "#ffba43",
  "company_name": "Your Company",
  "logo_url": "https://example.com/logo.png",
  "favicon_url": "https://example.com/favicon.ico",
  "dark_primary_color": "#cc5531",
  "dark_secondary_color": "#cc9536"
}
```

### Content Endpoint (`/content`)

Returns content for various website sections.

**Expected Response:**
```json
{
  "hero": {
    "title": "Welcome to Our Website",
    "subtitle": "Your Trusted Partner",
    "description": "We provide excellent services...",
    "cta_text": "Get Started",
    "cta_link": "/contact/",
    "background_image": "https://example.com/hero-bg.jpg"
  },
  "services": [
    {
      "title": "Service 1",
      "description": "Description of service 1",
      "icon": "https://example.com/icon1.svg"
    }
  ]
}
```

### Tables Endpoint (`/tables/{tableName}`)

Returns table data for dynamic sections.

**Expected Response:**
```json
{
  "rows": [
    {
      "id": 1,
      "title": "Item 1",
      "description": "Description",
      "image_url": "https://example.com/image1.jpg"
    }
  ]
}
```

## Dynamic Features

### 1. Dynamic Colors

Colors are automatically applied to CSS custom properties:

```css
:root {
  --primary: #ff6a3e;        /* From API */
  --secondary: #ffba43;      /* From API */
  --xabo-primary: var(--primary);
}
```

**Usage in templates:**
```html
<div class="xabo-bg-primary">Content with dynamic background</div>
<span class="xabo-text-secondary">Text with dynamic color</span>
```

### 2. Dynamic Logos

Logos are automatically updated across the site:

```html
<!-- Logos will be automatically updated -->
<img data-logo="header" src="/default-logo.png" alt="Logo">
<img data-logo="footer" src="/default-logo.png" alt="Logo">
```

### 3. Dynamic Content

Content sections are populated from API data:

```html
<!-- Hero section with dynamic content -->
<h1 data-xabo-content="hero.title">Default Title</h1>
<p data-xabo-content="hero.description">Default description</p>
```

### 4. Table Data Integration

Use table data in your templates:

```javascript
// In your template or component
const tableData = await client.xabo.getTableData('products');
```

## Configuration Options

### Feature Flags

Control which features are enabled:

```env
XABO_DYNAMIC_COLORS=true     # Enable dynamic color system
XABO_DYNAMIC_LOGOS=true      # Enable dynamic logo management
XABO_DYNAMIC_CONTENT=true    # Enable dynamic content updates
XABO_ANALYTICS=false         # Enable analytics tracking
XABO_REALTIME_UPDATES=false  # Enable real-time updates
```

### Performance Settings

```env
XABO_CACHE_TTL=3600          # Cache time-to-live (seconds)
XABO_API_TIMEOUT=5000        # API request timeout (ms)
XABO_ENABLE_COMPRESSION=true # Enable response compression
XABO_LAZY_LOAD_IMAGES=true   # Enable lazy loading for images
```

### Error Handling

```env
XABO_FALLBACK_ON_ERROR=true  # Use fallback data on errors
XABO_MAX_ERROR_RETRIES=3     # Maximum retry attempts
XABO_LOG_ERRORS=true         # Log errors to console
```

## Error Handling

The system includes comprehensive error handling:

### Fallback Strategies

1. **Cached Data**: Use previously cached API responses
2. **Default Data**: Fall back to predefined default content
3. **Graceful Degradation**: Hide dynamic elements, show static content
4. **Retry Logic**: Automatic retry with exponential backoff

### Error Types

- **Network Errors**: Connection issues, timeouts
- **API Errors**: Invalid responses, authentication failures
- **Data Errors**: Malformed or missing data

### Monitoring

```javascript
// Listen for error events
document.addEventListener('xabo:error', (event) => {
  console.log('Xabo error:', event.detail);
});

// Get error statistics
const stats = window.xaboErrorHandler.getErrorStats();
```

## Examples

### Basic Usage

```html
<!-- In your template -->
{% extends "layouts/base.html" %}

{% block body %}
  {% include "components/xabo-hero.html" %}
  {% include "components/xabo-services.html" %}
{% endblock %}
```

### Custom Content Section

```html
<!-- Custom section with Xabo data -->
<section data-xabo-section="about">
  <h2 data-xabo-content="about.title">{{ xabo.content.about.title or "About Us" }}</h2>
  <p data-xabo-content="about.description">{{ xabo.content.about.description or "Default description" }}</p>
</section>
```

### Using Table Data

```javascript
// In a custom script
document.addEventListener('DOMContentLoaded', async () => {
  if (window.xaboData?.api) {
    const products = await window.xaboData.api.getTableData('products');
    renderProducts(products);
  }
});
```

### Custom Color Handling

```javascript
// Listen for color updates
document.addEventListener('xabo:colorsApplied', (event) => {
  const colors = event.detail;
  // Apply custom color logic
  updateCustomComponents(colors);
});
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify `XABO_API_KEY` in `.env` file
   - Check API key permissions in Xabo dashboard

2. **Content Not Updating**
   - Check browser console for errors
   - Verify API endpoints are returning expected data
   - Clear cache: `window.xaboData.api.clearCache()`

3. **Colors Not Applying**
   - Ensure `XABO_DYNAMIC_COLORS=true`
   - Check CSS custom properties in browser dev tools
   - Verify color format (hex values)

4. **Performance Issues**
   - Increase cache TTL: `XABO_CACHE_TTL=7200`
   - Enable compression: `XABO_ENABLE_COMPRESSION=true`
   - Check network tab for slow API calls

### Debug Mode

Enable debug mode for detailed logging:

```env
NODE_ENV=development
XABO_LOG_API_CALLS=true
```

### Testing Fallbacks

Test fallback behavior by temporarily disabling API:

```env
XABO_API_KEY=invalid_key
```

### Cache Management

```javascript
// Clear all cache
window.xaboData.api.clearCache();

// Get cache statistics
const stats = window.xaboData.api.getCacheStats();
console.log('Cache stats:', stats);
```

## Support

For additional support:

1. Check the browser console for error messages
2. Review the error log: `window.xaboErrorHandler.getErrorStats()`
3. Verify API responses using browser network tab
4. Test with fallback data to isolate issues

## Next Steps

1. Configure your Xabo API endpoints
2. Customize the color scheme in `src/assets/less/xabo-colors.less`
3. Add custom content sections using the provided components
4. Test error handling by temporarily disabling the API
5. Monitor performance and adjust cache settings as needed
