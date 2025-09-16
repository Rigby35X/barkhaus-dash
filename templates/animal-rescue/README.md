# Animal Rescue Template

A beautiful, modern React template designed specifically for animal rescue organizations.

## 🎯 Features

- **Responsive Design** - Works perfectly on all devices
- **Animal Gallery** - Showcase adoptable animals with filtering
- **Adoption Forms** - Streamlined adoption application process
- **Donation Integration** - Easy donation buttons and forms
- **Event Calendar** - Promote rescue events and fundraisers
- **Volunteer Signup** - Recruit and manage volunteers
- **Success Stories** - Share happy adoption stories
- **Contact Forms** - Multiple ways for people to get in touch

## 🚀 Quick Start

### 1. Copy Template Files
```bash
cp -r templates/animal-rescue/* src/
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API
Update your `.env.local` with your Xano endpoints:
```env
VITE_XANO_ANIMALS_URL=your_animals_api_url
VITE_XANO_ORGANIZATIONS_URL=your_org_api_url
```

### 4. Customize Branding
Edit `src/config/branding.ts`:
```typescript
export const branding = {
  organizationName: "Your Rescue Name",
  primaryColor: "#3B82F6",
  logo: "/your-logo.png"
}
```

## 📁 Template Structure

```
animal-rescue/
├── components/           # Reusable components
│   ├── AnimalCard.tsx
│   ├── AdoptionForm.tsx
│   ├── DonationButton.tsx
│   └── ...
├── pages/               # Page components
│   ├── HomePage.tsx
│   ├── AnimalsPage.tsx
│   ├── AboutPage.tsx
│   └── ContactPage.tsx
├── styles/              # Custom styles
│   ├── globals.css
│   └── components.css
├── assets/              # Images and icons
├── config.json          # Template configuration
└── README.md           # This file
```

## 🎨 Customization

### Colors
The template uses Tailwind CSS classes. Update your `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Your primary color
        secondary: '#1E40AF',  // Your secondary color
        accent: '#F59E0B'      // Your accent color
      }
    }
  }
}
```

### Components
All components are fully customizable. Key components include:

- **AnimalCard** - Display individual animals
- **AdoptionForm** - Handle adoption applications
- **DonationButton** - Process donations
- **EventCard** - Show upcoming events

### Pages
The template includes these main pages:

- **Home** - Hero section, featured animals, mission
- **Animals** - Full animal gallery with filtering
- **About** - Organization story and team
- **Contact** - Contact forms and information

## 🔧 API Integration

The template is designed to work with Xano APIs:

### Animals API
```typescript
// Fetch animals
const animals = await fetch(`${VITE_XANO_ANIMALS_URL}/animals?tenant_id=${tenantId}`)

// Animal data structure
interface Animal {
  id: number
  name: string
  breed: string
  age: string
  description: string
  image_url: string
  status: 'available' | 'adopted' | 'pending'
}
```

### Organizations API
```typescript
// Fetch organization data
const org = await fetch(`${VITE_XANO_ORGANIZATIONS_URL}/organizations/${orgId}`)
```

## 📱 Responsive Design

The template is fully responsive with breakpoints:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

## 🎯 SEO Optimized

- Semantic HTML structure
- Meta tags for social sharing
- Optimized images with alt text
- Clean URLs

## 🚀 Deployment

The template works with any React hosting platform:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **GitHub Pages**

## 📞 Support

For questions or customization help:
- Email: support@barkhaus.com
- Documentation: https://docs.barkhaus.com
- GitHub Issues: https://github.com/barkhaus/templates

## 📄 License

MIT License - feel free to use for any rescue organization!
