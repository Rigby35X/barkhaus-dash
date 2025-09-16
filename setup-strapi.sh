#!/bin/bash

# Strapi CMS Setup Script for Barkhaus Dashboard
echo "🚀 Setting up Strapi CMS for Barkhaus Dashboard..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from your project root directory"
    exit 1
fi

# Create Strapi project in a subdirectory
echo "📦 Creating Strapi project..."
npx create-strapi-app@latest barkhaus-cms --quickstart --no-run

# Navigate to Strapi directory
cd barkhaus-cms

echo "⚙️  Configuring Strapi..."

# Create the content types directory structure
mkdir -p src/api/template/content-types/template
mkdir -p src/api/section/content-types/section  
mkdir -p src/api/organization/content-types/organization

# Create Template content type
cat > src/api/template/content-types/template/schema.json << 'EOF'
{
  "kind": "collectionType",
  "collectionName": "templates",
  "info": {
    "singularName": "template",
    "pluralName": "templates",
    "displayName": "Template",
    "description": ""
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "description": {
      "type": "text",
      "required": true
    },
    "thumbnail": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "isActive": {
      "type": "boolean",
      "default": true
    },
    "sections": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::section.section",
      "mappedBy": "template"
    }
  }
}
EOF

# Create Section content type
cat > src/api/section/content-types/section/schema.json << 'EOF'
{
  "kind": "collectionType",
  "collectionName": "sections",
  "info": {
    "singularName": "section",
    "pluralName": "sections",
    "displayName": "Section",
    "description": ""
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "type": {
      "type": "enumeration",
      "enum": ["hero", "about", "services", "gallery", "footer", "custom"],
      "required": true
    },
    "content": {
      "type": "json",
      "required": true
    },
    "order": {
      "type": "integer",
      "required": true,
      "default": 10
    },
    "isVisible": {
      "type": "boolean",
      "default": true
    },
    "template": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::template.template",
      "inversedBy": "sections"
    }
  }
}
EOF

# Create Organization content type
cat > src/api/organization/content-types/organization/schema.json << 'EOF'
{
  "kind": "collectionType",
  "collectionName": "organizations",
  "info": {
    "singularName": "organization",
    "pluralName": "organizations",
    "displayName": "Organization",
    "description": ""
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "logo": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "primaryColor": {
      "type": "string",
      "default": "#3B82F6"
    },
    "secondaryColor": {
      "type": "string",
      "default": "#8B5CF6"
    },
    "accentColor": {
      "type": "string",
      "default": "#10B981"
    },
    "headingFont": {
      "type": "string",
      "default": "Inter"
    },
    "bodyFont": {
      "type": "string",
      "default": "Inter"
    },
    "mission": {
      "type": "text",
      "required": true
    },
    "about": {
      "type": "text",
      "required": true
    },
    "contactInfo": {
      "type": "json"
    },
    "socialMedia": {
      "type": "json"
    }
  }
}
EOF

echo "✅ Content types created!"
echo "🚀 Starting Strapi..."

# Start Strapi
npm run develop &

echo ""
echo "🎉 Strapi setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Wait for Strapi to start (it will open http://localhost:1337/admin)"
echo "2. Create your admin account"
echo "3. Go to Settings > Users & Permissions Plugin > Roles > Public"
echo "4. Enable permissions for Template, Section, and Organization (find, findOne)"
echo "5. Add sample data using the Content Manager"
echo "6. Generate an API token in Settings > API Tokens"
echo "7. Update your .env.development file with the token"
echo ""
echo "🔗 Useful links:"
echo "   Strapi Admin: http://localhost:1337/admin"
echo "   Your App: http://localhost:5173/app/templates"
echo ""
EOF
