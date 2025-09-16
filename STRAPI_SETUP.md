# Strapi CMS Integration Setup Guide

This guide walks you through setting up Strapi CMS for dynamic template content management.

## 🚀 Quick Setup Steps

### 1. Install Strapi

```bash
# Create a new Strapi project
npx create-strapi-app@latest barkhaus-cms --quickstart

# Navigate to the project
cd barkhaus-cms

# Start Strapi
npm run develop
```

### 2. Create Content Types

After Strapi starts, go to `http://localhost:1337/admin` and create these content types:

#### **Template Content Type**
- **Collection Type**: `template`
- **Fields**:
  - `name` (Text) - Required
  - `slug` (UID) - Required, target field: name
  - `description` (Text) - Required
  - `thumbnail` (Media) - Single image
  - `isActive` (Boolean) - Default: true
  - `sections` (Relation) - Has many sections

#### **Section Content Type**
- **Collection Type**: `section`
- **Fields**:
  - `name` (Text) - Required
  - `type` (Enumeration) - Values: hero, about, services, gallery, footer, custom
  - `content` (JSON) - Required
  - `order` (Number) - Required
  - `isVisible` (Boolean) - Default: true
  - `template` (Relation) - Belongs to template

#### **Organization Content Type**
- **Collection Type**: `organization`
- **Fields**:
  - `name` (Text) - Required
  - `slug` (UID) - Required, target field: name
  - `logo` (Media) - Single image
  - `primaryColor` (Text) - Default: #3B82F6
  - `secondaryColor` (Text) - Default: #8B5CF6
  - `accentColor` (Text) - Default: #10B981
  - `headingFont` (Text) - Default: Inter
  - `bodyFont` (Text) - Default: Inter
  - `mission` (Text) - Required
  - `about` (Text) - Required
  - `contactInfo` (JSON)
  - `socialMedia` (JSON)

### 3. Configure API Permissions

1. Go to **Settings > Users & Permissions Plugin > Roles**
2. Click on **Public**
3. Enable these permissions:
   - **Template**: find, findOne
   - **Section**: find, findOne
   - **Organization**: find, findOne

### 4. Add Sample Data

#### Sample Template:
```json
{
  "name": "Modern Rescue",
  "slug": "modern-rescue",
  "description": "A contemporary design with gradient backgrounds",
  "isActive": true
}
```

#### Sample Organization:
```json
{
  "name": "Happy Paws Rescue",
  "slug": "happy-paws",
  "primaryColor": "#2563eb",
  "secondaryColor": "#3b82f6",
  "accentColor": "#f59e0b",
  "headingFont": "Poppins",
  "bodyFont": "Inter",
  "mission": "Saving lives, one paw at a time",
  "about": "We are dedicated to rescuing and rehoming animals in need.",
  "contactInfo": {
    "email": "info@happypaws.org",
    "phone": "(555) 123-4567",
    "address": "123 Main St, Anytown, ST 12345"
  },
  "socialMedia": {
    "facebook": "https://facebook.com/happypaws",
    "instagram": "https://instagram.com/happypaws",
    "twitter": "https://twitter.com/happypaws"
  }
}
```

#### Sample Section (Hero):
```json
{
  "name": "Hero Section",
  "type": "hero",
  "order": 1,
  "isVisible": true,
  "content": {
    "title": "Find Your Perfect Companion",
    "subtitle": "Every animal deserves a loving home",
    "ctaText": "View Available Pets",
    "ctaLink": "#pets",
    "backgroundImage": "/hero-bg.jpg"
  }
}
```

### 5. Update Environment Variables

Add to your `.env.development`:

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_TOKEN=your-api-token-here
```

To get an API token:
1. Go to **Settings > API Tokens**
2. Create new token with **Read** permissions
3. Copy the token to your `.env` file

## 🎨 Using Templates with Live Preview

### 1. Access Templates Page
- Go to `/app/templates` in your application
- Select an organization from the dropdown
- Click "Live Preview" on any template

### 2. Template Structure
Each template can have multiple sections:
- **Hero**: Main banner with title and CTA
- **About**: Organization information
- **Services**: List of services offered
- **Gallery**: Photo gallery or success stories
- **Footer**: Contact info and links

### 3. Dynamic Content
Templates automatically pull:
- Organization branding (colors, fonts, logo)
- Contact information
- Mission statement and about text
- Social media links

## 🔧 Development Workflow

### 1. Create New Template
1. Add template in Strapi admin
2. Create sections for the template
3. Template appears automatically in your app

### 2. Customize Organization
1. Update organization data in Strapi
2. Changes reflect immediately in previews
3. Live sites update automatically

### 3. Preview System
- **Static Preview**: Uses mock data
- **Live Preview**: Uses real Strapi data
- **Organization Preview**: Shows template with specific org data

## 🚀 Production Deployment

### 1. Deploy Strapi
```bash
# Build for production
npm run build

# Deploy to your hosting provider
# (Heroku, DigitalOcean, AWS, etc.)
```

### 2. Update Environment Variables
```env
VITE_STRAPI_URL=https://your-strapi-domain.com
VITE_STRAPI_TOKEN=your-production-token
```

### 3. Configure CORS
In Strapi's `config/middlewares.js`:
```javascript
module.exports = [
  // ... other middlewares
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000', 'https://your-app-domain.com'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    },
  },
];
```

## 📝 Content Management Tips

1. **Template Naming**: Use descriptive names like "Modern Rescue", "Classic Shelter"
2. **Section Order**: Use increments of 10 (10, 20, 30) for easy reordering
3. **Content JSON**: Keep content structure consistent across templates
4. **Images**: Upload high-quality images for better previews
5. **Colors**: Use hex codes for consistent branding

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**: Check Strapi CORS configuration
2. **API Token**: Ensure token has correct permissions
3. **Content Not Loading**: Verify API permissions are set to Public
4. **Images Not Showing**: Check media upload settings in Strapi

### Debug Mode:
Enable debug logging in your app:
```javascript
// In strapiApi.ts
console.log('Strapi URL:', STRAPI_URL);
console.log('API Response:', response);
```

## 🎯 Next Steps

1. **Custom Sections**: Create new section types for specific needs
2. **Advanced Previews**: Add real-time preview updates
3. **Template Builder**: Visual drag-and-drop template creation
4. **Multi-language**: Add internationalization support
5. **Analytics**: Track template usage and performance
